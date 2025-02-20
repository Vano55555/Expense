<template>
    <div>
      <h2>Liste des Utilisateurs</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.nom }} {{ user.prenom }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="deleteUser(user.id)" class="btn btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <router-link to="/users/new" class="btn btn-primary">Ajouter un utilisateur</router-link>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'UserList',
    setup() {
      const users = ref<any[]>([]);
  
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users');
          users.value = response.data;
        } catch (error) {
          console.error(error);
        }
      };
  
      const deleteUser = async (id: number) => {
        try {
          await axios.delete(`http://localhost:5000/api/users/${id}`);
          fetchUsers(); // Rafraîchir la liste des utilisateurs après la suppression
        } catch (error) {
          console.error(error);
        }
      };
  
      onMounted(fetchUsers);
  
      return { users, deleteUser };
    }
  });
  </script>
  