'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUserSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Callout,
  Card,
  Flex,
  Link,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
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
    <Flex justify={'center'} align={'center'} className={'h-screen'}>
      <Card className="w-[350px] p-5">
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
              router.push('/api/auth/signin');
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
              type={'password'}
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

          <Flex justify={'center'} className={'pt-5'}>
            <div>
              <Button disabled={isSubmitting} size={'2'} className={'w-full'}>
                SIGN UP
                {isSubmitting && <Spinner />}
              </Button>
            </div>
          </Flex>

          <Flex justify="center" gap="5" align={'center'}>
            <Separator size={'3'} />
            <Text color={'gray'} size={'2'}>
              Or
            </Text>
            <Separator size={'3'} />
          </Flex>
          <Flex justify={'center'}>
            <Text size={'2'}>
              <Link href={'/api/auth/signin'}>LOGIN</Link>
            </Text>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default RegisterForm;
