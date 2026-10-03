import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import { useGoogleCalendar } from './context/GoogleCalendarContext'

function App() {
  const [tasks, setTasks] = useState([])
  const { authenticated, loading, login, logout, clientId } = useGoogleCalendar()

  useEffect(() => {
    const stored = localStorage.getItem('daily-tasks')

    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch {
        setTasks([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('daily-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData) => {
    if (!taskData.text.trim()) return

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskData.text.trim(),
        date: taskData.date,
        time: taskData.time,
        completed: false,
        calendarAdded: false,
      },
    ])
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const updateTask = (id, updates) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, ...updates }
        : task
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-md mx-auto px-4 py-8">

        <header className="mb-8 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Daily Tasks
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Stay organized, get things done
            </p>
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : authenticated ? (
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Signed in
              </button>
            ) : (
              <button
                onClick={login}
                disabled={!clientId}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {clientId ? 'Connect Calendar' : 'Configure Client ID'}
              </button>
            )}
          </div>
        </header>

        <TaskInput onAdd={addTask} />

        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          authenticated={authenticated}
          onUpdate={updateTask}
        />

        {tasks.length === 0 && (
          <div className="mt-8 text-center text-gray-400 dark:text-gray-500">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-1">
              Add your first task above to get started
            </p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {tasks.filter(t => t.completed).length} of {tasks.length} completed
          </div>
        )}

      </div>
    </div>
  )
}

export default App