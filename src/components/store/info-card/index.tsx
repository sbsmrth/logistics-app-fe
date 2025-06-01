import type { ReactNode } from "react";
import { useTranslate } from "@refinedev/core";
import {
  Box,
  Divider,
  Paper,
  Skeleton,
  type SxProps,
  useTheme,
} from "@mui/material";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import type { IStore } from "../../../interfaces";
import { StoreStatus } from "../status";
import FmdGoodIcon from '@mui/icons-material/FmdGood';

type Props = {
  store?: IStore;
};

export const StoreInfoCard = (props: Props) => {
  const t = useTranslate();
  const { address, zipCode, capacity, status } = props?.store || {};

  return (
    <Paper>
      <Info
        icon={
          <ArrowDropDownCircleOutlinedIcon
            sx={{
              transform: "rotate(-90deg)",
            }}
          />
        }
        label={t("products.fields.isActive.label")}
        value={<StoreStatus value={status === 'ACTIVE'} size="small" />}
      />
      <Divider />
      <Info
        icon={<PlaceOutlinedIcon />}
        label={t("stores.fields.address")}
        value={address}
        sx={{
          height: "80px",
        }}
      />
      <Divider />
      <Info
        icon={<FmdGoodIcon />}
        label={t("stores.fields.zipCode")}
        value={zipCode}
      />
      <Divider />
      <Info
        icon={<PhoneOutlinedIcon />}
        label={t("stores.fields.capacity")}
        value={capacity}
      />
    </Paper>
  );
};

type InfoProps = {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  sx?: SxProps;
};

const Info = ({ icon, label, value, sx }: InfoProps) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          p: "16px 0px 16px 24px",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          mr: "8px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          color: palette.primary.main,
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          mr: "8px",
          display: "flex",
          alignItems: "center",
          width: "112px",
        }}
      >
        {label}
      </Box>
      {value ?? (
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "200px" }} />
      )}
    </Box>
  );
};
