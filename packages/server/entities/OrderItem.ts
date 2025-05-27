import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Order,
    (order) => order.items,
  )
  order!: Order;

  @ManyToOne(
    () => Product,
    (product) => product.id,
  )
  product!: Product;

  @Column()
  quantity!: number;
}
