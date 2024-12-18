// stores/tasksStore.js
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    // Fetch tasks from Supabase
    async fetchTasks() {
      const { data, error } = await supabase.from('tasks').select()
      if (data) this.tasks = data
      if (error) console.error('Error fetching tasks:', error.message)
    },

    // Add a new task
    async addTask(task) {
      const { data, error } = await supabase.from('tasks').insert([task]).select()
      if (data) this.tasks.push(data[0])
      if (error) console.error('Error adding task:', error.message)
    },

    // Edit an existing task
    async updateTask(updatedTask) {
      const { error } = await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id)
      if (!error) {
        const index = this.tasks.findIndex((task) => task.id === updatedTask.id)
        if (index !== -1) this.tasks[index] = updatedTask
      }
    },

    // Delete a task
    async deleteTask(taskId) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (!error) this.tasks = this.tasks.filter((task) => task.id !== taskId)
    },
  },
})
