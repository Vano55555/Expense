import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';

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
}
