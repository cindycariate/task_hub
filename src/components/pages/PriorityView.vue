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

// Task list array
const tasks = ref([
  { title: 'Task 1: Lorem ipsum dolor sit amet' },
  { title: 'Task 2: Consectetur adipiscing elit' },
])

// New task input model
const newTask = ref('')

// Function to add a new task
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({ title: newTask.value })
    newTask.value = ''
  }
}

// Function to edit a task
const editTask = (index) => {
  const updatedTitle = prompt('Edit Task:', tasks.value[index].title)
  if (updatedTitle !== null && updatedTitle.trim()) {
    tasks.value[index].title = updatedTitle
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
            <v-tab value="one">Urgent</v-tab>
            <v-tab value="two">Important</v-tab>
            <v-tab value="three">Routine</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one">
                <v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title style="font-family: 'Poppins'; color: #00838f"
                      ><b>Urgent Tasks </b>
                      <v-icon
                        class="mdi mdi-alert-circle-outline"
                        style="font-size: 25px"
                        color="red-darken-3"
                      ></v-icon
                    ></v-card-title>
                    <v-card-subtitle>Plan, Prioritize, and Complete your tasks</v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <!-- Two-column Layout -->
                    <v-row>
                      <!-- First Column: To Do Tasks -->
                      <v-col cols="12" class="pa-4">
                        <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>

                        <!-- Task List (Dynamic Example) -->
                        <v-card
                          v-for="(task, index) in tasks"
                          :key="index"
                          class="mb-5 custom-border"
                          elevation="0"
                          outlined
                        >
                          <v-card-text class="d-flex justify-space-between align-center">
                            <span>{{ task.title }}</span>
                            <div>
                              <!-- Edit Button -->
                              <v-btn icon color="#00ACC1" @click="editTask(index)" size="small">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>

                              <!-- Delete Button -->
                              <v-btn
                                icon
                                color="red"
                                @click="deleteTask(index)"
                                size="small"
                                class="ml-2"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item value="two"
                ><v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title style="font-family: 'Poppins'; color: #00838f">
                      <b>Important Tasks </b>
                      <v-icon
                        class="mdi mdi-alert-octagon-outline"
                        style="font-size: 25px"
                        color="red-darken-3"
                      ></v-icon>
                    </v-card-title>

                    <v-card-subtitle> Plan, Prioritize, and Complete your tasks </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <v-row>
                      <!-- First Column: To Do Tasks -->
                      <v-col cols="12" class="pa-4">
                        <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>

                        <!-- Task List (Dynamic Example) -->
                        <v-card
                          v-for="(task, index) in tasks"
                          :key="index"
                          class="mb-5 custom-border"
                          elevation="0"
                          outlined
                        >
                          <v-card-text class="d-flex justify-space-between align-center">
                            <span>{{ task.title }}</span>
                            <div>
                              <!-- Edit Button -->
                              <v-btn icon color="#00ACC1" @click="editTask(index)" size="small">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>

                              <!-- Delete Button -->
                              <v-btn
                                icon
                                color="red"
                                @click="deleteTask(index)"
                                size="small"
                                class="ml-2"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item value="three"
                ><v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title style="font-family: 'Poppins'; color: #00838f">
                      <b>Routine Tasks</b>
                      <v-icon
                        class="mdi mdi-clipboard-text-clock-outline"
                        style="font-size: 25px"
                        color="cyan-darken-2"
                      ></v-icon>
                    </v-card-title>

                    <v-card-subtitle> Plan, Prioritize, and Complete your tasks </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    <v-row>
                      <!-- First Column: To Do Tasks -->
                      <v-col cols="12" class="pa-4">
                        <h3 class="text-h6 mb-4"><strong>Tasks</strong></h3>

                        <!-- Task List (Dynamic Example) -->
                        <v-card
                          v-for="(task, index) in tasks"
                          :key="index"
                          class="mb-5 custom-border"
                          elevation="0"
                          outlined
                        >
                          <v-card-text class="d-flex justify-space-between align-center">
                            <span>{{ task.title }}</span>
                            <div>
                              <!-- Edit Button -->
                              <v-btn icon color="#00ACC1" @click="editTask(index)" size="small">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>

                              <!-- Delete Button -->
                              <v-btn
                                icon
                                color="red"
                                @click="deleteTask(index)"
                                size="small"
                                class="ml-2"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
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
.custom-border {
  border: 2px solid #0097a7; /* Adjust color as needed */
  border-radius: 8px; /* Optional: Adds rounded corners */
}
</style>
