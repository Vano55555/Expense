<template>
    <div class="home">
      <h1>Bienvenue sur la page d'accueil</h1>
      <button @click="logout">Déconnexion</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'Home',
    setup() {
      const router = useRouter();
  
      const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
      };
  
      return { logout };
    },
  });
  </script>