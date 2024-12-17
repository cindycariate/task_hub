<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

// for the tabs part
const tab = ref(1)
const isDrawerVisible = ref(true)
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head">
            <v-tab value="one">Low</v-tab>
            <v-tab value="two">Medium</v-tab>
            <v-tab value="three">High</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one"
                ><v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title> Card title </v-card-title>

                    <v-card-subtitle> Card subtitle secondary text </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item value="two"
                ><v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title> Card title </v-card-title>

                    <v-card-subtitle> Card subtitle secondary text </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>

              <v-tabs-window-item value="three"
                ><v-card class="mx-auto" max-width="100%" hover>
                  <v-card-item>
                    <v-card-title> Card title </v-card-title>

                    <v-card-subtitle> Card subtitle secondary text </v-card-subtitle>
                  </v-card-item>

                  <v-card-text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </v-card-text>
                </v-card>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>
<style scoped>
.auth-background {
  background: linear-gradient(140deg, #0a0a0b, #1ea8b0);
  /* background-image: url('@/assets/img/bg.jpg'); */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.tabs-head {
  color: white;
  font-family: 'Poppins', sans-serif;
}
</style>
