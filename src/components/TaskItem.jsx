import { useState } from 'react'
import { useGoogleCalendar } from '../context/GoogleCalendarContext'

function TaskItem({
  task,
  onToggle,
  onDelete,
  authenticated,
  onUpdate
}) {
  const { addToCalendar } = useGoogleCalendar()

  const [addingToCalendar, setAddingToCalendar] = useState(false)
  const [calendarError, setCalendarError] = useState(null)

  const handleAddToCalendar = async () => {
    if (!authenticated) {
      alert('Please connect Google Calendar first.')
      return
    }

    if (!task.date || !task.time) {
      alert('Please select date and time first.')
      return
    }

    setAddingToCalendar(true)
    setCalendarError(null)

    try {
      // Create local date/time
      const startTime = new Date(`${task.date}T${task.time}`)

      if (isNaN(startTime.getTime())) {
        throw new Error('Invalid date or time')
      }

      // 1 hour duration
      await addToCalendar(
        task.text,
        startTime,
        60
      )

      onUpdate(task.id, {
        calendarAdded: true
      })

      alert('Task added to Google Calendar!')

      // Open Google Calendar
      window.open(
        'https://calendar.google.com/calendar/u/0/r',
        '_blank'
      )

    } catch (err) {
      console.error('Failed to add to calendar:', err)
      setCalendarError(err.message || 'Failed to add event')
    } finally {
      setAddingToCalendar(false)
    }
  }

  return (
    <li className="group relative flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">

      {/* Main row */}
      <div className="flex items-center gap-3">

        {/* Complete button */}
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center"
          aria-label={
            task.completed
              ? 'Mark incomplete'
              : 'Mark complete'
          }
        >
          {task.completed && (
            <svg
              className="w-3.5 h-3.5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Task name */}
        <span
          className={`flex-1 text-gray-900 dark:text-white break-words ${
            task.completed
              ? 'line-through text-gray-400'
              : ''
          }`}
        >
          {task.text}
        </span>

        {/* Calendar button */}
        {authenticated && (
          <button
            onClick={handleAddToCalendar}
            disabled={addingToCalendar || task.calendarAdded}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              task.calendarAdded
                ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                : 'text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label="Add to Google Calendar"
            title={
              task.calendarAdded
                ? 'Already added to Google Calendar'
                : 'Add to Google Calendar'
            }
          >
            {addingToCalendar ? (
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Delete task"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

        <span>📅</span>

        <input
          type="date"
          value={task.date || ''}
          onChange={(e) =>
            onUpdate(task.id, {
              date: e.target.value,
              calendarAdded: false
            })
          }
          className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
        />

        <span>🕐</span>

        <input
          type="time"
          value={task.time || ''}
          onChange={(e) =>
            onUpdate(task.id, {
              time: e.target.value,
              calendarAdded: false
            })
          }
          className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
        />

      </div>

      {/* Error */}
      {calendarError && (
        <div className="px-3 py-2 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {calendarError}
        </div>
      )}

    </li>
  )
}

export default TaskItem