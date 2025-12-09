import { AppDataSource } from '../../config/data-source';

interface UserSeed {
  email: string;
  full_name: string;
  password: string;
  role: string;
  is_active: boolean;
}

export async function seedUsers() {
  const dataSource = await AppDataSource.initialize();

  try {
    // Check if users already exist
    const result = await dataSource.query('SELECT COUNT(*) as count FROM users');
    const count = parseInt(result[0].count);

    if (count > 0) {
      console.log('⚠️  Users already seeded, skipping...');
      await dataSource.destroy();
      return;
    }

    // Create seed data
    const users: UserSeed[] = [
      {
        email: 'admin@example.com',
        full_name: 'Admin User',
        password: 'admin123', // In production, use bcrypt!
        role: 'admin',
        is_active: true,
      },
      {
        email: 'user1@example.com',
        full_name: 'John Doe',
        password: 'user123',
        role: 'user',
        is_active: true,
      },
      {
        email: 'user2@example.com',
        full_name: 'Jane Smith',
        password: 'user123',
        role: 'user',
        is_active: true,
      },
      {
        email: 'user3@example.com',
        full_name: 'Bob Johnson',
        password: 'user123',
        role: 'user',
        is_active: true,
      },
      {
        email: 'inactive@example.com',
        full_name: 'Inactive User',
        password: 'user123',
        role: 'user',
        is_active: false,
      },
    ];

    // Insert users
    for (const user of users) {
      await dataSource.query(
        `INSERT INTO users (email, full_name, password, role, is_active) 
         VALUES ($1, $2, $3, $4, $5)`,
        [user.email, user.full_name, user.password, user.role, user.is_active],
      );
    }

    console.log('✅ Users seeded successfully!');
    console.log(`   - ${users.length} users created`);
    console.log(`   - 1 admin, ${users.length - 1} regular users`);

  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Allow running this file directly
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
