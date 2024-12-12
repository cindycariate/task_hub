<template>
  <div class="home-content">
    <div class="welcome-message">
      <h1 class="text-white text-h3">
        Welcome to <span class="task-text">Task</span><span class="hub-text">Hub</span>
      </h1>
      <p class="p">Visually Manage Your Tasks</p>
      <button class="create-new-btn rounded-pill"><i class="mdi mdi-plus"></i> Create New</button>
    </div>
  </div>
</template>

<style scoped>
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
