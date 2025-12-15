'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/_lib/authcontext'
import { db } from '@/app/_lib/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import TaskList from './TaskList'
import TaskForm from './TaskForm'

export default function Calendar() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Load tasks from Firestore
  useEffect(() => {
    if (!user?.uid) return

    const tasksRef = collection(db, 'tasks')
    const q = query(
      tasksRef,
      where('userId', '==', user.uid),
      orderBy('date', 'asc')
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = []
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() })
      })
      setTasks(tasksData)
    })

    return () => unsubscribe()
  }, [user])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const getTasksForDate = (date) => {
    if (!date) return []
    const dateStr = formatDate(date)
    return tasks.filter(task => task.date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleAddTask = (date) => {
    setSelectedDate(date)
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setSelectedDate(new Date(task.date))
    setShowTaskForm(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const taskRef = doc(db, 'tasks', editingTask.id)
        await updateDoc(taskRef, taskData)
      } else {
        // Add new task
        await addDoc(collection(db, 'tasks'), {
          ...taskData,
          userId: user.uid,
          createdAt: new Date()
        })
      }
      setShowTaskForm(false)
      setEditingTask(null)
      setSelectedDate(null)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ]

  const dayNames = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']

  if (!user) {
    return <div>Ładowanie...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={handlePrevMonth}
          style={{
            padding: '10px 15px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Poprzedni
        </button>

        <h1 style={{ margin: 0, fontSize: '24px' }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>

        <button
          onClick={handleNextMonth}
          style={{
            padding: '10px 15px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Następny →
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        backgroundColor: '#e5e7eb',
        border: '1px solid #e5e7eb'
      }}>
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} style={{
            backgroundColor: '#f9fafb',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            border: '1px solid #e5e7eb'
          }}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {getDaysInMonth(currentDate).map((date, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            minHeight: '120px',
            padding: '5px',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            {date && (
              <>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: date.toDateString() === new Date().toDateString() ? '#3b82f6' : '#374151'
                }}>
                  {date.getDate()}
                </div>

                <TaskList
                  tasks={getTasksForDate(date)}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />

                <button
                  onClick={() => handleAddTask(date)}
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Dodaj zadanie"
                >
                  +
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showTaskForm && (
        <TaskForm
          date={selectedDate}
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
            setSelectedDate(null)
          }}
        />
      )}
    </div>
  )
}