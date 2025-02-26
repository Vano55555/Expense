import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./User.entity";  // Importer la table User si nécessaire
import { Category } from "./Category.entity";  // Importer la table Category si nécessaire

@Entity()
export class Budget {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.budgets)
    @JoinColumn({ name: "utilisateurId" })
    user!: User;

    @ManyToOne(() => Category, category => category.budgets)
    @JoinColumn({ name: "categorieId" })
    categories!: Category;

    @Column("decimal")
    montantBudget!: number;  

    @Column("decimal", { default: 0 })
    montantDepense!: number; 
    categorie: any;
}
