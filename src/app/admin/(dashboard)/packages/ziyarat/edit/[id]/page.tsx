import { db } from '@/lib/db'
import { packages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

// ✅ THIS IMPORT WAS MISSING. IT IS REQUIRED.
import ZiyaratPackageForm from '@/components/admin/forms/ZiyaratPackageForm'

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditZiyaratPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch from Database
  const [pkg] = await db.select().from(packages).where(eq(packages.id, id));

  // If not found in DB, show 404
  if (!pkg) return notFound();

  // Pass existing data to form
  return <ZiyaratPackageForm pkg={pkg} />
}