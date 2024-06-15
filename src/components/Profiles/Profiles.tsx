import React from 'react';
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Link } from '@chakra-ui/react';
import { Link as Route } from 'react-router-dom';

const Profiles = () => {
  return (
    <Box className="profile">
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Circuits
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Link as={Route} to="/panel/my-circuits/circuitIdPlaceholder">
              Circuit HelloWorld
            </Link>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Circuit components
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Link as={Route} to="/panel/my-circuits/pc-1">
              Circuit HelloWorld
            </Link>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default Profiles;
