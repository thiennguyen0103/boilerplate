import { Email } from 'src/modules/users/domain/value-objects/email.vo';
import { UserName } from 'src/modules/users/domain/value-objects/user-name.vo';
import { UserStatus } from 'src/modules/users/domain/enums/user-status.enum';

export interface UserProps {
  id: string;
  email: Email;
  passwordHash: string | null;
  name: UserName;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  id: string;
  email: Email;
  passwordHash: string | null;
  name: UserName;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: CreateUserProps): User {
    const now = new Date();

    return new User({
      id: props.id,
      email: props.email,
      passwordHash: props.passwordHash,
      name: props.name,
      status: UserStatus.ACTIVE,
      emailVerified: props.emailVerified ?? false,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string | null {
    return this.props.passwordHash;
  }

  get name(): UserName {
    return this.props.name;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  updateName(name: UserName): void {
    this.props.name = name;
    this.touch();
  }

  changeStatus(status: UserStatus): void {
    this.props.status = status;
    this.touch();
  }

  markEmailVerified(): void {
    if (this.props.emailVerified) return;

    this.props.emailVerified = true;
    this.touch();
  }

  changePasswordHash(passwordHash: string): void {
    if (!passwordHash.trim()) {
      throw new Error('Password hash cannot be empty');
    }

    this.props.passwordHash = passwordHash;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
