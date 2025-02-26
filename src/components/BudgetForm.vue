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
              <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">{{ categorie.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="userId">Utilisateur</label>
            <select v-model="budget.userId" id="userId" class="form-control" required>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" @click="showModal = false" class="btn btn-secondary">Annuler</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {
  data() {
    return {
      showModal: false as boolean,
      budget: {
        montantBudget: 0 as number,
        montantDepense: 0 as number,
        categorieId: null as number | null,
        userId: null as number | null
      },
      categories: [] as Array<{ id: number, name: string }>,
      users: [] as Array<{ id: number, name: string }>
    };
  },
  methods: {
    // Initialisation des listes de catégories et utilisateurs
    async fetchData() {
      try {
        const [categoriesResponse, usersResponse] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/users')
        ]);
        this.categories = categoriesResponse.data;
        this.users = usersResponse.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    },

    // Soumettre le formulaire de budget
    async submitBudgetForm() {
      try {
        await axios.post('/api/budgets', this.budget);
        this.showModal = false;
        this.$emit('budgetCreated');
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de la création du budget", error);
      }
    },

    // Réinitialiser le formulaire
    resetForm() {
      this.budget = {
        montantBudget: 0,
        montantDepense: 0,
        categorieId: null,
        userId: null
      };
    }
  },
  created() {
    this.fetchData();
  }
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
</style>