import {
  OAuthAccount,
  OAuthProvider,
} from 'src/modules/auth/domain/entities/oauth-account.entity';

export interface CreateOAuthAccountData {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerSubject: string;
  email: string | null;
  emailVerified: boolean;
}

export interface OAuthAccountRepositoryPort {
  findByProviderSubject(
    provider: OAuthProvider,
    providerSubject: string,
  ): Promise<OAuthAccount | null>;
  findByUserAndProvider(
    userId: string,
    provider: OAuthProvider,
  ): Promise<OAuthAccount | null>;
  create(data: CreateOAuthAccountData): Promise<OAuthAccount>;
  deleteByUserAndProvider(
    userId: string,
    provider: OAuthProvider,
  ): Promise<boolean>;
  countByUserId(userId: string): Promise<number>;
}
