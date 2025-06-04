import { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { GoogleMap, AdvancedMarker } from "../../map";

interface Location {
  lat: number;
  lng: number;
  timestamp: string;
}

interface CourierHistoryMapProps {
  locations: Location[];
}

export const CourierHistoryMap = ({ locations }: CourierHistoryMapProps): JSX.Element => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const center = locations.length > 0
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: 5.06889, lng: -75.51738 }; // Default center

  useEffect(() => {
    if (map && locations.length > 1) {
      const polyline = new google.maps.Polyline({
        path: locations.map((loc) => ({ lat: loc.lat, lng: loc.lng })),
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      polyline.setMap(map);

      return () => {
        polyline.setMap(null); // Limpia la línea cuando el componente se desmonta
      };
    }
  }, [map, locations]);

  return (
    <Box
      ref={parentRef}
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <GoogleMap
        mapProps={{
          setMap: (mapInstance) => setMap(mapInstance),
          mapId: "courier-history-map",
          disableDefaultUI: true,
          center,
          zoom: 12,
        }}
      >
        {locations.map((location, index) => (
          <AdvancedMarker
            key={index}
            map={map}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
          >
            <img
              src="/images/marker-courier.svg"
              alt={`Location ${index}`}
              style={{ width: "32px", height: "32px" }}
            />
            {selectedLocation?.timestamp === location.timestamp && (
              <Card
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLocation(null);
                }}
                sx={{
                  padding: "16px",
                  position: "absolute",
                  bottom: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  backgroundColor: "white",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Box>
                  <Typography variant="h6">Location Details</Typography>
                  <Divider />
                  <Stack direction="row" alignItems="center" gap="8px">
                    <PlaceOutlinedIcon />
                    <Typography py="8px">
                      Latitude: {location.lat}, Longitude: {location.lng}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Typography py="8px">Timestamp: {location.timestamp}</Typography>
                </Box>
              </Card>
            )}
          </AdvancedMarker>
        ))}
      </GoogleMap>
    </Box>
  );
};