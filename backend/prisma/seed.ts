import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UUIDv7 } from '../src/lib/infra/prisma/uuid-v7.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users with UUID v7
  const users = [
    {
      id: UUIDv7.generate(),
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      lastLogin: new Date(),
    },
    {
      id: UUIDv7.generate(),
      email: 'user@example.com', 
      password: await bcrypt.hash('user123', 10),
      lastLogin: new Date(),
    },
    {
      id: UUIDv7.generate(),
      email: 'test@example.com',
      password: await bcrypt.hash('test123', 10),
      lastLogin: new Date(),
    },
  ];

  // Insert users
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: userData.password,
        lastLogin: userData.lastLogin,
      },
      create: userData,
    });

    console.log(`✅ Created/Updated user: ${user.email} (ID: ${user.id})`);
    
    // Demonstrate UUID v7 timestamp extraction
    try {
      const timestamp = UUIDv7.extractTimestamp(user.id);
      console.log(`   🕐 Created at: ${timestamp.toISOString()}`);
    } catch (error) {
      console.log(`   ⚠️  Not a UUID v7: ${user.id}`);
    }
  }

  // Demonstrate UUID v7 time-ordering
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { id: 'asc' }, // UUID v7s are naturally time-ordered
  });

  console.log('\n📊 Users ordered by UUID v7 (chronologically):');
  allUsers.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.email} - ${user.id}`);
  });

  console.log('\n🎉 Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });