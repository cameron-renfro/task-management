import { createFileRoute, Outlet } from '@tanstack/react-router'
import { data, Task } from '../data'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks')({
  component: TasksComponent,
})

function TasksComponent() {
  const match = Route.useMatch()
  const isExact = match.pathname === '/tasks'
  return (
    <div>
      <h1>Tasks</h1>
      {isExact && (
        <ul>
          {data.map((task: Task) => (
            <li key={task.id}>
              <Link
                to="/tasks/$taskId"
                params={(prev) => ({ ...prev, taskId: String(task.id) })}
              >
                {task.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Outlet />
    </div>
  )
}
