<template>
  <div class="container py-5">
    <!-- Bouton pour ouvrir le modal d'inscription -->
    <button type="button" class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#userModal">
      Inscription
    </button>
    <!-- Bouton pour ouvrir le modal de connexion -->
    <button type="button" class="btn btn-secondary mb-4" data-bs-toggle="modal" data-bs-target="#loginModal">
      Connexion
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
              <button type="button" class="btn btn-danger w-100 py-2 mt-2" data-bs-dismiss="modal">Annuler</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour la connexion -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Connexion</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="loginUser">
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email</label>
                <input type="email" v-model="loginData.email" class="form-control" id="loginEmail" required />
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Mot de passe</label>
                <input type="password" v-model="loginData.password" class="form-control" id="loginPassword" required />
              </div>
              <button type="submit" class="btn btn-primary w-100 py-2">Se connecter</button>
              <button type="button" class="btn btn-danger w-100 py-2 mt-2" data-bs-dismiss="modal">Annuler</button>
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
                <button @click="editUser(user)" class="btn btn-warning btn-sm ms-2">
                  <i class="bi bi-pencil-fill"></i> Modifier
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
import api from '../services/api';

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

    const loginData = ref({
      email: '',
      password: ''
    });

    const users = ref<any[]>([]);

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        users.value = response.data;
      } catch (error) {
        console.error(error);
        alert('Erreur lors du chargement des utilisateurs');
      }
    };

    const createUser = async () => {
      try {
        const response = await api.post('/users', user.value);
        console.log('Utilisateur créé :', response.data);
        fetchUsers(); // Rafraîchir la liste après l'ajout
        user.value = { nom: '', prenom: '', dateNaissance: '', sexe: 'Masculin', email: '', password: '' }; // Réinitialiser le formulaire
        alert('Utilisateur créé avec succès !');
        // Fermer le modal après la création
        const userModal = new (window as any).bootstrap.Modal(document.getElementById('userModal'));
        userModal.hide();
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la création de l\'utilisateur');
      }
    };

    const deleteUser = async (id: number) => {
      try {
        const response = await api.delete(`/users/${id}`);
        console.log('Utilisateur supprimé :', response.data);
        fetchUsers();
        alert('Utilisateur supprimé avec succès !');
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    };

    const editUser = (userToEdit: any) => {
      user.value = { ...userToEdit };
      const userModal = new (window as any).bootstrap.Modal(document.getElementById('userModal'));
      userModal.show();
    };

    const loginUser = async () => {
      try {
        console.log("Données envoyées :", loginData.value);

        const response = await api.post('/auth/login', loginData.value, {
          headers: { 'Content-Type': 'application/json' }
        });

        console.log("Réponse du serveur :", response.data);

        if (response.data.success) {
          alert('Connexion réussie !');
        } else {
          alert('Échec de la connexion : ' + response.data.message);
        }
      } catch (error) {
        console.error('Erreur lors de la connexion : ', error);
        alert('Erreur lors de la connexion : ' + error);
      }
    };

    // Charger les utilisateurs au démarrage
    onMounted(fetchUsers);

    return { user, users, createUser, deleteUser, editUser, loginUser, loginData };
  }
});
</script>