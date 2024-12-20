<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { supabase } from '@/utils/supabase' // Import Supabase for auth

const isDrawerVisible = ref(true)
const tab = ref(1)

// For task management
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
          <v-tabs v-model="tab" class="auth-background tabs-head">
            <!-- Add Tab Headers if needed -->
          </v-tabs>

          <!-- Profile and Task Management Sections -->
          <v-row>
            <!-- Profile Picture Section -->
            <v-col cols="12" md="3" class="d-flex flex-column align-center justify-center">
              <v-avatar color="#26C6DA" size="100" class="mt-2 mb-3">
                <span class="text-white text-h5 font-weight-bold">CC</span>
              </v-avatar>
              <v-btn color="#00838f" class="change-photo-btn" prepend-icon="mdi-camera">
                Change Photo
              </v-btn>
            </v-col>

            <!-- Profile Information Section -->
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12">
                  <p class="text-h6 mt-5" style="color: #00838f; font-family: 'Poppins'">
                    <v-icon class="mr-1" color="cyan-darken-2"
                      >mdi mdi-account-circle-outline</v-icon
                    >
                    <b>Profile Information</b>
                  </p>
                </v-col>

                <!-- Email Address Field -->
                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    label="Email Address"
                    variant="outlined"
                    value="cariatecindy@gmail.com"
                  />
                </v-col>

                <!-- Name Field -->
                <v-col cols="12" sm="6" md="8">
                  <v-text-field label="Your Name" variant="outlined" value="Cindy Cariate" />
                </v-col>

                <!-- Save Changes Button -->
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="cyan-darken-2" class="save-btn">Save Changes</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Profile Card */
.profile-card {
  color: #00838f;
  border-radius: 12px;
}

/* Avatar */

/* Change Photo Button */
.change-photo-btn {
  color: #00838f;
  text-transform: none;
  font-weight: 600;
}

/* Buttons */
.v-btn {
  text-transform: none;
  font-weight: 600;
}

.save-btn {
  margin-bottom: 10px;
  margin-right: 10px;
}

/* Typography */
p {
  margin: 0;
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
