import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './Transaction.entity';

@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string; 

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transactions!: Transaction[];
}
