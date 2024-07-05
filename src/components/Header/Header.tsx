import './Header.scss';
import { Stack, HStack, Box, Avatar, Image, Flex, Spacer, Icon, Switch, color } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon, InfoOutlineIcon } from '@chakra-ui/icons';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('#454546', '#bababd');

  const storageUsed = (): number => {
    let _lsTotal = 0,
      _xLen,
      _x;
    for (_x in localStorage) {
      if (!localStorage.hasOwnProperty(_x)) {
        continue;
      }
      _xLen = (localStorage[_x].length + _x.length) * 2;
      _lsTotal += _xLen;
    }
    return _lsTotal;
  };

  return (
    <header className="header">
      <Flex bg={bg} color={color}>
        <Box>
          <Image
            height={50}
            src="assests/logo.png"
            fallbackSrc="https://ciep.mx/wp-content/uploads/2019/09/placeholder.png"
          />
          <h1>Merch Tracker</h1>
        </Box>
        <Spacer />
        <HStack>
          <Box>Storage used: {(storageUsed() / 1024).toFixed(2)} KB</Box>
          <Box className="color-switch">
            <Icon as={MoonIcon} style={{ opacity: colorMode === 'dark' ? 1 : 0 }} />
            <Switch colorScheme="gray" onChange={toggleColorMode} className="switch" />
            <Icon as={SunIcon} style={{ opacity: colorMode === 'light' ? 1 : 0 }} />
          </Box>
          <Box>
            <Icon as={InfoOutlineIcon} /> Instructions
          </Box>
          {/* <Box>Logout</Box>
          <Box>
            <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          </Box> */}
        </HStack>
      </Flex>
    </header>
  );
};

export default Header;
