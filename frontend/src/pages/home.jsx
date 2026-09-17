import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {authfetch, API_URL} from "../api"

import card from "./amex.webp"

async function getTransactions(){
    const res = await authfetch(`${API_URL}/transaction`);
    return res.json();
}

async function getBalance(){
    const res = await authfetch(`${API_URL}/transaction/summary/balance`);
    return res.json();
}

async function getCategoryBreakdown(){
    const res = await authfetch(`${API_URL}/transaction/summary/category`);
    return res.json();
}

async function getProfile(){
    const res = await authfetch(`${API_URL}/user/profile`);
    return res.json();
}

async function deleteTransaction(id){
    const res = await authfetch(`${API_URL}/transaction/${id}`,{
        method: 'DELETE',
    })
    return res.json();
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6699'];

function Home(){
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('')

    useEffect(() => {
        getTransactions()
            .then((result) => {
                if(!result.success){
                    setError(result.message)
                    return;
                }
                setTransactions(result.data);
            })
            .catch(() => {
                setError('Something went wrong')
            });

        getBalance()
            .then((result) => {
                if(!result.success){
                    setError(result.message)
                    return;
                }
                setBalance(result.data);
            })
            .catch(() => {
                setError('Something went wrong')
            });

        getCategoryBreakdown()
            .then((result) => {
                if(!result.success){
                    setError(result.message)
                    return;
                }
                setCategoryData(result.data);
            })
            .catch(() => {
                setError('Something went wrong')
            });

        getProfile()
            .then((result) => {
                if(!result.success){
                    setError(result.message)
                    return;
                }
                setUser(result.data);
            })
            .catch(() => {
                setError('Something went wrong')
            });
    },[]);

    async function handleDelete(id){
        try{
            const result = await deleteTransaction(id)

            if(!result.success){
                setError(result.message)
                return;
            }

            setTransactions((prev) => prev.filter((t) => t._id !== id));
        }catch(err){
            setError('Something went wrong')
        }
    }

    return(
        <>

        <title>
            Home
        </title>

        {error &&
            <p className="text-center text-red-500 mt-3 px-4">
                {error}
            </p>
        }

        <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 px-4 md:px-0"
        >

            <section
            className="flex justify-center items-center"
            >
                {balance && user && (

                    <div
                    className="rounded-sm text-white md:mt-3 mt-6 drop-shadow-2xl
                    bg-cover bg-center w-full max-w-[400px] aspect-[5/3] relative"
                    style={{backgroundImage: `url(${card})`}}
                    >
                        <div className="absolute bottom-4 left-6 sm:left-10 font-semibold text-black">
                            <h3>{user.name}</h3>
                            <h3>Balance: $ {balance.balance}.00</h3>
                        </div>
                    </div>
                )}
            </section>

            <section
            className="flex justify-center items-center mt-2 md:mt-5 w-full"
            >
                {categoryData.length > 0 && (
                    <div className="w-full max-w-[400px] h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="total"
                                    nameKey="_id"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                        key={entry._id}
                                        fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

        </div>

        {transactions.length === 0 && !error && (
            <p className="text-center mt-8 text-gray-500 px-4">
                No transactions found.
            </p>
        )}

        <hr className="mt-6"/>

        {transactions.length > 0 && (

            <section className="mt-6 px-4 md:px-8">

                <h2 className="text-2xl font-semibold text-center mt-5 mb-6">
                    Recent Transactions
                </h2>

                <div
                className="hidden md:grid grid-cols-6 text-center items-center
                font-medium text-gray-500 px-5 pb-3"
                >
                    <p>Transaction</p>
                    <p>Amount</p>
                    <p>Type</p>
                    <p>Category</p>
                    <p>Payment Mode</p>
                    <p>Date</p>
                </div>

                <div className="hidden md:block space-y-3">

                    {transactions.map((transaction) => (

                        <div
                        className="grid grid-cols-6 items-center
                        text-center bg-white border border-gray-200
                        rounded-2xl shadow-sm px-5 py-4
                        hover:shadow-md transition"
                        key={transaction._id}
                        >

                            <div className="min-w-0 px-2">
                                <h4 className="font-medium break-words">
                                    {transaction.title}
                                </h4>

                                <div className="flex justify-center gap-2 mt-2">

                                    <Link to={`/edit-transaction/${transaction._id}`}>
                                        <button
                                        className="px-3 py-1 text-sm rounded-full
                                        border border-gray-300
                                        hover:bg-gray-100 transition cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                    </Link>

                                    <button
                                    className="px-3 py-1 text-sm rounded-full border border-gray-300
                                    hover: transition cursor-pointer"
                                    onClick={() => handleDelete(transaction._id)}
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>

                            <p className="font-medium break-words">
                                ${transaction.amount}
                            </p>

                            <p className="capitalize break-words">
                                {transaction.type}
                            </p>

                            <p className="break-words">
                                {transaction.category}
                            </p>

                            <p className="break-words">
                                {transaction.payment_mode}
                            </p>

                            <p>
                                {new Date(transaction.date).toLocaleDateString()}
                            </p>

                        </div>

                    ))}

                </div>

                <div className="md:hidden space-y-4">

                    {transactions.map((transaction) => (

                        <div
                        className="bg-white border border-gray-200
                        rounded-2xl p-4 sm:p-5 shadow-sm
                        w-full overflow-hidden"
                        key={transaction._id}
                        >

                            <div className="flex justify-between items-start gap-3">

                                <div className="min-w-0">
                                    <h4 className="font-semibold text-lg break-words">
                                        {transaction.title}
                                    </h4>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {new Date(transaction.date).toLocaleDateString()}
                                    </p>
                                </div>

                                <p className="font-semibold text-lg whitespace-nowrap">
                                    ${transaction.amount}
                                </p>

                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-5 text-sm">

                                <div className="min-w-0">
                                    <p className="text-gray-400">
                                        Type
                                    </p>

                                    <p className="font-medium capitalize break-words">
                                        {transaction.type}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-gray-400">
                                        Category
                                    </p>

                                    <p className="font-medium break-words">
                                        {transaction.category}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-gray-400">
                                        Payment
                                    </p>

                                    <p className="font-medium break-words">
                                        {transaction.payment_mode}
                                    </p>
                                </div>

                            </div>

                            <div className="flex gap-2 mt-5">

                                <Link
                                className="flex-1"
                                to={`/edit-transaction/${transaction._id}`}
                                >
                                    <button
                                    className="w-full py-2 rounded-full
                                    border border-gray-300
                                    hover:bg-gray-100 transition cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                </Link>

                                <button
                                className="flex-1 py-2 rounded-full border border-gray-300
                                hover:transition cursor-pointer"
                                onClick={() => handleDelete(transaction._id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </section>
        )}

        </>
    );
}

export default Home;