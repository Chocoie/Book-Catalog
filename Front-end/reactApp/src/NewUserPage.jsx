import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/NewUserPage.css'


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
            const userData = await response.json();
            return {
                _id: userData._id,
                uType: doc.uType
            };
        } else {
            return null;
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

        //check if any fields are empty
        if(!firstname || !lastname || !username || !password || !password2 || !usertype)
        {
            setError("All fields are required!");
            return;
        }

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

        //stores userType and user id in local storage
        const userData = await addNewUser();
        if(typeof userData === 'object' && userData !== null) {
            localStorage.setItem('userType', userData.uType);
            localStorage.setItem('_id', userData._id);

            console.log("routing...")
            navigate('/catalog');
        } else {
            setError("Account creation error");
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
            <main class="newUserMain">
                <h2 id="createNewAccounth2">Create a new account</h2>
                {error && (
                <p id="newUserError">
                    Error: {error}
                </p>
                )}
                <form class="newUserForm">
                    <input onChange={handleFirstNameChange} type="text" class="newUserInputTyped" id="firstName" placeholder="First Name" required/>
                    <br/>
                    <br/>
                    <input onChange={handleLastNameChange} type="text" class="newUserInputTyped" id="lastName" placeholder="Last Name" required/>
                    <br/>
                    <br/>
                    <input onChange={handleUsernameChange} onBlur={() => checkUName(username)} type="text" class="newUserInputTyped" id="newUName" placeholder="Username" required/>
                    <br/>
                    <br/>
                    <input onChange={handlePasswordChange} type="password" class="newUserInputTyped" id="newUserPass" placeholder="Password" required/>
                    <br/>
                    <br/>
                    <input onChange={handlePassword2Change} type="password" class="newUserInputTyped" id="newUserPass2" placeholder="Confirm Password" required/>
                    <br/>
                    <br/>                    
                    <label id="selectUserLabel">Select User Type:</label>
                    <br/>
                    <div class="radioButtons">
                        <input onChange={handleUserTypeChange} type="radio" id="adminInput" name="userType" value="Administrator" required/>
                        <label for="adminInput">Administrator</label>
                        <input onChange={handleUserTypeChange} type="radio" id="standInput" name="userType" value="Standard" required/>
                        <label for="standInput">Standard</label>
                        <br/>
                    </div>
                    <div class="newUserButtons">
                        <button id="createAcc" onClick={redirectUser} type="button">Create Account</button>
                        <br/>
                        <p id="alreadyHave">Already have an account?</p>
                        <button id="newUserLogin" onClick={() => navigate('/login')} type="button">Login</button>
                    </div>
                </form>
            </main>
        </>
    )
}