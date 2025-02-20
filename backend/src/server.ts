import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import expenseRoutes from './routes/Expense.route';
import userRoutes from './routes/User.route';

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
