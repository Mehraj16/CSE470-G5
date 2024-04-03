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
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
