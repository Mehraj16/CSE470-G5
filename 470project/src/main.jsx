import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Events from './pages/Events.jsx'
import Settings from './pages/Settings.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "events",
    element: <Events />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
