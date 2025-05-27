import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { User } from './entities/User';
import { AppDataSource } from './configs/database';
import { Product } from './entities/Product';
import { Order } from './entities/Order';
import { OrderItem } from './entities/OrderItem';

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
