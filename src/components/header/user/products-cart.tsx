import { useState } from 'react';
import { useApiUrl, useNotification, useTranslate } from '@refinedev/core';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, createSvgIcon, SwipeableDrawer } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  IProductExtended,
  useProductsStore,
} from '../../../store/productItems';
import Remove from '@mui/icons-material/Remove';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { StoreMap } from '../../store';
import { useCheckoutForm } from './useCheckoutForm';

const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>,
  'Plus'
);

export const ProductsCart = ({ userId }: { userId: string }) => {
  const products = useProductsStore(state => state.products);
  const increaseQuantity = useProductsStore(state => state.increaseQuantity);
  const decreaseQuantity = useProductsStore(state => state.decreaseQuantity);
  const t = useTranslate();

  const [drawerState, setDrawerState] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalPrice = products.reduce((acc, product) => {
    const quantity = product.quantity ?? 1;
    const price = product.unitPrice ?? 0;
    return acc + quantity * price;
  }, 0);

  const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid`,
      padding: '0 4px',
    },
  }));

  function toggleDrawer(anchor: string, open: boolean) {
    return (event: any) => {
      if (
        event &&
        typeof event === 'object' &&
        'type' in event &&
        event.type === 'keydown' &&
        'key' in event &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setDrawerState({ ...drawerState, [anchor]: open });
    };
  }

  return (
    <>
      <IconButton aria-label="cart" onClick={toggleDrawer('right', true)}>
        <StyledBadge badgeContent={products.length} color="secondary">
          <ShoppingCartIcon />
        </StyledBadge>
      </IconButton>

      <SwipeableDrawer
        anchor="right"
        open={drawerState['right']}
        onClose={toggleDrawer('right', false)}
        onOpen={toggleDrawer('right', true)}
      >
        <Box
          sx={{
            width: 350,
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('cart.title', 'Cart')}
            </Typography>

            {products.length === 0 ? (
              <Typography color="text.secondary">
                {t('cart.empty', 'Your cart is empty.')}
              </Typography>
            ) : (
              products.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    padding: 1.5,
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={product.imageUrl}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="bold" noWrap>
                      {product.productName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => decreaseQuantity(product.productId)}
                      >
                        <Remove />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {product.quantity ?? 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => increaseQuantity(product.productId)}
                      >
                        <PlusIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Typography fontWeight="bold">
                    ${((product.quantity ?? 1) * product.unitPrice).toFixed(2)}
                  </Typography>
                </Box>
              ))
            )}
          </Box>

          {products.length > 0 && (
            <Box
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                paddingTop: 2,
                marginTop: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setIsDialogOpen(true)}
              >
                {t('cart.checkout', 'Proceed to Checkout')}
              </Button>
            </Box>
          )}
        </Box>
      </SwipeableDrawer>

      <CheckoutAddressDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        products={products}
        totalPrice={totalPrice}
        userId={userId}
      />
    </>
  );
};

type DialogProps = {
  open: boolean;
  onClose: () => void;
  products: IProductExtended[];
  totalPrice: number;
  userId: string;
};

export const CheckoutAddressDialog = ({
  open,
  onClose,
  products,
  totalPrice,
  userId,
}: DialogProps) => {
  const form = useCheckoutForm();
  const apiUrl = useApiUrl();
  const { open: notificationOpen } = useNotification();
  const clearProducts = useProductsStore(state => state.clearProducts);

  const handleConfirm = async () => {
    const address = form.getValues('address');
    console.log('Dirección confirmada:', address);
    // onSelect(address);

    const groupedSubOrders = products.reduce((acc, product) => {
      const storeId = product.storeId;

      if (!acc[storeId]) {
        acc[storeId] = {
          storeId: storeId,
          orderItems: [],
        };
      }

      acc[storeId].orderItems.push({
        productId: product.productId,
        quantity: product.quantity ?? 1,
        unitPrice: product.unitPrice,
      });

      return acc;
    }, {} as Record<number, { storeId: number; orderItems: { productId: number; quantity: number; unitPrice: number }[] }>);

    const subOrders = Object.values(groupedSubOrders);

    const res = await fetch(`${apiUrl}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: userId,
        address: address.text,
        subOrders: Object.values(subOrders),
      }),
    });

    if (res.ok) {
      notificationOpen?.({
        type: 'success',
        message: 'Ordered successfully',
        description: 'You can follow your order.',
        key: 'sucess-order',
      });
      onClose();
      clearProducts();
    } else {
      notificationOpen?.({
        type: 'error',
        message: 'Error creating order',
        description: "Your order couldn't be created.",
        key: 'error-order',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order confirmation</DialogTitle>
      <DialogContent>
        {/* RESUMEN DE PRODUCTOS */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Products summary
          </Typography>
          {products.map((product, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography>
                {product.productName} x {product.quantity}
              </Typography>
              <Typography>
                ${((product.quantity ?? 1) * product.unitPrice).toFixed(2)}
              </Typography>
            </Box>
          ))}

          {/* TOTAL ESTÁTICO */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 2,
              pt: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              ${totalPrice} {/* <-- Puedes calcularlo luego dinámicamente */}
            </Typography>
          </Box>
        </Box>

        {/* DIRECCIÓN */}
        <Box mt={4}>
          <TextField
            fullWidth
            label="Address"
            value={form.watch('address.text')}
            onChange={e => {
              form.setValue('address.text', e.target.value);
            }}
          />
        </Box>

        {/* MAPA */}
        <Box height="400px" mt={2}>
          <StoreMap
            lat={form.latLng.lat}
            lng={form.latLng.lng}
            onDragEnd={form.handleMapOnDragEnd}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm order
        </Button>
      </DialogActions>
    </Dialog>
  );
};
