import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/LoginPage.css'

export function LoginPage()
{
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[errMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()

    function handleUsernameChange(data)
    {
        setUsername(data.target.value);
    }

    function handlePasswordChange(data)
    {
        setPassword(data.target.value);
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        setErrorMessage("");

        if(!username || !password)
        {
            setErrorMessage("All fields are required!");
            return;
        }

        //allows user to login if conditions are met
        axios.post('http://localhost:8080/login', {uName: username, pass: password})
        .then(result => {
            if(result.data.status === "Success")
            {
                const userType = result.data.userType;
                const userID = result.data.userID;
                if(userType && userID)
                {
                    localStorage.setItem('userType', userType);
                    localStorage.setItem('_id', userID);
                    navigate('/catalog');
                }
            }
        })
        .catch(err => {
            console.log(err);
            if (err.response){
                if(err.response.status === 401) {
                    const failMessage = err.response.data;
                    setErrorMessage(failMessage);
                }
            } else {
                console.log("Network error: ", err);
                setErrorMessage("A network or server error occurred. Please try again.");
            }
        })
    }    

    return(
        <>
            <main class="loginMain">
                <h2 class="welcomeBackh2">Welcome Back!</h2>
                <br/>
                {/* Error message */}
                {errMessage && (
                <p id="loginError">Error: {errMessage}</p>
                )}

                <form class="loginForm" onSubmit={handleSubmit}>
                    <input id="loginUName" onChange={handleUsernameChange} type="text" placeholder="Username"/>
                    <br/>
                    <br/>
                    <input id="loginPass" onChange={handlePasswordChange} type="password" placeholder="Password"/>
                    <br/>
                    <br/>
                    <div class="loginButtons">
                        <button id="registerNew"onClick={() => navigate('/newUser')} type="button">Sign Up</button>
                        <button id="loginSubmit" type="submit">Log In</button>
                    </div>
                </form>
            </main>            
        </>
    )
}
