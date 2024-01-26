import React, { FormEvent } from 'react';
import RegisterForm from '@/app/register/form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const RegisterPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
