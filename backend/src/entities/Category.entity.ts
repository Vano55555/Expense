import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Expense } from './Expense.entity';
import { Budget } from "./Budget.entity";
import { CategoryType } from "./CategoryType.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string; 

    @Column()
    libelle!: string;

    @Column()
    description!: string;

    @OneToMany(() => Expense, depense => depense.categorie) 
    expenses!: Expense[];

    @OneToMany(() => Budget, (budget) => budget.categorie)
    budgets!: Budget[];

  @ManyToOne(() => CategoryType, (categoryType) => categoryType.categories, { nullable: false })
  @JoinColumn({ name: "categoryTypeId" })
  categoryType!: CategoryType;
}
