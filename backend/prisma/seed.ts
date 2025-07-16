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
      {
        name: 'Alice Johnson',
        street_address: '123 Main St',
        city: 'Anytown',
        phone: '123-456-7890',
      },
      {
        name: 'Bob Smith',
        street_address: '456 Oak Ave',
        city: 'Othertown',
        phone: '321-654-9870',
      },
      {
        name: 'Charlie Nguyen',
        street_address: '789 Oak Ave',
        city: 'Othertown',
        phone: '321-654-9870',
      },
      {
        name: 'Diana Patel',
        street_address: '456 Pine Rd',
        city: 'Anothertown',
        phone: '456-789-1230',
      },
      {
        name: 'Ethan Garcia',
        street_address: '101 Elm St',
        city: 'Yetanothertown',
        phone: '567-890-1234',
      },
    ],
  });
}

main()
  .then(() => console.log('Seed completed.'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
