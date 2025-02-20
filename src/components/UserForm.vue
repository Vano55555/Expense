<template>
    <div>
      <h2>Ajouter un Utilisateur</h2>
      <form @submit.prevent="createUser">
        <div class="mb-3">
          <label for="nom" class="form-label">Nom</label>
          <input type="text" v-model="user.nom" class="form-control" id="nom" required />
        </div>
        <div class="mb-3">
          <label for="prenom" class="form-label">Prénom</label>
          <input type="text" v-model="user.prenom" class="form-control" id="prenom" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" v-model="user.email" class="form-control" id="email" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input type="password" v-model="user.password" class="form-control" id="password" required />
        </div>
        <button type="submit" class="btn btn-success">Créer l'utilisateur</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'UserForm',
    setup() {
      const user = ref({
        nom: '',
        prenom: '',
        email: '',
        password: ''
      });
  
      const router = useRouter();
  
      const createUser = async () => {
        try {
          await axios.post('http://localhost:5000/api/users', user.value);
          router.push('/users'); // Rediriger vers la liste des utilisateurs après création
        } catch (error) {
          console.error(error);
        }
      };
  
      return { user, createUser };
    }
  });
  </script>
  