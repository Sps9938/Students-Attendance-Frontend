import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AddStudentsPage, Login, SignUp, SingleStudentPage, StudentPage } from "./Pages"
import Protected from './Components/AuthLayout.jsx'
import { ChangeUserPassword, CreateClass, ForgetPassword, Home, UpdateUserDetails, UserButton, FetchAllClass, MarkAttendance, LowAttendance, SendOtp, VerifyOtp} from './Components/index.js'


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [

            {
                path: "/",
                element: (
                    <Protected authentication>
                        <Home />
                    </Protected>
                ),

            },

            {

                path: "/login",
                element: (
                    <Protected authentication={false}>
                        <Login />
                    </Protected>
                ),
            },

            {
                path: "/signup",
                element: (
                    <Protected authentication={false}>
                        <SignUp />
                    </Protected>
                )
            },
            {
                path: "/user",
                element: (
                    <Protected authentication>
                        <UserButton />
                    </Protected>
                )
            },
            {
                path: "/forget-password",
                element: (

                    <ForgetPassword />

                )
            },
            {
                path: "/change-password",
                element: (
                    <Protected authentication>
                        <ChangeUserPassword />
                    </Protected>

                )
            },
            {
                path: "/update-user-details",
                element: (
                    <Protected authentication>
                        <UpdateUserDetails />
                    </Protected>

                )
            },
            {
                path: "/createclass",
                element: (
                    <Protected authentication>
                        <CreateClass />
                    </Protected>

                )
            },

            {
                path: "/getclasses",
                element: (
                    <Protected authentication>
                        <FetchAllClass />
                    </Protected>

                )
            },


            {
                path: "/student/form/:classId",
                element: (

                    <AddStudentsPage />


                )
            },


            {
                path: "/student/get/student/details/:classId",
                element: (

                    <Protected authentication>
                        <StudentPage />
                    </Protected>

                )
            },
            {
                path: "/student/mark/attendance/:classId",
                element: (

                    <Protected authentication>
                        <MarkAttendance />
                    </Protected>

                )
            },
            {
                path: "/get/each/student/detais/:studentId",
                element: (

                    <Protected authentication>
             <SingleStudentPage />
                    </Protected>

                )
            },
            {
                path: "/low/attendance",
                element: (

                    <Protected authentication>
                        <LowAttendance />
                    </Protected>

                )
            },
            {
                path: "/request-otp",
                element:(
                 <SendOtp />
            )
                
            },
            {
                path: "/verify-otp",
                element:(
                 <VerifyOtp />
              
            )
                
            },
           







        ]
    }
])

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)
