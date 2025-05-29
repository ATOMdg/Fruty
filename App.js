import React, { useContext, useEffect, useState } from 'react'
import {NavBar} from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import { WidgetManager } from './components/WidgetManager';

export const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await check();
        user.setUser(data);
        user.setIsAuth(true);
      } catch (e) {
        console.error('Ошибка авторизации:', e);
        user.setUser({});
        user.setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return <Spinner animation={'grow'}/>
  }

  return(
    <WidgetManager>
      <NavBar loading={loading} />
    </WidgetManager>
  )
})

export default App;
