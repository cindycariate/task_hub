import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
    notes: [], // Add 'notes' to state for storing fetched or added notes
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

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanedTask])
          .select('id') // Ensure 'id' is selected
          .single()

        if (error) throw error

        console.log('Inserted task ID:', data.id) // Debugging log
        this.tasks.push(data)
        return data.id // Return the task ID
      } catch (error) {
        console.error('Error inserting task:', error.message, error)
        throw error
      }
    },

    // Add a note to the database
    async addNote(note) {
      try {
        // Insert the note into Supabase
        const { data, error } = await supabase.from('notes').insert(note).select().single()
        if (error) throw error
        console.log('Inserted note data:', data) // Debugging log

        // Add to local notes state
        if (data) this.notes.push(data)
      } catch (error) {
        console.error('Error inserting note:', error.message)
      }
    },
  },
})
