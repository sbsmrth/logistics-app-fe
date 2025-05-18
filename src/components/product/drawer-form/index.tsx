import {
  type HttpError,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from '@refinedev/core';
import { DeleteButton, useAutocomplete } from '@refinedev/mui';
import { useSearchParams } from 'react-router';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Drawer, DrawerHeader } from '../../../components';
import type { ICategory, IProduct, Nullable } from '../../../interfaces';

type Props = {
  action: 'create' | 'edit';
};

export const ProductDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();

  const onDrawerCLose = () => {
    go({
      to:
        searchParams.get('to') ??
        getToPath({
          action: 'list',
        }) ??
        '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: 'replace',
    });
  };

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    refineCore: { onFinish, id, formLoading },
    saveButtonProps,
  } = useForm<IProduct, HttpError, Nullable<IProduct>>({
    defaultValues: {
      name: '',
      description: '',
      unitPrice: 0,
      categoryId: null,
      status: 'ACTIVE',
      weight: 0,
      dimensionsCm: '',
      dateOfExpiration: undefined,
      requiredRefrigeration: false,
      isFragile: false,
      barCode: '',
    },
    refineCoreProps: {
      redirect: false,
      onMutationSuccess: () => {
        if (props.action === 'create') {
          onDrawerCLose();
        }
      },
    },
  });

  const { autocompleteProps } = useAutocomplete<ICategory>({
    resource: 'categories',
  });

  return (
    <Drawer
      PaperProps={{ sx: { width: { sm: '100%', md: '416px' } } }}
      open
      anchor="right"
      onClose={onDrawerCLose}
    >
      <DrawerHeader
        title={t('products.actions.edit')}
        onCloseClick={onDrawerCLose}
      />
      <form onSubmit={handleSubmit(data => onFinish(data))}>
        <Paper sx={{ marginTop: '32px' }}>
          <Stack padding="24px" spacing="24px">
            {/* Name */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: t('errors.required.field', {
                    field: 'name',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    id="name"
                    label={t('products.fields.name')}
                    placeholder={t('products.fields.name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormControl>

            {/* Iamge url */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="imageUrl"
                rules={{
                  required: t('errors.required.field', {
                    field: 'imageUrl',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    id="imageUrl"
                    label={t('products.fields.imageUrl')}
                    placeholder={t('products.fields.imageUrl')}
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                  />
                )}
              />
            </FormControl>

            {/* Description */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="description"
                rules={{
                  required: t('errors.required.field', {
                    field: 'description',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    id="description"
                    label={t('products.fields.description')}
                    placeholder={t('products.fields.description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </FormControl>

            {/* Price */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="unitPrice"
                rules={{
                  required: t('errors.required.field', {
                    field: 'price',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    id="price"
                    label={t('products.fields.price')}
                    placeholder={t('products.fields.price')}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    error={!!errors.unitPrice}
                    helperText={errors.unitPrice?.message}
                  />
                )}
              />
            </FormControl>

            {/* Category */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="categoryId"
                rules={{
                  required: t('errors.required.field', {
                    field: 'categoryId',
                  }),
                }}
                render={({ field }) => (
                  <Autocomplete<ICategory>
                    id="category"
                    options={autocompleteProps?.options ?? []}
                    getOptionLabel={option => option?.name ?? ''}
                    isOptionEqualToValue={(option, value) =>
                      option?.id?.toString() === value?.toString()
                    }
                    value={
                      autocompleteProps?.options?.find(
                        option =>
                          option?.id?.toString() === field.value?.toString()
                      ) ?? null
                    }
                    onChange={(_, value) => {
                      field.onChange(value?.id ?? null);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Category"
                        margin="normal"
                        variant="outlined"
                        error={!!errors.categoryId}
                        helperText={errors.categoryId?.message}
                        required
                      />
                    )}
                  />
                )}
              />
            </FormControl>

            {/* isActive */}
            <FormControl>
              <FormLabel>{t('products.fields.isActive.label')}</FormLabel>
              <Controller
                control={control}
                name="status"
                rules={{
                  validate: value => {
                    if (value === undefined) {
                      return t('errors.required.field', {
                        field: 'isActive',
                      });
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <ToggleButtonGroup
                    id="isActive"
                    {...field}
                    exclusive
                    color="primary"
                    onChange={(_, newValue) =>
                      setValue('status', newValue ? 'ACTIVE' : 'INACTIVE', {
                        shouldValidate: true,
                      })
                    }
                  >
                    <ToggleButton value="ACTIVE">
                      {t('products.fields.isActive.true')}
                    </ToggleButton>
                    <ToggleButton value="INACTIVE">
                      {t('products.fields.isActive.false')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              {errors.status && (
                <FormHelperText error>{errors.status.message}</FormHelperText>
              )}
            </FormControl>

            {/* Weight */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="weight"
                rules={{
                  required: t('errors.required.field', {
                    field: 'weight',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Weight (kg)"
                    type="number"
                    placeholder="Enter weight"
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                )}
              />
            </FormControl>

            {/* Dimensions */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="dimensionsCm"
                rules={{
                  required: t('errors.required.field', {
                    field: 'dimensions',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Dimensions (cm)"
                    placeholder="e.g. 30x20x10"
                    error={!!errors.dimensionsCm}
                    helperText={errors.dimensionsCm?.message}
                  />
                )}
              />
            </FormControl>

            {/* Barcode */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="barCode"
                rules={{
                  required: t('errors.required.field', {
                    field: 'barcode',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Barcode"
                    placeholder="e.g. 1234567890123"
                    error={!!errors.barCode}
                    helperText={errors.barCode?.message}
                  />
                )}
              />
            </FormControl>

            {/* Date of Expiration */}
            <FormControl fullWidth>
              <Controller
                control={control}
                name="dateOfExpiration"
                rules={{
                  required: t('errors.required.field', {
                    field: 'expiration date',
                  }),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiration Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfExpiration}
                    helperText={errors.dateOfExpiration?.message}
                  />
                )}
              />
            </FormControl>

            {/* Refrigeration */}
            <FormControlLabel
              control={
                <Controller
                  name="requiredRefrigeration"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value || false} />
                  )}
                />
              }
              label="Requires Refrigeration"
            />

            {/* Fragile */}
            <FormControlLabel
              control={
                <Controller
                  name="isFragile"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value || false} />
                  )}
                />
              }
              label="Fragile"
            />
          </Stack>
        </Paper>

        {/* Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          padding="16px 24px"
        >
          <Button variant="text" color="inherit" onClick={onDrawerCLose}>
            {t('buttons.cancel')}
          </Button>
          {props.action === 'edit' && (
            <DeleteButton
              recordItemId={id}
              variant="contained"
              onSuccess={() => onDrawerCLose()}
            />
          )}
          <Button {...saveButtonProps} variant="contained">
            {t('buttons.save')}
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};
