<script setup>
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore' // Assuming you're using Pinia for task state management
import { supabase } from '@/utils/supabase' // Assuming Supabase is set up for DB interaction
import SideNav from '../layout/navigation/SideNav.vue'

// Initialize task store
const taskStore = useTaskStore()

// Task form data
const newTask = ref({
  title: '',
  description: '',
  notes: '',
  status_name: '',
  priority_level: '',
  deadline: '',
  start_date: '',
  end_date: '',
})
// Dialog visibility state
const isAddTaskDialogVisible = ref(false)

// Function to open the create new task dialog
const openCreateNewDialog = () => {
  isAddTaskDialogVisible.value = true
}

// Add task function
const addTask = () => {
  console.log('Task Added:', newTask.value)
  isAddTaskDialogVisible.value = false
}
// Options for select inputs
const statusOptions = ['To Do', 'In Progress', 'Completed']
const priorityOptions = ['Urgent', 'Important', 'Routine']

// Props for controlling dialog visibility and task data
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
  onSave: {
    type: Function,
    required: true,
  },
})

// Function to save task (with store and supabase integration)
const saveTask = async () => {
  try {
    // Step 1: Get the authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData) {
      throw new Error('No authenticated user found')
    }

    // Step 2: Save the task to Supabase (without notes)
    const { data: taskData, error: taskError } = await supabase
      .from('tasks') // 'tasks' is the table name
      .insert([
        {
          title: newTask.value.title,
          description: newTask.value.description,
          status_name: newTask.value.status_name,
          priority_level: newTask.value.priority_level,
          deadline: newTask.value.deadline,
          start_date: newTask.value.start_date,
          end_date: newTask.value.end_date,
          user_id: userData.id, // Add user_id to link the task to the user
        },
      ])
      .single() // This ensures we get a single task entry back

    // Log taskData and taskError for debugging
    console.log('Task Data:', taskData)
    console.log('Task Error:', taskError)

    if (!taskData) {
      console.error('No task data returned after insertion')
      throw new Error('No task data returned')
    }

    // Step 3: Insert the note into the 'notes' table, using task_id as a foreign key
    const { error: noteError } = await supabase.from('notes').insert([
      {
        task_id: taskData.id, // Reference the task using its ID
        note: newTask.value.notes, // Insert the note text
      },
    ])

    if (noteError) throw noteError // If notes insertion fails, throw an error

    // After successful insertion, add the task to the store (optional)
    taskStore.addTask(taskData)

    // Close the dialog after saving
    props.onSave(newTask.value)
    props.onClose()
  } catch (err) {
    console.error('Error saving task:', err)
    // Handle error (optional: show notification, etc.)
  }
}

// Function to close dialog
const closeDialog = () => {
  props.onClose()
}
</script>

<template>
  <v-dialog v-model="props.isVisible" max-width="600">
    <v-card class="elevation-3 add-task-dialog">
      <v-card-title class="d-flex justify-center align-center">
        <v-icon class="mr-2" color="cyan-darken-2">mdi mdi-pen-plus</v-icon>
        <span class="headline" style="font-family: 'Poppins'; font-weight: bold; color: #00838f">
          Add New Task
        </span>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form>
          <!-- Task Title -->
          <v-text-field
            v-model="newTask.title"
            label="Task Title"
            outlined
            dense
            color="cyan-darken-3"
            class="mb-3"
          ></v-text-field>

          <!-- Task Description -->
          <v-textarea
            v-model="newTask.description"
            label="Task Description"
            outlined
            dense
            color="cyan-darken-3"
            rows="3"
            class="mb-3"
          ></v-textarea>

          <!-- Additional Notes -->
          <v-text-field
            v-model="newTask.notes"
            label="Additional Notes"
            outlined
            dense
            color="cyan-darken-3"
            class="mb-3"
          ></v-text-field>

          <!-- Status and Priority -->
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="newTask.status_name"
                :items="statusOptions"
                label="Status"
                outlined
                dense
                color="cyan-darken-3"
                class="mb-3"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="newTask.priority_level"
                :items="priorityOptions"
                label="Priority"
                outlined
                dense
                color="cyan-darken-3"
                class="mb-3"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Deadline -->
          <v-text-field
            v-model="newTask.deadline"
            label="Deadline"
            type="datetime-local"
            outlined
            dense
            color="cyan-darken-3"
            class="mb-3"
          ></v-text-field>

          <!-- Start and End Time -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="newTask.start_date"
                label="Start Time"
                type="datetime-local"
                outlined
                dense
                color="cyan-darken-3"
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="newTask.end_date"
                label="End Time"
                type="datetime-local"
                outlined
                dense
                color="cyan-darken-3"
                class="mb-3"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-3 d-flex justify-space-between">
        <v-btn color="red lighten-1" text @click="closeDialog" class="cancel-btn rounded-pill">
          Cancel
        </v-btn>
        <v-btn color="cyan-darken-3" text @click="saveTask" class="save-btn rounded-pill">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Styles for dialog */
.add-task-dialog {
  border-radius: 30px;
  border: 2px solid #0097a7;
  overflow: hidden;
  background-color: #f7f9fa;
}

.cancel-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

.save-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  border: 2px solid #0097a7;
}
</style>
