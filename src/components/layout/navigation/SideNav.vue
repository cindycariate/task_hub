<script setup>
import { ref } from 'vue'
import BackgroundLayout from '@/components/auth/BackgroundLayout.vue'
import ProfileHeader from '../ProfileHeader.vue'

const isDrawerVisible = ref(true)
const isTaskDropdownVisible = ref(false)
const isPriorityDropdownVisible = ref(false)

// Track the active drawer item
const activeMenuItem = ref('') // Store the currently active item

// Function to toggle the Task dropdown
const toggleTaskDropdown = () => {
  if (isPriorityDropdownVisible.value) {
    isPriorityDropdownVisible.value = false
  }
  isTaskDropdownVisible.value = !isTaskDropdownVisible.value
}

// Function to toggle the Priority dropdown
const togglePriorityDropdown = () => {
  if (isTaskDropdownVisible.value) {
    isTaskDropdownVisible.value = false
  }
  isPriorityDropdownVisible.value = !isPriorityDropdownVisible.value
}

// Function to set the active menu item
const setActiveMenuItem = (item) => {
  activeMenuItem.value = item
}
</script>

<template>
  <BackgroundLayout>
    <!-- Sidebar Drawer -->
    <div class="nav-drawer rounded-sm" style="font-family: 'Poppins'" v-if="isDrawerVisible">
      <div class="drawer-header mb-5">
        <img class="logo-icon" src="/logo_icon.png" alt="" />
        <h1><span class="task-text">Task</span><span class="hub-text">Hub</span></h1>
      </div>
      <ul class="drawer-menu">
        <li :class="{ active: activeMenuItem === 'Home' }" @click="setActiveMenuItem('Home')">
          <i class="mdi mdi-home"></i>
          <span>Home</span>
        </li>
        <li :class="{ active: activeMenuItem === 'Task' }" @click="setActiveMenuItem('Task')">
          <i class="mdi mdi-pen"></i>
          <span>Task</span>
          <span class="dropdown-icon" @click.stop="toggleTaskDropdown">
            {{ isTaskDropdownVisible ? '▲' : '▼' }}
          </span>
        </li>
        <ul v-if="isTaskDropdownVisible" class="dropdown">
          <li
            :class="{ active: activeMenuItem === 'Completed' }"
            @click="setActiveMenuItem('Completed')"
          >
            Completed
          </li>
          <li
            :class="{ active: activeMenuItem === 'In Progress' }"
            @click="setActiveMenuItem('In Progress')"
          >
            In progress
          </li>
          <li
            :class="{ active: activeMenuItem === 'Pending' }"
            @click="setActiveMenuItem('Pending')"
          >
            Pending
          </li>
        </ul>
        <li
          :class="{ active: activeMenuItem === 'Priority' }"
          @click="setActiveMenuItem('Priority')"
        >
          <i class="mdi mdi-star"></i> <span> Priority</span>
          <span class="dropdown-icon" @click.stop="togglePriorityDropdown">
            {{ isPriorityDropdownVisible ? '▲' : '▼' }}
          </span>
        </li>
        <ul v-if="isPriorityDropdownVisible" class="dropdown">
          <li :class="{ active: activeMenuItem === 'Urgent' }" @click="setActiveMenuItem('Urgent')">
            Urgent
          </li>
          <li
            :class="{ active: activeMenuItem === 'Important' }"
            @click="setActiveMenuItem('Important')"
          >
            Important
          </li>
        </ul>
        <v-divider class="my-10"></v-divider>
        <li
          :class="{ active: activeMenuItem === 'Settings' }"
          @click="setActiveMenuItem('Settings')"
        >
          <i class="mdi mdi-cog"></i>
          <span>Settings</span>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="welcome-message">
        <h1 class="text-white text-h3">
          Welcome to <span class="task-text">Task</span><span class="hub-text">Hub</span>
        </h1>
        <p class="p">Visually Manage Your Tasks</p>
        <button class="create-new-btn rounded-pill"><i class="mdi mdi-plus"></i> Create New</button>
      </div>
    </div>
  </BackgroundLayout>
</template>

<style scoped>
/* Sidebar Drawer */
.nav-drawer {
  background-color: rgba(3, 47, 53, 0.8); /* Dark semi-transparent background */
  color: white; /* Text color */
  width: 300px; /* Fixed width for the sidebar */
  padding: 20px; /* Internal padding for content */
  position: fixed; /* Fixed on the screen */
  top: 0; /* Space from the top */
  left: 0; /* Space from the left */
  bottom: 0; /* Space from the bottom */
  box-shadow: 0px 4px 10px rgba(242, 241, 241, 0.3); /* Subtle shadow */
  display: flex; /* Allows flexible alignment */
  flex-direction: column; /* Aligns items vertically */
  justify-content: flex-start; /* Space out content */
  overflow: hidden; /* Prevent overflow if content exceeds height */
}

.drawer-header {
  display: flex;
  align-items: center; /* Aligns logo and text vertically */
}
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

.drawer-header h1 {
  margin: 0; /* Remove default margin from the h1 */
  font-size: 30px; /* Font size for the text */
  font-weight: bold; /* Emphasize the text */
}

.drawer-menu {
  list-style: none; /* Remove bullet points */
  padding: 0; /* No padding for the list */
}

.drawer-menu li {
  margin: 15px 0; /* Space between menu items */
  display: flex;
  align-items: center; /* Center icons and text */
  gap: 10px; /* Space between icons and text */
  cursor: pointer; /* Pointer cursor on hover */
}

.drawer-menu li:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Transparent white background */
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Add some padding for better visual effect */
  color: white; /* Keep text color white */
  transition: background-color 0.3s; /* Smooth transition effect */
}
.drawer-menu li.active {
  background-color: rgba(6, 149, 154, 0.817); /* Transparent white background */
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Add some padding for better visual effect */
  color: white; /* Keep text color white */
  transition: background-color 0.3s; /* Smooth transition effect */
}
.drawer-menu .dropdown {
  list-style: none; /* Remove bullet points */
  padding: 0 60px; /* Indent dropdown items */
  margin: 10px 0; /* Space between items */
}

/* SIDEBAR END */

.dropdown-icon {
  margin-left: auto; /* Push icon to the far right */
  font-size: 12px; /* Small size for the icon */
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
</style>
