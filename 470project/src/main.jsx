import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Events from './pages/Events.jsx'
import Settings from './pages/Settings.jsx'
import EventDetails from './pages/EventDetails.jsx'
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
  {
    path: "eventdetails",
    element: <EventDetails />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
