import { Outlet, Navigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/Slices/authSlice';

const UnLoggedRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return !user?.token ? <Outlet /> : <Navigate to="/panel/" />;
};

export default UnLoggedRoutes;
