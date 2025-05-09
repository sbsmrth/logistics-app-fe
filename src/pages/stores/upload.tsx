import { useApiUrl, useTranslate } from '@refinedev/core';
import { ListButton } from '@refinedev/mui';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const StoreUpload = () => {
  const apiUrl = useApiUrl();
  const [response, setResponse] = useState<{
    successCount: number | null;
    errors: string[];
  }>({
    successCount: null,
    errors: [],
  });

  const t = useTranslate();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;

    if (!file) return;

    const formData = new FormData();

    formData.append('file', file);

    try {
      const res = await fetch(`${apiUrl}/stores/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      const { successCount, errors } = result;
      setResponse({ successCount, errors });
    } catch (error) {
      setResponse({ errors: ['Error uploading file'], successCount: null });
    }
  };

  return (
    <>
      <ListButton
        variant="outlined"
        sx={{
          borderColor: 'GrayText',
          color: 'GrayText',
          backgroundColor: 'transparent',
        }}
        resource="stores"
        startIcon={<ArrowBack />}
      />
      <Typography
        variant="h5"
        component="h5"
        sx={{ textAlign: 'center', marginTop: '2rem' }}
      >
        Load your CSV file with the stores you want to import.
      </Typography>
      <Divider
        sx={{
          marginBottom: '24px',
          marginTop: '24px',
        }}
      />
      <Grid container spacing="24px">
        <Grid
          size={{
            xs: 12,
            md: 12,
            lg: 12,
          }}
        ></Grid>
      </Grid>
      <Container sx={{ textAlign: 'center' }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          {t('stores.uploadStore')}
          <VisuallyHiddenInput
            type="file"
            multiple={false}
            accept=".csv"
            onChange={handleChange}
          />
        </Button>
      </Container>

      <Container
        sx={{
          display: 'flex',
          marginTop: '4rem',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Stack sx={{ width: '50%' }} spacing={2}>
          {response.successCount && (
            <Alert severity="success">
              {response.successCount} stores were imported successfully.
            </Alert>
          )}
          {response.errors.length > 0 && (
            <>
              {response.errors.slice(0, 10).map((error, index) => (
                <Alert severity="error" key={index}>
                  {error}
                </Alert>
              ))}
            </>
          )}
        </Stack>
      </Container>
    </>
  );
};
