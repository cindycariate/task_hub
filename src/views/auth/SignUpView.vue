<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'
</script>

<template>
  <AppLayout>
    <template #content
      ><v-row justify="center" align-content="center" no-gutters="">
        <v-col cols="12" md="6">
          <v-img
            class="mx-auto"
            :width="290"
            aspect-ratio="16/9"
            cover
            src="/logo_icon.png"
            alt="TaskHub"
          ></v-img>
          <p class="description text-center mb-5">
            A Task Manager app helps users create tasks, assign priorities, and monitor progress to
            stay organized and meet deadlines efficiently.
          </p></v-col
        >
        <v-col cols="12" md="6">
          <v-card class="glassmorphic-card mx-auto" :max-width="'500'" elevation="14" rounded="lg">
            <template v-slot:title>
              <span class="font-weight-black text-center d-block text-uppercase pt-4">sign up</span>
            </template>

            <v-card-text class="pt-4">
              <SignUpForm></SignUpForm>

              <h4 class="text-center">
                Already have an account?
                <RouterLink style="color: white" to="/"><b>Login</b></RouterLink>
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row></template
    >
  </AppLayout>
</template>

<style scoped>
.transparent-app {
  background: transparent;
}

.glassmorphic-card {
  color: white;
  background: rgba(64, 64, 64, 0.15); /* Transparent white */
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.959); /* Frosted border */
}
.description {
  font-size: 18px;
  color: white;
  text-align: center;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
}

.text-logo {
  color: aqua;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: bolder;
  font-size: x-large;
}
</style>
