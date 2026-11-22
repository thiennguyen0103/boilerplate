export interface AccessTokenPayload {
  sub: string;
  email: string;
  sessionId: string;
}

export interface AccessTokenPort {
  sign(payload: AccessTokenPayload): Promise<string>;
  verify(token: string): Promise<AccessTokenPayload>;
}
