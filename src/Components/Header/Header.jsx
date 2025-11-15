import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { Container, LogoutBtn, UserButton, ThemeToggle } from "../index"

 function Header(){
    const authStatus = useSelector((state) => state.auth.success);
    // console.log(authStatus);
    // const classId = useSelector((state) => state.someReducer.classId); 

    const navItems = [

{
    name: "Home",
    slug: "/",
    active: authStatus,
},

 {
    name: "Login",
    slug: "/login",
    active: !authStatus,
 },

 {
    name: "SignUp",
    slug: "/signUp",
    active: !authStatus,
 },

 {
    name: "User Profile",
    slug: "/user",
    active: authStatus,
 },
 {
    name: "DashBoard",
    slug: `/deleted/classes`,
    active: authStatus,
 },

    ]


return (
    <header className="w-full bg-white dark:bg-[#151b23] shadow-sm sticky top-0 z-50">
        <div className="border-b border-gray-200 dark:border-gray-700">
            <Container>
                <nav className="flex items-center justify-between py-4 font-bold">
                    <span className="text-lg text-gray-900 dark:text-white">
                        Attendance
                    </span>

                    <ul className="flex items-center gap-4">
                        <li>
                            <ThemeToggle />
                        </li>
                        {navItems.map(
                            (item) =>
                                item.active && (
                                    <li key={item.name}>
                                        <Link
                                            to={item.slug}
                                            className="px-4 py-2 text-sm rounded-full transition-all
                                 text-gray-700 hover:text-black hover:bg-gray-100
                                 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                )
                        )}

                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </div>
    </header>
);
 }

 export default Header