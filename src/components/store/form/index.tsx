import { useTranslate } from "@refinedev/core";
import { Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import InputMask from "react-input-mask";
import type { useStoreForm } from "./useStoreForm";

type Props = {
  action: "create" | "edit";
  form: ReturnType<typeof useStoreForm>;
  onCancel?: () => void;
};

export const StoreForm = (props: Props) => {
  const t = useTranslate();
  const {
    register,
    control,
    formState: { errors },
    saveButtonProps,
    setValue,
    handleAddressChange,
  } = props.form;

  return (
    <form>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "24px",
        }}
      >
        <FormControl fullWidth>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: t("errors.required.field", {
                field: "title",
              }),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("stores.fields.title")}
                required
                size="small"
                margin="none"
                variant="outlined"
              />
            )}
          />
          {errors.name && (
            <FormHelperText error>{errors.name.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel
            sx={{
              marginBottom: "8px",
            }}
          >
            {t("products.fields.isActive.label")}
          </FormLabel>
          <Controller
            control={control}
            name="status"
            defaultValue={false}
            rules={{
              validate: (value) => {
                if (value === undefined) {
                  return t("errors.required.field", {
                    field: "isActive",
                  });
                }
                return true;
              },
            }}
            render={({ field }) => {
              return (
                <ToggleButtonGroup
                  id="isActive"
                  {...field}
                  exclusive
                  color="primary"
                  onChange={(_, newValue) => {
                    setValue("status", newValue ? 'ACTIVE' : 'INACTIVE', {
                      shouldValidate: true,
                    });

                    return newValue;
                  }}
                >
                  <ToggleButton value={true}>
                    {t("stores.fields.isActive.true")}
                  </ToggleButton>
                  <ToggleButton value={false}>
                    {t("stores.fields.isActive.false")}
                  </ToggleButton>
                </ToggleButtonGroup>
              );
            }}
          />
          {errors.status && (
            <FormHelperText error>{errors.status.message}</FormHelperText>
          )}
        </FormControl>

        {/* <FormControl fullWidth>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: t("errors.required.field", {
                field: "email",
              }),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("stores.fields.email")}
                required
                size="small"
                margin="none"
                variant="outlined"
              />
            )}
          />
          {errors.email && (
            <FormHelperText error>{errors.email.message}</FormHelperText>
          )}
        </FormControl> */}

        <FormControl fullWidth>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{
              required: t("errors.required.field", {
                field: "address.text",
              }),
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("stores.fields.address")}
                required
                size="small"
                margin="none"
                variant="outlined"
                onChange={(e) => {
                  field.onChange(e);
                  handleAddressChange(e.target.value);
                }}
              />
            )}
          />
          {errors.address && (
            <FormHelperText error>{errors.address.message}</FormHelperText>
          )}
        </FormControl>

   

        {/* this is a workaround for registering fields to ant design form*/}
        {/* otherwise these fields will be null */}
        <Box
          sx={{
            display: "none",
          }}
        >
          <input
            {...register("latitude", {
              required: t("errors.required.field", {
                field: "latitude",
              }),
            })}
            type="hidden"
          />
          <input
            {...register("longitude", {
              required: t("errors.required.field", {
                field: "longitude",
              }),
            })}
            type="hidden"
          />
        </Box>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="text"
            color="inherit"
            onClick={() => {
              if (props.onCancel) {
                props.onCancel();
              }
            }}
          >
            {t("buttons.cancel")}
          </Button>
          <Button {...saveButtonProps} variant="contained">
            {t("buttons.save")}
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
