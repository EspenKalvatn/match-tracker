'use client';

import Link from 'next/link';
import React from 'react';
import { GiSoccerField } from 'react-icons/gi';
import { usePathname } from 'next/navigation';
import classnames from 'classnames';
import { Button, Flex } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';

const NavBar = () => {
  const currentPath = usePathname();
  const { data: session } = useSession();

  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'My matches', href: '/matches' },
  ];

  return (
    <Flex
      gap="5"
      align="center"
      justify="between"
      className="border-b mb-5 px-5 h-14"
    >
      <Flex gap={'3'} align="center" className="flex-1">
        <Link href="/">
          <GiSoccerField />
        </Link>
        <ul className="flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              className={classnames({
                'text-zinc-900': link.href === currentPath,
                'text-zinc-500': link.href !== currentPath,
                'hover:text-zinc-800 transition-colors': true,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </ul>
      </Flex>

      <Flex gap={'3'} justify={'end'} className="flex-1">
        {!!session && <Button onClick={() => signOut()}>Logout</Button>}
        {!session && (
          <>
            <Button>
              <Link href="/login">Login</Link>
            </Button>
            <Button>
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;
