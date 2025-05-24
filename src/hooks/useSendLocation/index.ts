import { useEffect, useRef } from 'react';
import { useApiUrl, useGetIdentity } from '@refinedev/core';
import { IIdentity } from '../../interfaces';

export const useSendLocation = () => {
  const { data: user } = useGetIdentity<IIdentity>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const apiUrl = useApiUrl();

  useEffect(() => {
    if (user?.roleName !== 'Cliente') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          try {
            await fetch(`${apiUrl}/updateCourierPosition`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.id,
                latitude,
                longitude,
              }),
            });
          } catch (error) {
            console.error('Error enviando ubicación:', error);
          }
        },
        error => {
          console.error('No se pudo obtener la ubicación', error);
        }
      );
    };

    sendLocation(); // Enviar una vez al montar

    intervalRef.current = setInterval(sendLocation, 30000); // Cada 30s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);
};
