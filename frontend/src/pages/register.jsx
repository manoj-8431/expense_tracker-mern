
import { useState } from "react";
import {useNavigate, Link} from "react-router-dom"
import {API_URL} from "../api";
import logo from "./logo.png"

async function registerRequest(name, email, password){
    const res = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
    });

    const result = await res.json();
    if(!result.success){
        throw new Error(result.message)
    }
    return result;
}

function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setError('')
        try{
            await registerRequest(name, email, password)
            navigate('/')
        }catch(err){
            setError(err.message)
        }
    }

    return(
        
        <div className="flex min-h-screen justify-center items-center px-4">

            <title>
                Register
            </title>

            <div className="w-full max-w-md">

                <img
                className="w-72 h-auto ml-auto mr-auto"
                src={logo}
                alt="apple logo"
                />

                <h1 className="font-semibold text-xl mt-2 text-center">
                    Create Your
                </h1>

                <h1 className="font-bold text-3xl text-center">
                    Apple Track Account
                </h1>

                <p className="text-center mt-2">Pay the Apple way</p>

                <br/>

                <form onSubmit={handleSubmit}>

                    <input
                    className="w-64 h-9 border border-black mt-5 rounded-t-md p-2 block mx-auto"
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />

                    <input
                    className="w-64 h-9 border border-black p-1 block mx-auto"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                    className="w-64 h-9 border rounded-b-md p-1 block mx-auto"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <button 
                    className="border rounded-md w-30 h-auto mt-4 bg-blue-600 text-white active:bg-blue-400 hover:cursor-pointer block mx-auto"
                    type="Submit">
                        Continue
                    </button>

                    {error && 
                    <p className="mt-3 font-semibold text-center">
                        {error}
                    </p>}
                </form>

                <footer className="text-center">
                    <p className="mt-10">
                        Already have an Account? 
                        <span className="font-semibold">
                            <Link to="/"> Login</Link>
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

export default Register;
