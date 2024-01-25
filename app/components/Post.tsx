import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Separator,
  Text,
  TextArea,
} from '@radix-ui/themes';
import { AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { IoMdFootball } from 'react-icons/io';

const Post = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: send request to server
  };

  const comments = [
    {
      'comment:': 'Great match!',
    },
    {
      'comment:': 'Nice!',
    },
    {
      'comment:': 'Fantastic atmosphere!',
    },
  ];

  return (
    <Card style={{ maxWidth: 500 }}>
      <Flex gap="3" direction="column">
        <Flex gap="5" align="center">
          <Avatar
            size="3"
            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            radius="full"
            fallback="T"
          />
          <Box className="">
            <Text as="div" size="2" weight="bold">
              Teodros Girmay
            </Text>
            <Text as="div" size="1" color="gray">
              about 3 days ago
            </Text>
          </Box>
        </Flex>

        <Flex gap="5" align="center">
          <Text as="div" size="2" color="gray">
            11.10.22
          </Text>

          <Flex direction="column" className="flex-1">
            <TeamAndScore team="Copenhagen" score={0} />
            <TeamAndScore team="Manchester Cty" score={0} />
          </Flex>
        </Flex>

        <Flex gap="5" align="center">
          <Flex direction="column" className="flex-1">
            <Text as="div" size="1" color="gray">
              Competition
            </Text>
            <Text as="div" size="2">
              UEFA Champions league
            </Text>
          </Flex>
          <Flex direction="column" className="flex-1">
            <Text as="div" size="1" color="gray">
              Ground name
            </Text>
            <Text as="div" size="2">
              Parken Stadium
            </Text>
          </Flex>
        </Flex>
        <Separator my="0" size="4" />
        <Text as="div" size="2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        </Text>
        <Separator my="0" size="4" />

        <Flex align="stretch" justify="between" className="">
          <Button
            variant="ghost"
            color={isLiked ? 'blue' : 'gray'}
            size="3"
            onClick={handleLike}
          >
            <AiOutlineLike />
            <Text as="div" size="1">
              Like
            </Text>
          </Button>
          <Button
            variant="ghost"
            color="gray"
            size="3"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <AiOutlineComment />
            <Text as="div" size="1">
              Comment
            </Text>
          </Button>
        </Flex>
      </Flex>

      {isExpanded && (
        <div>
          <Separator my="3" size="4" />
          <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
            {comments.map((comment) => (
              <div key={comment['comment:']}>
                <Text as="div" size="1" color="gray">
                  {comment['comment:']}
                </Text>
              </div>
            ))}
          </Flex>
          <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
            <TextArea size="2" placeholder="Reply to comment…" />
          </Flex>
        </div>
      )}
    </Card>
  );
};
export default Post;

const TeamAndScore: React.FC<{ team: string; score: number }> = ({
  team,
  score,
}) => {
  return (
    <Flex justify="between">
      <Flex gap="2" align="center">
        <IoMdFootball />
        <Text as="div" size="3">
          {team}
        </Text>
      </Flex>
      <Text as="div" size="3">
        {score}
      </Text>
    </Flex>
  );
};
