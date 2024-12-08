<template>
  <div class="auth-background">
    <slot></slot>
  </div>
</template>

<style scoped>
.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  /* background-image: url('@/assets/img/bg.jpg'); */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
