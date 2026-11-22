import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  emailVerified: boolean;
}

export interface AuthResult {
  user: OAuthUser;
  accessToken: string;
  refreshToken: string;
}
