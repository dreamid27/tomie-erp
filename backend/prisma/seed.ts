import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { id: 'c9b368eb-f290-45fa-87e5-71d950e9aa6b', name: 'Wireless Mouse' },
      {
        id: '2d972346-92af-4a6d-8e11-a5edde038823',
        name: 'Mechanical Keyboard',
      },
      { id: '42098d9e-1bc3-4ac7-8830-4bba2dc21a3a', name: 'USB-C Hub' },
      {
        id: '9fcf95e7-d66e-442a-a60c-622030f23fbb',
        name: 'Noise Cancelling Headphones',
      },
      {
        id: '9bb580ac-067c-4f97-b344-34ebe213ae7f',
        name: 'Portable SSD 1TB',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.customer.createMany({
    data: [
      {
        id: '9bb580ac-067c-4f97-b344-34ebe213ae7f',
        name: 'Alice Johnson',
        street_address: '123 Main St',
        city: 'Anytown',
        phone: '123-456-7890',
      },
      {
        id: '9fcf95e7-d66e-442a-a60c-622030f23fbb',
        name: 'Bob Smith',
        street_address: '456 Oak Ave',
        city: 'Othertown',
        phone: '321-654-9870',
      },
      {
        id: '42098d9e-1bc3-4ac7-8830-4bba2dc21a3a',
        name: 'Charlie Nguyen',
        street_address: '789 Oak Ave',
        city: 'Othertown',
        phone: '321-654-9870',
      },
      {
        id: '2d972346-92af-4a6d-8e11-a5edde038823',
        name: 'Diana Patel',
        street_address: '456 Pine Rd',
        city: 'Anothertown',
        phone: '456-789-1230',
      },
      {
        id: 'c9b368eb-f290-45fa-87e5-71d950e9aa6b',
        name: 'Ethan Garcia',
        street_address: '101 Elm St',
        city: 'Yetanothertown',
        phone: '567-890-1234',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log('Seed completed.'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
