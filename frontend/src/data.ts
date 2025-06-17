// data.ts

export interface Task {
  id: number
  name: string
  notes: string
}

export const data: Task[] = [
  {
    id: 1,
    name: 'Design login flow',
    notes: 'Consider social login options and error UX',
  },
  {
    id: 2,
    name: 'Implement task list',
    notes: 'Fetch from API and handle loading state',
  },
  {
    id: 3,
    name: 'Set up routing',
    notes: 'Use TANStack Router with type-safe paths',
  },
  {
    id: 4,
    name: 'Write unit tests',
    notes: 'Cover reducers and UI state components',
  },
  {
    id: 5,
    name: 'Build deployment pipeline',
    notes: 'Use GitHub Actions to deploy via CDK',
  },
]
