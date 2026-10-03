import { useState } from 'react'

function TaskInput({ onAdd }) {
  const getToday = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getCurrentTime = () => {
    const now = new Date()

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    return `${hours}:${minutes}`
  }

  const [text, setText] = useState('')
  const [date, setDate] = useState(getToday())
  const [time, setTime] = useState(getCurrentTime())

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    onAdd({
      text,
      date,
      time,
    })

    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">

      {/* Task */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="New task"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Date
          </label>

          <input
            type="date"
            value={date}
            min={getToday()}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>
    </form>
  )
}

export default TaskInput