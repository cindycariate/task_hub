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

          <v-container fluid> </v-container>
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
