import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Expense } from './Expense.entity';

@Entity()

export class User {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ type: "date" })
  dateNaissance!: Date;

  @Column()
  sexe!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses!: Expense[];  
}
