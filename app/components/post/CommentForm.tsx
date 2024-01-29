import React from 'react';
import { Avatar, Button, Flex, TextField } from '@radix-ui/themes';
import { AiOutlineSend } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentSchema } from '@/app/validationSchemas';

type CommentFormProps = {
  onSubmit: (data: CommentFormData) => Promise<void>;
};

export type CommentFormData = {
  content: string;
};

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await onSubmit(data);
        } catch (error) {
          console.error(error);
        }
      })}
    >
      {/* Form Content */}
      <Flex gap="3" justify={'between'} align={'center'}>
        {/* ... Other form elements ... */}
        <Avatar
          size="2"
          src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
          radius="full"
          fallback={'D'}
        />
        <TextField.Root className={'w-full'}>
          <TextField.Input
            placeholder="Reply to comment…"
            {...register('content')}
          />
        </TextField.Root>

        <Button variant={'ghost'} color={'gray'} type="submit">
          <AiOutlineSend />{' '}
        </Button>
      </Flex>
    </form>
  );
};

export default CommentForm;
