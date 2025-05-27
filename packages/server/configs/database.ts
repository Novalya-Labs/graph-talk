import { DataSource } from 'typeorm';
import { Env } from './env';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USER,
  password: Env.DB_PASS,
  database: Env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Product, Order, OrderItem],
  migrations: [],
  subscribers: [],
});
