import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddIndexes1701234623456 implements MigrationInterface {
    name = 'AddIndexes1701234623456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add index on users email
        await queryRunner.createIndex('users', new TableIndex({
            name: 'IDX_users_email',
            columnNames: ['email'],
        }));

        // Add index on tasks status
        await queryRunner.createIndex('tasks', new TableIndex({
            name: 'IDX_tasks_status',
            columnNames: ['status'],
        }));

        // Add index on tasks user_id
        await queryRunner.createIndex('tasks', new TableIndex({
            name: 'IDX_tasks_user_id',
            columnNames: ['user_id'],
        }));

        // Add composite index on tasks status and priority
        await queryRunner.createIndex('tasks', new TableIndex({
            name: 'IDX_tasks_status_priority',
            columnNames: ['status', 'priority'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('tasks', 'IDX_tasks_status_priority');
        await queryRunner.dropIndex('tasks', 'IDX_tasks_user_id');
        await queryRunner.dropIndex('tasks', 'IDX_tasks_status');
        await queryRunner.dropIndex('users', 'IDX_users_email');
    }
}
