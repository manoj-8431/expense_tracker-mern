import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {authfetch, API_URL} from "../api";

async function getTransaction(id){
    const res = await authfetch(`${API_URL}/transaction/${id}`);
    return res.json();
}

async function updateTransaction(id, data){
    const res = await authfetch(`${API_URL}/transaction/${id}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if(!result.success){
        throw new Error(result.message)
    }

    return result;
}

function EditTransaction(){

    const {id} = useParams();
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [mode, setMode] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        getTransaction(id)
            .then((result) => {

                if(!result.success){
                    setError(result.message);
                    return;
                }

                const transaction = result.data;

                setType(transaction.type);
                setAmount(transaction.amount);
                setCategory(transaction.category);
                setTitle(transaction.title);
                setMode(transaction.payment_mode);

            })
            .catch(() => {
                setError("Something went wrong")
            })
            .finally(() => {
                setLoading(false);
            })

    },[id]);

    async function handleSubmit(e){

        e.preventDefault();
        setError("");

        try{

            await updateTransaction(id, {
                type,
                amount,
                category,
                title,
                payment_mode: mode,
            });

            navigate('/home')

        }catch(err){
            setError(err.message)
        }
    }

    if(loading){
        return(
            <div className="flex justify-center items-center min-h-screen">
                <p>loading...</p>
            </div>
        )
    }

    return(
        <div className="flex justify-center items-center min-h-screen px-4 py-8">

        <div className="w-full max-w-xl">

            <h1 
            className="font-bold text-3xl text-center mt-5 sm:mt-10">
                Update your transaction
            </h1>

            <title>
                Edit Transaction
            </title>

            <form
            className="px-5 sm:px-8 md:px-10 py-8 mt-8 sm:mt-10
            border border-gray-300 rounded-xl"
            onSubmit={handleSubmit}>

                <label
                className="font-semibold text-lg ml-1"
                >
                    Title
                </label>
                <br/>

                <input
                className="w-full h-10 border border-gray-500 px-3 rounded-lg"
                type="text"
                value={title}
                placeholder="Enter transaction title"
                onChange={(e) => setTitle(e.target.value)}
                />

                <br/>
                <br/>

                <label
                className="font-semibold text-lg ml-1"
                >
                    Amount
                </label>
                <br/>

                <input
                className="w-full h-10 border border-gray-500 px-3 rounded-lg"
                type="number"
                value={amount}
                placeholder="Enter the amount"
                onChange={(e) => setAmount(e.target.value)}
                />

                <br/>
                <br/>

                <label
                className="font-semibold text-lg ml-1"
                >
                    Type
                </label>
                <br/>

                <select
                className="w-full h-10 border border-gray-500 px-3 rounded-lg"
                value={type}
                onChange={(e) => setType(e.target.value)}
                >
                    <option value="income">
                        Income
                    </option>

                    <option value="expense">
                        Expense
                    </option>
                </select>

                <br/>
                <br/>

                <label
                className="font-semibold text-lg ml-1"
                >
                    Category
                </label>
                <br/>

                <select
                className="w-full h-10 border border-gray-500 px-3 rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Food & Grocery">
                        Food & Grocery
                    </option>

                    <option value="Travel">
                        Travel
                    </option>

                    <option value="Rent & Bills">
                        Rent & Bills
                    </option>

                    <option value="Fashion">
                        Fashion
                    </option>

                    <option value="Entertainment">
                        Entertainment
                    </option>

                    <option value="Salary">
                        Salary
                    </option>

                    <option value="Others">
                        Others
                    </option>
                </select>

                <br/>
                <br/>

                <label
                className="font-semibold text-lg ml-1"
                >
                    Mode of Payment
                </label>
                <br/>

                <select
                className="w-full h-10 border border-gray-500 px-3 rounded-lg"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                >
                    <option value="Cash">
                        Cash
                    </option>

                    <option value="Card">
                        Card
                    </option>

                    <option value="UPI">
                        UPI
                    </option>
                </select>

                <br/>
                <br/>

                {error && (
                    <p className="text-red-500 text-center">
                        {error}
                    </p>
                )}

                <br/>

                <div className="text-center">

                    <button
                    className="w-32 h-10
                    bg-blue-600 text-white rounded-md
                    font-bold text-lg hover:cursor-pointer"
                    type="submit"
                    >
                        Save Changes
                    </button>

                </div>

                <div className="text-center mt-3">

                    <p>
                        <Link to="/home">
                            Cancel
                        </Link>
                    </p>

                </div>

            </form>

        </div>

        </div>
    );
}

export default EditTransaction;