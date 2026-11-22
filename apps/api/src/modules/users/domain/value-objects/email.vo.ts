import { InvalidEmailError } from '../errors/invalid-email.error';

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !normalized ||
      normalized.length > 254 ||
      !emailRegex.test(normalized)
    ) {
      throw new InvalidEmailError(value);
    }

    return new Email(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
