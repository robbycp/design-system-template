import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react';

import apiStrapi, {
  strapiTokenKey,
  useProductsGet,
  useProductDetailGet,
} from '@kudaterbang/data-access-strapi';
// import { setCookie } from '~/utils/cookies'
// import { useAuth } from '~/utils/auth'

const StrapiView = () => {
  // const { isAuthenticated, logout } = useAuth()

  const { data: dataProducts } = useProductsGet();
  const { data: dataProductDetail, mutate: mutateProductDetail } =
    useProductDetailGet('1');
  const [isLogin, setisLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    // logout()
  };
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    let result;
    if (isLogin) {
      result = await apiStrapi.loginPost({
        data: {
          identifier: email,
          password,
        },
      });
    } else if (!!username && !!email && !!password) {
      result = await apiStrapi.registerPost({
        data: {
          username,
          email,
          password,
        },
      });
    }
    if (result?.data?.jwt) {
      // setCookie(strapiTokenKey, result.data.jwt)
      setUsername('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div>
      <Typography variant="h2">Strapi</Typography>
      <Button onClick={() => mutateProductDetail()}>Refresh</Button>
      <Button onClick={handleLogout}>Logout</Button>
      {dataProducts?.data?.data.map((product) => (
        <div key={product.id}>
          <Typography variant="body2">
            {product.attributes.product_name}
          </Typography>
        </div>
      ))}
      <div>
        <div>Get Detail : </div>
        {JSON.stringify(dataProductDetail?.data)}
      </div>
      {/* {isAuthenticated ? (
        <>
          <Button onClick={handleLogout}>Logout</Button>
          {dataProducts?.data?.data.map((product) => (
            <div key={product.id}>
              <Typography variant="body2">{product.attributes.product_name}</Typography>
            </div>
          ))}
          <div>
            <>
              <div>Get Detail : </div>
              {JSON.stringify(dataProductDetail?.data)}
            </>
          </div>
        </>
      ) : (
        <form>
          {isLogin ? 'Login' : 'Register'}
          <Button onClick={() => setisLogin(!isLogin)}>Change to {isLogin ? 'Register' : 'Login'}</Button>
          {!isLogin && (
            <TextField value={username} onChange={(e) => setUsername(e.currentTarget.value)} label="Username" />
          )}
          <TextField value={email} onChange={(e) => setEmail(e.currentTarget.value)} label="Email" />
          <TextField value={password} onChange={(e) => setPassword(e.currentTarget.value)} label="Password" />
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </form>
      )} */}
    </div>
  );
};

export default StrapiView;