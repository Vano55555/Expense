import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Expense } from "./Expense.entity";  
import { User } from "./User.entity";
import { TransactionType } from "./TransactionType.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Expense, expense => expense.transactions)
    @JoinColumn({ name: "expenseId" })
    expense!: Expense;

    @Column("decimal")
    montant!: number;  

    @Column()
    date!: Date; 

    @Column()
    modePaiement!: string; 

    @ManyToOne(() => User) 
    @JoinColumn({ name: "userId" }) 
    user!: User;  

    @ManyToOne(() => TransactionType, (transactionType) => transactionType.transactions)
    @JoinColumn({ name: 'typeTransactionId' })
    transactionType!: TransactionType;
}
