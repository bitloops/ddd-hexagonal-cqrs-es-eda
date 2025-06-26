import { Button, Input, Stack, Field } from '@chakra-ui/react';
import { type ChangeEvent, type JSX } from 'react';
import { type Email, type Password } from '../../models/Auth';
import BitloopsAlert from '../Alert';

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
        <Field.Root>
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
        </Field.Root>
        <Button
          disabled={!email.isValid || !password.isValid}
          onClick={submit}
          loading={isProcessing}
        >
          {view}
        </Button>
        {(email.message || password.message) && (
          <BitloopsAlert message={email.message || password.message || ''} type="error" duration={3000} />
        )}
      </Stack>
    </form>
  );
}
export { EmailPassForm };
