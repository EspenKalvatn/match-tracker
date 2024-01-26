import React from 'react';
import LoginForm from '@/app/login/form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
