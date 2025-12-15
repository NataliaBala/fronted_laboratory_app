'use client'

import { useState, useEffect } from 'react'

export default function TaskForm({ date, task, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setCompleted(task.completed || false)
      setPriority(task.priority || 'medium')
    } else {
      setTitle('')
      setDescription('')
      setCompleted(false)
      setPriority('medium')
    }
  }, [task])

  const handleSubmit = (e) => {
    e.preventDefault()

    const taskData = {
      title,
      description,
      completed,
      priority,
      date: date.toISOString().split('T')[0]
    }

    onSave(taskData)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
          {task ? 'Edytuj zadanie' : 'Dodaj zadanie'}
        </h2>

        <div style={{ marginBottom: '15px', fontSize: '14px', color: '#6b7280' }}>
          Data: {formatDate(date)}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Tytuł zadania *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                color: '#0f172a',
                backgroundColor: '#fff'
              }}
              placeholder="Wpisz tytuł zadania..."
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Opis
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                color: '#0f172a',
                backgroundColor: '#fff',
                resize: 'vertical'
              }}
              placeholder="Opis zadania (opcjonalne)..."
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Priorytet
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                color: '#0f172a',
                backgroundColor: '#fff'
              }}
            >
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Ukończone
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Anuluj
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {task ? 'Zapisz zmiany' : 'Dodaj zadanie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}