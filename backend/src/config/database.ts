import { DataSource } from 'typeorm';
import { User } from '../entities/User.entity';
import { Expense } from '../entities/Expense.entity';
import { Category } from '../entities/Category.entity';
import { ExpenseUser } from '../entities/Expense_User.entity';
import { Budget } from '../entities/Budget.entity';
import { Transaction } from '../entities/Transaction.entity';
import { TransactionType } from '../entities/TransactionType.entity';
import { CategoryType } from '../entities/CategorieType.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'suivi-depenses', 
  entities: [User, Expense, Category, ExpenseUser, Transaction, TransactionType, Budget, CategoryType],
  synchronize: true, 
  logging: true,
});
