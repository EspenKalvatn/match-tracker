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
      <div>
        <Button variant="ghost" color={'gray'}>
          <HiOutlineDotsHorizontal />
        </Button>
      </div>
    </Popover.Trigger>
    <Popover.Content>
      <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
        {userId === currentUserId && (
          <Flex direction={'column'} gap={'3'}>
            <div>
              <Button variant="ghost" color="red" onClick={onDelete}>
                {children}
              </Button>
            </div>
          </Flex>
        )}
      </Flex>
    </Popover.Content>
  </Popover.Root>
);

export default OptionsMenu;
