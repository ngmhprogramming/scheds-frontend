// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'

import Root from './routes/Root';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Schedule from './routes/Schedule';
import Groups from './routes/Groups';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/schedule",
    element: <Schedule />,
  },
  {
    path: "/groups",
    element: <Groups />,
  }
]);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  // Strict Mode was causing problems with the calendar
  <RouterProvider router={router} />
  // </StrictMode>,
)
