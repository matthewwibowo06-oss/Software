import btsData from "@/data/bts-data.json";

export interface BTS {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  region: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Coverage radius per BTS tower: 400 meters
 */
export const COVERAGE_RADIUS_KM = 0.4;
export const COVERAGE_RADIUS_METERS = 400;

/**
 * Check if a location is covered by any BTS
 * Coverage radius is 400 meters by default
 */
export function checkCoverage(
  latitude: number,
  longitude: number,
  radiusKm: number = COVERAGE_RADIUS_KM
): {
  isCovered: boolean;
  nearestBTS: BTS | null;
  distance: number | null;
} {
  let nearestBTS: BTS | null = null;
  let minDistance = Infinity;

  for (const bts of btsData as BTS[]) {
    const distance = calculateDistance(
      latitude,
      longitude,
      bts.latitude,
      bts.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestBTS = bts;
    }
  }

  return {
    isCovered: minDistance <= radiusKm,
    nearestBTS,
    distance: minDistance === Infinity ? null : minDistance,
  };
}

/**
 * Get all BTS towers
 */
export function getAllBTS(): BTS[] {
  return btsData as BTS[];
}

/**
 * Get BTS towers by region
 */
export function getBTSByRegion(region: string): BTS[] {
  return (btsData as BTS[]).filter((bts) =>
    bts.region.toUpperCase().includes(region.toUpperCase())
  );
}
