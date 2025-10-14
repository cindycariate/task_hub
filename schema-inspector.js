// Quick database schema inspector
// Add this to your browser console to check the actual column names

(async function inspectNotesSchema() {
  try {
    console.log('🔍 Inspecting notes table schema...')
    
    // Get the first few notes to see the actual column structure
    const { data, error } = await window.supabase
      .from('notes')
      .select('*')
      .limit(3)
    
    if (error) {
      console.error('❌ Error fetching notes:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('✅ Notes table structure:')
      console.log('Available columns:', Object.keys(data[0]))
      console.log('Sample data:', data[0])
      
      // Check common column name variations
      const firstNote = data[0]
      console.log('Checking common column names:')
      console.log('- note:', firstNote.note)
      console.log('- content:', firstNote.content) 
      console.log('- text:', firstNote.text)
      console.log('- description:', firstNote.description)
      console.log('- body:', firstNote.body)
      console.log('- notes:', firstNote.notes)
    } else {
      console.log('📝 No notes found in database')
    }
  } catch (error) {
    console.error('❌ Inspector failed:', error)
  }
})();

// Also check tasks table structure
(async function inspectTasksSchema() {
  try {
    console.log('🔍 Inspecting tasks table schema...')
    
    const { data, error } = await window.supabase
      .from('tasks')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error fetching tasks:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('✅ Tasks table structure:')
      console.log('Available columns:', Object.keys(data[0]))
    }
  } catch (error) {
    console.error('❌ Tasks inspector failed:', error)
  }
})();