import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./User.entity";  
import { Category } from "./Category.entity";  

@Entity()
export class Budget {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.budgets)
    @JoinColumn({ name: "utilisateurId" })
    utilisateur!: User;

    @ManyToOne(() => Category, category => category.budgets)
    @JoinColumn({ name: "categorieId" })
    categorie!: Category; 

    @Column("decimal")
    montantBudget!: number;  

    @Column("decimal", { default: 0 })
    montantDepense!: number; 
    categories: any;
}
