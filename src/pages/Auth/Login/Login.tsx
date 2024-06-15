import { useForm } from 'react-hook-form';
import React, { useRef, useEffect } from 'react';

import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { EmailIcon, ViewIcon } from '@chakra-ui/icons';
import './Login.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../../store/Slices/authSlice';

const Login = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [show, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!show);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = () => {
    dispatch(
      login({
        token: 'laksdhasdlkha',
        otro: 'asdyasddsa',
      }),
    );
  };

  return (
    <Box className="login-container">
      <div className="video-container"></div>
      <Box className="login-card" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit(onSubmit)} className="common-form">
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<EmailIcon color="gray" />} />
            <Input placeholder="Correo del usuario" {...register('email', { required: true, maxLength: 100 })} />
          </InputGroup>
          {errors?.email?.type === 'required' && <p className="error-fb">Este campo es requerido</p>}
          {errors?.email?.type === 'maxLength' && (
            <p className="error-fb">El correo no puede exceder 100 characteres</p>
          )}

          <InputGroup>
            <Input
              type={show ? 'text' : 'password'}
              placeholder="Enter password"
              {...register('password', { required: true, maxLength: 32 })}
            />
            <InputRightElement>
              <IconButton aria-label="View password" icon={<ViewIcon />} colorScheme="gray" onClick={handleClick} />
            </InputRightElement>
          </InputGroup>
          {errors?.password?.type === 'required' && <p className="error-fb">Este campo es requerido</p>}
          {errors?.password?.type === 'maxLength' && (
            <p className="error-fb">El correo no puede exceder 32 characteres</p>
          )}

          {/* <Button onClick={toggleColorMode}>Toggle {colorMode === 'light' ? 'Dark' : 'Light'}</Button> */}

          <div className="form-actions">
            <Button type="submit" colorScheme="purple" height="48px" width="200px">
              Log in
            </Button>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
