import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
    notes: [],
  }),
  actions: {
    async fetchTasks() {
      try {
        // Fetch tasks with their associated notes using a LEFT JOIN
        const { data, error } = await supabase
          .from('tasks')
          .select(
            `
            *,
            notes (
              id,
              note,
              created_at,
              updated_at
            )
          `,
          )
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform the data to include notes as a single field for compatibility
        const tasksWithNotes = (data || []).map((task) => ({
          ...task,
          notes: task.notes && task.notes.length > 0 ? task.notes[0].note : null,
        }))

        console.log('Fetched tasks with notes:', tasksWithNotes)
        this.tasks = tasksWithNotes
      } catch (error) {
        console.error('Error fetching tasks:', error.message, error)
      }
    },

    async fetchTasksForUser(userId) {
      try {
        console.log('Fetching tasks for user ID:', userId)

        if (!userId) {
          throw new Error('User ID is required to fetch tasks')
        }

        // Fetch tasks with their associated notes using a LEFT JOIN
        const { data, error } = await supabase
          .from('tasks')
          .select(
            `
            *,
            notes (
              id,
              note,
              created_at,
              updated_at
            )
          `,
          )
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error fetching tasks:', error)
          throw error
        }

        // Transform the data to include notes as a single field for compatibility
        const tasksWithNotes = (data || []).map((task) => ({
          ...task,
          notes: task.notes && task.notes.length > 0 ? task.notes[0].note : null,
        }))

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
        // Validate required fields
        if (!task.title || !task.title.trim()) {
          throw new Error('Task title is required')
        }
        if (!task.user_id) {
          throw new Error('User ID is required')
        }

        // Format dates properly - only include if they have values
        const formatDate = (dateString) => {
          if (!dateString || dateString === '') return null
          try {
            // Check if it's already a valid ISO string
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return null
            return date.toISOString()
          } catch {
            return null
          }
        }

        const cleanedTask = {
          title: task.title.trim(),
          description: task.description && task.description.trim() ? task.description.trim() : null,
          status_name: task.status_name || 'To Do',
          priority_level: task.priority_level || 'Routine',
          deadline: formatDate(task.deadline),
          start_date: formatDate(task.start_date),
          end_date: formatDate(task.end_date),
          user_id: task.user_id,
        }

        console.log('Task to insert (cleaned):', cleanedTask)
        console.log('User ID:', task.user_id)

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanedTask])
          .select('*')
          .single()

        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }

        console.log('Successfully inserted task:', data)

        // Handle notes separately if provided
        if (task.notes && task.notes.trim()) {
          try {
            const noteData = {
              task_id: data.id,
              note: task.notes.trim(),
              user_id: task.user_id,
            }

            const { error: noteError } = await supabase.from('notes').insert([noteData])

            if (noteError) {
              console.error('Error inserting note:', noteError)
              // Don't throw error for notes - task was created successfully
            } else {
              console.log('Successfully inserted note for task:', data.id)
            }
          } catch (noteError) {
            console.error('Error handling note insert:', noteError)
            // Continue - task was created successfully
          }
        }

        // Add to local state
        this.tasks.unshift(data) // Add to beginning for latest first

        return data.id
      } catch (error) {
        console.error('Error inserting task:', error.message, error)
        console.error('Task data that failed:', task)
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
                // Update existing note
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

        // Update the local state
        const index = this.tasks.findIndex((task) => task.id === taskId)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...taskUpdate }
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
