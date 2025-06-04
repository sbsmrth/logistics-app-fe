import { useEffect } from "react";

interface PolylineProps {
  map?: google.maps.Map;
  path: google.maps.LatLngLiteral[];
  options?: google.maps.PolylineOptions;
}

const Polyline = ({ map, path, options }: PolylineProps) => {
  useEffect(() => {
    if (!map || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path,
      ...options,
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null); // Limpia la línea cuando el componente se desmonta
    };
  }, [map, path, options]);

  return null; // Este componente no necesita renderizar nada en React
};

export default Polyline;