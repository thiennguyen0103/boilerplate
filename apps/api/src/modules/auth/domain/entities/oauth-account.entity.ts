export type OAuthProvider = 'google';

export interface OAuthAccountProps {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerSubject: string;
  email: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

export class OAuthAccount {
  private constructor(private readonly props: OAuthAccountProps) {}

  static reconstitute(props: OAuthAccountProps): OAuthAccount {
    return new OAuthAccount(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get provider(): OAuthProvider {
    return this.props.provider;
  }

  get providerSubject(): string {
    return this.props.providerSubject;
  }

  get email(): string | null {
    return this.props.email;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
