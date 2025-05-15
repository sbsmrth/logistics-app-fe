import { useForm } from '@refinedev/react-hook-form';
import * as React from 'react';
import {
  useApiUrl,
  useLink,
  useNavigation,
  useNotification,
  useParsed,
  useRouterContext,
  useRouterType,
  useTranslate,
} from '@refinedev/core';
import { ThemedTitleV2 } from '@refinedev/mui';
import { layoutStyles, titleStyles } from './styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import type { BoxProps } from '@mui/material/Box';
import type { CardContentProps } from '@mui/material/CardContent';
import type { ForgotPasswordPageProps } from '@refinedev/core';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Controller } from 'react-hook-form';
import type { FormPropsType } from '../index';

interface VerifyFormTypes extends FormPropsType {
  code?: string;
}

type VerifyProps = ForgotPasswordPageProps<
  BoxProps,
  CardContentProps,
  VerifyFormTypes
>;

export const AccountVerifyPage: React.FC<VerifyProps> = ({
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  title,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      code: '',
    },
  });
  const apiUrl = useApiUrl();

  const translate = useTranslate();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;
  const parsed = useParsed<{ email: string }>();

  const userEmail = parsed.params?.email ?? '';

  const { open } = useNotification();

  const { push } = useNavigation();

  const handleSubmitCode = async (code: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email: userEmail }),
      });

      if (response.ok) {
        open!({
          type: 'success',
          message: translate(
            'pages.verify.success',
            'Verification successful, you can now login'
          ),
        });

        push('/login');
      } else {
        console.error('Verification failed');

        open!({
          type: 'error',
          message: translate(
            'pages.verify.error.validCode',
            'Verification failed, please try again'
          ),
        });
      }
    } catch (error) {
      console.error('Error submitting verification code:', error);
    }
  };

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

  const Content = (
    <Card {...(contentProps ?? {})}>
      <CardContent sx={{ p: '32px', '&:last-child': { pb: '32px' } }}>
        <Typography
          component="h1"
          variant="h5"
          align="center"
          style={titleStyles}
          color="primary"
          fontWeight={700}
        >
          {translate('pages.verify.title', 'Enter verification code')}
        </Typography>
        <p color="primary">
          {translate(
            'pages.verify.subtitle',
            'A 6-digit code has been sent to your email'
          )}
        </p>
        <Box
          component="form"
          onSubmit={handleSubmit(data => {
            const { code } = data;
            if (!code) return;

            handleSubmitCode(code);
          })}
        >
          <Controller
            name="code"
            control={control}
            rules={{ validate: value => value.length === 6 }}
            render={({ field, fieldState }) => (
              <Box>
                <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} />
                {fieldState.invalid ? (
                  <FormHelperText error>OTP invalid</FormHelperText>
                ) : null}
              </Box>
            )}
          />
          {loginLink ?? (
            <Box textAlign="right" sx={{ mt: '24px' }}>
              <Typography variant="body2" component="span" fontSize="12px">
                {translate(
                  'pages.forgotPassword.buttons.haveAccount',
                  translate(
                    'pages.register.buttons.haveAccount',
                    'Have an account? '
                  )
                )}
              </Typography>{' '}
              <MuiLink
                variant="body2"
                component={ActiveLink}
                underline="none"
                to="/login"
                fontWeight="bold"
                fontSize="12px"
                color="primary.light"
              >
                {translate(
                  'pages.forgotPassword.signin',
                  translate('pages.login.signin', 'Sign in')
                )}
              </MuiLink>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: '24px' }}
          >
            {translate('pages.verify.buttons.submit', 'Verify Code')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box component="div" style={layoutStyles} {...(wrapperProps ?? {})}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: '16px',
          width: '100%',
          maxWidth: '400px',
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
      </Container>
    </Box>
  );
};
