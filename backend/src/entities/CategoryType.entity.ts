import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Category } from "./Category.entity"; 

@Entity()
export class CategoryType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Category, (category) => category.categoryType)
  categories!: Category[];
}
