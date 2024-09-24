import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ClockInDto, ClockOutDto } from './dto/attendance.dto';

@Controller({ version: '1', path: 'attendance' })
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Body() clockInDto: ClockInDto) {
    return this.attendanceService.clockIn(clockInDto.staffId);
  }

  @Post('clock-out')
  async clockOut(@Body() clockOutDto: ClockOutDto) {
    return this.attendanceService.clockOut(clockOutDto.staffId);
  }

  @Get('history/:staffId')
  async getAttendanceHistory(@Param('staffId') staffId: string) {
    return this.attendanceService.getAttendanceHistory(staffId);
  }
}
