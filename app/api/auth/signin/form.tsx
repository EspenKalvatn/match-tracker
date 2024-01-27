'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Callout,
  Card,
  Flex,
  TextField,
  Text,
  Separator,
  Link,
} from '@radix-ui/themes';
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
    <Flex justify={'center'} align={'center'} className="h-screen ">
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
              console.error('error', error);
              setIsSubmitting(false);
              setError('Username or password is incorrect');
            }
          })}
        >
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

          <Flex justify={'center'} className={'pt-5'}>
            <Button disabled={isSubmitting} size={'2'} className={'w-full'}>
              LOGIN
              {isSubmitting && <Spinner />}
            </Button>
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
              <Link href={'/api/auth/new-user'}>SIGN UP</Link>
            </Text>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default LoginForm;
