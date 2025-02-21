<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4 text-primary">Gestion des Dépenses</h2>

    <!-- Bouton d'ajout -->
    <button class="btn btn-success mb-3" @click="showModal = true">
      <i class="bi bi-plus-circle"></i> Ajouter une Dépense
    </button>

    <!-- Tableau des dépenses -->
    <table class="table table-bordered table-hover table-striped">
      <thead class="table-light">
        <tr>
          <th>Montant</th>
          <th>Catégorie</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in expenses" :key="expense.id">
          <td>{{ expense.montant }} €</td>
          <td>{{ expense.categorie }}</td>
          <td>{{ formatDate(expense.date) }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editExpense(expense)">
              <i class="bi bi-pencil"></i> Modifier
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteExpense(expense.id)">
              <i class="bi bi-trash"></i> Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL D'AJOUT/MODIFICATION -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="text-center">{{ editingExpense ? "Modifier" : "Ajouter" }} une Dépense</h3>
        <form @submit.prevent="saveExpense">
          <div class="mb-3">
            <label for="montant" class="form-label">Montant</label>
            <input type="number" v-model="expense.montant" class="form-control" id="montant" required placeholder="Entrez le montant" />
          </div>
          <div class="mb-3">
            <label for="categorie" class="form-label">Catégorie</label>
            <select v-model="expense.categorie" class="form-select" id="categorie" required>
              <option value="" disabled>Choisissez une catégorie</option>
              <option value="Alimentation">Alimentation</option>
              <option value="Transports">Transports</option>
              <option value="Logement">Logement</option>
              <option value="Divertissement">Divertissement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="date" class="form-label">Date</label>
            <input type="date" v-model="expense.date" class="form-control" id="date" required />
          </div>

          <button type="submit" class="btn btn-success w-100 mt-2">
            <i class="bi bi-check-circle"></i> {{ editingExpense ? "Modifier" : "Ajouter" }}
          </button>
          <button type="button" class="btn btn-secondary w-100 mt-2" @click="resetForm">
            <i class="bi bi-arrow-clockwise"></i> Réinitialiser
          </button>
          <button type="button" class="btn btn-danger w-100 mt-2" @click="closeModal">
            <i class="bi bi-x-circle"></i> Annuler
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "ExpenseForm",
  setup() {
    interface Expense {
      id?: number;
      montant: number;
      categorie: string;
      date: string;
      userId: number;  // Ajout de userId dans la définition de Expense
    }

    const API_URL = "http://localhost:3000/api/expenses"; // Remplace avec ton API

    const showModal = ref<boolean>(false);
    const expenses = ref<Expense[]>([]);
    const editingExpense = ref<boolean>(false);
    const expense = ref<Expense>({
      montant: 0,
      categorie: "",
      date: "",
      userId: 1, // Valeur par défaut (id utilisateur courant)
    });

    // Récupérer les dépenses
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${API_URL}?userId=${expense.value.userId}`);
        if (!response.ok) throw new Error("Erreur de récupération des dépenses");
        expenses.value = await response.json();
      } catch (error) {
        console.error("Erreur lors du chargement des dépenses:", error);
      }
    };

    // Sauvegarder une dépense
    const saveExpense = async () => {
      // Vérifier si tous les champs sont remplis
      if (!expense.value.montant || !expense.value.categorie || !expense.value.date) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      try {
        const method = editingExpense.value ? "PUT" : "POST";
        const url = editingExpense.value && expense.value.id ? `${API_URL}/${expense.value.id}` : API_URL;

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense.value),
        });

        if (!response.ok) throw new Error("Erreur lors de l'enregistrement de la dépense");

        alert(editingExpense.value ? "Dépense modifiée avec succès !" : "Dépense ajoutée avec succès !");
        closeModal();
        fetchExpenses(); // Recharger les dépenses
      } catch (error) {
        console.error("Erreur lors de l'ajout/modification de la dépense:", error);
      }
    };

    // Modifier une dépense
    const editExpense = (exp: Expense) => {
      expense.value = { ...exp };
      editingExpense.value = true;
      showModal.value = true;
    };

    // Supprimer une dépense
    const deleteExpense = async (id?: number) => {
      if (!id) return;
      if (!confirm("Voulez-vous vraiment supprimer cette dépense ?")) return;

      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        fetchExpenses();
      } catch (error) {
        console.error("Erreur lors de la suppression de la dépense:", error);
      }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
      expense.value = { montant: 0, categorie: "", date: "", userId: expense.value.userId };
    };

    // Fermer le modal
    const closeModal = () => {
      resetForm();
      showModal.value = false;
      editingExpense.value = false;
    };

    // Formater la date
    const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR");

    // Charger les dépenses au démarrage
    onMounted(fetchExpenses);

    return { showModal, expenses, expense, editingExpense, saveExpense, editExpense, deleteExpense, resetForm, closeModal, formatDate };
  },
});
</script>

<style scoped>
/* Styles généraux */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  max-width: 100%;
}

/* Table */
th {
  color: #007bff;
}
</style>
