import React, { ReactNode } from 'react';
import { Button, Flex, Popover } from '@radix-ui/themes';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

interface OptionsMenuProps {
  userId: string | undefined;
  currentUserId: string | undefined;
  onDelete: () => void;
  children: ReactNode; // Update here
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  userId,
  currentUserId,
  onDelete,
  children,
}) => (
  <Popover.Root>
    <Popover.Trigger>
      <Button variant="ghost" color={'gray'}>
        <HiOutlineDotsHorizontal />
      </Button>
    </Popover.Trigger>
    <Popover.Content>
      <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
        {userId === currentUserId && (
          <Flex direction={'column'} gap={'3'}>
            <Button variant="ghost" color="red" onClick={onDelete}>
              {children}
            </Button>
          </Flex>
        )}
      </Flex>
    </Popover.Content>
  </Popover.Root>
);

export default OptionsMenu;
