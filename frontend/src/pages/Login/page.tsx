import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Link as RouterLink } from 'react-router';

type LoginPageProps = {
  login: () => void;
  isProcessing: boolean;
};

function LoginPage({ login, isProcessing }: LoginPageProps): JSX.Element {
  return (
    <Stack gap="4">
      <Heading>Sign in</Heading>
      <Text>
        Continue to the Bitloops identity service. This application never receives your
        password.
      </Text>
      <Button onClick={login} loading={isProcessing}>
        Continue with Keycloak
      </Button>
      <Text>
        Need an account? <RouterLink to="/register">Register</RouterLink>
      </Text>
    </Stack>
  );
}

export default LoginPage;
