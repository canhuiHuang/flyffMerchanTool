import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Profiles from '../../components/Profiles/Profiles';
import './Main.scss';
import { useEffect } from 'react';
import flyffSrv from '../../services/flyff.js';

const Main = () => {
  useEffect(() => {
    console.log('test');
    flyffSrv.getAllItems().then((res) => console.log(res));
  });

  return (
    <Flex className="panel-container">
      <Profiles />
      {/* <Current />
      <Builds />
      <Search /> */}
    </Flex>
  );
};

export default Main;
