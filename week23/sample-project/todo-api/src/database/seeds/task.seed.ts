import { AppDataSource } from '../../config/data-source';

interface TaskSeed {
  title: string;
  description: string;
  status: string;
  priority: string;
  user_id: number;
}

export async function seedTasks() {
  const dataSource = await AppDataSource.initialize();

  try {
    // Check if tasks already exist
    const result = await dataSource.query('SELECT COUNT(*) as count FROM tasks');
    const count = parseInt(result[0].count);

    if (count > 0) {
      console.log('⚠️  Tasks already seeded, skipping...');
      await dataSource.destroy();
      return;
    }

    // Get all users
    const users = await dataSource.query('SELECT id FROM users WHERE is_active = true ORDER BY id');

    if (users.length === 0) {
      console.log('⚠️  No active users found. Please seed users first.');
      await dataSource.destroy();
      return;
    }

    // Create seed data for each user
    const tasks: TaskSeed[] = [];

    for (const user of users) {
      tasks.push(
        {
          title: `Complete Week 23 Assignment`,
          description: 'Finish all database-related exercises',
          status: 'pending',
          priority: 'high',
          user_id: user.id,
        },
        {
          title: `Review NestJS Documentation`,
          description: 'Read through NestJS official docs',
          status: 'in_progress',
          priority: 'medium',
          user_id: user.id,
        },
        {
          title: `Setup PostgreSQL on Server`,
          description: 'Install and configure PostgreSQL database',
          status: 'completed',
          priority: 'high',
          user_id: user.id,
        },
      );
    }

    // Insert tasks
    for (const task of tasks) {
      await dataSource.query(
        `INSERT INTO tasks (title, description, status, priority, user_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        [task.title, task.description, task.status, task.priority, task.user_id],
      );
    }

    console.log('✅ Tasks seeded successfully!');
    console.log(`   - ${tasks.length} tasks created`);
    console.log(`   - ${tasks.length / users.length} tasks per user`);

  } catch (error) {
    console.error('❌ Error seeding tasks:', error.message);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Allow running this file directly
if (require.main === module) {
  seedTasks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
