<!-- TaskView.vue -->
<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, computed } from 'vue'

const isDrawerVisible = ref(true)

// Modal visibility
const isAddTaskDialogVisible = ref(false)

// for the tabs part
const tab = ref('one')

// Task data
const tasks = ref([
  {
    title: 'Web App',
    description: 'Develop the frontend interface',
    notes: 'Use Vuetify for UI components',
    dueDate: '2024-12-19',
    startTime: '08:00',
    endTime: '10:00',
    priority: 'High', // New field
    status: 'In Progress', // New field
  },
  {
    title: 'Database',
    description: 'Design database schema',
    notes: 'Focus on normalization and indexes',
    dueDate: '2024-12-18',
    startTime: '10:00',
    endTime: '12:00',
    priority: 'Medium', // New field
    status: 'Pending', // New field
  },
])

// New task inputs
const newTask = ref({
  title: '',
  description: '',
  notes: '',
  dueDate: '',
  startTime: '',
  endTime: '',
  priority: '', // New field
  status: '', // New field
})

// Dropdown options
const priorityOptions = ['Urgent', 'Important', 'Routine']
const statusOptions = ['Pending', 'In Progress', 'Done']

// Function to add a new task
const addTask = () => {
  if (newTask.value.title.trim() && newTask.value.dueDate.trim()) {
    const formattedDueDate = newTask.value.dueDate.split('T')[0]
    tasks.value.push({ ...newTask.value, dueDate: formattedDueDate })
    newTask.value = {
      title: '',
      description: '',
      notes: '',
      dueDate: '',
      startTime: '',
      endTime: '',
      priority: '', // Reset field
      status: '', // Reset field
    }
    isAddTaskDialogVisible.value = false
  } else {
    alert('Please provide a title and due date!')
  }
}

// Function to delete a task
const deleteTask = (index) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value.splice(index, 1)
  }
}

