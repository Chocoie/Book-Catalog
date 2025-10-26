import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './CSS/AddBooktoUser.css'

export function AddBooktoUser ({bookIDFromCat, userIDFromAcc})
{
    const[isRead, setIsRead] = useState(false);
    const[initialIsRead, setInitialIsRead] = useState(false);
    const[rating, setRating] = useState("");
    const[message, setMessage] = useState("");
    const[isOpen, setIsOpen] = useState(false);

    useEffect(()=> {
        if(!bookIDFromCat || !userIDFromAcc) return;

         const fetchIsRead = async () => {
            try{
                let response = await fetch(`http://localhost:8080/userActivity/status/${userIDFromAcc}/${bookIDFromCat}`);

                if(response.ok)
                {
                    let theJson = await response.json();
                    setInitialIsRead(theJson.isRead || false);
                }
            }
            catch (error) {console.log(error)};
        }
        fetchIsRead();
    }, [bookIDFromCat, userIDFromAcc]);

    const handleReadChange = (e) => {
        const isChecked = e.target.checked;
        setIsRead(isChecked);

        if(!isChecked)
        {
            setRating("");
            setIsOpen(false);
        }
    };

    const dropdown = () => {
        setIsOpen(prev => !prev);
    }

    const handleRatingChange = (e) => {
        const newRating = e.currentTarget.getAttribute('data-value');
        e.stopPropagation();

        setRating(newRating);
        setIsOpen(false);
    };   

    //add a book to user's catalog
    async function addBookForUser(event)
    {
        event.preventDefault();

        if (isRead && rating === "")
        {
            setMessage("Please select a rating.");
            return;
        }

        let doc = {
            uID: userIDFromAcc,
            bID: bookIDFromCat,
            isRead: isRead,
            rating: rating || null
        }

        console.log("Attpemting to send data: ", doc);

        try{
            let response = await fetch("http://localhost:8080/userBooks", {
                method: "POST",
                body: JSON.stringify(doc),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok)
                setMessage("Marked as read");
        } catch(e) {
            console.error(e);
        }
    }    

    return(
        <>
            <form class="addBookToUser" onSubmit={addBookForUser}>
                {!initialIsRead ? (
                    <>
                        <label class="readContainer" htmlFor={`readMark-${bookIDFromCat}`}> Read
                            <input type="checkbox" id={`readMark-${bookIDFromCat}`} checked={isRead} onChange={handleReadChange}/>
                            <span id={`checkBox-${bookIDFromCat}`}></span>
                        </label>
                        {isRead && (
                            <>
                                <div 
                                    id={`rating-${bookIDFromCat}`} 
                                    className={`dropdownContainer ${isOpen ? 'open' : ''}`} 
                                    onClick={dropdown}
                                >
                                    <span class="dropdownValue">
                                        {rating ? `${rating} Star${rating > 1 ? 's' : ''}` : 'Rate ▼'}
                                    </span>
                                    <ul class="dropdownOptionsList">
                                        <li class="dropdownOption" data-value="1" onClick={handleRatingChange}>1 Star</li>
                                        <li class="dropdownOption" data-value="2" onClick={handleRatingChange}>2 Stars</li>
                                        <li class="dropdownOption" data-value="3" onClick={handleRatingChange}>3 Stars</li>
                                        <li class="dropdownOption" data-value="4" onClick={handleRatingChange}>4 Stars</li>
                                        <li class="dropdownOption" data-value="5" onClick={handleRatingChange}>5 Stars</li>
                                    </ul>
                                </div>
                                <br/>
                                <button id="submitRating" type="submit">Save</button>
                                {message && <p id="readMessage">{message}</p>}
                            </>
                        )}
                    </>) : (<><p>Already Read</p></>)
                }
            </form>
        </>
    )
}