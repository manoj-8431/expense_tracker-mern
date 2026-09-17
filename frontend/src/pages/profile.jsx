import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {authfetch, API_URL} from "../api"

import hello from "./hello.png"

async function getProfile(){
    const res = await authfetch(`${API_URL}/user/profile`);
    return res.json();
}

async function sendFeedback(data){
    const res = await authfetch(`${API_URL}/user/feedback`, {
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if(!result.success){
        throw new Error(result.message)
    }

    return result;
}

function Profile(){

    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        setError('');

        try{
            await sendFeedback({
                feedback,
            });

            navigate('/home');

        }catch(err){
            setError(err.message)
        }
    }

    useEffect(() => {

        getProfile()
        .then((result) => {

            if(!result.success){
                setError(result.message)
                return;
            }

            setUser(result.data)

        })
        .catch(() => {
            setError('Something went wrong')
        })

    },[]);

    if(error){
        return(
            <div className="flex justify-center items-center min-h-screen px-4">

                <div className="w-full max-w-xl text-center">

                    <p className="text-red-500 mb-4">
                        {error}
                    </p>

                    <Link to="/home">
                        Back to Home
                    </Link>

                </div>

            </div>
        );
    }

    if(!user){
        return(
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return(
    <div className="flex justify-center min-h-screen px-4 py-8">

    <div className="w-full max-w-2xl">

            <div
            className="flex justify-center items-center"
            >
                <img 
                className="w-80 h-auto"
                src={hello} />
            </div>

        <title>
            User Profile
        </title>

        <div
        className="mt-2 sm:mt-10 border border-gray-300
        rounded-xl overflow-hidden"
        >

            <div className="px-5 sm:px-8 py-6">

                <h2 className="text-xl font-semibold mb-5">
                    Account Information
                </h2>

                <div className="border border-gray-200 rounded-lg overflow-hidden">

                    <div className="grid grid-cols-1 sm:grid-cols-3
                    border-b border-gray-200">

                        <div className="px-4 py-4 bg-gray-50 font-semibold">
                            Username
                        </div>

                        <div className="px-4 py-4 sm:col-span-2">
                            {user.name}
                        </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3">

                        <div className="px-4 py-4 bg-gray-50 font-semibold">
                            Email
                        </div>

                        <div className="px-4 py-4 sm:col-span-2 break-words">
                            {user.email}
                        </div>

                    </div>

                </div>

            </div>

            <div className="border-t border-gray-200 px-5 sm:px-8 py-6">

                <form onSubmit={handleSubmit}>

                    <h2 className="text-xl font-semibold mb-5">
                        Feedback
                    </h2>

                    <textarea
                    className="w-full h-32 border border-gray-500
                    p-3 rounded-lg resize-none"
                    placeholder="Send your valuable feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    />

                    {error && (
                        <p className="text-red-500 text-center mt-3">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row
                    justify-between items-center gap-4 mt-6">

                        <Link to="/home">
                            Back to Home
                        </Link>

                        <button
                        className="w-full sm:w-36 h-10
                        bg-blue-600 text-white rounded-md
                        font-bold text-lg hover:cursor-pointer"
                        type="submit"
                        >
                            Send Feedback
                        </button>

                    </div>

                </form>

            </div>

            <div className="border-t border-gray-200 px-5 sm:px-8 py-5">

                <div className="text-center">

                    <button
                    className="w-28 h-10 border border-gray-500
                    rounded-md font-bold text-lg
                    hover:bg-gray-100 cursor-pointer"
                    type="button"
                    onClick={() => navigate('/')}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    </div>

    </div>
);
}

export default Profile;