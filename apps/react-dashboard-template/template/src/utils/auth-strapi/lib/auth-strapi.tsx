import { createAuthentication } from 'utils/util-auth';

import apiStrapi, { strapiTokenKey } from 'services/data-access-strapi';
import { useNavigate } from 'react-router-dom';

const { AuthContext, AuthProvider, useAuth } = createAuthentication(
  {
    tokenKey: strapiTokenKey,
    fetchUser: apiStrapi.meGet,
  },
  'csr'
);

const AuthProviderApp = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <AuthProvider
      navigateLogout={() => {
        navigate('/');
      }}
    >
      {children}
    </AuthProvider>
  );
};

export { AuthContext, AuthProviderApp, useAuth };
