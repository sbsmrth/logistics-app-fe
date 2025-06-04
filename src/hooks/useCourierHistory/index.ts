import { useState } from "react";

export const useCourierHistory = () => {
  const [locations, setLocations] = useState<{ lat: number; lng: number; timestamp: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourierHistory = async (courierId: string, from: string, to: string) => {
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL; // Obtiene la URL base desde el archivo .env
      const response = await fetch(`${baseUrl}/location/${courierId}/history/${encodeURIComponent(from)}/${encodeURIComponent(to)}`);
      console.log("Fetching courier history from:", `${baseUrl}/location/${courierId}/history/${encodeURIComponent(from)}/${encodeURIComponent(to)}`);
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching courier history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { locations, isLoading, fetchCourierHistory };
};