import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useNavigate } from 'react-router-dom'

function Welcome()
{
    const navigate = useNavigate();
    return(
        <>
            <h1>Welcome to the Book Catalog!</h1>
            <button type="button" onClick={() => navigate('/newUser')}>New User</button>
            <button type="button" onClick={() => navigate('/login')}>Existing User</button>
        </>
    )
}

export default Welcome;