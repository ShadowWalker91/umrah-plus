import { notFound } from 'next/navigation';
import { getZiyaratData } from '@/lib/ziyarat';
import ZiyaratDetailClient from '@/components/ziyarat/ZiyaratDetailClient';

// Update Interface: params is a Promise
interface PageProps {
  params: Promise<{
    city: string;
    slug: string;
  }>;
}

// 1. Make Component Async
export default async function SingleZiyaratPage({ params }: PageProps) {
  
  // 2. Await the params before using them
  const resolvedParams = await params;

  // 3. Process Params
  const rawCityParam = resolvedParams.city.toLowerCase(); 
  const cityKey = rawCityParam.replace('-ziyarat', '');       
  const slug = resolvedParams.slug;

  // 4. Fetch Data
  const data = getZiyaratData(cityKey, slug);

  // 5. Handle 404
  if (!data) {
    return notFound();
  }

  // 6. Pass data to Client Component
  return (
    <ZiyaratDetailClient 
      data={data} 
      cityKey={cityKey} 
      rawCityParam={rawCityParam} 
    />
  );
}