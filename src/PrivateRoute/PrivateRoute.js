import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn === undefined) {
    // While the context is being loaded, you can show a loading spinner
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
