import { Link } from 'react-router';
import Box from '@mui/material/Box';

import { GeoTrackLogoIcon, GeoTrackLogoText } from '../icons/geotrack-logo';

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={'12px'}
        sx={{
          color: 'text.primary',
        }}
      >
        {collapsed ? (
          <GeoTrackLogoIcon
            style={{
              width: 30,
              height: 30,
            }}
          />
        ) : (
          <>
            <GeoTrackLogoIcon
              style={{
                width: 30,
                height: 30,
              }}
            />
            <GeoTrackLogoText fontWeight={800} variant="h6" />
          </>
        )}
      </Box>
    </Link>
  );
};
