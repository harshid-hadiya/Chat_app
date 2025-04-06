import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider,createBrowserRouter} from "react-router-dom"
import {Contextprovider} from './Context/Context.jsx'
import Chat from './Pages/Chat.jsx'
const routes=[
  {
    path:"/",
    element:<Contextprovider><App /></Contextprovider>
  },
  {
    path:"/chat",
    element:
    <Contextprovider><Chat /></Contextprovider>
  }
]
const router=createBrowserRouter(routes);
createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
 
)
