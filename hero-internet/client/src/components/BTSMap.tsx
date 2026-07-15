import { useRef, useEffect, useState } from "react";
import { MapView } from "./Map";
import { getAllBTS, COVERAGE_RADIUS_METERS } from "@/lib/bts-utils";
import { Card } from "./ui/card";

interface BTSMapProps {
  onMapReady?: (map: google.maps.Map) => void;
  highlightBTS?: string | null;
  userLocation?: { lat: number; lng: number } | null;
}

export function BTSMap({ onMapReady, highlightBTS, userLocation }: BTSMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const [selectedBTS, setSelectedBTS] = useState<string | null>(null);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Get all BTS data
    const btsData = getAllBTS();
    
    // Calculate bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.element?.remove?.());
    markersRef.current = [];
    circlesRef.current.forEach(circle => circle.setMap(null));
    circlesRef.current = [];

    // Add BTS markers
    btsData.forEach((bts) => {
      const position = { lat: bts.latitude, lng: bts.longitude };
      bounds.extend(position);

      // Draw 400m coverage radius circle
      const circle = new google.maps.Circle({
        map,
        center: position,
        radius: COVERAGE_RADIUS_METERS,
        fillColor: "#FF6B35",
        fillOpacity: 0.15,
        strokeColor: "#FF6B35",
        strokeOpacity: 0.6,
        strokeWeight: 1.5,
        clickable: false,
      });
      circlesRef.current.push(circle);

      // Create marker element
      const markerDiv = document.createElement("div");
      markerDiv.className = `
        w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
        transition-all duration-200 shadow-lg
        ${highlightBTS === bts.id ? "bg-red-500 scale-125" : "bg-primary"}
        hover:scale-110 hover:shadow-xl
      `;
      markerDiv.innerHTML = `
        <div class="w-3 h-3 bg-white rounded-full"></div>
      `;
      markerDiv.title = bts.name;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content: markerDiv,
      });

      // Add click listener
      markerDiv.addEventListener("click", () => {
        setSelectedBTS(bts.id);
        map.panTo(position);
        map.setZoom(15);
      });

      markersRef.current.push(marker);
    });

    // Add user location marker if provided
    if (userLocation) {
      const userMarkerDiv = document.createElement("div");
      userMarkerDiv.className = `
        w-8 h-8 rounded-full flex items-center justify-center
        bg-accent border-4 border-white shadow-lg
      `;
      userMarkerDiv.innerHTML = `
        <div class="w-2 h-2 bg-white rounded-full"></div>
      `;

      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: userLocation,
        content: userMarkerDiv,
      });

      bounds.extend(userLocation);
    }

    // Fit bounds with padding
    map.fitBounds(bounds, { top: 100, right: 50, bottom: 100, left: 50 });

    onMapReady?.(map);
  };

  const btsData = getAllBTS();
  const selectedBTSData = btsData.find(b => b.id === selectedBTS);

  return (
    <div className="space-y-4">
      <div className="relative h-96 rounded-lg overflow-hidden border-2 border-border shadow-lg">
        <MapView
          initialCenter={{ lat: -7.5, lng: 111.5 }}
          initialZoom={9}
          onMapReady={handleMapReady}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <div>
              <p className="text-xs text-muted-foreground">BTS Towers</p>
              <p className="font-semibold text-foreground">{btsData.length} Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20" />
            <div>
              <p className="text-xs text-muted-foreground">Coverage Radius</p>
              <p className="font-semibold text-foreground">400 m</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Your Location</p>
              <p className="font-semibold text-foreground">Your Address</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Selected BTS Info */}
      {selectedBTSData && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-foreground">{selectedBTSData.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Latitude</p>
                <p className="font-mono font-semibold text-foreground">{selectedBTSData.latitude.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Longitude</p>
                <p className="font-mono font-semibold text-foreground">{selectedBTSData.longitude.toFixed(4)}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Coverage Radius</p>
              <p className="font-semibold text-foreground">400 m radius</p>
            </div>
          </div>
        </Card>
      )}

      {/* BTS List */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">All BTS Towers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {btsData.map((bts) => (
            <button
              key={bts.id}
              onClick={() => setSelectedBTS(bts.id)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedBTS === bts.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-foreground"
              }`}
            >
              <p className="text-sm font-semibold">{bts.name}</p>
              <p className="text-xs opacity-75">{bts.latitude.toFixed(2)}, {bts.longitude.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
