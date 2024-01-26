'use client';
import React, { useState } from 'react';
import { Button, TextField, Callout, Text, Card } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});
import 'easymde/dist/easymde.min.css';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createMatchSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type MatchForm = z.infer<typeof createMatchSchema>;

const NewMatchPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchForm>({
    resolver: zodResolver(createMatchSchema),
  });

  return (
    <Card className="max-w-xl">
      {error && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className=" space-y-3"
        onSubmit={handleSubmit(async (data) => {
          // TODO: get userId from session
          const userId = '65b2bfaccbabf784573f8a8e';
          try {
            setIsSubmitting(true);
            await axios.post('/api/matches', { ...data, userId });
            router.push('/matches');
          } catch (error) {
            setIsSubmitting(false);
            setError('An unexpected error occured');
          }
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Home team" {...register('homeTeam')} />
        </TextField.Root>
        <ErrorMessage>{errors.homeTeam?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input placeholder="Away team" {...register('awayTeam')} />
        </TextField.Root>
        <ErrorMessage>{errors.awayTeam?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input
            type="number"
            placeholder="Home score"
            {...register('homeScore', { valueAsNumber: true })}
          />
        </TextField.Root>
        <ErrorMessage>{errors.homeScore?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input
            type="number"
            placeholder="Away score"
            {...register('awayScore', { valueAsNumber: true })}
          />
        </TextField.Root>
        <ErrorMessage>{errors.awayScore?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input placeholder="Stadium" {...register('stadium')} />
        </TextField.Root>
        <ErrorMessage>{errors.stadium?.message}</ErrorMessage>

        <TextField.Root>
          <TextField.Input
            placeholder="Competition"
            {...register('competition')}
          />
        </TextField.Root>
        <ErrorMessage>{errors.competition?.message}</ErrorMessage>

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                const formattedDate = date ? date.toISOString() : null;
                field.onChange(formattedDate);
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
            />
          )}
        />
        <ErrorMessage>{errors.date?.message}</ErrorMessage>

        {/*<Controller*/}
        {/*  name="description"*/}
        {/*  control={control}*/}
        {/*  render={({ field }) => (*/}
        {/*    <SimpleMDE placeholder="Add a note" {...field} />*/}
        {/*  )}*/}
        {/*/>*/}
        {/*<ErrorMessage>{errors.description?.message}</ErrorMessage>*/}

        <Button disabled={isSubmitting}>
          Add new match
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </Card>
  );
};

export default NewMatchPage;
