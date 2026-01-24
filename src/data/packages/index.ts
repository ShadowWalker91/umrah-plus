import { Package } from './types';
import { ZIYARAT_PACKAGES } from './ziyarat';
// import { UMRAH_PACKAGES } from './umrah'; // Uncomment when you create this file

// Combine all arrays into one master array
export const PACKAGES: Package[] = [
  ...ZIYARAT_PACKAGES,
  // ...UMRAH_PACKAGES,
  // ...TRANSPORT_PACKAGES
];

// Re-export the type so you don't have to import from './types' elsewhere
export type { Package, VehiclePrice } from './types';