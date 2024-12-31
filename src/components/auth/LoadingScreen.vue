<template>
  <div id="loading-screen" v-if="loading">
    <div class="background"></div>
    <div class="logo-container">
      <img src="/logo_icon.png" alt="Logo" class="logo" />
      <div class="loading-text">{{ loadingText }}</div>
    </div>
    <canvas id="particles"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true) // Toggle loading screen
const loadingText = ref('Loading...')

onMounted(() => {
  const canvas = document.getElementById('particles')
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = []
  for (let i = 0; i < 100; i++) {
    particles.push(createParticle())
  }

  function createParticle() {
    const size = Math.random() * 5 + 1
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      size,
      color: 'rgba(255,255,255,0.5)',
    }
  }

  function drawParticle(particle) {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.fill()
    ctx.closePath()
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle) => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Wrap particles around edges
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      drawParticle(particle)
    })

    requestAnimationFrame(animateParticles)
  }

  animateParticles()

  // Simulate loading delay (adjust as needed)
  setTimeout(() => {
    loading.value = false
  }, 5000)
})
</script>

<style scoped>
#loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #005f73, #0a9396);
}

.logo-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100px;
  animation: pulse 2s infinite;
}

.loading-text {
  color: white;
  margin-top: 10px;
  font-size: 1.5em;
  animation: fade 2s infinite;
  font-family: 'Poppins';
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes fade {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

canvas#particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
