import React from 'react'
import ReactDOM from 'react-dom/client'

// import website pages
import CreateTask from './pages/CreateTask/CreateTask'
import ViewTasks from './pages/ViewTasks/ViewTasks'
import Login from './pages/Login/Login'
import Error from './pages/Error/Error'

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element : <Login/>,
    errorElement : <Error/>
  },
  {
    path:"tasks", 
    element :<ViewTasks />
  },
  {
    path :"create-task", 
    element :<CreateTask />
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);