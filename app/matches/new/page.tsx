'use client';
import React from 'react';
import { Button, TextField } from '@radix-ui/themes';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MatchForm {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  stadium: string;
  date: Date;
  competition: string;
  description: string;
}

const NewMatchPage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<MatchForm>();
  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await axios.post('/api/matches', data);
        router.push('/matches');
      })}
    >
      <TextField.Root>
        <TextField.Input placeholder="Home team" {...register('homeTeam')} />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="Away team" {...register('awayTeam')} />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input
          type="number"
          placeholder="Home score"
          {...register('homeScore', { valueAsNumber: true })}
        />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input
          type="number"
          placeholder="Away score"
          {...register('awayScore', { valueAsNumber: true })}
        />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="Stadium" {...register('stadium')} />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input
          placeholder="Competition"
          {...register('competition')}
        />
      </TextField.Root>

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMdeReact placeholder="Add a note" {...field} />
        )}
      />

      <Button>Add new match</Button>
    </form>
  );
};

export default NewMatchPage;
