import { IsNotEmpty, IsString } from 'class-validator';

export class ClockInDto {
  @IsNotEmpty()
  @IsString()
  staffId: string; // Tetap sebagai string untuk UUID
}

export class ClockOutDto {
  @IsNotEmpty()
  @IsString()
  staffId: string; // Tetap sebagai string untuk UUID
}
