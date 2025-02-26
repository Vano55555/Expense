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
import Swal from "sweetalert2";
import jsPDF from "jspdf";

export default defineComponent({
  name: "ExpenseForm",
  setup() {
    interface Expense {
      id?: number;
      montant: number;
      categorie: string;
      date: string;
      userId: number;
    }

    const API_URL = "http://localhost:3000/api/expenses"; 

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
        Swal.fire("Erreur", "Veuillez remplir tous les champs.", "error");
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
      
      // Utilisation de SweetAlert pour confirmation
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

    const downloadPDF = (expense: Expense) => {
      const doc = new jsPDF();
      doc.text(`Dépense ID: ${expense.id}\nMontant: ${expense.montant} €\nCatégorie: ${expense.categorie}\nDate: ${expense.date}\nUser ID: ${expense.userId}`, 10, 10);
      doc.save(`Depense_${expense.id}.pdf`);
    };

    onMounted(fetchExpenses);

    return { showModal, expenses, expense, editingExpense, saveExpense, editExpense, deleteExpense, resetForm, closeModal, formatDate, downloadPDF };
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
