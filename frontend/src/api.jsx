export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export async function authfetch(url, options={}){
    const token = localStorage.getItem('accessToken');

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, {...options, headers});

    if(res.status === 401){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href="/";
        return;
    }
    return res;
}