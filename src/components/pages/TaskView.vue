<!-- TaskView.vue -->
<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)

// for the tabs part
const tab = ref(1)

// Toggle function for the sidebar
const toggleSidebar = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

// Task data
const tasks = ref([
  {
    title: 'Web App',
    description: 'Develop the frontend interface',
    notes: 'Use Vuetify for UI components',
    dueDate: '2024-12-18',
    startTime: '08:00',
    endTime: '10:00',
  },
  {
    title: 'Database',
    description: 'Design database schema',
    notes: 'Focus on normalization and indexes',
    dueDate: '2024-12-18',
    startTime: '10:00',
    endTime: '12:00',
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
})

// Function to add a new task
const addTask = () => {
  if (newTask.value.title.trim()) {
    tasks.value.push({ ...newTask.value })
    newTask.value = { title: '', description: '', notes: '', startTime: '', endTime: '' }
  }
}

// Function to delete a task
const deleteTask = (index) => {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value.splice(index, 1)
  }
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head">
            <v-tab value="one">To Do</v-tab>
            <v-tab value="two">In Progress</v-tab>
            <v-tab value="three">Done</v-tab>
          </v-tabs>
          <v-container fluid>
            <v-row>
              <!-- First Column: My Tasks -->
              <v-col cols="6">
                <h2 class="text-h5 mb-3">My Tasks</h2>

                <!-- Task List with Dropdown -->
                <v-expansion-panels>
                  <v-expansion-panel v-for="(task, index) in tasks" :key="index" class="mb-2">
                    <v-expansion-panel-title>
                      <div class="d-flex justify-space-between align-center">
                        <!-- Task Title -->
                        <strong>{{ task.title }}</strong>
                        <div>
                          <!-- Delete Button -->
                          <v-btn icon color="red" size="small" @click.stop="deleteTask(index)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <!-- Task Details -->
                      <div>
                        <div><strong>Description:</strong> {{ task.description }}</div>
                        <div><strong>Notes:</strong> {{ task.notes }}</div>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Add New Task -->
                <v-form @submit.prevent="addTask">
                  <v-text-field v-model="newTask.title" label="Title" outlined dense></v-text-field>

                  <v-text-field
                    v-model="newTask.description"
                    label="Description"
                    outlined
                    dense
                  ></v-text-field>

                  <v-textarea v-model="newTask.notes" label="Notes" outlined dense></v-textarea>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="newTask.startTime"
                        label="Start Date/Time"
                        type="datetime-local"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="newTask.endTime"
                        label="End Date/Time"
                        type="datetime-local"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-btn color="primary" type="submit" class="mt-2">
                    <v-icon left>mdi-plus</v-icon> Add Task
                  </v-btn>
                </v-form>
              </v-col>

              <!-- Second Column: Due Today -->
              <v-col cols="6">
                <h2 class="text-h5 mb-3">Due Today</h2>

                <!-- Due Today List -->
                <v-card v-for="(task, index) in tasks" :key="index" class="mb-2" outlined>
                  <v-card-text>
                    <strong>{{ task.title }}</strong>
                    <div class="text-caption">Start: {{ task.startTime || '-' }}</div>
                    <div class="text-caption">End: {{ task.endTime || '-' }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
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
</style>
