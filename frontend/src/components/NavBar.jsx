import logo from "../pages/logo.png";
import user from "./user.png";
import home from "./home.png";
import plus from "./plus.png";

import {useNavigate} from "react-router-dom"

function NavBar(){

    const navigate = useNavigate();

    return(
        <>
        <nav
        className="flex items-center justify-between
        px-3 sm:px-5 md:px-8 py-2"
        >

            <img
            className="w-14 sm:w-16 md:w-20 h-auto shrink-0"
            src={logo}
            alt="apple-logo"
            />

            <h1
            className="font-semibold text-lg sm:text-xl md:text-2xl
            whitespace-nowrap"
            >
                Apple Track
            </h1>

            <div
            className="flex items-center gap-1 sm:gap-2
            bg-gray-100 border
            rounded-full p-1"
            >

                <button
                title="HomePage"
                className="w-9 h-9 sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-full 
                active:scale-95 transition cursor-pointer"
                onClick={() => navigate('/home')}
                >
                    <img
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    src={home}
                    alt="Home"
                    />
                </button>

                <button
                title="New Transaction"
                className="w-9 h-9 sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-full 
                active:scale-95 transition cursor-pointer"
                onClick={() => navigate('/add-transaction')}
                >
                    <img
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    src={plus}
                    alt="Add Transaction"
                    />
                </button>

                <button
                title="User Profile"
                className="w-9 h-9 sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-full 
                active:scale-95 transition cursor-pointer"
                onClick={() => navigate('/profile')}
                >
                    <img
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    src={user}
                    alt="user-account"
                    />
                </button>

            </div>

        </nav>

        <hr />
        </>
    );
}

export default NavBar;