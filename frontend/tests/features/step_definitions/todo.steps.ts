import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import * as assert from 'assert';
import todoReducer, { setTodos } from '../../../src/store/todo/todoSlice';
import { Todo } from '../../../src/models/Todo';

function parseTodosTable(table: DataTable): Todo[] {
    return table.hashes().map(row => ({
        id: row.id,
        title: row.title,
        isCompleted: row.completed === 'true',
    }));
}

Given('a fresh todo state', function () {
    this.state = { todosState: [], todoIdsState: [] };
});

Given('a todo state with:', function (table) {
    const todos = parseTodosTable(table);
    this.state = {
        todosState: todos,
        todoIdsState: todos.map(todo => todo.id),
    };
});

When('a {string} setTodos event arrives with todos:', function (type, table) {
    const todos = parseTodosTable(table);
    this.state = todoReducer(this.state, setTodos({ type, todos }));
});

Then('the todosState should be:', function (table) {
    const expected = parseTodosTable(table);
    assert.deepStrictEqual(this.state.todosState, expected);
});

Then('the todoIdsState should be:', function (table) {
    const expected = table.hashes().map((row: { id: string }) => row.id);
    assert.deepStrictEqual(this.state.todoIdsState, expected);
});