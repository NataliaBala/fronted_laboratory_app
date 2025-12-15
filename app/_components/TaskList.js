'use client'

export default function TaskList({ tasks, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div style={{
        fontSize: '12px',
        color: '#9ca3af',
        fontStyle: 'italic'
      }}>
        Brak zadań
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '25px' }}>
      {tasks.map(task => (
        <div
          key={task.id}
          style={{
            backgroundColor: task.completed ? '#f0fdf4' : '#fef3c7',
            border: `1px solid ${task.completed ? '#bbf7d0' : '#fde68a'}`,
            borderRadius: '3px',
            padding: '3px 6px',
            marginBottom: '2px',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={() => onEditTask(task)}
          title="Kliknij aby edytować"
        >
          <span style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#166534' : '#92400e',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {task.title}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteTask(task.id)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '10px',
              padding: '0 2px',
              marginLeft: '4px'
            }}
            title="Usuń zadanie"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}