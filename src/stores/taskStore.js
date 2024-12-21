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
        const { data, error } = await supabase
          .from('tasks')
          .update(updatedTask)
          .eq('id', taskId)
          .select()
          .single()

        if (error) throw error

        // Update the local state
        const index = this.tasks.findIndex((task) => task.id === taskId)
        if (index !== -1) {
          this.tasks[index] = data
        }
      } catch (error) {
        console.error('Error updating task:', error.message, error)
      }
    },

    async deleteTask(taskId) {
      try {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId)

        if (error) throw error

        // Remove the task from the local state
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
      } catch (error) {
        console.error('Error deleting task:', error.message, error)
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
  },
})
