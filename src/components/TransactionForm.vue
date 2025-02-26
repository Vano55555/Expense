<template>
  <div>
    <!-- Bouton pour ouvrir la modal -->
    <button @click="showModal = true" class="btn btn-primary">Créer Transaction</button>

    <!-- Modal native -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Créer une Transaction</h2>
        <form @submit.prevent="submitTransactionForm">
          <div class="form-group">
            <label for="amount">Montant</label>
            <input type="number" v-model="transaction.amount" id="amount" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="transactionTypeId">Type de Transaction</label>
            <select v-model="transaction.transactionTypeId" id="transactionTypeId" class="form-control" required>
              <option v-for="type in transactionTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
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
      transaction: {
        amount: 0 as number,
        transactionTypeId: null as number | null
      },
      transactionTypes: [] as Array<{ id: number, name: string }> // Typage explicite
    };
  },
  methods: {
    async fetchTransactionTypes() {
      try {
        const response = await axios.get('/api/transaction_types');
        console.log("Types de transactions reçus :", response.data); // Debug
        this.transactionTypes = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des types de transactions", error);
      }
    },

    async submitTransactionForm() {
      try {
        console.log("Envoi de la transaction :", this.transaction); // Debug
        await axios.post('/api/transactions', this.transaction);
        this.showModal = false;
        this.$emit('transactionCreated');
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de la création de la transaction", error);
      }
    },

    resetForm() {
      this.transaction = {
        amount: 0,
        transactionTypeId: null
      };
    }
  },
  created() {
    this.fetchTransactionTypes();
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