import 'reflect-metadata';
import { DataSource, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Env } from './configs/env';

// ---------- Entities ----------
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;
}

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('decimal')
  price!: number;
}

@Entity()
class Order {
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

@Entity()
class OrderItem {
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

// ---------- Data Source ----------
const AppDataSource = new DataSource({
  type: 'postgres',
  host: Env.DB_HOST,
  port: Number(Env.DB_PORT),
  username: Env.DB_USER,
  password: Env.DB_PASS,
  database: Env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Product, Order, OrderItem],
});

// ---------- Seeding Function ----------
const seed = async () => {
  await AppDataSource.initialize();

  // Users
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    const user = new User();
    user.name = faker.person.fullName();
    user.email = faker.internet.email();
    users.push(await AppDataSource.manager.save(user));
  }

  // Products
  const products: Product[] = [];
  for (let i = 0; i < 20; i++) {
    const product = new Product();
    product.name = faker.commerce.productName();
    product.description = faker.commerce.productDescription();
    product.price = Number.parseFloat(faker.commerce.price());
    products.push(await AppDataSource.manager.save(product));
  }

  // Orders
  for (let i = 0; i < 30; i++) {
    const order = new Order();
    order.user = faker.helpers.arrayElement(users);
    order.createdAt = faker.date.past();

    const savedOrder = await AppDataSource.manager.save(order);

    // Order items
    const itemCount = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < itemCount; j++) {
      const item = new OrderItem();
      item.order = savedOrder;
      item.product = faker.helpers.arrayElement(products);
      item.quantity = faker.number.int({ min: 1, max: 10 });
      await AppDataSource.manager.save(item);
    }
  }

  console.log('✅ Seed terminé !');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Erreur lors du seed :', error);
  process.exit(1);
});
