<!-- TaskView.vue -->
<script setup>
import AppLayout from '../layout/AppLayout.vue'
import { ref } from 'vue'

const isDrawerVisible = ref(true)

// for the tabs part
const tab = ref(1)
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="true" :is-drawer-visible="isDrawerVisible">
    <template #content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" class="auth-background tabs-head"> </v-tabs>

          <v-row>
            <!-- Profile Picture Section -->
            <v-col cols="12" md="3" class="d-flex flex-column align-center justify-center">
              <v-avatar color="#26C6DA" size="100" class="mt-2 mb-3">
                <span class="text-white text-h5 font-weight-bold">CC</span>
              </v-avatar>
              <v-btn color="#00838f" class="change-photo-btn" prepend-icon="mdi-camera">
                Change Photo
              </v-btn>
            </v-col>

            <!-- Profile Information Section -->
            <v-col cols="12" md="9">
              <v-row>
                <v-col cols="12">
                  <p class="text-h6 mt-3 mx-3" style="color: #00838f; font-family: 'Poppins'">
                    <b>Profile Information</b>
                  </p>
                </v-col>

                <!-- Email Address Field -->
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Email Address"
                    variant="outlined"
                    value="cariatecindy@gmail.com"
                  ></v-text-field>
                </v-col>

                <!-- Name Field -->
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Your Name"
                    variant="outlined"
                    value="Cindy Cariate"
                  ></v-text-field>
                </v-col>

                <!-- Save Changes Button -->
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="cyan-darken-2" class="save-btn">Save Changes</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Profile Card */
.profile-card {
  color: #00838f;
  border-radius: 12px;
}

/* Avatar */
.v-avatar {
  background-color: #673ab7; /* Purple color */
}

/* Change Photo Button */
.change-photo-btn {
  color: #00838f;
  text-transform: none;
  font-weight: 600;
}

/* Buttons */
.v-btn {
  text-transform: none;
  font-weight: 600;
}

.save-btn {
  margin-bottom: 10px;
  margin-right: 10px;
}

/* Typography */
p {
  margin: 0;
}
/* Gradient background */
.gradient-bg {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Container styling */
.container {
  position: relative;
  padding: 20px;
}

/* Button positioning */
.menu-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}
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
.toggle-btn {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
.tabs-head {
  color: white;
  font-family: 'Poppins', sans-serif;
}
.text-caption {
  color: #777;
  font-size: 0.9em;
}
.custom-border {
  border: 2px solid #0097a7; /* Adjust color as needed */
  border-radius: 8px; /* Optional: Adds rounded corners */
}
</style>
