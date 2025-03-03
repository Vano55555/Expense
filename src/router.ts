import { createRouter, createWebHistory } from 'vue-router';

// Importez tous les composants
import UserForm from './components/UserForm.vue';
import ExpenseForm from './components/ExpenseForm.vue';
import BudgetForm from './components/BudgetForm.vue';
import TransactionForm from './components/TransactionForm.vue';
import CategoryForm from './components/CategoryForm.vue';
//import ExpenseUserForm from './components/ExpenseUserForm.vue';

// Définissez les routes
const routes = [
  {
    path: '/users',
    component: UserForm,
  },
  {
    path: '/expenses',
    component: ExpenseForm,
  },
  {
    path: '/budget',
    component: BudgetForm,
  },
  {
    path: '/transactions',
    component: TransactionForm,
  },
  {
    path: '/categoryform',
    component: CategoryForm,
  },
  /*{
    path: '/expenseuserform',
    component: ExpenseUserForm,
  },*/
  {
    path: '/',
    redirect: '/users', // Redirige vers /users par défaut
  },
];

// Créez le routeur
const router = createRouter({
  history: createWebHistory(), // Utilisation du mode d'historique HTML5
  routes,
});

// Exportez le routeur
export default router;