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
          placeholder: 'Enter your name',
        },
        {
          type: 'password',
          required: true,
        },
      ]}
    />
  );
};

export default SignUp;
