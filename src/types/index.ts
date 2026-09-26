export type VehicleOption = {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
};

export type CityPackage = {
  id: string;
  title: string;
  durationDays: number;
  destinations?: string[] | null;
  description: string;
  vehicleOptions?: VehicleOption[] | null;
  includes?: string[] | null;
  citySlug?: string;
};