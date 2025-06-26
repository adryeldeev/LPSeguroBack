// seed.js
import prisma from "../src/models/prismaClient.js";
import bcrypt from 'bcrypt';


async function main() {
  const passwordHash = await bcrypt.hash('4sSeguro123@', 10);

  await prisma.user.upsert({
     where: { email: "4sseguroacidentes@gmail.com" },
    update: {},
    create: {
      name: '4sSeguro',
    email: '4sseguroacidentes@gmail.com',
      password: passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin user created or already exists');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
