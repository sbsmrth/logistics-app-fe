import { useMemo } from 'react';
import { useNavigation, useTranslate } from '@refinedev/core';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  EditButton,
  ShowButton,
  TextFieldComponent,
  useDataGrid,
} from '@refinedev/mui';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { StoreStatus } from '../../../components';
import type { IStore } from '../../../interfaces';

export const StoreTable = () => {
  const t = useTranslate();
  const { edit } = useNavigation();

  const { dataGridProps } = useDataGrid<IStore>({
    initialPageSize: 10,
  });

  const columns = useMemo<GridColDef<IStore>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID #',
        width: 72,
        display: 'flex',
        renderCell: function render({ row }) {
          return <Typography>#{row.id}</Typography>;
        },
      },
      {
        field: 'name',
        headerName: t('stores.fields.title'),
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'address',
        headerName: t('stores.fields.address'),
        flex: 2,
        width: 356,
        display: 'flex',
        renderCell: function render({ row }) {
          return <TextFieldComponent value={row.address} />;
        },
      },
      // {
      //   field: "email",
      //   headerName: t("stores.fields.email"),
      //   minWidth: 188,
      // },
      {
        field: 'capacity',
        headerName: t('stores.fields.capacity'),
        minWidth: 110,
      },
      {
        field: 'zipCode',
        headerName: t('stores.fields.zipCode'),
        minWidth: 132,
      },
      {
        field: 'isActive',
        headerName: t('stores.fields.isActive.label'),
        width: 110,
        display: 'flex',
        renderCell: function render({ row }) {
          return <StoreStatus value={row.status === 'ACTIVE'} />;
        },
      },
      {
        field: 'actions',
        headerName: t('table.actions'),
        type: 'actions',
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        renderCell: function render({ row }) {
          return (
            <IconButton
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => edit('stores', row.id)}
            >
              <VisibilityOutlined color="action" />
            </IconButton>
          );
        },
      },
    ],
    [t]
  );

  return (
    <DataGrid
      {...dataGridProps}
      disableColumnSelector
      columns={columns}
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
};
