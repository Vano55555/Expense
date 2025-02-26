import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { ExpenseUser } from './Expense_User.entity';
import { Transaction } from './Transaction.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  montant!: number;

  @Column()
  categorie!: string;

  @Column()
  date!: Date;

  @ManyToOne(() => User, (user) => user.expenses)
  user!: User;

  @OneToMany(() => ExpenseUser, (expenseUser) => expenseUser.expense)
  expenseUsers!: ExpenseUser[]; 

  @OneToMany(() => Transaction, (transaction) => transaction.expense)
  transactions!: Transaction[]; 
}
