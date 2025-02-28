<template>
  <div>
    <!-- Bouton pour ouvrir la modal -->
    <button @click="showModal = true" class="btn btn-primary">Créer Budget</button>

    <!-- Modal native -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Créer un Budget</h2>
        <form @submit.prevent="submitBudgetForm">
          <div class="form-group">
            <label for="montantBudget">Montant du Budget</label>
            <input type="number" v-model="budget.montantBudget" id="montantBudget" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="montantDepense">Montant de Dépense</label>
            <input type="number" v-model="budget.montantDepense" id="montantDepense" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="categorieId">Catégorie</label>
            <select v-model="budget.categorieId" id="categorieId" class="form-control" required>
              <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="userId">Utilisateur</label>
            <select v-model="budget.userId" id="userId" class="form-control" required>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.nom }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" @click="showModal = false" class="btn btn-secondary">Annuler</button>
        </form>
      </div>
    </div>

    <!-- Tableau des budgets -->
    <div class="budget-list">
      <h2>Liste des Budgets</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Montant Budget</th>
            <th>Montant Dépense</th>
            <th>Catégorie</th>
            <th>Utilisateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(budget, index) in budgets" :key="index">
            <td>{{ budget.montantBudget }}</td>
            <td>{{ budget.montantDepense }}</td>
            <td>{{ getCategoryName(budget.categorieId) }}</td>
            <td>{{ getUserName(budget.userId) }}</td>
            <td>
              <button @click="editBudget(index)" class="btn btn-warning">Modifier</button>
              <button @click="deleteBudget(index)" class="btn btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    // États réactifs
    const showModal = ref(false);
    const budget = reactive({
      montantBudget: 0,
      montantDepense: 0,
      categorieId: null as number | null,
      userId: null as number | null,
    });
    const categories = ref<Array<{ id: number; nom: string }>>([]);
    const users = ref<Array<{ id: number; nom: string }>>([]);
    const budgets = ref<
      Array<{
        montantBudget: number;
        montantDepense: number;
        categorieId: number | null;
        userId: number | null;
      }>
    >([]);

    // Méthodes
    const fetchData = async () => {
      try {
        const [categoriesResponse, usersResponse] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/users'),
        ]);
        categories.value = categoriesResponse.data;
        users.value = usersResponse.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    const submitBudgetForm = async () => {
      try {
        await axios.post('/api/budgets', budget);
        budgets.value.push({ ...budget }); // Ajouter le nouveau budget à la liste
        showModal.value = false;
        resetForm();
      } catch (error) {
        console.error("Erreur lors de la création du budget", error);
      }
    };

    const resetForm = () => {
      budget.montantBudget = 0;
      budget.montantDepense = 0;
      budget.categorieId = null;
      budget.userId = null;
    };

    const deleteBudget = (index: number) => {
      budgets.value.splice(index, 1); // Supprimer le budget de la liste
    };

    const editBudget = (index: number) => {
      const selectedBudget = budgets.value[index];
      Object.assign(budget, selectedBudget); // Remplir le formulaire avec les données du budget sélectionné
      showModal.value = true; // Ouvrir la modal pour modification
    };

    const getCategoryName = (categoryId: number | null) => {
      const category = categories.value.find((cat) => cat.id === categoryId);
      return category ? category.nom : 'Inconnu';
    };

    const getUserName = (userId: number | null) => {
      const user = users.value.find((u) => u.id === userId);
      return user ? user.nom : 'Inconnu';
    };

    // Charger les données au montage du composant
    onMounted(() => {
      fetchData();
    });

    // Retourner les états et méthodes pour le template
    return {
      showModal,
      budget,
      categories,
      users,
      budgets,
      submitBudgetForm,
      deleteBudget,
      editBudget,
      getCategoryName,
      getUserName,
    };
  },
};
</script>

<style scoped>
/* Styles pour la modal native */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  margin-left: 10px;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.budget-list {
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}
</style>