export interface PasswordHasherPort {
  hash(plainText: string): Promise<string>;
  verify(hashedPassword: string, plainText: string): Promise<boolean>;
}
