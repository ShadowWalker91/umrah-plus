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
  destinations: string[];
  description: string;
  vehicleOptions: VehicleOption[];
  includes: string[];
};