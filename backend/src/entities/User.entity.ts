import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Expense } from './Expense.entity';
import { ExpenseUser } from './Expense_User.entity';
import { Budget } from './Budget.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ type: 'date' })
  dateNaissance!: Date;

  @Column()
  sexe!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses!: Expense[];

  @OneToMany(() => ExpenseUser, (expenseUser) => expenseUser.user)
  expenseUsers!: ExpenseUser[]; 

  @OneToMany(() => Budget, (budget) => budget)
  budgets!: Budget[]; 
}
