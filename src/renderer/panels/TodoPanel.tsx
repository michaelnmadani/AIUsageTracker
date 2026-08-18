import React, { useMemo, useState } from 'react';
import { Empty, Panel } from '../components/Panel';
import { api } from '../lib/api';
import { dayLabel } from '../lib/format';
import type { TodoData, TodoItem, TodoPriority } from '../../shared/types';

const PRIORITY_COLOUR: Record<TodoPriority, string> = {
  high: 'var(--bad)',
  normal: 'var(--accent)',
  low: 'var(--text-faint)',
};

interface Props {
  todos: TodoData;
  onChange: (todos: TodoData) => void;
}

export function TodoPanel({ todos, onChange }: Props) {
  const [draft, setDraft] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('normal');

  const { open, done } = useMemo(() => {
    const sorted = [...todos.items].sort((a, b) => a.order - b.order);
    return {
      open: sorted.filter((item) => !item.done),
      done: sorted.filter((item) => item.done),
    };
  }, [todos.items]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setDraft('');
    onChange(await api.todos.add({ title, priority }));
  };

  const toggle = async (item: TodoItem) => {
    onChange(await api.todos.update(item.id, { done: !item.done }));
  };

  return (
    <Panel
      title="To do"
      pulse={todos.updatedAt}
      meta={
        <>
          <span>
            {open.length} open{done.length > 0 ? ` · ${done.length} done` : ''}
          </span>
          {done.length > 0 ? (
            <button
              className="btn btn--icon"
              title="Clear completed"
              onClick={async () => onChange(await api.todos.clearCompleted())}
            >
              Clear
            </button>
          ) : null}
        </>
      }
    >
      <form className="todo-form" onSubmit={submit}>
        <input
          value={draft}
          placeholder="Add a task…"
          onChange={(event) => setDraft(event.target.value)}
        />
        <select
          style={{ width: 96 }}
          value={priority}
          onChange={(event) => setPriority(event.target.value as TodoPriority)}
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
        <button className="btn btn--primary" type="submit">
          Add
        </button>
      </form>

      {open.length === 0 && done.length === 0 ? (
        <Empty>Nothing on the list. Enjoy it while it lasts.</Empty>
      ) : (
        <div className="list">
          {[...open, ...done].map((item) => (
            <div key={item.id} className={`item${item.done ? ' todo--done' : ''}`}>
              <div
                className="todo__priority"
                style={{ background: item.done ? 'transparent' : PRIORITY_COLOUR[item.priority] }}
              />
              <button
                className={`todo__check${item.done ? ' todo__check--done' : ''}`}
                onClick={() => void toggle(item)}
                aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
              >
                {item.done ? (
                  <svg width="11" height="11" viewBox="0 0 12 12">
                    <path
                      d="M2 6.5l2.5 2.5L10 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}
              </button>
              <div className="item__main">
                <div className="item__title">{item.title}</div>
                {item.dueAt ? (
                  <div
                    className={`item__sub${
                      !item.done && item.dueAt < Date.now() ? ' todo__due--overdue' : ''
                    }`}
                  >
                    Due {dayLabel(item.dueAt)}
                  </div>
                ) : null}
              </div>
              <button
                className="btn btn--icon btn--danger"
                title="Delete"
                onClick={async () => onChange(await api.todos.remove(item.id))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
