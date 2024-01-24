'use client';
import React from 'react';
import { Button, Table } from '@radix-ui/themes';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { createMatchSchema } from '@/app/validationSchemas';

type Match = z.infer<typeof createMatchSchema>;

const fetchMatches = async () => {
  const response = await fetch('/api/matches');
  const data = await response.json();
  return data;
};

const MyMatches = () => {
  const {
    data: matches,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading matches</p>;
  }

  console.log('matches', matches);

  return (
    <div>
      <Table.Root className="mb-5">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Home team</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Home score</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Away score</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Away team</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stadium</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Competition</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {matches.map((match: Match, index: number) => {
            const date = new Date(match.date);
            return (
              <Table.Row key={index}>
                <Table.Cell>{date.toLocaleDateString('en-GB')}</Table.Cell>
                <Table.Cell>{match.homeTeam}</Table.Cell>
                <Table.Cell>{match.homeScore}</Table.Cell>
                <Table.Cell>{match.awayScore}</Table.Cell>
                <Table.Cell>{match.awayTeam}</Table.Cell>
                <Table.Cell>{match.stadium}</Table.Cell>
                <Table.Cell>{match.competition}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Button>
        <Link href="/matches/new">Add new match</Link>
      </Button>
    </div>
  );
};

export default MyMatches;
