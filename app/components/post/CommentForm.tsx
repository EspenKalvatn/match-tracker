import React from 'react';
import { Avatar, Button, Flex, TextField } from '@radix-ui/themes';
import { AiOutlineSend } from 'react-icons/ai';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentSchema } from '@/app/validationSchemas';
import { useSession } from 'next-auth/react';

interface CommentFormProps {
  onSubmit: SubmitHandler<CommentFormData>;
}

export type CommentFormData = {
  content: string;
};

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const session = useSession();
  const user = session.data?.user;
  const { register, handleSubmit, reset } = useForm<CommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await onSubmit(data);
          reset();
        } catch (error) {
          console.error(error);
        }
      })}
    >
      <Flex gap="3" justify={'between'} align={'end'}>
        <Avatar
          size="2"
          src=""
          radius="full"
          color={user?.avatarColor || 'green'}
          fallback={user?.avatarInitials || user.name[0] || ''}
        />
        <TextField.Root className={'w-full'}>
          <TextField.Input
            placeholder="Reply to comment…"
            {...register('content')}
          />
        </TextField.Root>

        <div>
          <Button variant={'ghost'} color={'gray'} type="submit">
            <AiOutlineSend />{' '}
          </Button>
        </div>
      </Flex>
    </form>
  );
};

export default CommentForm;
