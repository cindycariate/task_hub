import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { InputValidator, RateLimiter } from '@/utils/security'
import { logger, ErrorHandler } from '@/utils/logger'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
    notes: [],
  }),
  actions: {
    async fetchTasks() {
      try {
        // Fetch tasks first
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (tasksError) throw tasksError

        logger.dev('✅ Tasks fetched successfully:', tasksData?.length)

        // Fetch notes for all tasks
        let tasksWithNotes = tasksData || []

        if (tasksData && tasksData.length > 0) {
          const taskIds = tasksData.map((task) => task.id)

          const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .in('task_id', taskIds)

          if (notesError) {
            logger.devError('Warning: Error fetching notes:', notesError)
            // Continue without notes rather than failing completely
          } else {
            logger.dev('✅ Notes fetched successfully:', notesData?.length)
          }

          // Combine tasks with their notes
          tasksWithNotes = tasksData.map((task) => {
            const taskNote = notesData?.find((note) => note.task_id === task.id)
            return {
              ...task,
              notes: taskNote ? taskNote.note : null,
            }
          })
        }

        logger.dev('Fetched tasks with notes:', logger.sanitizeForLogging(tasksWithNotes))
        this.tasks = tasksWithNotes
      } catch (error) {
        logger.error('Error fetching tasks:', error.message)
        logger.devError('Full error details:', error)
        throw ErrorHandler.handleApiError(error, 'Failed to fetch tasks')
      }
    },

    async fetchTasksForUser(userId) {
      try {
        logger.dev('Fetching tasks for user ID:', userId)

        if (!userId) {
          const error = new Error('User ID is required to fetch tasks')
          logger.error('Task fetch failed: User authentication required', error)
          throw error
        }

        // Schema inspection (development only)
        logger.dev('🔍 Inspecting notes table schema...')
        const { data: sampleNotes, error: schemaError } = await supabase
          .from('notes')
          .select('*')
          .limit(1)

        if (!schemaError && sampleNotes && sampleNotes.length > 0) {
          logger.dev('📋 Notes table columns:', Object.keys(sampleNotes[0]))
          logger.dev('📋 Sample note data:', sampleNotes[0])
        }

        // Fetch tasks first
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (tasksError) {
          const errorInfo = ErrorHandler.handleApiError(tasksError, 'fetch tasks')
          logger.error(errorInfo.userMessage, tasksError, { userId, operation: 'fetchTasks' })
          throw new Error(errorInfo.userMessage)
        }

        logger.dev('✅ Tasks fetched successfully:', tasksData?.length)

        // Fetch notes for all tasks
        let tasksWithNotes = tasksData || []

        if (tasksData && tasksData.length > 0) {
          const taskIds = tasksData.map((task) => task.id)

          const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .in('task_id', taskIds)

          if (notesError) {
            logger.devWarn('Warning: Error fetching notes:', notesError)
            // Continue without notes rather than failing completely
          } else {
            logger.dev('✅ Notes fetched successfully:', notesData?.length)
            logger.dev('🔍 Raw notes data:', notesData)
            // Log the structure of the first note to see column names
            if (notesData && notesData.length > 0) {
              logger.dev('🔍 First note structure:', Object.keys(notesData[0]))
              logger.dev('🔍 First note full data:', notesData[0])
            }
          }

          // Combine tasks with their notes
          tasksWithNotes = tasksData.map((task) => {
            const taskNote = notesData?.find((note) => note.task_id === task.id)
            logger.dev(`📝 Task ${task.id}: Found note?`, !!taskNote)
            if (taskNote) {
              logger.dev(`📝 Task ${task.id}: Note object:`, taskNote)
              // Try different possible column names
              const noteText =
                taskNote.note ||
                taskNote.content ||
                taskNote.text ||
                taskNote.description ||
                taskNote.body
              logger.dev(`📝 Task ${task.id}: Note text:`, noteText)
            }
            return {
              ...task,
              notes: taskNote
                ? taskNote.notes ||
                  taskNote.note ||
                  taskNote.content ||
                  taskNote.text ||
                  taskNote.description ||
                  taskNote.body
                : null,
            }
          })

          logger.dev(
            '🔍 Final tasks with notes:',
            tasksWithNotes.map((t) => ({ id: t.id, title: t.title, notes: t.notes })),
          )
        }

        logger.success('Tasks loaded successfully', `${tasksWithNotes?.length || 0} tasks found`)
        this.tasks = tasksWithNotes
        return tasksWithNotes
      } catch (error) {
        const errorInfo = ErrorHandler.handleApiError(error, 'fetch user tasks')
        logger.error(errorInfo.userMessage, error, { userId, operation: 'fetchTasksForUser' })
        this.tasks = [] // Reset to empty array on error
        throw new Error(errorInfo.userMessage)
      }
    },
    async logout() {
      try {
        // Perform Supabase logout
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Clear the task store state
        this.$reset()
      } catch (error) {
        logger.error('Error logging out:', error.message)
        logger.devError('Full error details:', error)
        throw ErrorHandler.handleApiError(error, 'Failed to log out')
      }
    },

    async addTask(task) {
      try {
        logger.dev('=== TASKSTORE: Starting addTask with security validation ===')
        logger.dev('Raw task data received:', logger.sanitizeForLogging(task))

        // Rate limiting check
        const userId = task.user_id
        if (RateLimiter.isRateLimited(`task_creation_${userId}`, 20, 60000)) {
          throw new Error('Too many task creation attempts. Please wait a moment.')
        }

        // Input validation and sanitization
        const validatedTask = {
          title: InputValidator.validateTaskTitle(task.title),
          description: InputValidator.validateTaskDescription(task.description),
          notes: InputValidator.validateTaskNotes(task.notes),
          status_name: InputValidator.validateStatus(task.status_name || 'To Do'),
          priority_level: InputValidator.validatePriority(task.priority_level || 'Routine'),
          deadline: InputValidator.validateDate(task.deadline),
          start_date: InputValidator.validateDate(task.start_date),
          end_date: InputValidator.validateDate(task.end_date),
          user_id: InputValidator.validateUUID(task.user_id),
        }

        logger.dev('✅ Task validation passed')
        logger.dev('Validated task data:', logger.sanitizeForLogging(validatedTask))

        const cleanedTask = {
          title: validatedTask.title,
          description: validatedTask.description,
          status_name: validatedTask.status_name,
          priority_level: validatedTask.priority_level,
          deadline: validatedTask.deadline,
          start_date: validatedTask.start_date,
          end_date: validatedTask.end_date,
          user_id: validatedTask.user_id,
        }

        logger.dev('Task to insert (cleaned):', logger.sanitizeForLogging(cleanedTask))
        logger.dev('🚀 Inserting task into Supabase...')

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanedTask])
          .select('*')
          .single()

        if (error) {
          const errorInfo = ErrorHandler.handleApiError(error, 'create task')
          logger.error(errorInfo.userMessage, error, {
            operation: 'addTask',
            userId: validatedTask.user_id,
            title: validatedTask.title,
          })
          throw new Error(errorInfo.userMessage)
        }

        logger.dev('✅ Task inserted successfully into database')
        logger.dev('Successfully inserted task:', logger.sanitizeForLogging(data))

        // Handle notes separately if provided
        if (validatedTask.notes && validatedTask.notes.trim()) {
          logger.dev('📝 Processing notes for task...')
          try {
            // Try different possible column names for the note content
            const noteData = {
              task_id: data.id,
              user_id: validatedTask.user_id,
            }

            // Use the correct column name - 'notes' (plural) based on schema discovery
            noteData.notes = validatedTask.notes.trim() // Use 'notes' column

            logger.dev(
              'Note data to insert (using "notes" column):',
              logger.sanitizeForLogging(noteData),
            )
            const { error: noteError } = await supabase.from('notes').insert([noteData])

            if (noteError) {
              logger.devError('❌ Error inserting note:', noteError)
              // Don't throw error for notes - task was created successfully
            } else {
              logger.dev('✅ Successfully inserted note for task:', data.id)
            }
          } catch (noteError) {
            logger.devError('❌ Error handling note insert:', noteError)
            // Continue - task was created successfully
          }
        } else {
          logger.dev('ℹ️ No notes provided for this task')
        }

        // Add to local state with notes included for UI consistency
        const taskWithNotes = {
          ...data,
          notes: task.notes && task.notes.trim() ? task.notes.trim() : null,
        }
        logger.dev('📥 Adding task to local state:', logger.sanitizeForLogging(taskWithNotes))
        this.tasks.unshift(taskWithNotes) // Add to beginning for latest first
        logger.dev('✅ Task added to local state. Total tasks:', this.tasks.length)
        logger.dev('=== TASKSTORE: addTask completed successfully ===')

        return data.id
      } catch (error) {
        logger.error('❌ TASKSTORE: addTask failed ❌')
        logger.error('Error message:', error.message)
        logger.devError('Full error:', error)
        logger.devError('Task data that failed:', logger.sanitizeForLogging(task))
        logger.error('=== TASKSTORE: addTask failed ===')
        throw ErrorHandler.handleApiError(error, 'Failed to create task')
      }
    },

    async editTask(taskId, updatedTask) {
      logger.dev('Editing task with ID:', taskId)
      logger.dev('Updated task data:', logger.sanitizeForLogging(updatedTask))
      logger.dev('Notes being saved:', updatedTask.notes)

      try {
        // Input validation and sanitization
        const validatedUpdate = {
          title: InputValidator.validateTaskTitle(updatedTask.title),
          description: InputValidator.validateTaskDescription(updatedTask.description),
          status_name: InputValidator.validateStatus(updatedTask.status_name),
          priority_level: InputValidator.validatePriority(updatedTask.priority_level),
          deadline: InputValidator.validateDate(updatedTask.deadline),
          start_date: InputValidator.validateDate(updatedTask.start_date),
          end_date: InputValidator.validateDate(updatedTask.end_date),
          updated_at: new Date().toISOString(),
        }

        logger.dev('Task update payload:', logger.sanitizeForLogging(validatedUpdate))

        const { data, error } = await supabase
          .from('tasks')
          .update(validatedUpdate)
          .eq('id', taskId)
          .select()

        if (error) {
          const errorInfo = ErrorHandler.handleApiError(error, 'update task')
          logger.error(errorInfo.userMessage, error, {
            operation: 'editTask',
            taskId: taskId,
            title: validatedUpdate.title,
          })
          throw new Error(errorInfo.userMessage)
        }

        logger.dev('Task updated successfully:', logger.sanitizeForLogging(data))

        // Handle notes separately if provided
        if (Object.prototype.hasOwnProperty.call(updatedTask, 'notes')) {
          try {
            if (updatedTask.notes && updatedTask.notes.trim()) {
              logger.dev('📝 Processing notes update for task...')
              // Check if note exists for this task
              const { data: existingNote, error: fetchError } = await supabase
                .from('notes')
                .select('*')
                .eq('task_id', taskId)
                .single()

              if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 is "not found"
                logger.devError('Error checking existing note:', fetchError)
              }

              if (existingNote) {
                // Update existing note using correct 'notes' column
                const { error: updateError } = await supabase
                  .from('notes')
                  .update({ notes: updatedTask.notes.trim() }) // Use 'notes' column
                  .eq('task_id', taskId)

                if (updateError) {
                  logger.devError('Error updating note:', updateError)
                } else {
                  logger.dev('✅ Successfully updated note for task:', taskId)
                }
              } else {
                // Create new note
                const noteData = {
                  task_id: taskId,
                  notes: updatedTask.notes.trim(), // Use 'notes' column
                  user_id: data[0]?.user_id || updatedTask.user_id,
                }

                const { error: insertError } = await supabase.from('notes').insert([noteData])

                if (insertError) {
                  logger.devError('Error inserting new note:', insertError)
                } else {
                  logger.dev('✅ Successfully created note for task:', taskId)
                }
              }
            } else {
              // Delete note if empty
              logger.dev('🗑️ Deleting empty note for task...')
              const { error: deleteError } = await supabase
                .from('notes')
                .delete()
                .eq('task_id', taskId)

              if (deleteError) {
                logger.devError('Error deleting note:', deleteError)
              } else {
                logger.dev('✅ Successfully deleted note for task:', taskId)
              }
            }
          } catch (noteError) {
            logger.devError('Error handling note update:', noteError)
            // Continue - task was updated successfully
          }
        }

        // Update the local state including notes for UI consistency
        const index = this.tasks.findIndex((task) => task.id === taskId)
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            ...validatedUpdate,
            notes: updatedTask.notes || null, // Include notes in local state
          }
          logger.dev('Local task updated:', logger.sanitizeForLogging(this.tasks[index]))
        }
      } catch (error) {
        logger.error('Error editing task:', error.message)
        logger.devError('Full error details:', error)
        throw ErrorHandler.handleApiError(error, 'Failed to update task')
      }
    },
    async deleteTask(taskId) {
      try {
        logger.dev('🗑️ Deleting task with ID:', taskId)

        // Rate limiting check for delete operations
        if (RateLimiter.isRateLimited(`task_deletion_${taskId}`, 10, 60000)) {
          throw new Error('Too many deletion attempts. Please wait a moment.')
        }

        const { error } = await supabase.from('tasks').delete().eq('id', taskId)

        if (error) {
          const errorInfo = ErrorHandler.handleApiError(error, 'delete task')
          logger.error(errorInfo.userMessage, error, {
            operation: 'deleteTask',
            taskId: taskId,
          })
          throw new Error(errorInfo.userMessage)
        }

        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        logger.dev('✅ Task deleted successfully and removed from local state')
      } catch (error) {
        logger.error('Error deleting task:', error.message)
        logger.devError('Full error details:', error)
        throw ErrorHandler.handleApiError(error, 'Failed to delete task')
      }
    },

    async addNote(note) {
      try {
        // Input validation
        const validatedNote = {
          task_id: note.task_id,
          notes: InputValidator.validateTaskNotes(note.notes || note.note), // Handle both column names
          user_id: note.user_id,
        }

        const { data, error } = await supabase.from('notes').insert(validatedNote).select().single()
        if (error) {
          const errorInfo = ErrorHandler.handleApiError(error, 'add note')
          logger.error(errorInfo.userMessage, error, {
            operation: 'addNote',
            taskId: note.task_id,
          })
          throw new Error(errorInfo.userMessage)
        }

        logger.dev('Inserted note data:', logger.sanitizeForLogging(data))

        if (data) this.notes.push(data)
      } catch (error) {
        logger.error('Error inserting note:', error.message)
        logger.devError('Full error details:', error)
        throw ErrorHandler.handleApiError(error, 'Failed to add note')
      }
    },
    // Ensure this function is defined in your taskStore.js
    async updateNoteForTask(taskId, note) {
      try {
        // Input validation
        const validatedNote = InputValidator.validateTaskNotes(note)

        const { error } = await supabase
          .from('notes')
          .update({ notes: validatedNote }) // Use 'notes' column
          .eq('task_id', taskId)

        if (error) {
          const errorInfo = ErrorHandler.handleApiError(error, 'update note')
          logger.error(errorInfo.userMessage, error, {
            operation: 'updateNoteForTask',
            taskId: taskId,
          })
          throw new Error(errorInfo.userMessage)
        }

        logger.dev('✅ Note updated successfully for task:', taskId)
        // Optionally update the note in the local store if needed
      } catch (error) {
        logger.error('Error updating note:', error.message)
        logger.devError('Full error details:', error)
        throw ErrorHandler.handleApiError(error, 'Failed to update note')
      }
    },
  },
})
