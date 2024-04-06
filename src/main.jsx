import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminHome from './pages/AdminHome.jsx'
import Manage from './pages/Manage.jsx'
import AdminSettings from './pages/AdminSettings.jsx'
import AdminInvites from './pages/AdminInvites.jsx'
import Accounts from './pages/Accounts.jsx'
import './index.css'
import AdminEvents from './components/AdminEvents.jsx'
import CreateEvents from './components/CreateEvents.jsx'
import CreatePost from './components/CreatePost.jsx'
import AdminPosts from './components/AdminPosts.jsx'
import CreateJob from './components/CreateJob.jsx'
import AdminJobs from './components/AdminJobs.jsx'
import App from './App.jsx'
import Events from './pages/Events.jsx'
import Settings from './pages/Settings.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Invites from './pages/Invites.jsx'
import MyEvents from './pages/MyEvents.jsx'
import Discover from './pages/Discover.jsx'
import ViewAll from './components/ViewAll.jsx'
import Circular from './pages/Circular.jsx'
import Notifications from './pages/Notifications.jsx'
import AdminRatings from './components/AdminRatings.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SendInvites from './components/SendInvites.jsx'
import LoginSignup from './LoginSignup.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginSignup />,
  },
  {
    path: "/admin",
    element: <AdminHome />,
  },
  {
    path: "/manage",
    element: <Manage />,
  },
  {
    path: "/adminsettings",
    element: <AdminSettings />,
  },
  {
    path: "/accounts",
    element: <Accounts />,
  },
  {
    path: "/admininvites",
    element: <AdminInvites />,
  },
  {
    path: "/adminevents",
    element: <AdminEvents />,
  },
  {
    path: "/createevents",
    element: <CreateEvents />,
  },
  {
    path: "/createopost",
    element: <CreatePost />,
  },
  {
    path: "/adminposts",
    element: <AdminPosts />,
  },
  {
    path: "/createjob",
    element: <CreateJob />,
  },
  {
    path: "/adminjob",
    element: <AdminJobs />,
  },
  {
    path: "/invitations",
    element: <SendInvites />,
  },
  {
    path: "/home",
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
    path: "circular",
    element: <Circular />,
  },
  {
    path: "notifications",
    element: <Notifications/>,
  },
  {
    path: "adminratings",
    element: <AdminRatings/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
