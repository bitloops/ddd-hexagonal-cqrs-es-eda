import { Alert, Button, FormControl, Input, Stack } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { Email, Password } from '../../models/Auth';

export interface EmailPassFormProps {
  email: Email;
  password: Password;
  view: string;
  submit: () => void;
  isProcessing: boolean;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
}

function EmailPassForm(props: EmailPassFormProps): JSX.Element {
  const { email, password, isProcessing, submit, updateEmail, updatePassword, view } = props;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    updatePassword(event.target.value);
  };

  return (
    <form>
      <Stack>
        <FormControl>
          <Input
            id="email-input"
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email.value}
            onChange={handleEmailChange}
          />
          <Input
            id="password-input"
            placeholder="Password"
            type="password"
            value={password.value}
            autoComplete="current-password"
            onChange={handlePasswordChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && email && password) {
                submit();
              }
            }}
          />
        </FormControl>
        <Button
          isDisabled={!email.isValid || !password.isValid}
          onClick={submit}
          isLoading={isProcessing}
        >
          {view}
        </Button>
        {(email.message || password.message) && (
          <Alert status="error">{email.message || password.message}</Alert>
        )}
      </Stack>
    </form>
  );
}
export { EmailPassForm };
