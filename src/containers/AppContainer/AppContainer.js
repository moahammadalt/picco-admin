import React, { useContext, Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { Spin, notification } from 'antd';
import 'antd/dist/antd.css';
import store from 'store';

import { LayoutContext, StoreContext } from '../../contexts';
import { handleRequestError } from '../../utils/API';
import { baseRoutes } from '../../router';

import '../../assets/scss/index.scss';

function AppContainer({ history }) {
  const authToken = store.get('authenticationToken');

  const { loading, error, successNotification } = useContext(LayoutContext);
  const {
    doCategoriesFetch,
    doColorsFetch,
    doSizesFetch,
    data: { categories, colors, sizes }
  } = useContext(StoreContext);

  useEffect(() => {
    const errorMessage = handleRequestError(error);
    const isAuthError = errorMessage === 'authentication failed';

    if (authToken) {
      (!categories || categories.length === 0) && doCategoriesFetch();
      (!colors || colors.length === 0) && doColorsFetch();
      (!sizes || sizes.length === 0) && doSizesFetch();
    }

    !!error &&
      !isAuthError &&
      notification.error({
        placement: 'bottomRight',
        message: 'An error occured!',
        duration: 3,
        description: errorMessage
      });
    !!successNotification &&
      notification.success({
        placement: 'bottomRight',
        message: successNotification,
        duration: 3
      });
    isAuthError && store.set('authenticationToken', null);
  }, [error, successNotification, authToken]);

  return (
    <Fragment>
      <Spin spinning={loading}>
        <Router history={history} basename="/admin-dashboard">
          <Switch>
            {baseRoutes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
          {!authToken && <Redirect to="/login" />}
        </Router>
      </Spin>
    </Fragment>
  );
}

export default AppContainer;
