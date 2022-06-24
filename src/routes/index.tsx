import React, { useEffect, useState, useContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  RouteProps,
  Switch,
  useLocation,
} from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import Store from '../store'
import { Home } from '../views/Home'

export enum RoutePath {
  Home = '/',
  Manage = '/manage/:exchange/:mode',
}

export const RouterContext = React.createContext({
  to: '',
  from: '',
})

export interface Routes {
  from: string
  to: string
}

export const useRoute = (): Routes => {
  return useContext(RouterContext)
}

const RouterProvider: React.FC = ({ children }) => {
  const location = useLocation()
  const [route, setRoute] = useState<Routes>({
    to: location.pathname,
    from: location.pathname,
  })

  useEffect(() => {
    setRoute((prev) => ({ to: location.pathname, from: prev.to }))
  }, [location])

  return (
    <RouterContext.Provider value={route}>{children}</RouterContext.Provider>
  )
}

interface MibaoRouterProps extends RouteProps {
  key: string
  params?: string
  path: string
}

const routes: MibaoRouterProps[] = [
  {
    component: Home,
    exact: true,
    key: 'Home',
    path: RoutePath.Home,
  },
]

export const Routers: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <RouterProvider>
          <Store>
            <Switch>
              {routes.map((route) => (
                <Route
                  {...route}
                  key={route.key}
                  path={`${route.path}${route.params ?? ''}`}
                />
              ))}
            </Switch>
          </Store>
        </RouterProvider>
      </Router>
    </I18nextProvider>
  )
}
