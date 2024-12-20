<script setup>
import { ref } from 'vue'
import AppLayout from '../AppLayout.vue'

// Sidebar visibility states
const isDrawerVisible = ref(true)
const drawer = ref(true)
const rail = ref(true)

// Dialog visibility state
const isAddTaskDialogVisible = ref(false)

// Task form data
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

// Options for select inputs
const statusOptions = ['To Do', 'In Progress', 'Completed']
const priorityOptions = ['Urgent', 'Important', 'Routine']

// Add task function (placeholder)
const addTask = () => {
  console.log('Task Added:', newTask.value)
  isAddTaskDialogVisible.value = false
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    style="font-family: 'Poppins'"
    width="250px"
  >
    <v-list-item class="sidenav-btn">
      <template v-slot:append>
        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-list class="sidenav" density="compact" nav>
      <RouterLink to="/pages/home" @click.stop>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          value="home"
          active-class="active"
        ></v-list-item>
      </RouterLink>
      <RouterLink to="/pages/task" @click.stop>
        <v-list-item prepend-icon="mdi-pen" title="Task" value="task"></v-list-item>
      </RouterLink>
      <RouterLink to="/pages/status" @click.stop>
        <v-list-item
          prepend-icon="mdi mdi-text-box-check-outline"
          title="Status"
          value="status"
        ></v-list-item>
      </RouterLink>
      <RouterLink to="/pages/priority" @click.stop>
        <v-list-item prepend-icon="mdi-star" title="Priority" value="priority"></v-list-item>
      </RouterLink>
      <v-divider class="my-5"></v-divider>
      <RouterLink to="/pages/accountSettings" @click.stop>
        <v-list-item
          prepend-icon="mdi-cog"
          title="Account Settings"
          value="accountSettings"
        ></v-list-item>
      </RouterLink>

      <!-- Create New Button -->
      <div :class="[rail ? 'rail-mode' : 'expanded-mode']" class="create-new-btn-side">
        <button class="create-new-btn rounded-pill" @click="isAddTaskDialogVisible = true">
          <i class="mdi mdi-plus"></i> <span v-if="!rail">Create New</span>
        </button>
      </div>
    </v-list>
  </v-navigation-drawer>

  <!-- Add New Task Dialog -->
  <v-dialog v-model="isAddTaskDialogVisible" max-width="600">
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
                v-model="newTask.status"
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

          <!-- Deadline -->
          <v-text-field
            v-model="newTask.dueDate"
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
                v-model="newTask.startTime"
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
</template>

<style scoped>
/* Sidebar Drawer */

.task-text {
  color: white;
}
.hub-text {
  color: aqua;
}

.logo-icon {
  height: 45px; /* Adjust height of the logo */
  width: auto; /* Keep aspect ratio */
  object-fit: contain; /* Ensure the image fits within its bounds */
}

.sidenav a:hover .v-list-item {
  background-color: rgba(255, 255, 255, 0.2); /* Transparent white background */
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Add some padding for better visual effect */

  transition: background-color 0.3s; /* Smooth transition effect */
}
.sidenav a.router-link-active .v-list-item {
  background-color: #0097a7;
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Add some padding for better visual effect */
  color: white; /* Keep text color white */
  transition: background-color 0.3s; /* Smooth transition effect */
}
.sidenav a {
  text-decoration: none; /* Remove underline */
  color: inherit; /* Inherit parent text color */
}

.sidenav a:hover {
  text-decoration: none; /* Prevent underline on hover */
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
.main-content {
  align-items: flex-end;
  margin-top: 50px;
  color: white;
}
.welcome-message h1 {
  font-weight: bolder;
  font-family: 'Poppins';
  padding-bottom: 3px;
}
.welcome-message p {
  font-weight: 500;
  font-size: 18px;
  padding-bottom: 20px;
  color: rgb(236, 229, 221);
}
.v-main {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
}
/* SIDENAV CREATE NEW BTN */
.create-new-btn-side {
  margin-top: auto; /* Push the button to the bottom */
  display: flex;
  justify-content: center; /* Center horizontally */
  padding: 20px;
}

.create-new-btn {
  background: #0097a7;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Poppins';
  margin-top: 30px;
  transition: transform 0.3s ease; /* Smooth transition */
}

.v-navigation-drawer[rail] .create-new-btn {
  transform: scale(0.8); /* Shrink the button on rail mode */
}

/* END */

/* SIDENAV STYLES */
.v-navigation-drawer {
  display: flex;
  flex-direction: column;
}
/* Ensure the button stays at the bottom */

/* DIALOG */

.add-task-dialog {
  border-radius: 30px; /* Round corners */
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
