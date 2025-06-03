import React from 'react';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  UpdatePasswordPage,
} from './components';
import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';
import type { AuthPageProps, RegisterFormTypes } from '@refinedev/core';
import type { UseFormProps } from '@refinedev/react-hook-form';
import { AccountVerifyPage } from './components/accountVerify';

export interface FormPropsType extends UseFormProps {
  onSubmit?: (values: RegisterFormTypes) => void;
}

export type ExtendedAuthTypes =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'updatePassword'
  | 'verify';

export interface ExtendedAuthProps
  extends Omit<AuthPageProps<BoxProps, CardProps, FormPropsType>, 'type'> {
  type?: ExtendedAuthTypes;
}

/**
 * **refine** has a default auth page form served on the `/login` route when the `authProvider` configuration is provided.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/} for more details.
 */
export const AuthPage: React.FC<ExtendedAuthProps> = props => {
  const { type } = props;
  const renderView = () => {
    switch (type) {
      case 'register':
        return <RegisterPage {...props} />;
      case 'forgotPassword':
        return <ForgotPasswordPage {...props} />;
      case 'updatePassword':
        return <UpdatePasswordPage {...props} />;
      case 'verify':
        return <AccountVerifyPage {...props} />;
      default:
        return <LoginPage {...props} />;
    }
  };

  return <>{renderView()}</>;
};
