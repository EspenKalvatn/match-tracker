'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Callout, TextField } from '@radix-ui/themes';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/app/validationSchemas';
import { z } from 'zod';

type LoginForm = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="max-w-md">
      {error && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className=" space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            setIsSubmitting(true);

            const response = await signIn('credentials', {
              email: data.email,
              password: data.password,
              redirect: false,
            });

            if (!response?.error) {
              router.push('/');
              router.refresh();
            }
          } catch (error) {
            setIsSubmitting(false);
            setError('An unexpected error occured');
          }
          setIsSubmitting(false);
          setError('Username or password is incorrect');
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Email" {...register('email')} />
        </TextField.Root>
        <ErrorMessage>{errors.email?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input
            placeholder="Enter password"
            {...register('password')}
          />
        </TextField.Root>
        <ErrorMessage>{errors.password?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          Login
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
