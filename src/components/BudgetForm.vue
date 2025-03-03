<template>
  <div>
    <!-- Bouton pour ouvrir la modal -->
    <button @click="showModal = true" class="btn btn-primary">Créer Budget</button>

    <!-- Modal native -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Modifier Budget' : 'Créer Budget' }}</h2>
        <form @submit.prevent="submitBudgetForm">
          <div class="form-group">
            <label for="montantBudget">Montant du Budget</label>
            <input
              type="number"
              v-model="budget.montantBudget"
              id="montantBudget"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="montantDepense">Montant de Dépense</label>
            <input
              type="number"
              v-model="budget.montantDepense"
              id="montantDepense"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
  <label for="utilisateurId">Utilisateur</label>
  <select v-model="budget.utilisateurId" id="utilisateurId" class="form-control" required>
    <option value="" disabled>Sélectionnez un utilisateur</option>
    <option v-for="user in users" :key="user.id" :value="user.id">
      {{ user.nom }} <!-- Utilise user.nom au lieu de user.name -->
    </option>
  </select>
</div>

          <div class="form-group">
            <label for="categorieId">Catégorie</label>
            <select v-model="budget.categorieId" id="categorieId" class="form-control" required>
              <option value="" disabled>Sélectionnez une catégorie</option>
              <option
                v-for="categorie in categories"
                :key="categorie.id"
                :value="categorie.id"
              >
                {{ categorie.name }}
              </option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</button>
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
            <th>Utilisateur</th>
            <th>Catégorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="budget in budgets" :key="budget.id">
            <td>{{ budget.montantBudget }}</td>
            <td>{{ budget.montantDepense }}</td>
            <td>{{ budget.utilisateurNom }}</td> <!-- Afficher le nom de l'utilisateur -->
            <td>{{ budget.categorieName }}</td> <!-- Afficher le nom de la catégorie -->
            <td>
              <button @click="editBudget(budget)" class="btn btn-warning">Modifier</button>
              <button @click="deleteBudget(budget.id)" class="btn btn-danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../services/api'; 

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  nom: string; 
}

interface Budget {
  id: number | null;
  montantBudget: number;
  montantDepense: number;
  utilisateurId: number | null; 
  categorieId: number | null;
}

interface BudgetResponse {
  id: number;
  montantBudget: number;
  montantDepense: number;
  utilisateurId: number;
  utilisateurNom: string; // Ajouter `utilisateurNom`
  categorieId: number;
  categorieName: string; // Ajouter `categorieName`
}

export default {
  setup() {
    // États réactifs
    const showModal = ref(false);
    const budget = reactive<Budget>({
      id: null,
      montantBudget: 0,
      montantDepense: 0,
      utilisateurId: null,
      categorieId: null,
    });

    const users = ref<User[]>([]);
    const categories = ref<Category[]>([]);
    const budgets = ref<BudgetResponse[]>([]);

    // Indicateur pour savoir si on est en mode édition
    const isEditMode = computed(() => budget.id !== null);

    // Récupérer les catégories depuis l'API
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data && Array.isArray(response.data)) {
          categories.value = response.data;
        } else {
          throw new Error("Format de données inattendu pour les catégories");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
      }
    };

    // Récupérer les utilisateurs depuis l'API
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        if (response.data && Array.isArray(response.data)) {
          users.value = response.data.map((user) => ({
            id: user.id,
            nom: user.nom, // Utilise `nom` au lieu de `name`
          }));
        } else {
          throw new Error("Format de données inattendu pour les utilisateurs");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    };

    const fetchBudgets = async () => {
  try {
    const response = await api.get('/budgets');
    if (response.data && Array.isArray(response.data)) {
      budgets.value = response.data.map((budget) => ({
        id: budget.id,
        montantBudget: budget.montantBudget,
        montantDepense: budget.montantDepense,
        utilisateurId: budget.utilisateur.id, // Utiliser `utilisateur.id`
        utilisateurNom: budget.utilisateur.nom, // Ajouter `utilisateurNom`
        categorieId: budget.categorie.id, // Utiliser `categorie.id`
        categorieName: budget.categorie.name, // Ajouter `categorieName`
      }));
    } else {
      throw new Error("Format de données inattendu pour les budgets");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets", error);
  }
};

    // Soumettre le formulaire (création ou modification)
    const submitBudgetForm = async () => {
      try {
        const payload = {
          montantBudget: budget.montantBudget,
          montantDepense: budget.montantDepense,
          utilisateurId: budget.utilisateurId, 
          categorieId: budget.categorieId,
        };

        console.log('Données envoyées:', payload); 

        if (isEditMode.value && budget.id !== null) {
          // Mise à jour du budget
          const response = await api.put<BudgetResponse>(`/budgets/${budget.id}`, payload);
          const updatedBudget = response.data;
          const index = budgets.value.findIndex((b) => b.id === budget.id);
          if (index !== -1) budgets.value[index] = updatedBudget;
        } else {
          // Création d'un nouveau budget
          const response = await api.post<BudgetResponse>('/budgets', payload);
          budgets.value.push(response.data);
        }

        showModal.value = false;
        resetForm();
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du budget", error);
        alert("Erreur lors de la sauvegarde du budget. Veuillez réessayer.");
      }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
      budget.id = null;
      budget.montantBudget = 0;
      budget.montantDepense = 0;
      budget.utilisateurId = null; 
      budget.categorieId = null;
    };

    // Supprimer un budget
    const deleteBudget = async (id: number) => {
      try {
        await api.delete(`/budgets/${id}`);
        budgets.value = budgets.value.filter((b) => b.id !== id);
        alert("Budget supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression du budget", error);
        alert("Erreur lors de la suppression du budget.");
      }
    };

    // Modifier un budget
    const editBudget = (selectedBudget: BudgetResponse) => {
      Object.assign(budget, {
        id: selectedBudget.id,
        montantBudget: selectedBudget.montantBudget,
        montantDepense: selectedBudget.montantDepense,
        categorieId: selectedBudget.categorieId,
        utilisateurId: selectedBudget.utilisateurId, // Utilise `utilisateurId` au lieu de `userId`
      });
      showModal.value = true;
    };

    // Obtenir le nom de la catégorie
    const getCategoryName = (categoryId: number | null) => {
      const category = categories.value.find((cat) => cat.id === categoryId);
      return category ? category.name : 'Inconnu';
    };

    // Obtenir le nom de l'utilisateur
    const getUserName = (utilisateurId: number | null) => {
      const user = users.value.find((u) => u.id === utilisateurId);
      return user ? user.nom : 'Inconnu'; // Utilise `nom` au lieu de `name`
    };

    // Charger les données au montage du composant
    onMounted(() => {
      fetchUsers();
      fetchCategories();
      fetchBudgets();
    });

    return {
      showModal,
      budget,
      categories,
      users,
      budgets,
      isEditMode,
      submitBudgetForm,
      deleteBudget,
      editBudget,
      getUserName,
      getCategoryName,
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