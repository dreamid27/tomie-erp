import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'Wireless Mouse' },
      { name: 'Mechanical Keyboard' },
      { name: 'USB-C Hub' },
      { name: 'Noise Cancelling Headphones' },
      { name: 'Portable SSD 1TB' },
    ],
  });

  await prisma.customer.createMany({
    data: [
      { name: 'Alice Johnson' },
      { name: 'Bob Smith' },
      { name: 'Charlie Nguyen' },
      { name: 'Diana Patel' },
      { name: 'Ethan Garcia' },
    ],
  });
}

main()
  .then(() => console.log('Seed completed.'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
