<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4 text-primary">Gestion des Dépenses</h2>

    <!-- Bouton d'ajout -->
    <button class="btn btn-success mb-3" @click="showModal = true">
      <i class="bi bi-plus-circle"></i> Ajouter une Dépense
    </button>

    <div class="card shadow-sm mt-5">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Liste des Dépenses</h2>
        <table class="table table-striped table-bordered">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Montant</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th>Type de Transaction</th>
              <th>User ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.id">
              <td>{{ expense.id }}</td>
              <td>{{ expense.montant }} FCFA</td>
              <td>{{ expense.categorie }}</td>
              <td>{{ formatDate(expense.date) }}</td>
              <td>{{ getTransactionTypeName(expense.transactionTypeId) }}</td>
              <td>{{ expense.userId }}</td>
              <td>
                <button class="btn btn-warning btn-sm" @click="editExpense(expense)">
                  <i class="bi bi-pencil"></i> Modifier
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteExpense(expense.id)">
                  <i class="bi bi-trash"></i> Supprimer
                </button>
                <button class="btn btn-primary btn-sm" @click="downloadPDF(expense)">
                  <i class="bi bi-file-earmark-pdf"></i> Télécharger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL D'AJOUT/MODIFICATION -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="text-center">{{ editingExpense ? "Modifier" : "Ajouter" }} une Dépense</h3>
        <form @submit.prevent="saveExpense" class="form-grid">
          <div class="form-group">
            <label for="montant" class="form-label">Montant</label>
            <input type="number" v-model="expense.montant" class="form-control" id="montant" required placeholder="Entrez le montant" />
          </div>
          <div class="form-group">
            <label for="user" class="form-label">Utilisateur</label>
            <select v-model="expense.userId" class="form-control" id="user" required>
              <option value="" disabled>Choisissez un utilisateur</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.nom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="categorie" class="form-label">Catégorie</label>
            <select v-model="expense.categorie" class="form-control" id="categorie" required>
              <option value="" disabled>Choisissez une catégorie</option>
              <option v-for="categorie in categories" :key="categorie.id" :value="categorie.name">{{ categorie.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="transactionType" class="form-label">Type de Transaction</label>
            <select v-model="expense.transactionTypeId" class="form-control" id="transactionType" required>
              <option value="" disabled>Choisissez un type de transaction</option>
              <option v-for="type in transactionTypes" :key="type.id" :value="type.id">{{ type.nom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date" class="form-label">Date</label>
            <input type="date" v-model="expense.date" class="form-control" id="date" required />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-success">
              <i class="bi bi-check-circle"></i> {{ editingExpense ? "Modifier" : "Ajouter" }}
            </button>
            <button type="button" class="btn btn-secondary" @click="resetForm">
              <i class="bi bi-arrow-clockwise"></i> Réinitialiser
            </button>
            <button type="button" class="btn btn-danger" @click="closeModal">
              <i class="bi bi-x-circle"></i> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import api from "../services/api"; // Assurez-vous d'importer votre service API

export default defineComponent({
  name: "ExpenseForm",
  setup() {
    interface Expense {
      id?: number;
      montant: number;
      categorie: string;
      transactionTypeId: number; 
      date: string;
      userId: number;
    }

    const showModal = ref<boolean>(false);
    const expenses = ref<Expense[]>([]);
    const editingExpense = ref<boolean>(false);
    const expense = ref<Expense>({
      montant: 0,
      categorie: "",
      transactionTypeId: 0,
      date: "",
      userId: 1,
    });

    const users = ref<{ id: number; nom: string }[]>([]);
    const categories = ref<{ id: number; name: string }[]>([]);
    const transactionTypes = ref<{ id: number; nom: string }[]>([]);

    // Récupérer les dépenses
    const fetchExpenses = async () => {
      try {
        const response = await api.get('/expenses'); 
        if (response.data && Array.isArray(response.data)) {
          expenses.value = response.data;
        } else {
          throw new Error("Format de données inattendu pour les dépenses");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des dépenses:", error);
      }
    };

    // Récupérer les utilisateurs
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users'); // Assurez-vous que l'endpoint est correct
        if (response.data && Array.isArray(response.data)) {
          users.value = response.data;
        } else {
          throw new Error("Format de données inattendu pour les utilisateurs");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    };

    // Récupérer les catégories
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories'); // Assurez-vous que l'endpoint est correct
        if (response.data && Array.isArray(response.data)) {
          categories.value = response.data;
        } else {
          throw new Error("Format de données inattendu pour les catégories");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    // Récupérer les types de transaction
    const fetchTransactionTypes = async () => {
      try {
        const response = await api.get('/transaction_types'); // Assurez-vous que l'endpoint est correct
        if (response.data && Array.isArray(response.data)) {
          transactionTypes.value = response.data;
        } else {
          throw new Error("Format de données inattendu pour les types de transaction");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des types de transaction", error);
      }
    };

    // Sauvegarder une dépense
    const saveExpense = async () => {
      if (!expense.value.montant || !expense.value.categorie || !expense.value.transactionTypeId || !expense.value.date) {
        Swal.fire("Erreur", "Veuillez remplir tous les champs.", "error");
        return;
      }

      try {
        const method = editingExpense.value ? "PUT" : "POST";
        const url = editingExpense.value && expense.value.id ? `/expenses/${expense.value.id}` : '/expenses';

        const response = await api({
          method,
          url,
          data: expense.value,
        });

        if (!response.data) throw new Error("Erreur lors de l'enregistrement de la dépense");

        Swal.fire("Succès", editingExpense.value ? "Dépense modifiée avec succès !" : "Dépense ajoutée avec succès !", "success");
        closeModal();
        fetchExpenses();
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

      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        text: "Voulez-vous vraiment supprimer cette dépense ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });

      if (!result.isConfirmed) return;

      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error("Erreur lors de la suppression de la dépense:", error);
      }
    };

    // Réinitialiser le formulaire
    const resetForm = () => {
      expense.value = { montant: 0, categorie: "", transactionTypeId: 0, date: "", userId: expense.value.userId };
    };

    // Fermer le modal
    const closeModal = () => {
      resetForm();
      showModal.value = false;
      editingExpense.value = false;
    };

    // Formater la date
    const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR");

    // Télécharger un PDF
    const downloadPDF = (expense: Expense) => {
      const doc = new jsPDF();
      doc.text(`Dépense ID: ${expense.id}\nMontant: ${expense.montant} FCFA\nCatégorie: ${expense.categorie}\nType de Transaction: ${getTransactionTypeName(expense.transactionTypeId)}\nDate: ${expense.date}\nUser ID: ${expense.userId}`, 10, 10);
      doc.save(`Depense_${expense.id}.pdf`);
    };

    // Obtenir le nom du type de transaction
    const getTransactionTypeName = (transactionTypeId: number) => {
      const type = transactionTypes.value.find((t) => t.id === transactionTypeId);
      return type ? type.nom : 'Inconnu';
    };

    onMounted(() => {
      fetchExpenses();
      fetchUsers();
      fetchCategories();
      fetchTransactionTypes(); 
    });

    return {
      showModal,
      expenses,
      expense,
      editingExpense,
      saveExpense,
      editExpense,
      deleteExpense,
      resetForm,
      closeModal,
      formatDate,
      downloadPDF,
      users,
      categories,
      transactionTypes,
      getTransactionTypeName,
    };
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
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px; /* Réduit la largeur maximale */
  overflow-y: auto;
  max-height: 90vh;
}

/* Formulaire en grille */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Deux colonnes */
  gap: 10px; /* Espacement réduit entre les champs */
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 0.9em; /* Taille de police réduite */
}

.form-control {
  width: 100%;
  padding: 6px; /* Padding réduit */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em; /* Taille de police réduite */
}

/* Actions du formulaire */
.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* Espacement réduit entre les boutons */
  margin-top: 10px;
}
/* Table */
th {
  color: #007bff;
}
</style>