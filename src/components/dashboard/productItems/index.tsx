import { useMemo } from 'react';
import { useGo, useList, useTranslate } from '@refinedev/core';
import {
  NumberField,
  useDataGrid,
  type UseDataGridReturnType,
} from '@refinedev/mui';
import Typography from '@mui/material/Typography';
import type { IAvaliableProducts, ICategory } from '../../../interfaces';
import { useLocation } from 'react-router';
import { ProductStatus } from '../../product';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { createSvgIcon } from '@mui/material';
import { useProductsStore } from '../../../store/productItems';

type Props = {
  categories: ICategory[];
} & UseDataGridReturnType<IAvaliableProducts>;

export const ProductsWrapper = () => {
  // const dataGrid = useDataGrid<IProduct>({
  //   resource: 'products',
  //   pagination: {
  //     pageSize: 12,
  //   },
  // });

  const dataGrid = useDataGrid<IAvaliableProducts>({
    resource: 'inventories/available-products',
    pagination: {
      pageSize: 12,
    },
  });

  const { data: categoriesData } = useList<ICategory>({
    resource: 'categories',
    pagination: {
      mode: 'off',
    },
  });
  const categories = categoriesData?.data || [];

  return <ProductItems {...dataGrid} categories={categories} />;
};
1;

const ProductItems = (props: Props) => {
  const go = useGo();
  const { pathname } = useLocation();
  const t = useTranslate();
  const products = props.tableQueryResult?.data?.data || [];
  const addProduct = useProductsStore(state => state.addProduct);

  const PlusIcon = createSvgIcon(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    'Plus'
  );

  const categoryFilters = useMemo(() => {
    const filter = props.filters.find(filter => {
      if ('field' in filter) {
        return filter.field === 'category.id';
      }
      return false;
    });

    const filterValues = filter?.value?.map((value: string | number) =>
      Number(value)
    );

    return {
      operator: filter?.operator || 'in',
      value: (filterValues || []) as number[],
    };
  }, [props.filters]).value;

  const hasCategoryFilter = categoryFilters?.length > 0;

  const handleOnTagClick = (categoryId: number) => {
    const newFilters = [...categoryFilters];
    const hasCurrentFilter = newFilters.includes(categoryId);
    if (hasCurrentFilter) {
      newFilters.splice(newFilters.indexOf(categoryId), 1);
    } else {
      newFilters.push(categoryId);
    }

    props.setFilters([
      {
        field: 'category.id',
        operator: 'in',
        value: newFilters,
      },
    ]);
    props.setCurrent(1);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing="12px"
        py="16px"
        flexWrap="wrap"
        useFlexGap
        rowGap="8px"
      >
        <Chip
          color={hasCategoryFilter ? undefined : 'primary'}
          sx={{
            color: hasCategoryFilter ? undefined : 'white',
          }}
          label={`🏷️ ${t('products.filter.allCategories.label')}`}
          onClick={() => {
            props.setFilters([
              {
                field: 'category.id',
                operator: 'in',
                value: [],
              },
            ]);
            props.setCurrent(1);
          }}
        />
        {props.categories.map(category => (
          <Chip
            key={category.id}
            label={category.name}
            color={
              categoryFilters?.includes(category.id) ? 'primary' : undefined
            }
            sx={{
              color: categoryFilters?.includes(category.id)
                ? 'white'
                : undefined,
            }}
            onClick={() => handleOnTagClick(category.id)}
          />
        ))}
      </Stack>

      <Divider />

      <Grid container spacing={3} sx={{ marginTop: '24px' }}>
        {products?.map(product => {
          const category = props.categories.find(
            c => c.id === product.categoryId
          );

          return (
            <Grid
              key={product.productId + product.storeLatitude}
              size={{
                sm: 3,
                md: 4,
                lg: 3,
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardActionArea
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'normal',
                  }}
                >
                  <Box>
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.imageUrl}
                      alt={product.productName}
                    />
                  </Box>

                  <CardContent>
                    <Stack
                      mb="8px"
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {product.productName}
                      </Typography>
                      <NumberField
                        variant="body1"
                        fontWeight={500}
                        value={product.unitPrice}
                        options={{ style: 'currency', currency: 'USD' }}
                      />
                    </Stack>
                    <Typography color="text.secondary">
                      {product.productDescription}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <CardActions
                  sx={{
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    marginTop: 'auto',
                    borderTop: '1px solid',
                    borderColor: theme => theme.palette.divider,
                  }}
                >
                  <Chip
                    size="small"
                    variant="outlined"
                    sx={{ backgroundColor: 'transparent' }}
                    label={category?.name}
                  />
                  <ProductStatus size="small" value={true} />
                  <PlusIcon
                    color="secondary"
                    onClick={() => addProduct(product)}
                    sx={{ cursor: 'pointer' }}
                  />
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ marginTop: '24px' }} />

      <TablePagination
        component="div"
        count={props.dataGridProps.rowCount}
        page={props.dataGridProps.paginationModel?.page || 0}
        rowsPerPage={props.dataGridProps.paginationModel?.pageSize || 12}
        rowsPerPageOptions={[12, 24, 48, 96]}
        onRowsPerPageChange={e => {
          props.setPageSize(+e.target.value);
        }}
        onPageChange={(_e, page) => {
          props.setCurrent(page + 1);
        }}
      />
    </>
  );
};
