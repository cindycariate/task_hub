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

    // Add a new task
    async addTask(taskData) {
      // Ensure valid user_id is provided
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) {
        console.error('User not authenticated')
        return
      }

      const { data, error } = await supabase.from('tasks').insert([
        {
          user_id: sessionData.session.user.id, // Use the authenticated user's ID
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline || null, // Ensure null for empty date fields
          start_date: taskData.start_date || null,
          end_date: taskData.end_date || null,
          priority_level: taskData.priority_level,
          status_name: taskData.status_name,
        },
      ])

      if (error) {
        console.error('Error adding task:', error.message)
        return
      }

      // Check if data is available and has the expected structure
      if (!data || data.length === 0) {
        console.error('No task data returned after insertion')
        return
      }

      console.log('Task added successfully:', data)

      // Extract the task ID of the newly created task
      const newTaskId = data[0]?.id // Safely access the task ID

      if (!newTaskId) {
        console.error('Task ID is missing')
        return
      }

      // Insert a note for the new task (if needed)
      const { data: noteData, error: noteError } = await supabase.from('notes').insert([
        {
          task_id: newTaskId, // Use the ID of the created task
          notes: taskData.notes || '', // Make sure notes aren't null or empty if provided
        },
      ])

      if (noteError) {
        console.error('Error adding note:', noteError.message)
      } else {
        console.log('Note added successfully:', noteData)
      }

      // Optionally, you can update the tasks in the store
      this.tasks.push(data[0])
    },

    // Read the reference on tasks

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
