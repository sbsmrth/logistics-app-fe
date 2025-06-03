import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button } from '@mui/material';
import { useGo } from '@refinedev/core';

export const Unauthorized = () => {
  const go = useGo();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      <LockOutlinedIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Acceso no autorizado
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        No tienes permisos para ver este recurso.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          go({
            to: '/',
            type: 'replace',
          })
        }
      >
        Volver al inicio
      </Button>
    </Box>
  );
};
