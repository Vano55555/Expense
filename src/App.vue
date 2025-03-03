<template>
  <div id="app">
    <div class="container-fluid">
      <!-- Navigation bar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
          <router-link to="/" class="navbar-brand">
            <strong>GESTION DES DEPENSES</strong>
          </router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <!-- Liens avec style spécial -->
              <li class="nav-item">
                <router-link to="/users" class="nav-link special-link">
                  <i class="bi bi-person-fill"></i> Utilisateurs
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/expenses" class="nav-link special-link">
                  <i class="bi bi-wallet2"></i> Dépenses
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/budget" class="nav-link special-link">
                  <i class="bi bi-briefcase"></i> Budget
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/transactions" class="nav-link special-link">
                  <i class="bi bi-credit-card"></i> Transactions
                </router-link>
              </li>
              
              <li class="nav-item">
                <router-link to="/categoryform" class="nav-link special-link">
                  <i class="bi bi-folder-plus"></i> Catégorie
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Content Section -->
      <div class="content-container mt-4">
        <!-- The routed view will be injected here -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  setup() {

    return {};
  },
});
</script>

<style scoped>
/* Global Styling */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

/* Navbar styling */
.navbar {
  background-color: #343a40;
}

.navbar-brand {
  font-size: 1.5rem;
  color: #fff;
  font-weight: 700;
}

.navbar-toggler {
  border: 1px solid #ffffff;
}

/* Special Link Styling */
.special-link {
  color: #ffffff;
  font-size: 1.1rem;
  text-transform: uppercase;
  border-radius: 30px;
  padding: 10px 20px;
  margin: 0 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.special-link:hover {
  background-color: #00bcd4;
  color: #fff;
  transform: translateY(-3px);
}

.special-link:active {
  background-color: #008c9e;
  transform: translateY(1px);
}

.navbar-nav .nav-item {
  margin: 0 15px;
}

/* Styling for router-link when active */
.router-link-active {
  font-weight: bold;
  color: #00bcd4;
}

.router-link-exact-active {
  color: #f39c12;
}

/* Content container for margin and padding */
.content-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Responsiveness */
@media (max-width: 768px) {
  .navbar-nav {
    text-align: center;
  }
}
</style>