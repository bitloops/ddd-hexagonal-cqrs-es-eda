import React, { useEffect, useState } from 'react';

interface LoginFormProps {
  loginWithEmailPassword: (email: string, password: string) => void;
  registerWithEmailPassword: (email: string, password: string) => void;
}

function LoginForm(props: LoginFormProps) {
  const { loginWithEmailPassword, registerWithEmailPassword } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
  }, []);
  return (<div style={{
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
    marginLeft: 'calc(50% - 125px)',
  }}>
    <div style={{fontFamily: 'sans-serif', marginBottom: '30px'}}>You are currently not logged in. To create and view your Todos please register & login.</div>
    <form>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '250px',
          position: 'relative',
          background: '#fff',
          borderColor: '#cbd4db',
          color: '#273240',
          fill: '#6f7782',
          fontSize: '16px',
          height: '48px',
          lineHeight: '48px',
          padding: '0 16px',
          cursor: 'pointer',
          alignSelf: 'stretch',
          marginBottom: '32px',
          alignItems: 'center',
          border: '1px solid',
          borderRadius: '2px',
          boxSizing: 'border-box',
          display: 'inline-flex',
          flexShrink: 0,
          justifyContent: 'center',
          overflow: 'hidden',
          transitionDuration: '.2s',
          transitionProperty: 'background,border,box-shadow,color,fill',
          userSelect: 'none',
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            loginWithEmailPassword(email, password);
          }
        }}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '250px',
          position: 'relative',
          background: '#fff',
          borderColor: '#cbd4db',
          color: '#273240',
          fill: '#6f7782',
          fontSize: '16px',
          height: '48px',
          lineHeight: '48px',
          padding: '0 16px',
          cursor: 'pointer',
          alignSelf: 'stretch',
          marginBottom: '32px',
          alignItems: 'center',
          border: '1px solid',
          borderRadius: '2px',
          boxSizing: 'border-box',
          display: 'inline-flex',
          flexShrink: 0,
          justifyContent: 'center',
          overflow: 'hidden',
          transitionDuration: '.2s',
          transitionProperty: 'background,border,box-shadow,color,fill',
          userSelect: 'none',
        }}
      />
    </form>
    <button
      onClick={() => loginWithEmailPassword(email, password)}
      type="button"
      style={{
        position: 'relative',
        background: '#50f',
        borderColor: '#cbd4db',
        color: '#fff',
        fill: '#6f7782',
        fontSize: '16px',
        height: '48px',
        lineHeight: '48px',
        padding: '0 16px',
        cursor: 'pointer',
        alignSelf: 'stretch',
        marginBottom: '32px',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: '2px',
        boxSizing: 'border-box',
        display: 'inline-flex',
        flexShrink: 0,
        justifyContent: 'center',
        overflow: 'hidden',
        transitionDuration: '.2s',
        transitionProperty: 'background,border,box-shadow,color,fill',
        userSelect: 'none',
        // '&:hover': {
        //   backgroundColor: '#f2f3f5',
        // }
      }}
    >
      Login
    </button>
    or 
    <button
      onClick={() => registerWithEmailPassword(email, password)}
      type="button"
      style={{
        position: 'relative',
        background: '#fff',
        borderColor: '#cbd4db',
        color: '#273240',
        fill: '#6f7782',
        fontSize: '16px',
        height: '48px',
        lineHeight: '48px',
        padding: '0 16px',
        cursor: 'pointer',
        alignSelf: 'stretch',
        marginBottom: '32px',
        alignItems: 'center',
        border: '1px solid',
        borderRadius: '2px',
        boxSizing: 'border-box',
        display: 'inline-flex',
        flexShrink: 0,
        justifyContent: 'center',
        overflow: 'hidden',
        transitionDuration: '.2s',
        transitionProperty: 'background,border,box-shadow,color,fill',
        userSelect: 'none',
        // '&:hover': {
        //   backgroundColor: '#f2f3f5',
        // }
      }}
    >
      Register
    </button>
  </div>);
}

export default LoginForm;
