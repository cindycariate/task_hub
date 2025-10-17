import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { InputValidator, RateLimiter } from '@/utils/security'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
    notes: [],
  }        // Add to local state with notes included for UI consistency
        const taskWithNotes = {
          ...data,
          notes: validatedTask.notes && validatedTask.notes.trim() ? validatedTask.notes.trim() : null
        } actions: {
    async fetchTasks() {
      try {
        // Fetch tasks first
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (tasksError) throw tasksError

        console.log('✅ Tasks fetched successfully:', tasksData?.length)

        // Fetch notes for all tasks
        let tasksWithNotes = tasksData || []

        if (tasksData && tasksData.length > 0) {
          const taskIds = tasksData.map((task) => task.id)

          const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .in('task_id', taskIds)

          if (notesError) {
            console.error('Warning: Error fetching notes:', notesError)
            // Continue without notes rather than failing completely
          } else {
            console.log('✅ Notes fetched successfully:', notesData?.length)
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

        console.log('Fetched tasks with notes:', tasksWithNotes)
        this.tasks = tasksWithNotes
      } catch (error) {
        console.error('Error fetching tasks:', error.message, error)
      }
    },

    async fetchTasksForUser(userId) {
      try {
        console.log('=== DEBUGGING SCHEMA ISSUE ===')
        console.log('Fetching tasks for user ID:', userId)

        if (!userId) {
          throw new Error('User ID is required to fetch tasks')
        }

        // First, let's inspect the notes table schema
        console.log('🔍 Inspecting notes table schema...')
        const { data: sampleNotes, error: schemaError } = await supabase
          .from('notes')
          .select('*')
          .limit(1)

        if (!schemaError && sampleNotes && sampleNotes.length > 0) {
          console.log('📋 Notes table columns:', Object.keys(sampleNotes[0]))
          console.log('📋 Sample note data:', sampleNotes[0])
        }

        // Fetch tasks first
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (tasksError) {
          console.error('Supabase error fetching tasks:', tasksError)
          throw tasksError
        }

        console.log('✅ Tasks fetched successfully:', tasksData?.length)

        // Fetch notes for all tasks
        let tasksWithNotes = tasksData || []

        if (tasksData && tasksData.length > 0) {
          const taskIds = tasksData.map((task) => task.id)

          const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .in('task_id', taskIds)

          if (notesError) {
            console.error('Warning: Error fetching notes:', notesError)
            // Continue without notes rather than failing completely
          } else {
            console.log('✅ Notes fetched successfully:', notesData?.length)
            console.log('🔍 Raw notes data:', notesData)
            // Log the structure of the first note to see column names
            if (notesData && notesData.length > 0) {
              console.log('🔍 First note structure:', Object.keys(notesData[0]))
              console.log('🔍 First note full data:', notesData[0])
            }
          }

          // Combine tasks with their notes
          tasksWithNotes = tasksData.map((task) => {
            const taskNote = notesData?.find((note) => note.task_id === task.id)
            console.log(`📝 Task ${task.id}: Found note?`, !!taskNote)
            if (taskNote) {
              console.log(`📝 Task ${task.id}: Note object:`, taskNote)
              // Try different possible column names
              const noteText = taskNote.note || taskNote.content || taskNote.text || taskNote.description || taskNote.body
              console.log(`📝 Task ${task.id}: Note text:`, noteText)
            }
            return {
              ...task,
              notes: taskNote ? (taskNote.notes || taskNote.note || taskNote.content || taskNote.text || taskNote.description || taskNote.body) : null,
            }
          })

          console.log('🔍 Final tasks with notes:', tasksWithNotes.map(t => ({ id: t.id, title: t.title, notes: t.notes })))
        }

        console.log('Successfully fetched tasks with notes for user:', tasksWithNotes)
        console.log('Number of tasks fetched:', tasksWithNotes?.length || 0)

        this.tasks = tasksWithNotes
        return tasksWithNotes
      } catch (error) {
        console.error('Error fetching tasks for user:', error.message, error)
        this.tasks = [] // Reset to empty array on error
        throw error
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
        console.error('Error logging out:', error.message)
      }
    },

    async addTask(task) {
      try {
        console.log('=== TASKSTORE: Starting addTask with security validation ===')
        console.log('Raw task data received:', JSON.stringify(task, null, 2))

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
          user_id: InputValidator.validateUUID(task.user_id)
        }

        console.log('✅ Task validation passed')
        console.log('Validated task data:', JSON.stringify(validatedTask, null, 2))

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

        console.log('Task to insert (cleaned):', JSON.stringify(cleanedTask, null, 2))
        console.log('User ID:', task.user_id)
        console.log('🚀 Inserting task into Supabase...')

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanedTask])
          .select('*')
          .single()

        if (error) {
          console.error('❌ Supabase insert error:', error)
          console.error('Error code:', error.code)
          console.error('Error details:', error.details)
          console.error('Error hint:', error.hint)
          throw error
        }

        console.log('✅ Task inserted successfully into database')

        console.log('Successfully inserted task:', JSON.stringify(data, null, 2))

        // Handle notes separately if provided
        if (validatedTask.notes && validatedTask.notes.trim()) {
          console.log('📝 Processing notes for task...')
          try {
            // Try different possible column names for the note content
            const noteData = {
              task_id: data.id,
              user_id: validatedTask.user_id,
            }

            // Use the correct column name - 'notes' (plural) based on schema discovery
            noteData.notes = validatedTask.notes.trim()  // Use 'notes' column

            console.log('Note data to insert (using "notes" column):', JSON.stringify(noteData, null, 2))
            const { error: noteError } = await supabase.from('notes').insert([noteData])

            if (noteError) {
              console.error('❌ Error inserting note:', noteError)
              // Don't throw error for notes - task was created successfully
            } else {
              console.log('✅ Successfully inserted note for task:', data.id)
            }
          } catch (noteError) {
            console.error('❌ Error handling note insert:', noteError)
            // Continue - task was created successfully
          }
        } else {
          console.log('ℹ️ No notes provided for this task')
        }

        // Add to local state with notes included for UI consistency
        const taskWithNotes = {
          ...data,
          notes: task.notes && task.notes.trim() ? task.notes.trim() : null,
        }
        console.log('📥 Adding task to local state:', JSON.stringify(taskWithNotes, null, 2))
        this.tasks.unshift(taskWithNotes) // Add to beginning for latest first
        console.log('✅ Task added to local state. Total tasks:', this.tasks.length)
        console.log('=== TASKSTORE: addTask completed successfully ===')

        return data.id
      } catch (error) {
        console.error('❌ TASKSTORE: addTask failed ❌')
        console.error('Error message:', error.message)
        console.error('Full error:', error)
        console.error('Task data that failed:', JSON.stringify(task, null, 2))
        console.error('=== TASKSTORE: addTask failed ===')
        throw error
      }
    },

    async editTask(taskId, updatedTask) {
      console.log('Editing task with ID: ', taskId)
      console.log('Updated task data: ', updatedTask)
      console.log('Notes being saved: ', updatedTask.notes)

      try {
        // Ensure we're updating the task with the correct fields (excluding notes)
        const taskUpdate = {
          title: updatedTask.title,
          description: updatedTask.description,
          status_name: updatedTask.status_name,
          priority_level: updatedTask.priority_level,
          deadline: updatedTask.deadline,
          start_date: updatedTask.start_date,
          end_date: updatedTask.end_date,
          updated_at: new Date().toISOString(),
        }

        console.log('Task update payload: ', taskUpdate)

        const { data, error } = await supabase
          .from('tasks')
          .update(taskUpdate)
          .eq('id', taskId)
          .select()

        if (error) throw error

        console.log('Task updated successfully: ', data)

        // Handle notes separately if provided
        if (Object.prototype.hasOwnProperty.call(updatedTask, 'notes')) {
          try {
            if (updatedTask.notes && updatedTask.notes.trim()) {
              // Check if note exists for this task
              const { data: existingNote, error: fetchError } = await supabase
                .from('notes')
                .select('*')
                .eq('task_id', taskId)
                .single()

              if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 is "not found"
                console.error('Error checking existing note:', fetchError)
              }

              if (existingNote) {
                // Update existing note using correct 'notes' column
                const { error: updateError } = await supabase
                  .from('notes')
                  .update({ note: updatedTask.notes.trim() })
                  .eq('task_id', taskId)

                if (updateError) {
                  console.error('Error updating note:', updateError)
                } else {
                  console.log('Successfully updated note for task:', taskId)
                }
              } else {
                // Create new note
                const noteData = {
                  task_id: taskId,
                  note: updatedTask.notes.trim(),
                  user_id: data[0]?.user_id || updatedTask.user_id,
                }

                const { error: insertError } = await supabase.from('notes').insert([noteData])

                if (insertError) {
                  console.error('Error inserting new note:', insertError)
                } else {
                  console.log('Successfully created note for task:', taskId)
                }
              }
            } else {
              // Delete note if empty
              const { error: deleteError } = await supabase
                .from('notes')
                .delete()
                .eq('task_id', taskId)

              if (deleteError) {
                console.error('Error deleting note:', deleteError)
              } else {
                console.log('Successfully deleted note for task:', taskId)
              }
            }
          } catch (noteError) {
            console.error('Error handling note update:', noteError)
            // Continue - task was updated successfully
          }
        }

        // Update the local state including notes for UI consistency
        const index = this.tasks.findIndex((task) => task.id === taskId)
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            ...taskUpdate,
            notes: updatedTask.notes || null, // Include notes in local state
          }
          console.log('Local task updated: ', this.tasks[index])
        }
      } catch (error) {
        console.error('Error editing task:', error.message, error)
        throw error
      }
    },
    async deleteTask(taskId) {
      try {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId)

        if (error) throw error

        this.tasks = this.tasks.filter((task) => task.id !== taskId)
      } catch (error) {
        console.error('Error deleting task:', error.message)
      }
    },

    async addNote(note) {
      try {
        const { data, error } = await supabase.from('notes').insert(note).select().single()
        if (error) throw error
        console.log('Inserted note data:', data)

        if (data) this.notes.push(data)
      } catch (error) {
        console.error('Error inserting note:', error.message)
      }
    },
    // Ensure this function is defined in your taskStore.js
    async updateNoteForTask(taskId, note) {
      try {
        const { error } = await supabase.from('notes').update({ note }).eq('task_id', taskId)

        if (error) throw error

        // Optionally update the note in the local store if needed
      } catch (error) {
        console.error('Error updating note:', error.message)
      }
    },
  },
})
