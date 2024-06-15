import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';

const Auth = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Navigate replace to="login" />} />
    </Routes>
  );
};

export default Auth;
