import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ziyaratLandmarks } from '@/lib/db/schema/ziyarat'
import { eq } from 'drizzle-orm'
import EditZiyaratForm from './EditZiyaratForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditZiyaratPage({ params }: PageProps) {
  const { id } = await params

  // 1. Fetch the specific location
  const result = await db
    .select()
    .from(ziyaratLandmarks)
    .where(eq(ziyaratLandmarks.id, id))
    .limit(1)

  const location = result[0]

  if (!location) {
    return notFound()
  }

  // 2. Pass data to the Client Component Form
  return <EditZiyaratForm initialData={location} />
}