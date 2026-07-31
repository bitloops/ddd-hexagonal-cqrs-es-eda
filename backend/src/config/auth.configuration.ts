export interface AuthEnvironmentVariables {
  oidc: {
    issuer: string;
    audience: string;
    clientId: string;
    jwksUri: string;
    requireVerifiedEmail: boolean;
    clockToleranceSeconds: number;
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

export default () => ({
  oidc: {
    issuer: required('OIDC_ISSUER'),
    audience: required('OIDC_AUDIENCE'),
    clientId: required('OIDC_CLIENT_ID'),
    jwksUri: required('OIDC_JWKS_URI'),
    requireVerifiedEmail:
      process.env.OIDC_REQUIRE_VERIFIED_EMAIL?.toLowerCase() === 'true',
    clockToleranceSeconds: process.env.OIDC_CLOCK_TOLERANCE_SECONDS
      ? Number(process.env.OIDC_CLOCK_TOLERANCE_SECONDS)
      : 5,
  },
  database: {
    host: process.env.PG_HOST ?? 'localhost',
    port: process.env.PG_PORT ? +process.env.PG_PORT : 5432,
    user: process.env.PG_USER ?? 'user',
    password: process.env.PG_PASSWORD ?? 'postgres',
    database: process.env.PG_DATABASE ?? 'bitloops',
  },
});
