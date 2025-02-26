<template>
  <div>
    <!-- Bouton pour ouvrir la modal -->
    <button @click="showModal = true" class="btn btn-primary">Créer Type de Transaction</button>

    <!-- Modal native -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Créer Type de Transaction</h2>
        <form @submit.prevent="submitTransactionTypeForm">
          <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" v-model="transactionType.name" id="name" class="form-control" required />
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
      transactionType: {
        name: '' as string
      }
    };
  },
  methods: {
    async submitTransactionTypeForm() {
      try {
        await axios.post('/api/transaction_types', this.transactionType);
        this.showModal = false;
        this.$emit('transactionTypeCreated');
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de la création du type de transaction", error);
      }
    },
    resetForm() {
      this.transactionType = {
        name: ''
      };
    }
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