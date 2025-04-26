import React from 'react';
import geolocalization from '../../img/geolocalizacion.png';
import Typography from '@mui/material/Typography';
import { TypographyProps } from '@mui/material';

export const GeoTrackLogoIcon: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = props => (
  <img
    src={geolocalization}
    alt="Geotrack"
    style={{
      width: 64,
      height: 64,
    }}
    {...props}
  />
);

export const GeoTrackLogoText: React.FC<TypographyProps> = props => {
  return <Typography {...props}>GeoTrack</Typography>;
};
