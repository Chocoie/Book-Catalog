import { use, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { redirect, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';


export function NewUserPage()
{
    const[firstname, setFirstName] = useState("");
    const[lastname, setLastName] = useState("");
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[password2, setSecondPassword] = useState("");
    const[usertype, setType] = useState("");
    const[isUNameTaken, setIsUNameTaken] = useState(false);
    const[error, setError] = useState("");
    const navigate = useNavigate();

    async function addNewUser()
    {
        let doc = {
            fName: firstname,
            lName: lastname,
            uName: username,
            pass: password,
            uType: usertype
        }

        //fetch
        let response = await fetch("http://localhost:8080/users", {
            method: "POST",
            body: JSON.stringify(doc),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        //check if response was successful
        if(response.ok){
            return true;
        } else {
            return false;
        }
    }

    const checkUName = async() => {
        try {
            const response = await axios.get('http://localhost:8080/users/checkuser', {params: {uName: username}});
            const taken = response.data.isTaken;
            setIsUNameTaken(taken);
            return taken;
        } catch (error) {
            console.error("Failed to check username:", error);
            return true; 
        }
    };

    //redirect use to the catalog page
    async function redirectUser(event)
    {
        event.preventDefault();
        setError("");

        //check if username already exists
        const isTaken = await checkUName();
        if(isTaken)
        {
            setError("Username is already taken. Try again.");
            return;
        }

        //ensure passwords match
        if(password !== password2){
            setError("Passwords do not match. Please try again.");
            return;
        }

        const success = await addNewUser();
        if(success) {
            console.log("routing...")
            navigate('/catalog');
        } else {
            setError("Account creation error")
        }

    }

    function handleFirstNameChange(data)
    {
        setFirstName(data.target.value);
    }

    function handleLastNameChange(data)
    {
        setLastName(data.target.value);
    }

    function handleUsernameChange(data)
    {
        setUsername(data.target.value);
        setIsUNameTaken(false);
        setError("");
    }

    function handlePasswordChange(data)
    {
        setPassword(data.target.value);
    }

    function handlePassword2Change(data)
    {
        setSecondPassword(data.target.value);
    }

    function handleUserTypeChange(data)
    {
        setType(data.target.value);
    }

    return(
        <>
            <div>
                <h2>Create a new account</h2>
                {error && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                    Error: {error}
                </p>
                )}
                <form>
                    <input onChange={handleFirstNameChange} type="text" id="firstName" placeholder="First Name" required/>
                    <input onChange={handleLastNameChange} type="text" id="lastName" placeholder="Last Name" required/>
                    <br/>
                    <br/>
                    <input onChange={handleUsernameChange} onBlur={() => checkUName(username)} type="text" id="username" placeholder="Username" required/>
                    <br/>
                    <br/>
                    <input onChange={handlePasswordChange} type="password" id="password" placeholder="Password" required/>
                    <br/>
                    <br/>
                    <input onChange={handlePassword2Change} type="password" id="password2" placeholder="Password" required/>
                    <br/>
                    <br/>                    
                    <label>Select User Type:</label>
                    <br/>
                    <input onChange={handleUserTypeChange} type="radio" id="adminInput" name="userType" value="Administrator" required/>
                    <label for="adminInput">Administrator</label>
                    <br/>
                    <input onChange={handleUserTypeChange} type="radio" id="standInput" name="userType" value="Standard" required/>
                    <label for="standInput">Standard</label>
                    <br/>
                    <br/>
                    <button onClick={redirectUser} type="button">Create Account</button>
                    <br/>
                    <p>Already have an account?</p>
                    <button onClick={() => navigate('/login')} type="button">Login</button>
                </form>
            </div>
        </>
    )
}