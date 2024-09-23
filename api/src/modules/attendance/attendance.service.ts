import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Staff } from '../staff/entities/staff.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  // Method untuk clock in
  async clockIn(
    staffId: string,
  ): Promise<{ message: string; data: Attendance }> {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with id ${staffId} not found`);
    }

    // Mengecek apakah staff sudah clock in tetapi belum clock out
    const existingAttendance = await this.attendanceRepository.findOne({
      where: { staff: { id: staff.id }, clockout: null },
    });

    if (existingAttendance) {
      throw new BadRequestException(
        `Staff with id ${staffId} has already clocked in and not clocked out yet.`,
      );
    }

    const attendance = this.attendanceRepository.create({
      clockin: new Date().toISOString(),
      staff: staff,
    });

    await this.attendanceRepository.save(attendance);
    return {
      message: 'Clock-in successful',
      data: attendance,
    };
  }

  // Method untuk clock out
  async clockOut(
    staffId: string,
  ): Promise<{ message: string; data: Attendance }> {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with id ${staffId} not found`);
    }

    // Mencari record clock in yang belum clock out
    const attendance = await this.attendanceRepository.findOne({
      where: { staff: { id: staff.id }, clockout: null },
    });

    if (!attendance) {
      throw new BadRequestException(
        `Staff with id ${staffId} has not clocked in yet or already clocked out.`,
      );
    }

    attendance.clockout = new Date().toISOString();
    await this.attendanceRepository.save(attendance);
    return {
      message: 'Clock-out successful',
      data: attendance,
    };
  }

  // Method untuk mendapatkan riwayat kehadiran berdasarkan staffId
  async getAttendanceHistory(
    staffId: string,
  ): Promise<{ message: string; data: Attendance[] }> {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with id ${staffId} not found`);
    }

    const history = await this.attendanceRepository.find({
      where: { staff: { id: staff.id } },
      order: { clockin: 'DESC' },
    });

    return {
      message: 'Attendance history retrieved successfully',
      data: history,
    };
  }
}
