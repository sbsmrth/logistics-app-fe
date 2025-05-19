import { useCallback } from "react";
import _debounce from "lodash/debounce";
import Box from "@mui/material/Box";
import { GoogleMap, MapMarker } from "../../map";
import { convertLatLng } from "../../../utils";

type Props = {
  lat?: number;
  lng?: number;
  onDragEnd?: ({ lat, lng }: { lat: number; lng: number }) => void;
};

export const CheckoutMap = ({ lat = 39.66853, lng = -75.67602, onDragEnd }: Props) => {
  const onDragEndDebounced = useCallback(
    _debounce((lat: number, lng: number) => {
      onDragEnd?.({ lat, lng });
    }, 1000),
    [onDragEnd]
  );

  const handleDragEnd = (e: google.maps.FeatureMouseEvent) => {
    const googleLat = e.latLng?.lat();
    const googleLng = e.latLng?.lng();
    if (!googleLat || !googleLng) return;

    const { lat, lng } = convertLatLng({ lat: googleLat, lng: googleLng });

    onDragEndDebounced.cancel();
    onDragEndDebounced(lat, lng);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <GoogleMap
        mapProps={{
          mapId: "checkout-map",
          center: { lat, lng },
        }}
      >
        {lat && lng && (
          <MapMarker
            icon={{ url: "/images/marker-store-pick.svg" }}
            position={{ lat, lng }}
            onDragEnd={handleDragEnd}
          />
        )}
      </GoogleMap>
    </Box>
  );
};
