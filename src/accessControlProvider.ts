import type { AccessControlProvider } from '@refinedev/core';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY } from './authProvider';

interface DecodedToken {
  role?: {
    name: string;
  };
  userId?: string;
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action, resource, params }) => {
    if (resource === 'login') {
      return { can: true };
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return { can: false };

    const decoded: DecodedToken = jwtDecode(token);
    const role = decoded.role?.name;

    if (!role) return { can: false };

    // ADMINISTRADOR tiene acceso total
    if (role === 'ADMINISTRADOR') return { can: true };

    // GERENTE tiene acceso a todo menos usuarios y couriers
    if (role === 'GERENTE') {
      if (resource && ['users', 'couriers'].includes(resource))
        return { can: false };
      return { can: true };
    }

    // DESPACHADOR puede ver y gestionar orders, products y categories
    if (role === 'DESPACHADOR') {
      if (
        resource &&
        ['orders', 'products', 'categories', 'dashboard'].includes(resource)
      ) {
        return { can: true };
      }
      return { can: false };
    }

    // REPARTIDOR solo puede ver couriers (su info)
    if (role === 'REPARTIDOR') {
      if (resource === 'couriers' && action === 'list') return { can: true };
      if (resource === 'dashboard') return { can: true };
      return { can: false };
    }

    // CLIENTE puede ver solo sus orders, y leer productos y categorías
    if (role === 'CLIENTE') {
      if (resource === 'orders' && action === 'list' && params?.id) {
        // Aquí podrías filtrar en el backend los pedidos por userId
        return { can: true };
      }
      if (resource && ['dashboard'].includes(resource)) {
        return { can: true };
      }
      return { can: false };
    }

    return {
      can: false,
      reason: 'No tienes permiso',
    };
  },
};
