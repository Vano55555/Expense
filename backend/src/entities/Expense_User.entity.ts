import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './User.entity';
import { Expense } from './Expense.entity';

@Entity('expense_user')
export class ExpenseUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.expenseUsers)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Expense, (expense) => expense.expenseUsers)
  @JoinColumn({ name: 'expenseId' })
  expense!: Expense;

  @Column('decimal')
  montantPartage!: number;  
}
