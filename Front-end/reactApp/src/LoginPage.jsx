import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <div>
                <h2>Welcome back!</h2>
                {/* Error message */}
                {errMessage && (
                <p>Error: {errMessage}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <input onChange={handleUsernameChange} type="text" id="username" placeholder="Username"/>
                    <br/>
                    <br/>
                    <input onChange={handlePasswordChange} type="password" id="password" placeholder="Password"/>
                    <br/>
                    <br/>
                    <button type="submit">Log In</button>
                    <button onClick={() => navigate('/newUser')} type="button">Register new account</button>
                </form>
            </div>            
        </>
    )
}
