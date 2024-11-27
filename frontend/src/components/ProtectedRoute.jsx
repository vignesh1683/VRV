import { useNavigate } from 'react-router-dom';

const currentUser = {
  role: 'user',
  isAuthenticated: true 
};

function ProtectedRoute({ element, allowedRoles }) {
  const navigate = useNavigate();
  const { role, isAuthenticated } = currentUser;

  if (!isAuthenticated) {
    return (navigate('/login'), null);
  }

  if (!allowedRoles.includes(role)) {
    return (navigate('/unauthorized'), null);
  }

  return element;
}

export default ProtectedRoute;
