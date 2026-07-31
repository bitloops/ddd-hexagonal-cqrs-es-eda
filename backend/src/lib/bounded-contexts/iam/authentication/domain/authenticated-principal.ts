export type ExternalIdentity = {
  issuer: string;
  subject: string;
  email: string;
  emailVerified: boolean;
  roles: string[];
};

export type AuthenticatedPrincipal = ExternalIdentity & {
  userId: string;
};
