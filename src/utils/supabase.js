import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
//Form action Utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}

//Check if the session exists
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error.message)
    return false
  }
  return !!data.session
}

// Fetch notes FK tasks
export const fetchTasksWithNotes = async () => {
  const { data, error } = await supabase.from('tasks').select(`
      id,
      title,
      description,
      deadline,
      start_date,
      end_date,
      priority_level,
      status_name,
      notes (id, notes, created_at)
    `)

  if (error) {
    console.error('Error fetching tasks with notes:', error.message)
  } else {
    console.log('Tasks with Notes:', data)
  }
}

// Call the function if needed
// fetchTasksWithNotes()
