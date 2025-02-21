<template>
  <div class="container py-5">
    <!-- Bouton pour ouvrir le modal -->
    <button type="button" class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#userModal">
      Inscription
    </button>

    <!-- Modal pour l'ajout d'utilisateur -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userModalLabel">Ajouter un Utilisateur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Formulaire d'ajout d'utilisateur -->
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
                <label for="dateNaissance" class="form-label">Date de Naissance</label>
                <input type="date" v-model="user.dateNaissance" class="form-control" id="dateNaissance" required />
              </div>
              <div class="mb-3">
                <label for="sexe" class="form-label">Sexe</label>
                <select v-model="user.sexe" class="form-control" id="sexe" required>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="user.email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" v-model="user.password" class="form-control" id="password" required />
              </div>
              <button type="submit" class="btn btn-success w-100 py-2">Créer l'utilisateur</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="card shadow-sm mt-5">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Liste des Utilisateurs</h2>
        <table class="table table-striped table-bordered">
          <thead class="table-dark">
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
                <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">
                  <i class="bi bi-trash-fill"></i> Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'UserForm',
  setup() {
    const user = ref({
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: 'Masculin',
      email: '',
      password: ''
    });

    const users = ref<any[]>([]);

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        users.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const createUser = async () => {
      try {
        await axios.post('http://localhost:3000/api/users', user.value);
        fetchUsers(); // Rafraîchir la liste après l'ajout
        user.value = { nom: '', prenom: '', dateNaissance: '', sexe: 'Masculin', email: '', password: '' }; // Réinitialiser le formulaire
      } catch (error) {
        console.error(error);
      }
    };

    const deleteUser = async (id: number) => {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        fetchUsers(); // Rafraîchir la liste après la suppression
      } catch (error) {
        console.error(error);
      }
    };

    // Charger les utilisateurs au démarrage
    onMounted(fetchUsers);

    return { user, users, createUser, deleteUser };
  }
});
</script>

<style scoped>
/* Global styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f6f9;
  color: #333;
}

/* Modal styling */
.modal-dialog {
  max-width: 600px;
}

.modal-body {
  padding: 25px;
}

.card {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.card-body {
  padding: 25px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

/* Form controls styling */
.form-control {
  border-radius: 10px;
  box-shadow: none;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 8px rgba(0, 188, 212, 0.5);
}

/* Submit button styling */
.btn {
  border-radius: 50px;
  font-weight: 600;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-success:focus {
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

/* Table styling */
table {
  width: 100%;
  border-radius: 8px;
}

.table th,
.table td {
  text-align: center;
  padding: 12px;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.table-bordered {
  border: 1px solid #ddd;
}

.table-dark {
  background-color: #343a40;
  color: white;
}

.table-dark th,
.table-dark td {
  color: #f8f9fa;
}

/* Button delete styling */
.btn-danger {
  background-color: #dc3545;
  border-radius: 25px;
  padding: 6px 20px;
  transition: background-color 0.3s ease;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Responsive design */
@media (max-width: 768px) {
  .card-body {
    padding: 20px;
  }

  .table td,
  .table th {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 0.9rem;
  }
}
</style>
