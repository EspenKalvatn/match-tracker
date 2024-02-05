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
          className=" space-y-4"
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
          <Flex direction={'column'} gap={'1'}>
            <Text size={'2'}>Name</Text>
            <TextField.Root>
              <TextField.Input {...register('name')} />
            </TextField.Root>
            <ErrorMessage>{errors.name?.message}</ErrorMessage>
          </Flex>

          <Flex direction={'column'} gap={'1'}>
            <Text size={'2'}>Email</Text>
            <TextField.Root>
              <TextField.Input {...register('email')} />
            </TextField.Root>
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </Flex>

          <Flex direction={'column'} gap={'1'}>
            <Text size={'2'}>Password</Text>

            <TextField.Root>
              <TextField.Input type={'password'} {...register('password')} />
            </TextField.Root>
            <Text color={'gray'} size={'1'}>
              Must be at least 8 characters long
            </Text>
            <ErrorMessage>{errors.password?.message}</ErrorMessage>
          </Flex>

          <Flex direction={'column'} gap={'1'}>
            <Text size={'2'}>Repeat Password</Text>
            <TextField.Root>
              <TextField.Input
                type={'password'}
                {...register('confirmPassword')}
              />
            </TextField.Root>
            <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
          </Flex>

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
