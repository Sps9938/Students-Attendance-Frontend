import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import {Login} from "./Pages"
import Protected from './Components/AuthLayout.jsx'

import { Navigate } from 'react-router-dom'
const router = createBrowserRouter( [
   {
     path: "/",
    element: <App />,
    children: [
       
        {

        path: "/login",
        element: (
            <Protected authentication={false}>
                <Login />
            </Protected>
        )
             
          
        
    }
    ]
}
])

createRoot(document.getElementById('root')).render(
<Provider store = {store}>
    <RouterProvider router={router} />
</Provider>
)
