import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => User,
    (user) => user.id,
  )
  user!: User;

  @Column()
  createdAt!: Date;

  @OneToMany(
    () => OrderItem,
    (item) => item.order,
  )
  items!: OrderItem[];
}
