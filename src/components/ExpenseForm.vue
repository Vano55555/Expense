<template>
  <div class="container mt-5">
    <div class="card shadow-lg p-4">
      <h2 class="text-center mb-4">Ajouter une Dépense</h2>
      <form @submit.prevent="createExpense">
        <div class="mb-3">
          <label for="montant" class="form-label">Montant</label>
          <input type="number" v-model="expense.montant" class="form-control" id="montant" required placeholder="Entrez le montant" />
        </div>
        <div class="mb-3">
          <label for="categorie" class="form-label">Catégorie</label>
          <select v-model="expense.categorie" class="form-select" id="categorie" required>
            <option value="" disabled selected>Choisissez une catégorie</option>
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
        <button type="submit" class="btn btn-success w-100 mt-3">Ajouter la Dépense</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ExpenseForm',
  setup() {
    const expense = ref({
      montant: 0,
      categorie: '',
      date: ''
    });

    const createExpense = async () => {
      try {
        await axios.post('http://localhost:5000/api/expenses', expense.value);
        // Rediriger ou faire d'autres actions après ajout
        alert("Dépense ajoutée avec succès !");
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'ajout de la dépense");
      }
    };

    return { expense, createExpense };
  }
});
</script>

<style scoped>
/* Ajout d'un peu d'espacement et de couleurs de fond */
.container {
  max-width: 600px;
}

.card {
  background-color: #f8f9fa;
}

button:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}
</style>
