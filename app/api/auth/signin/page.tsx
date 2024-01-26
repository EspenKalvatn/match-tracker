import React from 'react';
import LoginForm from '@/app/api/auth/signin/form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }
  return <LoginForm />;
};

export default SignInPage;
