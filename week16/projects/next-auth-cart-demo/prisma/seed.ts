import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

async function main() {
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordUser = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: passwordAdmin,
      role: 'ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User Demo',
      email: 'user@example.com',
      passwordHash: passwordUser,
      role: 'USER'
    }
  });

  // Seed products individually to avoid duplicates
  const products = [
    { id: 1, name: 'Kaos Next.js', price: 149900, imageUrl: '/images/shirt.jpg', stock: 100 },
    { id: 2, name: 'Mug RevoU',    price:  79900, imageUrl: '/images/mug.jpg', stock: 100 },
    { id: 3, name: 'Sticker Pack', price:  29900, imageUrl: '/images/stickers.jpg', stock: 100 }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product
    });
  }

  console.log('✅ Database seeded successfully!');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});