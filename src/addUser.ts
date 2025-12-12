import { prisma } from './lib/prisma';

async function main() {
  const now = BigInt(Date.now());

  const user = await prisma.user.create({
    data: {
      login: 'testuser',
      password: '123456',
      version: 1,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log('User added:', user);

  const allUsers = await prisma.user.findMany();
  console.log('All user:', allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
