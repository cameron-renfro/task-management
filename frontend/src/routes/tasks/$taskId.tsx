import { createFileRoute } from '@tanstack/react-router'
import { data } from '../../data'

export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskComponent,
})

function TaskComponent() {
  const { taskId } = Route.useParams()
  console.log('TaskComponent params:', taskId)
  const task = data.find((t) => String(t.id) === taskId)
  if (!task) return <div>Task not found</div>
  return (
    <div>
      <h2>{task.name}</h2>
      <p>{task.notes}</p>
    </div>
  )
}
