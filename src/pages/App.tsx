import { useState } from 'react';
import Login from './Auth/Login/Login';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoutes from '../routes/PrivateRoutes';
import UnLoggedRoutes from '../routes/UnloggedRoutes';
import Auth from './Auth/Auth';
import Main from './Main/Main';
import Header from '../components/Header/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route element={<Main />} path="/main/*"></Route>
          <Route path="/*" element={<Navigate replace to="main" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
