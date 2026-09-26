import { getTransportData } from '@/app/actions/transportActions';
import TransportationClient from './TransportationClient';

export const revalidate = 0;

export const metadata = {
  title: 'Official Transport Packages & Rates | Umrah Plus',
  description: 'Private ground transportation & ziyarat experiences between the two holy cities. View official rates for fixed route packages and point-to-point transfers.',
};

export default async function TransportationPage() {
  const storeData = await getTransportData();
  return <TransportationClient initialStoreData={storeData} />;
}