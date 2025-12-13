import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('transactions')
  getAllTransactions(@Query('limit') limit?: string) {
    return this.adminService.getAllTransactions(limit ? parseInt(limit) : 100);
  }

  @Get('audit-logs')
  getAuditLogs(@Query('limit') limit?: string) {
    return this.adminService.getAuditLogs(limit ? parseInt(limit) : 100);
  }

  @Get('statistics')
  getStatistics() {
    return this.adminService.getStatistics();
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.adminService.updateUserStatus(+id, body.isActive);
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.adminService.updateUserRole(+id, body.role);
  }
}
