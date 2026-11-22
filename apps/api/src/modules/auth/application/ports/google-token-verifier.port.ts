export interface GoogleIdentity {
  subject: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
}

export interface GoogleTokenVerifierPort {
  verify(idToken: string): Promise<GoogleIdentity>;
}
