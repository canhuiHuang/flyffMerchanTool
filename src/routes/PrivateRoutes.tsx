import { Outlet, Navigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/Slices/authSlice';

const PrivateRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return user?.token ? <Outlet /> : <Navigate to="/login/" />;
};

export default PrivateRoutes;
