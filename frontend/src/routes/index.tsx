// src/routes/index.tsx
import * as fs from 'node:fs'
import { useState, useEffect } from 'react'
import { useRouter, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const filePath = 'count.txt'

interface Data {
  message: string
}

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0')
  )
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount()
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount()
    await fs.promises.writeFile(filePath, `${count + data}`)
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const [data, setData] = useState<Data | null>(null)
  const router = useRouter()
  const state = Route.useLoaderData()

  useEffect(() => {
    const url =
      'https://zn6wvmciu6.execute-api.us-east-1.amazonaws.com/dev/ping'

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data)
        setData(data)
      })

      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate()
        })
      }}
    >
      Add 1 to {state}?
      {data && (
        <>
          <p>{data.message}</p>
        </>
      )}
    </button>
  )
}
