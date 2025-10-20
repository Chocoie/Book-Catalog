import { useNavigate } from 'react-router-dom'
import './CSS/Welcome.css';

export function Welcome()
{
    const navigate = useNavigate();
    return(
        <>
            <main class="welcomeMain"> 
                <h1>Welcome to the Book Catalog!</h1>
                <br/>
                <div class="welcomeButtons">
                    <button id="newUser" type="button" onClick={() => navigate('/newUser')}>Sign Up</button>
                    <button id="existingUser" type="button" onClick={() => navigate('/login')}>Login</button>
                </div>
            </main>
        </>
    )
}