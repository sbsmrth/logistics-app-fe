import { useEffect, useRef } from "react";

interface RouteDrawerProps {
  map?: google.maps.Map;
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}

const coordsChanged = (
  a: google.maps.LatLngLiteral,
  b: google.maps.LatLngLiteral
): boolean => {
  return a.lat !== b.lat || a.lng !== b.lng;
};

const RouteDrawer: React.FC<RouteDrawerProps> = ({ map, origin, destination }) => {
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer>();
  const lastOrigin = useRef<google.maps.LatLngLiteral | null>(null);
  const lastDestination = useRef<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (!map) return;

    const originChanged = !lastOrigin.current || coordsChanged(lastOrigin.current, origin);
    const destinationChanged =
      !lastDestination.current || coordsChanged(lastDestination.current, destination);

    // Solo actualiza si hay cambio real en coordenadas
    if (!originChanged && !destinationChanged) return;

    lastOrigin.current = origin;
    lastDestination.current = destination;

    const directionsService = new google.maps.DirectionsService();

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
      });
      directionsRendererRef.current.setMap(map);
    }

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [map, origin, destination]);

  return null;
};

export default RouteDrawer;
