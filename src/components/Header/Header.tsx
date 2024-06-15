import React from 'react';
import './Header.scss';
import { Stack, HStack, Box, Avatar, Image, Flex, Spacer, Icon, Switch, color } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon, InfoOutlineIcon } from '@chakra-ui/icons';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('#454546', '#bababd');

  return (
    <header className="header">
      <Flex bg={bg} color={color}>
        <Box>
          <Image
            height={50}
            src="gibbresh.png"
            fallbackSrc="https://ciep.mx/wp-content/uploads/2019/09/placeholder.png"
          />
          Logo
        </Box>
        <Spacer />
        <HStack>
          <Box>
            <Icon as={InfoOutlineIcon} /> Instructions
          </Box>

          <Box className="color-switch">
            <Icon as={MoonIcon} style={{ opacity: colorMode === 'dark' ? 1 : 0 }} />
            <Switch colorScheme="gray" onChange={toggleColorMode} className="switch" />
            <Icon as={SunIcon} style={{ opacity: colorMode === 'light' ? 1 : 0 }} />
          </Box>
          <Box>Report a bug</Box>
          <Box>Logout</Box>
          <Box>
            <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          </Box>
        </HStack>
      </Flex>
    </header>
  );
};

export default Header;
