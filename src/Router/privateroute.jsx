import React from 'react';
import { Route, Redirect } from 'react-router-dom';
function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = /* 사용자가 인증되었는지 확인하는 로직을 작성하세요 */ false;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/singin" />
      }
    />
  );
}
export default PrivateRoute;