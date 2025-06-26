import React, { useEffect } from 'react';
import { Alert } from '@chakra-ui/react';

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
      <Alert.Root status={type} title={message}>
        <Alert.Indicator />
        <Alert.Title>{message}</Alert.Title>
      </Alert.Root>
    );
  return null;
}

export default BitloopsAlert;
