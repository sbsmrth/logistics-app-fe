import type { AuthProvider } from '@refinedev/core';
import { disableAutoLogin } from './hooks';

export const TOKEN_KEY = 'access_token';
const API_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_PHONE = import.meta.env.VITE_ADMIN_PHONE;
import { UserRole } from './types/roles';
import { jwtDecode } from 'jwt-decode';
const DEFAULT_AVATAR = "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740";

interface DecodedToken {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role?: {
    name: UserRole;
  };
}
export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const res = await fetch(API_URL + '/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        current_password: password,
      }),
    });


    if (res.ok) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
    // enableAutoLogin();
    // localStorage.setItem(TOKEN_KEY, `${email}-${password}`);
  },
  register: async ({ fullname, email, password }) => {
    const res = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        current_password: password,
        fullname,
        phone: ADMIN_PHONE,
      }),
    });

    if (res.ok) {
      return {
        success: true,
        user: email,
      };
    } else {
      return {
        success: false,
        error: {
          message: 'Register failed',
          name: 'Error while creating your account',
        },
      };
    }
  },
  forgotPassword: async ({ email }) => {
    const res = await fetch(API_URL + '/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (res.ok) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: {
          message: 'Failed while asking for password reset',
          name: 'Unexpected error',
        },
      };
    }
  },
  updatePassword: async ({ password, token }) => {
    const res = await fetch(API_URL + `/auth/reset-password?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    });

    if (res.ok) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: {
          message: 'Failed while asking for password reset',
          name: 'Unexpected error',
        },
      };
    }
  },
  logout: async () => {
    disableAutoLogin();
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  onError: async error => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: 'Check failed',
        name: 'Token not found',
      },
      logout: true,
      redirectTo: '/login',
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {

      const decoded: DecodedToken = jwtDecode(token);
      console.log("decoded en auth", decoded);
      return {
        id: decoded.id as string,
        name: decoded.name,
        email: decoded.email,
        roleName: decoded.role?.name ,
        avatar: decoded.avatar || DEFAULT_AVATAR,
      };
    } catch (error) {
      console.error("Token inválido:", error);
      return null;
    }
  },
};
