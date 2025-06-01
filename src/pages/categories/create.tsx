import {
  CanAccess,
  type HttpError,
  useGetToPath,
  useGo,
  useTranslate,
} from '@refinedev/core';
import { DeleteButton } from '@refinedev/mui';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormLabel from '@mui/material/FormLabel';
import { Drawer, DrawerHeader } from '../../components'; // ajusta el path según tu estructura
import type { ICategory, Nullable } from '../../interfaces';
import { Unauthorized } from '../../components/unauthorized';

type Props = {
  action: 'create' | 'edit';
};

export const CategoryDrawerForm = (props: Props) => {
  const [searchParams] = useSearchParams();
  const t = useTranslate();

  const navigate = useNavigate();

  const onDrawerCLose = () => {
    const current = new URLSearchParams(searchParams);
    current.delete('drawer');
    navigate(`${window.location.pathname}?${current.toString()}`, {
      replace: true,
    });
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    refineCore: { onFinish, id, formLoading },
    saveButtonProps,
  } = useForm<ICategory, HttpError, Nullable<ICategory>>({
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
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

  return (
    <CanAccess
      resource="categories"
      action="create"
      fallback={<Unauthorized />}
    >
      <Drawer
        PaperProps={{ sx: { width: { sm: '100%', md: '416px' } } }}
        open
        anchor="right"
        onClose={onDrawerCLose}
      >
        <DrawerHeader
          title={
            props.action === 'create'
              ? t('pages.categories.new')
              : t('categories.titles.edit')
          }
          onCloseClick={onDrawerCLose}
        />
        <form
          onSubmit={handleSubmit(data => {
            const { isActive, ...remaingData } = data;
            console.log('remaingData', remaingData);
            onFinish(remaingData);
          })}
        >
          <Paper sx={{ marginTop: '32px' }}>
            <Stack padding="24px" spacing="24px">
              {/* Campo nombre */}
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
                      label={t('pages.categories.fields.name')}
                      placeholder={t('pages.categories.fields.name')}
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText error>{errors.name.message}</FormHelperText>
                )}
              </FormControl>

              {/* Campo descripción */}
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
                      label={t('pages.categories.fields.description')}
                      placeholder={t('pages.categories.fields.description')}
                      multiline
                      rows={4}
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText error>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Campo isActive */}
              <FormControl>
                <FormLabel>{t('categories.fields.isActive.label')}</FormLabel>
                <Controller
                  control={control}
                  name="isActive"
                  defaultValue={true}
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
                      onChange={(_, newValue) => {
                        setValue('isActive', newValue, {
                          shouldValidate: true,
                        });
                        return newValue;
                      }}
                    >
                      <ToggleButton value={true}>
                        {t('categories.fields.isActive.true')}
                      </ToggleButton>
                      <ToggleButton value={false}>
                        {t('categories.fields.isActive.false')}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
                {errors.isActive && (
                  <FormHelperText error>
                    {errors.isActive.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Paper>

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
                onSuccess={() => {
                  onDrawerCLose();
                }}
              />
            )}
            <Button {...saveButtonProps} variant="contained">
              {t('buttons.save')}
            </Button>
          </Stack>
        </form>
      </Drawer>
    </CanAccess>
  );
};
