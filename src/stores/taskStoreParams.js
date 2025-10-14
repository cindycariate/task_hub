import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useTaskStoreParams = defineStore('taskStoreParams', {
  state: () => ({
    tasks: [],
    notes: [],
  }),
  actions: {
    // Params-based approach for fetching tasks with notes
    async fetchTasksForUserWithParams(userId) {
      try {
        console.log('=== PARAMS APPROACH: Fetching tasks for user ===', userId)

        if (!userId) {
          throw new Error('User ID is required to fetch tasks')
        }

        // Method 1: Using RPC (Remote Procedure Call) function
        // This requires creating a custom function in Supabase
        const { data: tasksWithNotes, error: rpcError } = await supabase
          .rpc('get_tasks_with_notes', { 
            p_user_id: userId 
          })

        if (!rpcError && tasksWithNotes) {
          console.log('✅ RPC method successful:', tasksWithNotes)
          this.tasks = tasksWithNotes
          return tasksWithNotes
        }

        console.log('ℹ️ RPC method not available, falling back to separate queries')

        // Method 2: Explicit JOIN using SQL-like syntax
        const { data: joinData, error: joinError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            description,
            status_name,
            priority_level,
            deadline,
            start_date,
            end_date,
            user_id,
            created_at,
            updated_at,
            notes!inner(note)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (!joinError && joinData) {
          console.log('✅ JOIN method successful:', joinData)
          const processedTasks = joinData.map(task => ({
            ...task,
            notes: task.notes?.[0]?.note || null
          }))
          this.tasks = processedTasks
          return processedTasks
        }

        console.log('ℹ️ JOIN method failed, using separate queries approach')

        // Method 3: Separate queries with explicit parameters
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (tasksError) throw tasksError

        if (!tasksData || tasksData.length === 0) {
          this.tasks = []
          return []
        }

        // Get notes using explicit parameter binding
        const taskIds = tasksData.map(task => task.id)
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('task_id, note, created_at, updated_at')
          .in('task_id', taskIds)
          .eq('user_id', userId) // Additional filter for security

        if (notesError) {
          console.warn('Notes fetch failed:', notesError)
        }

        // Combine data
        const combinedTasks = tasksData.map(task => ({
          ...task,
          notes: notesData?.find(note => note.task_id === task.id)?.note || null
        }))

        console.log('✅ Separate queries method successful:', combinedTasks)
        this.tasks = combinedTasks
        return combinedTasks

      } catch (error) {
        console.error('❌ Params approach failed:', error)
        this.tasks = []
        throw error
      }
    },

    // Alternative: Using stored procedure approach
    async fetchTasksWithStoredProcedure(userId) {
      try {
        // This would require creating a stored procedure in Supabase
        const { data, error } = await supabase
          .rpc('get_user_tasks_with_notes', {
            user_id_param: userId
          })

        if (error) throw error

        this.tasks = data || []
        return data
      } catch (error) {
        console.error('Stored procedure approach failed:', error)
        throw error
      }
    }
  }
})