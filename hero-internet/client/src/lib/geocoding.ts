/**
 * Convert address to latitude/longitude using Google Geocoding API.
 *
 * The Google Maps JS API is loaded on demand via a singleton loader so the
 * geocoder works even before/without the map component being rendered.
 */

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

let mapsApiPromise: Promise<void> | null = null;

/**
 * Load the Google Maps JS API once (singleton). Safe to call multiple times.
 */
export function loadMapsApi(): Promise<void> {
  // Already loaded
  if ((window as any).google?.maps?.Geocoder) {
    return Promise.resolve();
  }
  if (mapsApiPromise) return mapsApiPromise;

  mapsApiPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve();
      script.remove();
    };
    script.onerror = () => {
      mapsApiPromise = null; // allow retry
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return mapsApiPromise;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  /** Google's location precision: ROOFTOP > RANGE_INTERPOLATED > GEOMETRIC_CENTER > APPROXIMATE */
  locationType: string;
}

/**
 * Geocode a street address, biased to the selected regency in East Java.
 * Tries multiple query variants and returns the most precise result.
 */
export async function geocodeAddress(
  address: string,
  region: string
): Promise<GeocodeResult | null> {
  try {
    await loadMapsApi();
  } catch (err) {
    console.error("Maps API failed to load:", err);
    return null;
  }

  const google = (window as any).google;
  const geocoder = new google.maps.Geocoder();

  // Query variants, most specific first
  const queries = [
    `${address}, ${region}, Jawa Timur, Indonesia`,
    `${address}, Kabupaten ${region}, Jawa Timur, Indonesia`,
    `${address}, ${region}, Indonesia`,
  ];

  for (const query of queries) {
    const result = await geocodeOnce(geocoder, query);
    if (result) {
      // Reject results that clearly landed outside East Java (sanity check)
      if (
        result.latitude < -9.5 ||
        result.latitude > -5.5 ||
        result.longitude < 110 ||
        result.longitude > 115
      ) {
        continue;
      }
      return result;
    }
  }

  return null;
}

function geocodeOnce(
  geocoder: any,
  query: string
): Promise<GeocodeResult | null> {
  return new Promise((resolve) => {
    geocoder.geocode(
      {
        address: query,
        componentRestrictions: { country: "ID" },
      },
      (results: any, status: any) => {
        if (status === "OK" && results && results.length > 0) {
          const best = results[0];
          const location = best.geometry.location;
          resolve({
            latitude: location.lat(),
            longitude: location.lng(),
            formattedAddress: best.formatted_address || "",
            locationType: best.geometry.location_type || "UNKNOWN",
          });
        } else {
          if (status !== "ZERO_RESULTS") {
            console.warn(`Geocoding failed for: ${query}, status: ${status}`);
          }
          resolve(null);
        }
      }
    );
  });
}
