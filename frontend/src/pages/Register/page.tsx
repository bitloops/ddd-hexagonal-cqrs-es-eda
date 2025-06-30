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

function RegisterPage(props: LogInPageProps): JSX.Element {
  const { email, isProcessing, password, submit, updateEmail, updatePassword } = props;

  return (
    <>
      <Heading>Register</Heading>
      <EmailPassForm
        email={email}
        password={password}
        view="Register"
        submit={submit}
        isProcessing={isProcessing}
        updateEmail={updateEmail}
        updatePassword={updatePassword}
      />
      <Stack>
        <Text>{'Already have an account? '}</Text>
        <RouterLink to="/login">
          LOGIN
        </RouterLink>
      </Stack>
    </>
  );
}
export default RegisterPage;
