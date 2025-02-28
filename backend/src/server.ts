import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import expenseRoutes from './routes/Expense.route';
import userRoutes from './routes/User.route';
import authRoutes from './routes/Auth.route';
import budgetRoutes from './routes/Budget.route';
import transactionRoutes from './routes/Transaction.route';
import expenseuserRoutes from './routes/Expense_User.route';
import transactiontypeRoutes from './routes/TransactionType.route';
import categoryRoutes from './routes/Category.route';
import categorytypeRoutes from './routes/CategoryType.route';

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
app.use('/api/budgets', budgetRoutes);  
app.use('/api/transactions', transactionRoutes);  
app.use('/api/expense_users', expenseuserRoutes);  
app.use('/api/transaction_types', transactiontypeRoutes); 
app.use('/api/category_types', categorytypeRoutes);
app.use('/api/', categoryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
