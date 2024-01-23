import React from 'react';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';

const MyMatches = () => {
  return (
    <div>
      <Button>
        <Link href="/matches/new">Add new match</Link>
      </Button>
    </div>
  );
};

export default MyMatches;
