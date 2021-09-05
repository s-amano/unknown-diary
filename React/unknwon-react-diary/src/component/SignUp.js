import React from 'react';
import { AmplifySignUp } from '@aws-amplify/ui-react';

const SignUp = () => {
  return (
    <AmplifySignUp
      slot="sign-up"
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

export default SignUp;
