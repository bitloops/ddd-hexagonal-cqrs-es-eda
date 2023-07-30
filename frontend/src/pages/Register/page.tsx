import React from 'react';
import { Heading, Link, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EmailPassForm } from '../../components/EmailPassForm';
import { Email, Password } from '../../models/Auth';

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
        <Link as={RouterLink} to="/login">
          LOGIN
        </Link>
      </Stack>
    </>
  );
}
export default RegisterPage;
