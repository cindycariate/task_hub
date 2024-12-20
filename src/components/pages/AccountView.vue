<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase' // Import Supabase for auth

const isDrawerVisible = ref(true)

// For the tabs part
const tab = ref(1)

// Use the task store
const taskStore = useTaskStore()

// Fetch tasks when the component is mounted
onMounted(() => {
  taskStore.fetchTasks()
})

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
const addTask = async () => {
  const { data: user } = await supabase.auth.getUser()

  if (newTask.value.title.trim()) {
    try {
      const taskData = {
        title: newTask.value.title,
        description: newTask.value.description || null,
        start_date: newTask.value.startTime ? newTask.value.startTime : null,
        end_date: newTask.value.endTime ? newTask.value.endTime : null,
        user_id: user?.user?.id,
      }

      // Call the store's addTask function
      await taskStore.addTask(taskData)

      // Reset form inputs
      newTask.value = {
        title: '',
        description: '',
        notes: '',
        dueDate: '',
        startTime: '',
        endTime: '',
      }
    } catch (error) {
      console.error('Error adding task:', error.message)
    }
  }
}

// Function to delete a task
const deleteTask = (index) => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.tasks.splice(index, 1)
  }
}

// Function to edit task
const editTask = (index) => {
  alert(`Edit task: ${taskStore.tasks[index].title}`)
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head"> </v-tabs>

          <!-- Task Input Form -->
          <v-form @submit.prevent="addTask">
            <v-text-field
              v-model="newTask.title"
              label="Title"
              placeholder="Task Title"
              required
            ></v-text-field>

            <v-textarea
              v-model="newTask.description"
              label="Description"
              placeholder="Task Description"
            ></v-textarea>

            <v-text-field
              v-model="newTask.startTime"
              label="Start Time"
              placeholder="YYYY-MM-DD"
              type="date"
            ></v-text-field>

            <v-text-field
              v-model="newTask.endTime"
              label="End Time"
              placeholder="YYYY-MM-DD"
              type="date"
            ></v-text-field>

            <v-btn type="submit" color="primary" class="mt-4">Add Task</v-btn>
          </v-form>

          <v-container fluid>
            <!-- Task List -->
            <v-list>
              <v-list-item
                v-for="(task, index) in taskStore.tasks"
                :key="index"
                class="custom-border mb-2"
              >
                <v-list-item-title>{{ task.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ task.description }}</v-list-item-subtitle>

                <v-btn @click="editTask(index)" color="blue">Edit</v-btn>
                <v-btn @click="deleteTask(index)" color="red" class="ml-2">Delete</v-btn>
              </v-list-item>
            </v-list>
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

.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.tabs-head {
  color: white;
  font-family: 'Poppins', sans-serif;
}

.custom-border {
  border: 2px solid #0097a7;
  border-radius: 8px;
}
</style>
