import { useState, useRef } from 'react'
import { type User } from '../constants/users'
import { useTodos } from '../hooks/useTodos'
import { TabHero } from '../components/TabHero'

interface Props { user: User }

export function TodoTab({ user }: Props) {
  const { todos, loading, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos(user.name)
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pending = todos.filter(t => !t.completed)
  const done = todos.filter(t => t.completed)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim() || submitting) return
    setSubmitting(true)
    await addTodo(draft)
    setDraft('')
    setSubmitting(false)
    inputRef.current?.focus()
  }

  return (
    <div data-testid="todo-tab">
      <TabHero tab="todo" user={user} />

      <div className="px-5 pt-5 pb-10 space-y-6">

        {/* Add todo */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Add something to your list…"
            maxLength={200}
            className="flex-1"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid var(--border)`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: 14,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = user.color)}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <button
            type="submit"
            disabled={!draft.trim() || submitting}
            style={{
              background: draft.trim() ? user.color : 'var(--bg-card)',
              color: draft.trim() ? '#0f0b08' : 'var(--text-tertiary)',
              border: `1px solid ${draft.trim() ? user.color : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.15s',
              cursor: draft.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Add
          </button>
        </form>

        {/* Pending */}
        {loading ? (
          <p className="font-ui" style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', paddingTop: 32 }}>
            Loading…
          </p>
        ) : pending.length === 0 && done.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 48 }}>
            <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Nothing here yet.
            </p>
            <p className="font-ui" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Add things you need to do before or during the trip.
            </p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section>
                <p
                  className="serif-eyebrow"
                  style={{ fontSize: 11, color: user.color, letterSpacing: '0.12em', marginBottom: 10 }}
                >
                  TO DO — {pending.length}
                </p>
                <div className="space-y-2">
                  {pending.map(todo => (
                    <TodoRow
                      key={todo.id}
                      text={todo.text}
                      completed={false}
                      accentColor={user.color}
                      onToggle={() => toggleTodo(todo.id, todo.completed)}
                      onDelete={() => deleteTodo(todo.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {done.length > 0 && (
              <section>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <p
                    className="serif-eyebrow"
                    style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.12em' }}
                  >
                    DONE — {done.length}
                  </p>
                  <button
                    onClick={clearCompleted}
                    className="font-ui"
                    style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'underline' }}
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2">
                  {done.map(todo => (
                    <TodoRow
                      key={todo.id}
                      text={todo.text}
                      completed={true}
                      accentColor={user.color}
                      onToggle={() => toggleTodo(todo.id, todo.completed)}
                      onDelete={() => deleteTodo(todo.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface RowProps {
  text: string
  completed: boolean
  accentColor: string
  onToggle: () => void
  onDelete: () => void
}

function TodoRow({ text, completed, accentColor, onToggle, onDelete }: RowProps) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        style={{
          flexShrink: 0,
          width: 22,
          height: 22,
          borderRadius: 6,
          border: `2px solid ${completed ? accentColor : 'var(--border)'}`,
          background: completed ? accentColor : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s',
        }}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1.5" stroke="#0f0b08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        className="font-ui flex-1"
        style={{
          fontSize: 14,
          color: completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
          textDecoration: completed ? 'line-through' : 'none',
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        style={{ flexShrink: 0, color: 'var(--text-tertiary)', padding: '2px 4px' }}
        aria-label="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
