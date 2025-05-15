import * as React from 'react';
import {
  AuthPage as MUIAuthPage,
  ExtendedAuthProps
} from '../../components/pages/auth';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import {
  GeoTrackLogoIcon,
  GeoTrackLogoText,
} from '../../components/icons/geotrack-logo';

const authWrapperProps = {
  style: {
    background:
      "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/auth-bg-image.webp')",
    backgroundSize: 'cover',
    repeat: 'no-repeat',
  },
};

const renderAuthContent = (content: React.ReactNode) => {
  return (
    <div>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="12px"
          marginBottom="16px"
        >
          <GeoTrackLogoIcon
            style={{
              width: 64,
              height: 64,
              color: '#fff',
            }}
          />
          <GeoTrackLogoText
            style={{
              color: '#fff',
            }}
            variant="h3"
            fontWeight={800}
          />
        </Box>
      </Link>
      {content}
    </div>
  );
};

export const AuthPage: React.FC<ExtendedAuthProps> = ({ type, formProps }) => {
  return (
    <MUIAuthPage
      type={type}
      wrapperProps={authWrapperProps}
      renderContent={renderAuthContent}
      formProps={formProps}
      contentProps={{
        sx: {
          backgroundColor: theme => theme.palette.background.default,
        },
      }}
    />
  );
};
