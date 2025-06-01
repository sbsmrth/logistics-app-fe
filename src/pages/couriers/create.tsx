import {
  useTranslate,
  type HttpError,
  useGetToPath,
  useGo,
  CanAccess,
} from '@refinedev/core';
import InputMask from 'react-input-mask';
import { useSearchParams } from 'react-router';
import { useAutocomplete } from '@refinedev/mui';
import {
  type UseStepsFormReturnType,
  useStepsForm,
} from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepButton from '@mui/material/StepButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import type { TextFieldProps } from '@mui/material/TextField';
import type { ICourier, IStore, Nullable } from '../../interfaces';
import Divider from '@mui/material/Divider';
import { Unauthorized } from '../../components/unauthorized';

export const CourierCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();

  const stepsForm = useStepsForm<ICourier, HttpError, Nullable<ICourier>>({
    stepsProps: {
      isBackValidate: false,
    },
  });

  const { stepTitles, stepFormFields } = useStepsFormList({ stepsForm });

  const isLastStep = stepsForm.steps.currentStep === stepFormFields.length - 1;

  const isFirstStep = stepsForm.steps.currentStep === 0;

  const onModalClose = () => {
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

  return (
    <CanAccess resource="products" action="create" fallback={<Unauthorized />}>
      <Dialog
        open
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '640px',
            width: '100%',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {t('couriers.actions.add')}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Stepper nonLinear activeStep={stepsForm.steps.currentStep}>
            {stepTitles.map((label, index) => (
              <Step
                key={label}
                sx={{
                  '& .MuiStepIcon-text': {
                    fill: theme =>
                      theme.palette.mode === 'light' ? 'white' : 'black',
                  },
                }}
              >
                <StepButton onClick={() => stepsForm.steps.gotoStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <Box mt="48px">
            <form>{stepFormFields[stepsForm.steps.currentStep]}</form>
          </Box>

          <Divider
            sx={{
              margin: '24px 0',
            }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Button onClick={onModalClose} color="inherit" variant="text">
              {t('buttons.cancel')}
            </Button>
            <Stack direction="row" spacing="8px">
              {!isFirstStep && (
                <Button
                  disabled={isFirstStep}
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    stepsForm.steps.gotoStep(stepsForm.steps.currentStep - 1);
                  }}
                >
                  {t('buttons.previousStep')}
                </Button>
              )}
              {isLastStep ? (
                <Button {...stepsForm.saveButtonProps} variant="contained">
                  {t('buttons.save')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    stepsForm.steps.gotoStep(stepsForm.steps.currentStep + 1);
                  }}
                >
                  {t('buttons.nextStep')}
                </Button>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </CanAccess>
  );
};

type UseStepsFormList = {
  stepsForm: UseStepsFormReturnType<ICourier, HttpError, Nullable<ICourier>>;
};

const useStepsFormList = ({ stepsForm }: UseStepsFormList) => {
  const t = useTranslate();

  const {
    control,
    formState: { errors },
    refineCore: { formLoading },
  } = stepsForm;

  const { autocompleteProps: storesAutoCompleteProps } =
    useAutocomplete<IStore>({
      resource: 'stores',
    });

  const stepPersonal = (
    <Stack gap="24px" key="step-personal">
      <FormControl fullWidth>
        <Controller
          control={control}
          name="name"
          defaultValue=""
          rules={{
            required: t('errors.required.field', {
              field: 'name',
            }),
          }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                variant="outlined"
                type="name"
                id="name"
                required
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: ({ palette }) =>
                      palette.mode === 'dark'
                        ? '#1E1E1E'
                        : palette.background.paper,
                  },
                }}
                label={t('couriers.fields.name.label')}
                placeholder={t('couriers.fields.name.label')}
              />
            );
          }}
        />
        {errors.name && (
          <FormHelperText error>{errors.name.message}</FormHelperText>
        )}
      </FormControl>{' '}
      <FormControl fullWidth>
        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{
            required: t('errors.required.field', {
              field: 'email',
            }),
          }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                variant="outlined"
                type="email"
                id="email"
                required
                label={t('couriers.fields.email.label')}
                placeholder={t('couriers.fields.email.label')}
              />
            );
          }}
        />
        {errors.email && (
          <FormHelperText error>{errors.email.message}</FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth>
        <Controller
          control={control}
          name="phone"
          defaultValue=""
          rules={{
            required: t('errors.required.field', {
              field: 'phone',
            }),
          }}
          render={({ field }) => {
            return (
              <InputMask
                {...field}
                mask="(399) 999 99 99"
                disabled={formLoading}
              >
                {/* @ts-expect-error False alarm */}
                {(props: TextFieldProps) => (
                  <TextField
                    {...props}
                    required
                    variant="outlined"
                    id="phone"
                    label={t('couriers.fields.phone.label')}
                    placeholder={t('couriers.fields.phone.label')}
                  />
                )}
              </InputMask>
            );
          }}
        />
        {errors.phone && (
          <FormHelperText error>{errors.phone.message}</FormHelperText>
        )}
      </FormControl>
      {/* <FormControl fullWidth>
        <Controller
          control={control}
          name="address"
          defaultValue=""
          rules={{
            required: t("errors.required.field", {
              field: "address",
            }),
          }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                required
                variant="outlined"
                id="address"
                label={t("couriers.fields.address.label")}
                placeholder={t("couriers.fields.address.label")}
              />
            );
          }}
        />
        {errors.address && (
          <FormHelperText error>{errors.address.message}</FormHelperText>
        )}
      </FormControl> */}
    </Stack>
  );

  const stepCompany = (
    <Stack gap="24px" key="step-company">
      <FormControl fullWidth size="small">
        <Controller
          control={control}
          name="store"
          rules={{
            required: 'Store required',
          }}
          defaultValue={null}
          render={({ field }) => (
            <Autocomplete
              {...storesAutoCompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              getOptionLabel={item => {
                return item.name ? item.name : '';
              }}
              isOptionEqualToValue={(option, value) =>
                value === undefined ||
                option?.id?.toString() === (value?.id ?? value)?.toString()
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('couriers.fields.store.label')}
                  variant="outlined"
                  error={!!errors.store}
                  required
                />
              )}
            />
          )}
        />
        {errors.store && (
          <FormHelperText error>{errors.store.message}</FormHelperText>
        )}
      </FormControl>
      {/* <FormControl fullWidth>
        <Controller
          control={control}
          name="accountNumber"
          defaultValue=""
          rules={{
            min: 10,
            required: t("errors.required.field", {
              field: "accountNumber",
            }),
          }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                name="accountNumber"
                required
                variant="outlined"
                label={t("couriers.fields.accountNumber.label")}
                placeholder={t("couriers.fields.accountNumber.label")}
              />
            );
          }}
        />
        {errors.accountNumber && (
          <FormHelperText error>{errors.accountNumber.message}</FormHelperText>
        )}
      </FormControl> */}
    </Stack>
  );

  const stepTitles = [
    t('couriers.steps.personal'),
    t('couriers.steps.company'),
  ];

  return {
    stepTitles,
    stepFormFields: [stepPersonal, stepCompany],
  };
};
