import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('numeric')
    price: number;

    @Column('int')
    stock: number;

    @Column({name: 'category_id', nullable: true})
    categoryId: number | null;;

    @ManyToOne(() => Category, (category) => category.product)
    @JoinColumn({ name: 'category_id'})
    category: Category;
}