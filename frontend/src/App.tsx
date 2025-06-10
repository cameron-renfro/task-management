import { RouterProvider, Router } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = new Router({ routeTree })

export function App() {
  return <RouterProvider router={router} />
}
