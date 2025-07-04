import { type JSX } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EmailPassForm } from '../../components/EmailPassForm';
import { type Email, type Password } from '../../models/Auth';

interface LogInPageProps {
  email: Email;
  password: Password;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
  submit: () => void;
  isProcessing: boolean;
}

function LoginPage(props: LogInPageProps): JSX.Element {
  const { email, isProcessing, password, submit, updateEmail, updatePassword } = props;

  return (
    <>
      <Heading>Login</Heading>
      <EmailPassForm
        email={email}
        password={password}
        view="Login"
        submit={submit}
        isProcessing={isProcessing}
        updateEmail={updateEmail}
        updatePassword={updatePassword}
      />
      <Stack>
        <Text>{'Do not have an account? '}</Text>
        <RouterLink to="/register">
          SIGN UP
        </RouterLink>
      </Stack>
    </>
  );
}
export default LoginPage;
