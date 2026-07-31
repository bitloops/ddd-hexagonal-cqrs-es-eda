import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Link as RouterLink } from 'react-router';

type RegisterPageProps = {
  register: () => void;
  isProcessing: boolean;
};

function RegisterPage({ register, isProcessing }: RegisterPageProps): JSX.Element {
  return (
    <Stack gap="4">
      <Heading>Create an account</Heading>
      <Text>
        Registration, credential policy and account recovery are managed by Keycloak.
      </Text>
      <Button onClick={register} loading={isProcessing}>
        Continue to registration
      </Button>
      <Text>
        Already registered? <RouterLink to="/login">Sign in</RouterLink>
      </Text>
    </Stack>
  );
}

export default RegisterPage;
