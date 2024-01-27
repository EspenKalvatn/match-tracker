'use client';

import Link from 'next/link';
import React from 'react';
import { GiSoccerField } from 'react-icons/gi';
import { AiOutlineUser } from 'react-icons/ai';

import { usePathname } from 'next/navigation';
import classnames from 'classnames';
import { Button, Flex, Popover, Text } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';

const NavBar = () => {
  const currentPath = usePathname();
  const session = useSession();

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
          <GiSoccerField size={'25'} />
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

      <Flex gap={'3'} justify={'end'} align={'center'} className="flex-1">
        <Popover.Root>
          <Popover.Trigger>
            <Button variant={'ghost'}>
              <AiOutlineUser size={'25'} />
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Flex gap={'3'} direction={'column'}>
              <Text size={'2'} color={'gray'}>
                {session.data?.user.name}
              </Text>
              <Text size={'2'} color={'gray'}>
                {session.data?.user.email}
              </Text>
              <Button>Go to profile</Button>
              <Button color={'red'} onClick={() => signOut()}>
                SIGN OUT
              </Button>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Flex>
  );
};

export default NavBar;
