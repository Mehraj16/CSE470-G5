import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Events from './pages/Events.jsx'
import Settings from './pages/Settings.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Invites from './pages/Invites.jsx'
import MyEvents from './pages/MyEvents.jsx'
import Discover from './pages/Discover.jsx'
import ViewAll from './components/ViewAll.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Article from './pages/Article.jsx'
import Circular from './pages/Circular.jsx'

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
  {
    path: "myevents",
    element: <MyEvents />,
  },
  {
    path: "discover",
    element: <Discover />,
  },
  {
    path: "invites",
    element: <Invites />,
  },
  {
    path: "viewall",
    element: <ViewAll />,
  },
  {
    path: "article",
    element: <Article />,
  },
  {
    path: "circular",
    element: <Circular />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)