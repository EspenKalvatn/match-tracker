import React from 'react';
import { Callout, Flex } from '@radix-ui/themes';
import { IoIosInformationCircleOutline } from 'react-icons/io';

const EnvironmentCallout = () => {
  return (
    <Flex justify={'center'}>
      <Callout.Root color={'orange'}>
        <Callout.Icon>
          <IoIosInformationCircleOutline size={'20'} />
        </Callout.Icon>
        <Callout.Text>
          You are now in a development environment. All data is temporary and
          can be deleted at any time.
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
};

export default EnvironmentCallout;
