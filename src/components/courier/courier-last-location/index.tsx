import { useRef, useState } from "react";
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

interface CourierLastLocationMapProps {
  locations: Location[];
}

export const CourierLastLocationMap = ({ locations }: CourierLastLocationMapProps): JSX.Element => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const lastLocation = locations[locations.length - 1] || null;

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
          mapId: "courier-last-location-map",
          disableDefaultUI: true,
          center: lastLocation
            ? { lat: lastLocation.lat, lng: lastLocation.lng }
            : { lat: 5.06889, lng: -75.51738 }, // Default center
          zoom: 14,
        }}
      >
        {lastLocation && (
          <AdvancedMarker
            map={map}
            position={{ lat: lastLocation.lat, lng: lastLocation.lng }}
          >
            <img
              src="/images/marker-courier.svg"
              alt="Last Location"
              style={{ width: "32px", height: "32px" }}
            />
            <Card
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
                <Typography variant="h6">Last Location Details</Typography>
                <Divider />
                <Stack direction="row" alignItems="center" gap="8px">
                  <PlaceOutlinedIcon />
                  <Typography py="8px">
                    Latitude: {lastLocation.lat}, Longitude: {lastLocation.lng}
                  </Typography>
                </Stack>
                <Divider />
                <Typography py="8px">Timestamp: {lastLocation.timestamp}</Typography>
              </Box>
            </Card>
          </AdvancedMarker>
        )}
      </GoogleMap>
    </Box>
  );
};