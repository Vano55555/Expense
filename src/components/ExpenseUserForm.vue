<template>
  <div>
    <h3>Associer des utilisateurs à une dépense</h3>
    
    <form @submit.prevent="addExpenseUser">
      <div class="mb-3">
        <label for="expense">Dépense :</label>
        <select v-model="selectedExpense" required>
          <option v-for="expense in expenses" :key="expense.id" :value="expense.id">
            {{ expense.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="users">Utilisateurs :</label>
        <select v-model="selectedUsers" multiple required>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <button type="submit">Associer</button>
    </form>

    <hr />

    <h3>Utilisateurs associés aux dépenses</h3>
    <table>
      <thead>
        <tr>
          <th>Dépense</th>
          <th>Utilisateurs</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(expenseUser, index) in expenseUsers" :key="index">
          <td>{{ expenseUser.expenseName }}</td>
          <td>{{ getUserNames(expenseUser.userIds) }}</td>
          <td>
            <button @click="removeExpenseUser(expenseUser.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

interface Expense {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface ExpenseUser {
  id: number;
  expenseName: string;
  userIds: number[];
}

export default defineComponent({
  name: 'ExpenseUserForm',
  setup() {
    const expenses = ref<Expense[]>([]);
    const users = ref<User[]>([]);
    const expenseUsers = ref<ExpenseUser[]>([]);
    const selectedExpense = ref<number | null>(null);
    const selectedUsers = ref<number[]>([]);

    // Charger les dépenses et utilisateurs
    onMounted(async () => {
      const expensesResponse = await axios.get('/api/expenses');
      const usersResponse = await axios.get('/api/users');
      const expenseUsersResponse = await axios.get('/api/expense-users');

      expenses.value = expensesResponse.data;
      users.value = usersResponse.data;
      expenseUsers.value = expenseUsersResponse.data;
    });

    // Associer une dépense à des utilisateurs
    const addExpenseUser = async () => {
      if (!selectedExpense.value || selectedUsers.value.length === 0) return;

      await axios.post('/api/expense-users', {
        expenseId: selectedExpense.value,
        userIds: selectedUsers.value,
      });

      // Recharger la liste après ajout
      const response = await axios.get('/api/expense-users');
      expenseUsers.value = response.data;

      selectedExpense.value = null;
      selectedUsers.value = [];
    };

    // Supprimer une association
    const removeExpenseUser = async (id: number) => {
      await axios.delete(`/api/expense-users/${id}`);

      // Mettre à jour la liste
      expenseUsers.value = expenseUsers.value.filter(exp => exp.id !== id);
    };

    // Récupérer les noms des utilisateurs associés à une dépense
    const getUserNames = (userIds: number[]) => {
      return users.value
        .filter(user => userIds.includes(user.id))
        .map(user => user.name)
        .join(', ');
    };

    return {
      expenses,
      users,
      expenseUsers,
      selectedExpense,
      selectedUsers,
      addExpenseUser,
      removeExpenseUser,
      getUserNames,
    };
  },
});
</script>

<style scoped>
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

button {
  cursor: pointer;
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
}

button:hover {
  background-color: darkred;
}
</style>
