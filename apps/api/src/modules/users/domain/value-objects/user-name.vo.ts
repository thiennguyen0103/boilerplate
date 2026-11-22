import { InvalidUserNameError } from '../errors/invalid-user-name.error';

export class UserName {
  private constructor(private readonly value: string) {}

  static create(value: string): UserName {
    const normalized = value.trim();

    if (!normalized) {
      throw new InvalidUserNameError('User name cannot be empty');
    }

    if (normalized.length < 2 || normalized.length > 100) {
      throw new InvalidUserNameError(
        'User name must be between 2 and 100 characters',
      );
    }

    return new UserName(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
