import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithUUID } from '../../../common/base.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Attendance extends BaseEntityWithUUID {
  @Column({ nullable: true })
  @Expose()
  clockin: string;

  @Column({ nullable: true })
  @Expose() // Tambahkan nullable: true
  clockout?: string;

  @ManyToOne(() => Staff, (staff) => staff.attendances)
  @Expose()
  staff: Staff;
}
