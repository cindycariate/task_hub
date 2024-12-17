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

    <v-list class="sidenav" density="compact" nav>
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

.sidenav li:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Transparent white background */
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Add some padding for better visual effect */
  color: white; /* Keep text color white */
  transition: background-color 0.3s; /* Smooth transition effect */
}
.sidenav li.active {
  background-color: rgba(6, 149, 154, 0.817); /* Transparent white background */
  border-radius: 5px; /* Rounded corners */
  padding: 5px; /* Add some padding for better visual effect */
  color: white; /* Keep text color white */
  transition: background-color 0.3s; /* Smooth transition effect */
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
</style>
