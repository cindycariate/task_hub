<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)

// BACKGROUND
// Function to generate random positions for particles
const getRandomPosition = () => {
  const x = Math.random() * 100 // Random X position (percentage)
  const y = Math.random() * 100 // Random Y position (percentage)
  return {
    left: `${x}%`, // X position (from 0% to 100%)
    top: `${y}%`, // Y position (from 0% to 100%)
    animationDelay: `${Math.random() * 5}s`, // Randomize animation delay for each particle
  }
}

// Dialog visibility
const isAddTaskDialogVisible = ref(false)

// Data for the new task
const newTask = ref({
  title: '',
  description: '',
  notes: '',
  status: '',
  priority: '',
  dueDate: '',
  startTime: '',
  endTime: '',
})

// Status and Priority options
const statusOptions = ['To Do', 'In Progress', 'Done']
const priorityOptions = ['Urgent', 'Important', 'Routine']

// Function to handle adding a new task
const addTask = () => {
  console.log('New Task:', newTask.value)
  // Logic for adding the task (e.g., saving to the database)
  isAddTaskDialogVisible.value = false // Close the dialog after saving
}
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <div class="home-content auth-background">
        <v-row class="align-center">
          <!-- Responsive image column -->
          <v-col cols="12" sm="6" md="5" class="d-flex justify-center">
            <img src="/src/assets/img/home_img.png" class="img-fluid bouncing-image" />
          </v-col>

          <!-- Responsive welcome message -->
          <v-col cols="12" sm="6" md="7">
            <div class="welcome-message text-center text-sm-left">
              <h1 class="text-white text-h2 mb-4">
                Welcome to <span class="task-text">Task</span><span class="hub-text">Hub</span>
              </h1>
              <p class="mb-3">Visually Manage Your Tasks</p>
              <!-- Button to open the dialog -->
              <button class="create-new-btn rounded-pill" @click="isAddTaskDialogVisible = true">
                <i class="mdi mdi-plus"></i> Create New
              </button>
            </div>

            <!-- Add Task Dialog -->
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
                    class="cancel-btn rounded-pill"
                  >
                    Cancel
                  </v-btn>
                  <v-btn color="cyan-darken-3" text @click="addTask" class="save-btn rounded-pill">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
/* BACKGROUND */

.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #0d9ea6);
  background-size: 200% 200%;
  background-position: 0% 50%;
  animation: moveBackground 10s linear infinite;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Keyframe animation for moving background */
@keyframes moveBackground {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Particles container */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  z-index: -1; /* Ensure particles are behind content */
}

/* Particle style */
.particle {
  font-size: 2rem; /* Icon size (adjust as needed) */
  position: absolute;
  animation:
    moveParticles 5s linear infinite,
    fadeInOut 3s ease-in-out infinite;
  color: rgba(255, 255, 255, 0.8); /* Particle color */
  transition: transform 0.2s ease-in-out;
}

/* Keyframe animation for moving particles */
@keyframes moveParticles {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(20px, 30px, 0); /* Change these values for more complex movement */
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

/* Keyframe animation for fading particles */
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* BOUNCING IMAGE */
/* Bounce Animation */
.bouncing-image {
  animation: bounce 2s infinite ease-in-out; /* Name, duration, repeat, easing */
  height: 385px;
  margin: auto;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0); /* Start and end at the original position */
  }
  50% {
    transform: translateY(-20px); /* Move up */
  }
}

/* WELCOME PAGE */

.create-new-btn {
  background: #0097a7;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
}
.home-content {
  align-items: center;
  color: white;
}
.welcome-message h1 {
  font-weight: bolder;
  font-family: 'Poppins';
  padding-bottom: 3px;
  margin: 0;
}
.welcome-message p {
  font-weight: 500;
  font-size: 25px;
  color: rgb(236, 229, 221);
  margin: 0;
}
.welcome-message {
  padding: 0;
  margin-left: 5px;
}
.hub-text {
  color: aqua;
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
  border: 2px solid #0097a7; /* Adjust color as needed */
}

/* END DIALOG */
</style>
