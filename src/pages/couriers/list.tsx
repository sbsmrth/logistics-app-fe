import React, { useMemo, useState } from "react";
import {
  CanAccess,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  CreateButton,
  EditButton,
  useDataGrid,
} from "@refinedev/mui";
import { useLocation } from "react-router";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { AllCouriersMap } from "../../components/courier/map/all-couriers-map";
import { type PropsWithChildren } from "react";

import {
  CourierRating,
  CourierStatus,
  RefineListView
} from "../../components";
import type { ICourier } from "../../interfaces";
import { Unauthorized } from "../../components/unauthorized";
import { Button } from "@mui/material";
import { useFileExport } from "../../hooks/useFileExport/index";

type View = "table" | "map";

export const CourierList = ({children}: PropsWithChildren) => {
  const [view, setView] = useState<View>(() => {
    const stored = localStorage.getItem("courier-view") as View;
    return stored || "table";
  });

  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl, replace } = useNavigation();
  const t = useTranslate();

  const { dataGridProps } = useDataGrid<ICourier>({
    pagination: {
      pageSize: 10,
    },
  });

  const { isLoading, triggerExport } = useFileExport("couriers");

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    newView: View
  ) => {
    replace(""); // Limpia filtros/paginación
    setView(newView);
    localStorage.setItem("courier-view", newView);
  };

  const columns = useMemo<GridColDef<ICourier>[]>(() => [
    {
      field: "id",
      headerName: "ID #",
      width: 64,
      renderCell: ({ row }) => <Typography>#{row.id}</Typography>,
    },
    {
      field: "name",
      width: 188,
      headerName: t("couriers.fields.name.label"),
    },
    {
      field: "licensePlate",
      width: 112,
      headerName: t("couriers.fields.licensePlate.label"),
    },
    {
      field: "gsm",
      width: 132,
      headerName: t("couriers.fields.gsm.label"),
    },
    {
      field: "store",
      minWidth: 156,
      flex: 1,
      headerName: t("couriers.fields.store.label"),
      renderCell: ({ row }) => <Typography>{row.store?.name}</Typography>,
    },
    {
      field: "rating",
      width: 156,
      headerName: t("couriers.fields.rating.label"),
      renderCell: ({ row }) => <CourierRating courier={row} />,
    },
    {
      field: "status",
      width: 156,
      headerName: t("couriers.fields.status.label"),
      renderCell: ({ row }) => <CourierStatus value={row?.status} />,
    },
    {
      field: "download",
      headerName: t("couriers.fields.download.label"),
      width: 200,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => triggerExport("pdf", String(row.id))}
            disabled={isLoading}
          >
            {t("couriers.actions.downloadPdf")}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => triggerExport("excel", String(row.id))}
            disabled={isLoading}
          >
            {t("couriers.actions.downloadExcel")}
          </Button>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: t("table.actions"),
      type: "actions",
      renderCell: ({ row }) => (
        <EditButton
          hideText
          recordItemId={row.id}
          svgIconProps={{ color: "action" }}
        />
      ),
    },
  ], [t]);

  return (
    <CanAccess resource="couriers" action="list" fallback={<Unauthorized />}>
      <RefineListView
        headerButtons={() => [
          <ToggleButtonGroup
            key="view-toggle"
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
          >
            <ToggleButton value="table" aria-label="table view" size="small">
              <ListOutlinedIcon />
            </ToggleButton>
            <ToggleButton value="map" aria-label="map view" size="small">
              <PlaceOutlinedIcon />
            </ToggleButton>
          </ToggleButtonGroup>,
          <CreateButton
            key="create"
            variant="contained"
            size="medium"
            sx={{ height: "40px" }}
            onClick={() => {
              go({
                to: `${createUrl("couriers")}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          >
            {t("couriers.actions.add")}
          </CreateButton>,
        ]}
      >
        <>
          {view === "table" && (
            <DataGrid
              {...dataGridProps}
              columns={columns}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          )
          }
          {
            view === "map" && (
              <Box sx={{ height: "calc(100dvh - 232px)", marginTop: "32px" }}>
                <AllCouriersMap />
              </Box>
            )
          }
        </>
      </RefineListView>
      {children}
    </CanAccess>
  );
};
