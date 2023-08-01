import React, { useEffect } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';

interface HeaderProps {
  message: string;
  type: 'success' | 'error';
  duration: number;
}

function BitloopsAlert(props: HeaderProps) {
  const { message, type, duration } = props;
  const [show, setShow] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  if (show)
    return (
      <Alert status={type}>
        <AlertIcon />
        {message}
      </Alert>
    );
  return null;
}

export default BitloopsAlert;
