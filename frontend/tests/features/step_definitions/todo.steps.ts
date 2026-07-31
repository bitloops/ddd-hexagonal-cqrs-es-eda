import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import todoReducer, { setTodos } from '../../../src/store/todo/todoReducer';
import type { Todo } from '../../../src/models/Todo';

interface TodoState {
    todosState: Todo[];
    todoIdsState: string[];
}

interface TodoWorld {
    state: TodoState;
}

function parseTodosTable(table: DataTable): Todo[] {
    return table.hashes().map(row => ({
        id: row.id,
        title: row.title,
        isCompleted: row.completed === 'true',
    }));
}

Given('a fresh todo state', function (this: TodoWorld) {
    this.state = { todosState: [], todoIdsState: [] };
});

Given('a todo state with:', function (this: TodoWorld, table: DataTable) {
    const todos = parseTodosTable(table);
    this.state = {
        todosState: todos,
        todoIdsState: todos.map(todo => todo.id),
    };
});

When('a {string} setTodos event arrives with todos:', function (this: TodoWorld, type: string, table: DataTable) {
    const todos = parseTodosTable(table);
    this.state = todoReducer(this.state, setTodos({ type, todos }));
});

Then('the todosState should be:', function (this: TodoWorld, table: DataTable) {
    const expected = parseTodosTable(table);
    assert.deepStrictEqual(this.state.todosState, expected);
});

Then('the todoIdsState should be:', function (this: TodoWorld, table: DataTable) {
    const expected = table.hashes().map(row => row.id);
    assert.deepStrictEqual(this.state.todoIdsState, expected);
});
