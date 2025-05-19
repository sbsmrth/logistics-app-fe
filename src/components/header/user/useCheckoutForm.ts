import { useForm } from "@refinedev/react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import {
  convertLatLng,
  type LatLng,
  getAddressWithLatLng,
  getLatLngWithAddress,
} from "../../../utils";
import { useEffect, useState } from "react";
import type { IAddress } from "../../../interfaces";

export const useCheckoutForm = () => {
  const form = useForm<{ address: IAddress }>({
    defaultValues: {
      address: {
        text: "",
        coordinate: [],
      },
    },
  });

  const [latLng, setLatLng] = useState<Partial<LatLng>>({
    lat: 39.66853,
    lng: -75.67602,
  });

  const [debouncedAddress, setDebouncedAddress] = useDebounceValue(
    form.getValues("address.text"),
    500
  );

  useEffect(() => {
    if (debouncedAddress) {
      getLatLngWithAddress(debouncedAddress).then((data) => {
        if (data) {
          const { lat, lng } = convertLatLng(data);
          form.setValue("address.coordinate", [lat, lng]);
          setLatLng({ lat, lng });
        }
      });
    }
  }, [debouncedAddress]);

  const handleMapOnDragEnd = async ({ lat, lng }: LatLng) => {
    const data = await getAddressWithLatLng({ lat, lng });
    if (data) {
      form.setValue("address.text", data.address);
      form.setValue("address.coordinate", [lat, lng]);
      setLatLng({ lat, lng });
    }
  };

  return {
    ...form,
    latLng,
    handleAddressChange: (address: string) => setDebouncedAddress(address),
    handleMapOnDragEnd,
  };
};
