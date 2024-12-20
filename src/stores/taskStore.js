import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*')
    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      tasks.value = data
    }
  }

  // Add a new task to Supabase
  const addTask = async (newTask) => {
    const { data, error } = await supabase.from('tasks').insert([newTask])
    if (error) {
      console.error('Error adding task:', error)
    } else {
      tasks.value.push(data[0])
    }
  }

  return { tasks, fetchTasks, addTask }
})
