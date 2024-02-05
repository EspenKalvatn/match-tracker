'use client';

import Link from 'next/link';
import React from 'react';
import { GiSoccerField } from 'react-icons/gi';
import { RxHamburgerMenu } from 'react-icons/rx';

import { usePathname } from 'next/navigation';
import classnames from 'classnames';
import {
  AlertDialog,
  Avatar,
  Button,
  Flex,
  Popover,
  Separator,
  Text,
} from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';
import { useIsMobile } from '@/app/utils/useIsMobile';

const NavBar = () => {
  const currentPath = usePathname();
  const session = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isMobile = useIsMobile(768);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'My matches', href: '/matches' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Flex direction={'column'} className={'mb-5'}>
      <Flex
        gap="5"
        align="center"
        justify="between"
        className="border-b px-5 h-14"
      >
        {useIsMobile(768) && (
          <button onClick={toggleMobileMenu}>
            <RxHamburgerMenu />
          </button>
        )}

        <Flex gap={'3'} align="center" className="flex-1">
          <Link href="/">
            <GiSoccerField size={'25'} />
          </Link>
          {!isMobile && (
            <ul className="flex space-x-6 lg:block">
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
          )}
        </Flex>

        <Flex gap={'3'} justify={'end'} align={'center'} className="flex-1">
          <Popover.Root>
            <Popover.Trigger>
              <div>
                <Button variant={'ghost'}>
                  <Avatar
                    size="3"
                    src=""
                    radius="full"
                    fallback={session.data?.user.name[0]}
                  />
                </Button>
              </div>
            </Popover.Trigger>
            <Popover.Content>
              <Flex gap={'3'} direction={'column'}>
                <Text size={'2'} color={'gray'}>
                  {session.data?.user.name}
                </Text>
                <Text size={'2'} color={'gray'}>
                  {session.data?.user.email}
                </Text>
                <Text size={'2'} color={'gray'}>
                  role: {session.data?.user.role}
                </Text>

                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <div>
                      <Button color="red" variant={'ghost'}>
                        DELETE ACCOUNT
                      </Button>
                    </div>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>DELETE ACCOUNT</AlertDialog.Title>
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
                            Delete account
                          </Button>
                        </div>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
                <div>
                  <Button
                    variant={'ghost'}
                    color={'red'}
                    onClick={() => signOut()}
                  >
                    SIGN OUT
                  </Button>
                </div>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </Flex>
      {isMobile && mobileMenuOpen && (
        <Flex direction={'column'} gap={'0'} align={'center'}>
          {links.map((link) => (
            <Flex
              key={link.href}
              direction={'column'}
              align={'center'}
              className={'w-full pt-4'}
            >
              <Link
                key={link.href}
                className={classnames({
                  'text-zinc-900': link.href === currentPath,
                  'text-zinc-500': link.href !== currentPath,
                  'hover:text-zinc-800 transition-colors': true,
                })}
                href={link.href}
                onClick={toggleMobileMenu}
              >
                {link.label}
              </Link>
              <Separator my="0" size="4" />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
export default NavBar;
