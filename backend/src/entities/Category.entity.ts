import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Expense } from './Expense.entity';
import { Budget } from "./Budget.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    // ParentId n'est plus une simple colonne, mais une relation ManyToOne
    @ManyToOne(() => Category, category => category.children, { nullable: true })
    @JoinColumn({ name: "parentId" })
    parentCategory!: Category | null;  // Relation avec le parent, nullable

    @OneToMany(() => Expense, depense => depense.categorie) 
    expenses!: Expense[];

    @OneToMany(() => Budget, (budget) => budget.categories)
    budgets!: Budget[];

    @OneToMany(() => Category, category => category.parentCategory)
    children!: Category[];  // Relation avec les sous-catégories
}
