import { useList, useNavigation, useTranslate } from "@refinedev/core";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { GoogleMap, AdvancedMarker } from "../../map";
import type { ICourier } from "../../../interfaces"; // Asume que defines esta interfaz

export const AllCouriersMap = () => {
  const t = useTranslate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [selectedCourier, setSelectedCourier] = useState<ICourier | null>(null);
  const { edit } = useNavigation();

  const { data: courierData } = useList<ICourier>({
    resource: "couriers",
    pagination: {
      mode: "off",
    },
  });

  const couriers = courierData?.data || [];

  const handleMarkerClick = (courier: ICourier) => {
    setSelectedCourier(courier);
  };

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
          setMap,
          mapId: "all-couriers-map",
          disableDefaultUI: true,
          center: {
            lat: 4.7110,
            lng: -74.0721,
          },
          zoom: 7,
        }}
      >
        {couriers.map((courier) => {
          const lat = courier.address.latitude
          const lng = courier.address.longitude

          if (!lat || !lng) return null;

          return (
            <AdvancedMarker
              key={courier.id}
              map={map}
              zIndex={selectedCourier?.id === courier.id ? 1 : 0}
              position={{ lat, lng }}
              onClick={() => handleMarkerClick(courier)}
            >
              {(selectedCourier?.id !== courier.id || !selectedCourier) && (
                <img src="/images/marker-courier.svg" alt={courier.name} />
              )}

              {selectedCourier?.id === courier.id && (
                <Card
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourier(null);
                  }}
                  sx={{
                    padding: "16px",
                    position: "relative",
                    marginBottom: "16px",
                  }}
                >
                  <Box
                    onClick={() => edit("couriers", selectedCourier.id)}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">{courier.name}</Typography>
                    {/* Aquí podrías mostrar estado del courier si está disponible */}
                    Courier status :3
                  </Box>

                  <Box mt="16px" color="text.secondary">
                    <Divider />
                    {courier.address?.text && (
                      <>
                        <Stack direction="row" alignItems="center" gap="8px">
                          <PlaceOutlinedIcon />
                          <Typography py="8px">{courier.address.text}</Typography>
                        </Stack>
                        <Divider />
                      </>
                    )}
                    {courier.email && (
                      <>
                        <Stack direction="row" alignItems="center" gap="8px">
                          <AccountCircleOutlinedIcon />
                          <Typography py="8px">{courier.email}</Typography>
                        </Stack>
                        <Divider />
                      </>
                    )}
                    {courier.gsm && (
                      <Stack direction="row" alignItems="center" gap="8px">
                        <LocalPhoneOutlinedIcon />
                        <Typography py="8px">{courier.gsm}</Typography>
                      </Stack>
                    )}
                  </Box>
                </Card>
              )}
            </AdvancedMarker>
          );
        })}
      </GoogleMap>
    </Box>
  );
};
