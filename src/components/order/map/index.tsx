import { GoogleMap, MapMarker } from '../../map';
import type { IOrder } from '../../../interfaces';
import RouteDrawer from '../../map/route-drawer';

type Props = {
  order?: IOrder;
  userRole?: string;
};

export const OrderDeliveryMap = ({ order, userRole }: Props) => {
  return (
    <GoogleMap
      mapProps={{
        center: {
          lat: order?.courier?.address?.latitude || 0,
          lng: order?.courier?.address?.longitude || 0,
        },
        zoom: 15,
      }}
    >
      <MapMarker
        key={`user-marker-${order?.user.id}`}
        icon={{
          url: '/images/marker-customer.svg',
        }}
        position={{
          // lat: order?.store?.address?.latitude || 0,
          // lng: order?.store?.address?.longitude || 0,

          lat: order?.address?.latitude || 0,
          lng: order?.address?.longitude || 0
        }}
      />
      <MapMarker
        key={`courier-marker-${order?.user.id}`}
        icon={{
          url: '/images/marker-courier.svg',
        }}
        position={{
          // lat: Number(order?.store.address.latitude),
          // lng: Number(order?.store.address.longitude),
          lat: order?.courier?.address?.latitude || 0,
          lng: order?.courier?.address?.longitude || 0,
        }}
      />
      {userRole === 'ADMIN' && (
        <MapMarker
          key={`store-marker-${order?.store.id}`}
          icon={{
            url: '/images/marker-store.svg',
          }}
          position={{
            lat: order?.store?.address?.latitude || 0,
            lng: order?.store?.address?.longitude || 0,
          }}
        />
      )}
      {userRole === 'REPARTIDOR' && (
        <RouteDrawer
          origin={{ lat: order?.courier?.address?.latitude!, lng: order?.courier?.address?.longitude! }}
          destination={{ lat: order?.address?.latitude!, lng: order?.address?.longitude! }}
        />
      )}
    </GoogleMap>
  );
};
