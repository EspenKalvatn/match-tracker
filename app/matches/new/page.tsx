'use client';
import React, { useState } from 'react';
import { Button, TextField, Callout, Text } from '@radix-ui/themes';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createMatchSchema } from '@/app/validationSchemas';
import { z } from 'zod';

type MatchForm = z.infer<typeof createMatchSchema>;

const NewMatchPage = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchForm>({
    resolver: zodResolver(createMatchSchema),
  });
  const [error, setError] = useState('');
  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className=" space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post('/api/matches', data);
            router.push('/matches');
          } catch (error) {
            setError('An unexpected error occured');
          }
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Home team" {...register('homeTeam')} />
        </TextField.Root>
        {errors.homeTeam && (
          <Text color="red" as="p">
            {errors.homeTeam.message}
          </Text>
        )}
        <TextField.Root>
          <TextField.Input placeholder="Away team" {...register('awayTeam')} />
        </TextField.Root>
        {errors.awayTeam && (
          <Text color="red" as="p">
            {errors.awayTeam.message}
          </Text>
        )}
        <TextField.Root>
          <TextField.Input
            type="number"
            placeholder="Home score"
            {...register('homeScore', { valueAsNumber: true })}
          />
        </TextField.Root>
        {errors.homeScore && (
          <Text color="red" as="p">
            {errors.homeScore.message}
          </Text>
        )}
        <TextField.Root>
          <TextField.Input
            type="number"
            placeholder="Away score"
            {...register('awayScore', { valueAsNumber: true })}
          />
        </TextField.Root>
        {errors.awayScore && (
          <Text color="red" as="p">
            {errors.awayScore.message}
          </Text>
        )}
        <TextField.Root>
          <TextField.Input placeholder="Stadium" {...register('stadium')} />
        </TextField.Root>
        {errors.stadium && (
          <Text color="red" as="p">
            {errors.stadium.message}
          </Text>
        )}
        <TextField.Root>
          <TextField.Input
            placeholder="Competition"
            {...register('competition')}
          />
        </TextField.Root>
        {errors.competition && (
          <Text color="red" as="p">
            {errors.competition.message}
          </Text>
        )}

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => field.onChange(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
            />
          )}
        />
        {errors.date && (
          <Text color="red" as="p">
            {errors.date.message}
          </Text>
        )}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact placeholder="Add a note" {...field} />
          )}
        />
        {errors.description && (
          <Text color="red" as="p">
            {errors.description.message}
          </Text>
        )}

        <Button>Add new match</Button>
      </form>
    </div>
  );
};

export default NewMatchPage;
