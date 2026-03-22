
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface LoggedRoutesProps {
  children: ReactNode;
}

const LoggedRoutes: React.FC<LoggedRoutesProps> = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    return <Navigate to="/lists" replace />;
  }

  return <>{children}</>;
};

export default LoggedRoutes;