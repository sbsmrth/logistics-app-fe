import { useForm } from '@refinedev/react-hook-form';
import * as React from 'react';
import { FormProvider } from 'react-hook-form';
import {
  type LoginPageProps,
  type LoginFormTypes,
  useActiveAuthProvider,
  type BaseRecord,
  type HttpError,
  useLogin,
  useTranslate,
  useRouterContext,
  useRouterType,
  useLink,
  useApiUrl,
  useGo,
} from '@refinedev/core';
import { ThemedTitleV2 } from '@refinedev/mui';
import { layoutStyles, titleStyles } from './styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { MuiOtpInput } from 'mui-one-time-password-input';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { BoxProps } from '@mui/material/Box';
import type { CardContentProps } from '@mui/material/CardContent';
import type { FormPropsType } from '../index';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { enableAutoLogin } from '../../../../hooks';
import { TOKEN_KEY } from '../../../../authProvider';

type LoginProps = LoginPageProps<BoxProps, CardContentProps, FormPropsType>;

/**
 * login will be used as the default type of the <AuthPage> component. The login page will be used to log in to the system.
 * @see {@link https://refine.dev/docs/api-reference/mui/components/mui-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
  hideForm,
  mutationVariables,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {};
  const methods = useForm<BaseRecord, HttpError, LoginFormTypes>({
    ...useFormProps,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;

  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  const apiUrl = useApiUrl();

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          fontSize: '20px',
        }}
      >
        {title ?? (
          <ThemedTitleV2
            collapsed={false}
            wrapperStyles={{
              gap: '8px',
            }}
          />
        )}
      </div>
    );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          <Stack spacing={1}>
            {providers.map((provider: any) => {
              return (
                <Button
                  key={provider.name}
                  variant="outlined"
                  fullWidth
                  sx={{
                    color: 'primary.light',
                    borderColor: 'primary.light',
                    textTransform: 'none',
                  }}
                  onClick={() =>
                    login(
                      { ...mutationVariables, providerName: provider.name },
                      {
                        onSuccess: (data: any) => {
                          const { success, userId } = data;
                          if (success) {
                            setOpen(true);
                            // setCurrentUserId(userId);
                          }
                        },
                      }
                    )
                  }
                  startIcon={provider.icon}
                >
                  {provider.label}
                </Button>
              );
            })}
          </Stack>
          {!hideForm && (
            <Divider
              sx={{
                fontSize: '12px',
                marginY: '16px',
              }}
            >
              {translate('pages.login.divider', 'or')}
            </Divider>
          )}
        </>
      );
    }
    return null;
  };

  const Content = (
    <Card {...(contentProps ?? {})}>
      <CardContent sx={{ p: '35px', '&:last-child': { pb: '35px' } }}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          style={titleStyles}
          color="primary"
          fontWeight={800}
        >
          {translate('pages.login.title', 'Sign in to your account')}
        </Typography>
        {renderProviders()}
        {!hideForm && (
          <Box
            component="form"
            onSubmit={handleSubmit(data => {
              if (onSubmit) {
                return onSubmit(data);
              }

              return login(
                { ...mutationVariables, ...data },
                {
                  onSuccess: (data: any) => {
                    const { success, userId } = data;
                    if (success) {
                      setOpen(true);
                      // setCurrentUserId(userId);
                    }
                  },
                }
              );
            })}
          >
            <TextField
              {...register('email', {
                required: translate(
                  'pages.login.errors.requiredEmail',
                  'Email is required'
                ),
              })}
              id="email"
              margin="normal"
              fullWidth
              label={translate('pages.login.fields.email', 'Email')}
              error={!!errors.email}
              name="email"
              type="email"
              autoComplete="email"
              variant="outlined"
              sx={{
                mt: 0,
              }}
              onChange={e => {setCurrentEmail(e.target.value)}}
            />
            <TextField
              {...register('password', {
                required: translate(
                  'pages.login.errors.requiredPassword',
                  'Password is required'
                ),
              })}
              id="password"
              margin="normal"
              fullWidth
              name="password"
              label={translate('pages.login.fields.password', 'Password')}
              helperText={errors?.password?.message}
              error={!!errors.password}
              type="password"
              placeholder="●●●●●●●●"
              autoComplete="current-password"
              sx={{
                mb: 0,
              }}
            />
            <Box
              component="div"
              sx={{
                mt: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {forgotPasswordLink ?? (
                <MuiLink
                  variant="body2"
                  color="primary"
                  fontSize="12px"
                  component={ActiveLink}
                  underline="none"
                  to="/forgot-password"
                >
                  {translate(
                    'pages.login.buttons.forgotPassword',
                    'Forgot password?'
                  )}
                </MuiLink>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: '24px', fontWeight: 800 }}
            >
              {translate('pages.login.signin', 'Sign in')}
            </Button>
          </Box>
        )}
        {registerLink ?? (
          <Box
            sx={{
              mt: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              textAlign="center"
              variant="body2"
              component="span"
              fontSize="12px"
            >
              {translate(
                'pages.login.buttons.noAccount',
                'Don’t have an account?'
              )}
            </Typography>
            <MuiLink
              ml="4px"
              fontSize="12px"
              variant="body2"
              color="primary"
              component={ActiveLink}
              underline="none"
              to="/register"
              fontWeight="bold"
            >
              {translate('pages.login.signup', 'Sign up')}
            </MuiLink>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const go = useGo();

  const handle2faSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleClose();

    const res = await fetch(apiUrl + '/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: otp,
        email: currentEmail,
      }),
    });

    if (!res.ok) return;

    const data = await res.json();

    enableAutoLogin();

    localStorage.setItem(TOKEN_KEY, data.token);

    go({
      to: '/',
      type: 'push',
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <Box component="div" style={layoutStyles} {...(wrapperProps ?? {})}>
          <Container
            component="main"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: hideForm ? 'flex-start' : 'center',
              alignItems: 'center',
              minHeight: '100dvh',
              padding: '16px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: hideForm ? '15dvh' : 0,
              }}
            >
              {renderContent ? (
                renderContent(Content, PageTitle)
              ) : (
                <>
                  {PageTitle}
                  {Content}
                </>
              )}
            </Box>
          </Container>
        </Box>
      </FormProvider>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handle2faSubmit,
          },
        }}
      >
        <DialogTitle>2Factor Verification</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Please enter the one-time password sent to your email or phone.
          </DialogContentText>
          <MuiOtpInput value={otp} onChange={handleOtpChange} length={6} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={otp.length < 6}>
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
