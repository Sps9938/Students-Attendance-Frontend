import React from "react";
import { Container } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

function Header() {
const user = useSelector((state) => state.auth.user);
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogout = () => {
dispatch(logout());
navigate("/login");
};

return (
<header className="bg-white shadow-md sticky top-0 z-50">
<Container>
<nav className="flex items-center justify-between py-4">
    {/* Logo */}
    <Link to="/" className="text-xl font-bold text-gray-800">
        MyApp
    </Link>

    {/* Navigation Buttons */}
    <ul className="flex items-center gap-4">
        {isAuthenticated ? (
            <>
        <li>
            <span className="text-gray-600 text-sm">Welcome, {user?.fullname}</span>
        </li>
        <li>
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-full hover:bg-red-600 transition-all"
        >
            Logout
                </button>
            </li>
        </>
        ) : (
    <>
        <li>
    <Link
        to="/login"
        className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-500 hover:text-white rounded-full transition-all"
    >
        Login
        </Link>
        </li>
        <li>
    <Link
        to="/signup"
        className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-500 hover:text-white rounded-full transition-all"
    >
        Signup
    </Link>
                </li>
            </>
        )}
    </ul>
</nav>
</Container>
</header>
);
}

export default Header;
