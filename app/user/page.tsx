'use client';
import React, { useState } from 'react';
import {
  AlertDialog,
  Avatar,
  Button,
  Callout,
  Flex,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import ErrorMessage from '@/app/components/ErrorMessage';
import { signOut, useSession } from 'next-auth/react';
import { Controller, Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import axios from 'axios';
import { AvatarColor } from '@/app/types/User';

type UpdateUserForm = z.infer<typeof updateUserSchema>;

const avatarColors: AvatarColor[] = [
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'brown',
  'orange',
  'sky',
  'mint',
  'lime',
  'yellow',
  'amber',
  'gold',
  'bronze',
  'gray',
];

const UserPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = useSession();
  const user = session.data?.user;

  console.log('user', user);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  return (
    <Flex
      direction={'column'}
      gap={'5'}
      align={'center'}
      className={'p-4 w-full max-w-[800px] mx-auto'}
    >
      {success && (
        <Callout.Root className="mb-5" color="green">
          <Callout.Text>{success}</Callout.Text>
        </Callout.Root>
      )}

      {error && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      {user && (
        <form
          className=" space-y-4 "
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            try {
              setIsSubmitting(true);
              const body = {
                name: data.name,
                email: data.email,
                avatarColor: data.avatarColor,
                avatarInitials: data.avatarInitials,
                password: data.password || null,
                confirmPassword: data.confirmPassword || null,
              };
              const response = await axios.put(`/api/users/${user.id}`, body);
              if (response.status === 200) {
                setSuccess('Profile updated');
              }
            } catch (error) {
              setError('Failed to update');
            } finally {
              setIsSubmitting(false);
              setTimeout(() => {
                setSuccess('');
                setError('');
              }, 3000);
            }
          })}
        >
          <Flex justify={'center'}>
            <Text size={'5'}>Edit Profile</Text>
          </Flex>
          <Flex justify={'center'}>
            <Avatar
              size={'8'}
              radius={'full'}
              color={user?.avatarColor || 'green'}
              fallback={user?.avatarInitials || user?.name[0] || ''}
            />
          </Flex>

          <Flex justify={'between'} align={'start'}>
            <Flex direction={'column'}>
              <Text>Avatar initials</Text>
              <TextField.Root>
                <TextField.Input
                  defaultValue={user?.avatarInitials || '?'}
                  {...register('avatarInitials')}
                />
              </TextField.Root>
              <ErrorMessage>{errors.avatarInitials?.message}</ErrorMessage>
            </Flex>

            <Flex direction={'column'} align={'center'} gap={'1'}>
              <Text>Avatar color</Text>
              <Controller
                name="avatarColor"
                control={control}
                defaultValue={user?.avatarColor || 'red'}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} size={'1'}>
                    <Select.Trigger placeholder={'Color'} variant={'ghost'} />
                    <Select.Content>
                      {avatarColors.map((color, index) => (
                        <Select.Item key={index} value={color}>
                          <Avatar
                            size={'1'}
                            color={color}
                            radius={'full'}
                            fallback={
                              user?.avatarInitials || user?.name[0] || ''
                            }
                          />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              <ErrorMessage>{errors.avatarColor?.message}</ErrorMessage>
            </Flex>
          </Flex>

          <Flex direction={'column'} gap={'2'}>
            <Text size={'2'}>Name</Text>
            <TextField.Root>
              <TextField.Input
                defaultValue={user?.name}
                {...register('name')}
              />
            </TextField.Root>
            <ErrorMessage>{errors.name?.message}</ErrorMessage>
          </Flex>
          <Flex direction={'column'} gap={'2'}>
            <Text size={'2'}>Email</Text>
            <TextField.Root>
              <TextField.Input
                defaultValue={user?.email}
                {...register('email')}
              />
            </TextField.Root>
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </Flex>
          <Flex direction={'column'} gap={'1'}>
            <Text size={'2'}>New Password</Text>

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
          <Flex gap={'2'}>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <div>
                  <Button type={'button'} color="red">
                    <AiOutlineDelete />
                    Delete Account
                  </Button>
                </div>
              </AlertDialog.Trigger>
              <AlertDialog.Content style={{ maxWidth: 450 }}>
                <AlertDialog.Title>Delete Account</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  Are you sure? All user data will be deleted as well.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end" align={'center'}>
                  <AlertDialog.Cancel>
                    <div>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </div>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <div>
                      <Button
                        variant="solid"
                        color="red"
                        onClick={async () => {
                          const response = await fetch(
                            `/api/users/${session.data?.user?.id}`,
                            {
                              method: 'DELETE',
                            },
                          );
                          if (response.ok) {
                            await signOut();
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>

            <Button disabled={isSubmitting}>
              <AiOutlineEdit />
              Save Changes
            </Button>
          </Flex>
        </form>
      )}
    </Flex>
  );
};

export default UserPage;
