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
            <label for="montant">Montant</label>
            <input type="number" v-model="transaction.montant" id="montant" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="date">Date</label>
            <input type="date" v-model="transaction.date" id="date" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="modePaiement">Mode de Paiement</label>
            <input type="text" v-model="transaction.modePaiement" id="modePaiement" class="form-control" required />
          </div>

          <div class="form-group">
            <label for="userId">Utilisateur</label>
            <select v-model="transaction.userId" id="userId" class="form-control" required>
              <option value="" disabled>-- Sélectionner un utilisateur --</option>
              <option v-for="user in transactionUser" :key="user.id" :value="user.id">
                {{ user.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="transactionTypeId">Type de Transaction</label>
            <select v-if="transactionTypes.length" v-model="transaction.transactionTypeId" id="transactionTypeId" class="form-control" required>
              <option value="" disabled>-- Sélectionner un type de transaction --</option>
              <option v-for="type in transactionTypes" :key="type.id" :value="type.id">{{ type.nom }}</option>
              <option value="other">Autres</option>
            </select>
            <p v-else>Chargement des types de transaction...</p>
          </div>

          <div v-if="transaction.transactionTypeId === 'other'" class="form-group">
            <label for="newTransactionType">Nouveau Type de Transaction</label>
            <input type="text" v-model="newTransactionType" id="newTransactionType" class="form-control" required />
          </div>

          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" @click="showModal = false" class="btn btn-secondary">Annuler</button>
        </form>
      </div>
    </div>

    <!-- Liste des transactions -->
    <h3>Liste des Transactions</h3>
    <table>
      <thead>
        <tr>
          <th>Montant</th>
          <th>Date</th>
          <th>Mode de Paiement</th>
          <th>Expense ID</th>
          <th>Utilisateur</th>
          <th>Type de Transaction</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td>{{ transaction.montant }}</td>
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.modePaiement }}</td>
          <td>{{ transaction.expenseId }} </td>
          <td>{{ transaction.user?.nom }} {{ transaction.user?.prenom }}</td>
          <td>{{ transaction.transactionType?.nom }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../services/api';

export default {
  setup() {
    const showModal = ref(false);
    const transaction = reactive({
      montant: 0,
      date: '',
      modePaiement: '',
      expenseId: null as number | null,
      userId: null as number | null,
      transactionTypeId: null as number | string | null,
    });
    const newTransactionType = ref('');
    const transactionTypes = ref<Array<{ id: number; nom: string }>>([]);
    const transactions = ref<Array<{ montant: number; date: string; modePaiement: string; expenseId: number; userId: number; transactionTypeId: number }>>([]);
    const transactionUser = ref<Array<{ id: number; nom: string }>>([]);

    const fetchTransactionUsers = async () => {
      try {
        const response = await api.get('/users');
        console.log('Utilisateurs récupérés :', response.data);
        transactionUser.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    };

    const fetchTransactionTypes = async () => {
      try {
        const response = await api.get('/transaction_types');
        console.log('Types de transactions récupérés :', response.data);
        transactionTypes.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Erreur lors de la récupération des types de transactions", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        console.log('Transactions récupérées :', response.data);
        transactions.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions", error);
      }
    };

    const submitTransactionForm = async () => {
      try {
        let transactionTypeId = transaction.transactionTypeId;

        if (transactionTypeId === 'other') {
          const newTypeResponse = await api.post('/transaction_types', { nom: newTransactionType.value });
          transactionTypeId = newTypeResponse.data.id;
        }

        const transactionData = {
          montant: transaction.montant,
          date: transaction.date,
          modePaiement: transaction.modePaiement,
          expenseId: transaction.expenseId,
          userId: transaction.userId,
          transactionTypeId: transactionTypeId,
        };

        await api.post('/transactions', transactionData);
        showModal.value = false;
        resetForm();
        await fetchTransactions();
      } catch (error) {
        console.error("Erreur lors de la création de la transaction", error);
      }
    };

    const resetForm = () => {
      transaction.montant = 0;
      transaction.date = '';
      transaction.modePaiement = '';
      transaction.expenseId = null;
      transaction.userId = null;
      transaction.transactionTypeId = null;
      newTransactionType.value = '';
    };

    const getTransactionTypeName = computed(() => (transactionTypeId: number) => {
      const type = transactionTypes.value.find((type) => type.id === transactionTypeId);
      return type ? type.nom : 'Inconnu';
    });

    const getUserName = computed(() => (userId: number) => {
      const user = transactionUser.value.find((user) => user.id === userId);
      return user ? user.nom : 'Inconnu';
    });

    onMounted(() => {
      fetchTransactionTypes();
      fetchTransactions();
      fetchTransactionUsers();
    });

    return {
      showModal,
      transaction,
      newTransactionType,
      transactionTypes,
      transactions,
      transactionUser,
      submitTransactionForm,
      getTransactionTypeName,
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>