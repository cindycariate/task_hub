<script setup>
import { ref } from 'vue'
import AppLayout from '../AppLayout.vue'

const isDrawerVisible = ref(true) // Sidebar visibility state
const drawer = ref(true)
const rail = ref(true)
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    style="font-family: 'Poppins'"
  >
    <v-list-item class="sidenav-btn">
      <template v-slot:append>
        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-list density="compact" nav>
      <RouterLink to="/pages/home"
        ><v-list-item prepend-icon="mdi-home" title="Home" value="home"></v-list-item
      ></RouterLink>
      <RouterLink to="/pages/task"
        ><v-list-item prepend-icon="mdi-pen" title="Task" value="task"></v-list-item
      ></RouterLink>
      <RouterLink to="/pages/priority"
        ><v-list-item prepend-icon="mdi-star" title="Priority" value="priority"></v-list-item
      ></RouterLink>
      <v-divider class="my-5"></v-divider>
      <RouterLink to="/pages/accountSettings">
        <v-list-item
          prepend-icon="mdi-cog"
          title="Account Settings"
          value="accountSettings"
        ></v-list-item>
      </RouterLink>
    </v-list>
  </v-navigation-drawer>
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
/*  ProfileHeader container styles  */
/* .profile-header-container {
  display: flex;
  margin-top: 30%;
  margin-left: 40%;
  margin-right: 40%;
  justify-content: center; /* Center the ProfileHeader horizontally */
/* margin-top: 50px; Add margin if needed to separate from other items
}*/

/* .profile-header {
  display: flex;
  align-items: center; /* Aligns content vertically
}*/

.sidenav-btn :hover {
  background-color: #0097a7;
}
.v-main {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
}
</style>
