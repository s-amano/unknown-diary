import React from 'react';
import { AmplifySignIn } from '@aws-amplify/ui-react';

const Login = () => {
  return (
    <AmplifySignIn
      slot="sign-in"
      formFields={[
        {
          type: 'username',
          required: true,
          placeholder: 'ユーザー名を入力してください',
        },
        {
          type: 'password',
          required: true,
          placeholder: 'パスワードを入力してください',
        },
      ]}
    />
  );
};

export default Login;
