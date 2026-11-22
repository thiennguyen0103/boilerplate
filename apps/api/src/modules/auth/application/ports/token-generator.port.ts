export interface TokenGeneratorPort {
  generate(): string;
  hash(token: string): string;
}
