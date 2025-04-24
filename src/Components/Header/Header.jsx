import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { Container, LogoutBtn, UserButton } from "../index"

 function Header(){
    const authStatus = useSelector((state) => state.auth.success);
    console.log(authStatus);
    

    const navItems = [

{
    name: "Home",
    slug: "/",
    active: !authStatus,
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

    ]


return (
    <header className="bg-white shadow-md sticky top-0 z-50 ">
        <Container>
    <nav className="flex items-center justify-between py-4 font-bold text-black">
        <Link to="/" className="text-xl font-bold text-gray-800">
        MyApp
        </Link>

    <ul className="flex items-center gap-4">
    {navItems.map(
        (item) =>
        item.active && (
        <li key={item.name}>
        <Link
            to={item.slug}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-500 hover:text-white rounded-full transition-all"
        >
            {item.name}
        </Link>
        </li>
        )
    )}

{authStatus == true && 

<li>
    <LogoutBtn />
    
</li>
}



    </ul>
    </nav>
        </Container>
    </header>
    );
 }

 export default Header