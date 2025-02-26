import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import expenseRoutes from './routes/Expense.route';
import userRoutes from './routes/User.route';
import authRoutes from './routes/Auth.route';
import budgetroute from './routes/Budget.route';
import transactionroute from './routes/Transaction.route';
import expenseuserroute from './routes/Expense_User.route';
import transactiontyperoute from './routes/TransactionType.route'; // Assurez-vous d'avoir cette importation

const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connexion à la base de données
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Database connection failed", error);
  });

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetroute);  
app.use('/api/transactions', transactionroute);  
app.use('/api/expense_users', expenseuserroute);  
app.use('/api/transaction_types', transactiontyperoute);  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
