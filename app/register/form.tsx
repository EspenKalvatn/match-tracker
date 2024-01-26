'use client';

import React, { FormEvent, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { createUserSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Callout, TextField } from '@radix-ui/themes';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import axios from 'axios';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';

type RegisterForm = z.infer<typeof createUserSchema>;

const RegisterForm = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(createUserSchema),
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
            const body = {
              name: data.name,
              email: data.email,
              password: data.password,
            };
            const response = await axios.post('/api/auth/register', {
              ...data,
            });
            console.log(response);
            router.push('/login');
          } catch (error) {
            setIsSubmitting(false);
            setError('Failed to register');
          }
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Name" {...register('name')} />
        </TextField.Root>
        <ErrorMessage>{errors.name?.message}</ErrorMessage>

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

        <TextField.Root>
          <TextField.Input
            type={'password'}
            placeholder="Repeat password"
            {...register('confirmPassword')}
          />
        </TextField.Root>
        <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          Register
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
