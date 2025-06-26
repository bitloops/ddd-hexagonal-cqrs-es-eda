export interface AppConfig {
  http: {
    port: number;
    ip: string;
  };
  database: {
    iam_mongo: {
      database: string;
      host: string;
      users_collection: string;
    };
    todo_mongo: {
      database: string;
      host: string;
    };
    marketing_mongo: {
      database: string;
      host: string;
      users_collection: string;
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
    iam_mongo: {
      database: process.env.IAM_DATABASE_NAME ?? 'iam',
      host: process.env.IAM_DATABASE_HOST ?? 'localhost',
      users_collection: process.env.IAM_DATABASE_USERS_COLLECTION ?? 'users',
    },
    todo_mongo: {
      database: process.env.TODO_DATABASE_NAME ?? 'todo',
      host: process.env.TODO_DATABASE_HOST ?? 'localhost',
    },
    marketing_mongo: {
      database: process.env.MARKETING_DATABASE_NAME ?? 'marketing',
      host: process.env.MARKETING_DATABASE_HOST ?? 'localhost',
      users_collection:
        process.env.MARKETING_DATABASE_USERS_COLLECTION ?? 'users',
    },
  },
  nats: {
    host: process.env.NATS_HOST ?? 'localhost',
    port: process.env.NATS_PORT ? parseInt(process.env.NATS_PORT) : 4222,
  },
});
