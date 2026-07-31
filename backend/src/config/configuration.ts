export interface AppConfig {
  http: {
    port: number;
    ip: string;
  };
  database: {
    postgres: {
      database: string;
      host: string;
      port: number;
    };
  };
  nats: {
    host: string;
    port: number;
  };
}
export default (): AppConfig => ({
  http: {
    port: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 8080,
    ip: process.env.HTTP_IP ?? '0.0.0.0',
  },
  database: {
    postgres: {
      database: process.env.PG_DATABASE ?? 'bitloops',
      host: process.env.PG_HOST ?? 'localhost',
      port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
    },
  },
  nats: {
    host: process.env.NATS_HOST ?? 'localhost',
    port: process.env.NATS_PORT ? parseInt(process.env.NATS_PORT) : 4222,
  },
});
