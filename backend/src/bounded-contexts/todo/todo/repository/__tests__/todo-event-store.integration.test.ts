import { Domain, asyncLocalStorage } from 'ddd-tactical-core-boilerplate';
import { Pool } from 'pg';

import { TitleVO } from '@src/lib/bounded-contexts/todo/todo/domain/title.value-object';
import { TodoEntity } from '@src/lib/bounded-contexts/todo/todo/domain/todo.entity';
import { UserIdVO } from '@src/lib/bounded-contexts/todo/todo/domain/user-id.value-object';
import { TODO_POSTGRES_SCHEMA } from '../todo-postgres.schema';
import { TodoOutboxRelay } from '../todo-outbox.relay';
import { TodoWriteRepository } from '../todo-write.repository';

const describeWithDatabase =
  process.env.RUN_DATABASE_TESTS === 'true' ? describe : describe.skip;

describeWithDatabase('Todo PostgreSQL event store and outbox', () => {
  const userId = '4f28e489-3b4f-48f7-a5f8-457246e229a5';
  const pool = new Pool({
    host: process.env.PG_HOST ?? 'localhost',
    port: Number(process.env.PG_PORT ?? 5432),
    database: process.env.PG_DATABASE ?? 'bitloops_test',
    user: process.env.PG_USER ?? 'user',
    password: process.env.PG_PASSWORD ?? 'postgres',
  });

  const relay = {
    requestFlush: jest.fn(),
  } as unknown as TodoOutboxRelay;
  const repository = new TodoWriteRepository(pool, relay);

  beforeAll(async () => {
    await pool.query(TODO_POSTGRES_SCHEMA);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE todo_outbox, todo_projection, todo_events');
    jest.mocked(asyncLocalStorage.getStore).mockReturnValue({
      get: (key: string) => {
        if (key === 'correlationId') return 'integration-test-correlation';
        if (key === 'context') return { userId };
        return undefined;
      },
    } as ReturnType<typeof asyncLocalStorage.getStore>);
  });

  afterAll(async () => {
    await pool.end();
  });

  it('commits events, projection and outbox together and rehydrates from history', async () => {
    const todo = createTodo('Persist all three records');

    expect((await repository.create(todo)).isOk()).toBe(true);
    todo.complete();
    expect((await repository.update(todo)).isOk()).toBe(true);

    const stored = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM todo_events) AS events,
         (SELECT COUNT(*)::int FROM todo_outbox) AS outbox,
         (SELECT COUNT(*)::int FROM todo_projection) AS projection`,
    );
    expect(stored.rows[0]).toEqual({ events: 2, outbox: 2, projection: 1 });

    const metadata = await pool.query(
      `SELECT metadata->'context' AS context
       FROM todo_events
       ORDER BY version`,
    );
    expect(metadata.rows).toEqual([
      { context: {} },
      { context: {} },
    ]);

    const projection = await pool.query(
      'SELECT completed, version FROM todo_projection WHERE id = $1',
      [todo.id.toString()],
    );
    expect(projection.rows[0]).toEqual({ completed: true, version: 2 });

    const loaded = await repository.getById(todo.id);
    expect(loaded.isOk()).toBe(true);
    if (loaded.isFail()) throw loaded.value;
    expect(loaded.value?.completed).toBe(true);
    expect(loaded.value?.version).toBe(2);
    expect(loaded.value?.domainEvents).toHaveLength(0);
  });

  it('rejects a stale aggregate without appending a partial event or outbox record', async () => {
    const todo = createTodo('Detect concurrent writes');
    expect((await repository.create(todo)).isOk()).toBe(true);

    const first = (await repository.getById(todo.id)).value as TodoEntity;
    const stale = (await repository.getById(todo.id)).value as TodoEntity;
    first.complete();
    expect((await repository.update(first)).isOk()).toBe(true);

    stale.modifyTitle(TitleVO.create({ title: 'A stale title update' }).value as TitleVO);
    expect((await repository.update(stale)).isFail()).toBe(true);

    const counts = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM todo_events) AS events,
         (SELECT COUNT(*)::int FROM todo_outbox) AS outbox`,
    );
    expect(counts.rows[0]).toEqual({ events: 2, outbox: 2 });
  });

  function createTodo(title: string): TodoEntity {
    return TodoEntity.create({
      userId: UserIdVO.create({ id: new Domain.UUIDv4(userId) }).value as UserIdVO,
      title: TitleVO.create({ title }).value as TitleVO,
      completed: false,
    }).value as TodoEntity;
  }
});
