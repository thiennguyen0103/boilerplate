import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export class ChangeUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;
}