// Filter tasks for "Due Today"
const dueTodayTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return tasks.value.filter((task) => task.dueDate === today)
})
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head"> </v-tabs>

          <v-container fluid>
            <v-row>
              <!-- First Column: My Tasks -->
              <v-col cols="8">
                <v-card-title class="d-flex align-center">
                  <div class="d-flex align-center" style="font-family: 'Poppins'; color: #00838f">
                    <span class="mr-2"><b>My Tasks</b></span>
                    <v-icon style="font-size: 25px" color="cyan-darken-2"
                      >mdi-progress-pencil</v-icon
                    >
                  </div>
                </v-card-title>
                <v-card-subtitle class="mb-3" style="font-family: 'Poppins'"
                  >Stay on Top of Your Tasks</v-card-subtitle
                >

                <!-- Task List -->
                <v-row
                  v-for="(task, index) in tasks"
                  :key="index"
                  class="task-container mb-2 align-center"
                >
                  <!-- Left Side: Task Panel -->
                  <v-col cols="10">
                    <v-expansion-panels>
                      <v-expansion-panel class="custom-border">
                        <v-expansion-panel-title>
                          <!-- Task Title -->
                          <strong>{{ task.title }}</strong>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <!-- Task Details -->
                          <div><strong>Description:</strong> {{ task.description }}</div>
                          <div><strong>Notes:</strong> {{ task.notes }}</div>
                          <div><strong>Due Date:</strong> {{ task.dueDate }}</div>
                          <div><strong>Priority:</strong> {{ task.priority }}</div>
                          <div><strong>Status:</strong> {{ task.status }}</div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>

                  <!-- Right Side: Edit and Delete Buttons -->
                  <v-col cols="2" class="d-flex justify-end">
                    <v-btn color="cyan-darken-2" size="small" @click="editTask(index)" class="mr-2">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="red" size="small" @click.stop="deleteTask(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Add New Task -->

                <v-btn
                  color="#00838F"
                  style="font-family: 'Poppins'"
                  type="submit"
                  class="mt-2 rounded-pill"
                  @click="isAddTaskDialogVisible = true"
                >
                  <v-icon left>mdi-plus</v-icon> Add Task
                </v-btn>
              </v-col>

              <!-- Second Column: Due Today -->
              <v-col cols="4">
                <h2 class="text-h5 mb-3" style="color: red; font-family: 'Poppins'">
                  <b>Due Today</b>
                </h2>
                <v-card v-for="(task, index) in dueTodayTasks" :key="index" class="mb-2" outlined>
                  <v-card-text>
                    <strong>{{ task.title }}</strong>
                    <div class="text-caption">Deadline: {{ task.dueDate || '-' }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
      <!-- Add Task Modal -->
      <v-dialog v-model="isAddTaskDialogVisible" max-width="600">
        <v-card class="elevation-3 add-task-dialog">
          <!-- Dialog Title -->
          <v-card-title class="d-flex justify-center align-center">
            <v-icon class="mr-2" color="cyan-darken-2">mdi mdi-pen-plus</v-icon>
            <span
              class="headline"
              style="font-family: 'Poppins'; font-weight: bold; color: #00838f"
            >
              Add New Task
            </span>
          </v-card-title>

          <!-- Dialog Content -->
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

              <!-- Task Notes -->
              <v-text-field
                v-model="newTask.notes"
                label="Additional Notes"
                outlined
                dense
                color="cyan-darken-3"
                class="mb-3"
              ></v-text-field>

              <!-- Row for Status and Priority -->
              <v-row>
                <!-- Status on the left -->
                <v-col cols="6">
                  <v-select
                    v-model="newTask.status"
                    :items="statusOptions"
                    label="Status"
                    outlined
                    dense
                    color="cyan-darken-3"
                    class="mb-3"
                  ></v-select>
                </v-col>

                <!-- Priority on the right -->
                <v-col cols="6">
                  <v-select
                    v-model="newTask.priority"
                    :items="priorityOptions"
                    label="Priority"
                    outlined
                    dense
                    color="cyan-darken-3"
                    class="mb-3"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Task Deadline -->
              <v-text-field
                v-model="newTask.dueDate"
                label="Deadline"
                type="datetime-local"
                outlined
                dense
                color="cyan-darken-3"
                class="mb-3"
              ></v-text-field>

              <v-row>
                <!-- Task Start Time -->
                <v-col cols="6">
                  <v-text-field
                    v-model="newTask.startTime"
                    label="Start Time"
                    type="datetime-local"
                    outlined
                    dense
                    color="cyan-darken-3"
                    class="mb-3"
                  ></v-text-field>
                </v-col>

                <!-- Task End Time -->
                <v-col cols="6">
                  <v-text-field
                    v-model="newTask.endTime"
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

          <!-- Dialog Actions -->
          <v-card-actions class="pa-3 d-flex justify-space-between">
            <v-btn
              color="red lighten-1"
              text
              @click="isAddTaskDialogVisible = false"
              class="cancel-btn"
            >
              Cancel
            </v-btn>
            <v-btn color="cyan-darken-3" text @click="addTask" class="save-btn rounded-pill">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Gradient background */
.gradient-bg {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Container styling */
.container {
  position: relative;
  padding: 20px;
}

/* Button positioning */
.menu-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}
.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  /* background-image: url('@/assets/img/bg.jpg'); */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.toggle-btn {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
.tabs-head {
  color: white;
  font-family: 'Poppins', sans-serif;
}
.text-caption {
  color: #777;
  font-size: 0.9em;
}
.custom-border {
  border: 2px solid #0097a7; /* Adjust color as needed */
  border-radius: 8px; /* Optional: Adds rounded corners */
}

/* DIALOG */

.add-task-dialog {
  border-radius: 12px; /* Round corners */
  border: 2px solid #0097a7; /* Adjust color as needed */
  overflow: hidden;
  background-color: #f7f9fa; /* Light background for contrast */
}

.cancel-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

.save-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

/* END DIALOG */
</style>
