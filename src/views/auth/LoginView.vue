<script setup>
import { RouterLink } from 'vue-router'

import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row justify="center" align-content="center">
        <v-col cols="12" md="6">
          <v-img
            class="mx-auto"
            :width="290"
            aspect-ratio="16/9"
            cover
            src="/logo_icon.png"
            alt="TaskHub"
          ></v-img>

          <p class="description text-center">
            A Task Manager app helps users create tasks, assign priorities, and monitor progress to
            stay organized and meet deadlines efficiently.
          </p></v-col
        >
        <v-col cols="12" md="6" class="mt-13">
          <v-card class="glassmorphic-card mx-auto" :max-width="'500'" elevation="14" rounded="lg">
            <template v-slot:title>
              <span class="font-weight-black text-center d-block text-uppercase pt-4">login</span>
            </template>

            <v-card-text class="pt-4">
              <v-form fast-fail @submit.prevent>
                <v-text-field
                  label="Email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                ></v-text-field>

                <v-text-field
                  label="Password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  @click:append-inner="visible = !visible"
                ></v-text-field>

                <v-btn
                  class="mt-2 text-white"
                  type="submit"
                  color="cyan-lighten-2"
                  rounded="xl"
                  block
                  prepend-icon="mdi-login"
                  >Log in</v-btn
                >
              </v-form>
              <v-divider class="my-5"></v-divider>
              <h4 class="text-center">
                Don't have account?
                <RouterLink style="color: white" to="/signup"><b>Sign up</b></RouterLink>
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
  backdrop-filter: blur(25px); /* Frosted glass effect */
  /* -webkit-backdrop-filter: blur(10px); Safari support */
  border: 2px solid rgba(255, 255, 255, 0.959); /* Frosted border */
  border-radius: 16px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Shadow for depth */
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
