<script setup>
import { ref } from 'vue'
import BackgroundLayout from '@/components/auth/BackgroundLayout.vue'

const theme = ref('light')

/*function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}*/
</script>

<template>
  <BackgroundLayout>
    <v-responsive>
      <v-app :theme="theme" class="transparent-app">
        <v-app-bar class="px-3" color="transparent">
          <h3 class="text-logo font-weight-black">TaskHub</h3>

          <v-spacer></v-spacer>

          <!-- <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>-->
        </v-app-bar>

        <v-main>
          <v-container class="d-flex justify-center align-center my-4">
            <v-row justify="center" align-content="center" no-gutters="">
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
                  A Task Manager app helps users create tasks, assign priorities, and monitor
                  progress to stay organized and meet deadlines efficiently.
                </p></v-col
              >
              <v-col cols="12" md="6">
                <v-card
                  class="glassmorphic-card mx-auto"
                  :max-width="'500'"
                  elevation="14"
                  rounded="lg"
                >
                  <template v-slot:title>
                    <span class="font-weight-black text-center d-block text-uppercase pt-4"
                      >sign up</span
                    >
                  </template>

                  <v-card-text class="pt-4">
                    <v-form fast-fail @submit.prevent>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field label="First name" variant="outlined"></v-text-field
                        ></v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field label="Last name" variant="outlined"></v-text-field
                        ></v-col>
                      </v-row>

                      <v-text-field
                        label="Email"
                        variant="outlined"
                        prepend-inner-icon="mdi-email"
                      ></v-text-field>

                      <v-text-field
                        label="Password"
                        type="password"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock"
                      ></v-text-field>
                      <v-text-field
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock"
                      ></v-text-field>

                      <v-btn
                        class="mt-2 text-white"
                        type="submit"
                        color="cyan-lighten-3"
                        rounded="xl"
                        block
                        >Sign up</v-btn
                      >
                    </v-form>
                    <v-divider class="my-5"></v-divider>
                    <h4 class="text-center">
                      Already have an account?
                      <RouterLink style="color: white" to="/"><b>Login</b></RouterLink>
                    </h4>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-app>
    </v-responsive>
  </BackgroundLayout>
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
