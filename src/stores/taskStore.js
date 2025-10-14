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
        const { data, error } = await supabase
          .from('tasks')
          .select('id, title, description, notes, status_name, priority_level, deadline, start_date, end_date, user_id, created_at, updated_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        console.log('Fetched tasks with notes:', data)
        this.tasks = data
      } catch (error) {
        console.error('Error fetching tasks:', error.message, error)
      }
    },

    async fetchTasksForUser(userId) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('id, title, description, notes, status_name, priority_level, deadline, start_date, end_date, user_id, created_at, updated_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        console.log('Fetched tasks for user with notes:', data)
        this.tasks = data
      } catch (error) {
        console.error('Error fetching tasks for user:', error.message, error)
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
        const cleanedTask = {
          title: task.title,
          description: task.description || null,
          notes: task.notes || null,
          status_name: task.status_name || 'To Do',
          priority_level: task.priority_level || 'Routine',
          deadline: task.deadline || null,
          start_date: task.start_date || null,
          end_date: task.end_date || null,
          user_id: task.user_id,
          created_at: task.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        console.log('Task to insert with notes:', cleanedTask)

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanedTask])
          .select('*')
          .single()

        if (error) throw error

        console.log('Inserted task with notes:', data)
        this.tasks.push(data)
        return data.id
      } catch (error) {
        console.error('Error inserting task:', error.message, error)
        throw error
      }
    },

    async editTask(taskId, updatedTask) {
      console.log('Editing task with ID: ', taskId)
      console.log('Updated task data: ', updatedTask)
      console.log('Notes being saved: ', updatedTask.notes)

      try {
        // Ensure we're updating the task with the correct fields
        const taskUpdate = {
          title: updatedTask.title,
          description: updatedTask.description,
          notes: updatedTask.notes,
          status_name: updatedTask.status_name,
          priority_level: updatedTask.priority_level,
          deadline: updatedTask.deadline,
          start_date: updatedTask.start_date,
          end_date: updatedTask.end_date,
          updated_at: new Date().toISOString()
        }

        console.log('Task update payload: ', taskUpdate)

        const { data, error } = await supabase
          .from('tasks')
          .update(taskUpdate)
          .eq('id', taskId)
          .select()

        if (error) throw error

        console.log('Task updated successfully: ', data)

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
        const { data, error } = await supabase.from('notes').update({ note }).eq('task_id', taskId)

        if (error) throw error

        // Optionally update the note in the local store if needed
      } catch (error) {
        console.error('Error updating note:', error.message)
      }
    },
  },
})
