import { seedUsers } from './user.seed';
import { seedTasks } from './task.seed';

async function runSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Run seeds in order
    await seedUsers();
    await seedTasks();

    console.log('\n✅ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
