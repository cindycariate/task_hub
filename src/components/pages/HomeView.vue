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
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <div class="home-content auth-background">
        <v-row>
          <!-- Responsive image column -->
          <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
            <img src="/src/assets/img/home_img.png" class="img-fluid note" height="325" />
          </v-col>

          <!-- Responsive welcome message -->
          <v-col cols="12" sm="6" md="8">
            <div class="welcome-message text-center text-sm-left">
              <h1 class="text-white text-h2">
                Welcome to <span class="task-text">Task</span><span class="hub-text">Hub</span>
              </h1>
              <p class="p">Visually Manage Your Tasks</p>
              <button class="create-new-btn rounded-pill">
                <i class="mdi mdi-plus"></i> Create New
              </button>
            </div>
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
  font-size: 18px;
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
</style>
