import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { type HttpError, useList, useTranslate } from '@refinedev/core';
import { useDataGrid, CreateButton } from '@refinedev/mui';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  RefineListView,
  CategoryStatus,
  CustomTooltip,
} from '../../components';
import { CategoryDrawerForm } from './create'; // importa tu nuevo componente
import type { ICategory, IProduct } from '../../interfaces';

export const CategoryList = () => {
  const t = useTranslate();
  const [searchParams] = useSearchParams();
  const isCreateDrawerOpen = searchParams.get('drawer') === 'create';

  const navigate = useNavigate();

  const { dataGridProps } = useDataGrid<ICategory, HttpError>({
    pagination: {
      mode: 'off',
    },
  });

  const { data: productsData = { data: [] }, isLoading: productsIsLoading } =
    useList<IProduct, HttpError>({
      resource: 'products',
      pagination: {
        mode: 'off',
      },
    });

  const products = productsData?.data || [];

  const columns = useMemo<GridColDef<ICategory>[]>(
    () => [
      {
        field: 'name',
        headerName: t('pages.categories.fields.name'),
        width: 232,
      },
      {
        field: 'description',
        headerName: t('pages.categories.fields.description'),
        flex: 1,
        renderCell: ({ row }) => {
          const description = row.description || '';
          const shortDescription =
            description.length > 50
              ? description.slice(0, 50) + '...'
              : description;
          return <span>{shortDescription}</span>;
        },
      },
      {
        field: 'product',
        headerName: t('pages.categories.fields.products'),
        flex: 1,
        display: 'flex',
        renderCell: function render({ row }) {
          const categoryProducts = products.filter(
            product => product.categoryId === row.id
          );
          return (
            <Box display="flex" alignItems="center" gap="8px" flexWrap="wrap">
              {productsIsLoading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    sx={{ width: '32px', height: '32px' }}
                    variant="rectangular"
                  />
                ))}

              {!productsIsLoading &&
                categoryProducts.map(product => {
                  const image = product.imageUrl;
                  // const thumbnailUrl = image?.thumbnailUrl || image?.url;
                  const thumbnailUrl = image;
                  return (
                    <CustomTooltip key={product.id} title={product.name}>
                      <Avatar
                        sx={{ width: '32px', height: '32px' }}
                        variant="rounded"
                        alt={product.name}
                        src={thumbnailUrl}
                      />
                    </CustomTooltip>
                  );
                })}
            </Box>
          );
        },
      },
      {
        field: 'isActive',
        headerName: t('categories.fields.isActive.label'),
        width: 116,
        display: 'flex',
        renderCell: function render({ row }) {
          return <CategoryStatus value={row.isActive!} />;
        },
      },
    ],
    [t, products, productsIsLoading]
  );

  return (
    <RefineListView
      headerButtons={({ defaultButtons }) => (
        <Stack direction="row" spacing={1}>
          {defaultButtons}
          <CreateButton
            onClick={() => {
              const current = new URLSearchParams(searchParams);
              current.set('drawer', 'create');
              navigate(`${window.location.pathname}?${current.toString()}`, {
                replace: true,
              });
            }}
          />
        </Stack>
      )}
    >
      <DataGrid {...dataGridProps} columns={columns} hideFooter />
      {isCreateDrawerOpen && <CategoryDrawerForm action="create" />}
    </RefineListView>
  );
};
