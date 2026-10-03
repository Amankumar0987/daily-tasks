import TaskItem from './TaskItem'

function TaskList({
  tasks,
  onToggle,
  onDelete,
  authenticated,
  onUpdate
}) {
  if (tasks.length === 0) return null

  return (
    <ul
      className="space-y-2"
      role="list"
      aria-label="Tasks"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          authenticated={authenticated}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  )
}

export default TaskList