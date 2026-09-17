import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

import logo from "./logo.png";

async function loginRequest(email, password) {
    const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (!result.success) {
        throw new Error(result.message);
    }

    localStorage.setItem("accessToken", result.data.access_token);
    localStorage.setItem("refreshToken", result.data.refresh_token);

    return result;
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await loginRequest(email, password);
            navigate("/home");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="flex min-h-screen justify-center items-center px-4">

            <title>
                Login
            </title>

            <div className="w-full max-w-md">
                <img
                    className="w-72 h-auto ml-auto mr-auto"
                    src={logo}
                    alt="apple logo"
                />

                <form onSubmit={handleSubmit}>
                    <h1 className="font-semibold text-xl mt-2 text-center">
                        Sign in To
                    </h1>

                    <h1 className="font-bold text-3xl text-center">
                        Apple Track
                    </h1>

                    <p className="text-center mt-2">Pay the Apple way</p>

                    <input
                        className="w-64 h-9 border border-black mt-5 rounded-t-md p-2 block mx-auto"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className="w-64 h-9 border rounded-b-md p-1 block mx-auto"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        className="border rounded-md w-30 h-auto mt-4 bg-blue-600 text-white active:bg-blue-400 hover:cursor-pointer block mx-auto"
                        type="submit"
                    >
                        Continue
                    </button>

                    {error && (
                        <p className="mt-3 font-semibold text-center">
                            {error}
                        </p>
                    )}
                </form>

                <footer className="text-center">
                    <p className="mt-10">
                        Don't have an Apple Account?
                        <span className="font-semibold">
                            <Link to="/register"> Create your Apple ID</Link>
                        </span>
                    </p>

                    <p>
                        Private Policy.
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default Login;

