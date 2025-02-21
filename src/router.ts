import { createRouter, createWebHistory } from 'vue-router';
import UserForm from './components/UserForm.vue';
import ExpenseForm from './components/ExpenseForm.vue'; 

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
    path: '/',
    redirect: '/users',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
