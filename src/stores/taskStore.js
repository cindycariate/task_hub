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
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        this.tasks = data
      } catch (error) {
        console.error('Error fetching tasks:', error.message, error)
      }
    },

    async fetchTasksForUser(userId) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

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
          ...task,
          deadline: task.deadline || null,
          start_date: task.start_date || null,
          end_date: task.end_date || null,
          created_at: task.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        console.log('Task to insert:', cleanedTask)

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanedTask])
          .select('id')
          .single()

        if (error) throw error

        console.log('Inserted task ID:', data.id)
        this.tasks.push(data)
        return data.id
      } catch (error) {
        console.error('Error inserting task:', error.message, error)
        throw error
      }
    },

    async editTask(taskId, updatedTask) {
      try {
        const { error } = await supabase.from('tasks').update(updatedTask).eq('id', taskId)

        if (error) throw error

        const index = this.tasks.findIndex((task) => task.id === taskId)
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updatedTask }
        }
      } catch (error) {
        console.error('Error editing task:', error.message)
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
