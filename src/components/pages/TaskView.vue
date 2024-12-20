<!-- TaskView.vue -->
<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)

// for the tabs part
const tab = ref(1)

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

// Function to edit task
const editTask = (index) => {
  alert(`Edit task: ${tasks.value[index].title}`)
}
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
                <v-form @submit.prevent="addTask" class="mt-4">
                  <v-text-field v-model="newTask.title" label="Title" outlined dense></v-text-field>

                  <v-text-field
                    v-model="newTask.dueDate"
                    label="Deadline Date/Time"
                    type="datetime-local"
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

                  <v-btn color="#00838F" style="font-family: 'Poppins'" type="submit" class="mt-2">
                    <v-icon left>mdi-plus</v-icon> Add Task
                  </v-btn>
                </v-form>
              </v-col>

              <!-- Second Column: Due Today -->
              <v-col cols="4">
                <h2 class="text-h5 mb-3" style="color: red; font-family: 'Poppins'">
                  <b>Due Today</b>
                </h2>
                <v-card v-for="(task, index) in tasks" :key="index" class="mb-2" outlined>
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
</style>
