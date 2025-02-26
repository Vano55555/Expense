import { createRouter, createWebHistory } from 'vue-router';
import UserForm from './components/UserForm.vue';
import ExpenseForm from './components/ExpenseForm.vue';
import BudgetForm from './components/BudgetForm.vue';
import TransactionForm from './components/TransactionForm.vue';
import TransactionTypeForm from './components/TransactionTypeForm.vue';
//import CategoryForm from './components/CategoryForm.vue'; 
//import CategoryTypeForm from './components/CategoryTypeForm.vue'; 

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
    path: '/transaction-types',
    component: TransactionTypeForm,
  },
  /*{
    path: '/categoryform',
    component: CategoryForm,
  },
  {
    path: '/categorytypeform',
    component: CategoryTypeForm,
  },*/
  {
    path: '/',
    redirect: '/users', // Redirige vers /users par défaut
  },
];

const router = createRouter({
  history: createWebHistory(), // Utilisation du mode d'historique HTML5
  routes,
});

export default router;