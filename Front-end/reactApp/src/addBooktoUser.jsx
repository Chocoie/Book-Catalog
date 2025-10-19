import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export function AddBooktoUser ({bookIDFromCat, userIDFromAcc})
{
    const[isRead, setIsRead] = useState(false);
    const[initialIsRead, setInitialIsRead] = useState(false);
    const[rating, setRating] = useState("");
    const[message, setMessage] = useState("");

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
            setRating("");
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    //add a book to user's catalog
    async function addBookForUser(event)
    {
        event.preventDefault();

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
            <form onSubmit={addBookForUser}>
                {!initialIsRead ? (
                    <>
                        <input type="checkbox" id={`readMark-${bookIDFromCat}`} checked={isRead} onChange={handleReadChange}/>
                        <label htmlFor={`readMark-${bookIDFromCat}`}>Read</label>
                        <br/>
                        {isRead && (
                            <>
                                <label htmlFor={`rating-${bookIDFromCat}`}>Rating</label>
                                <select id={`rating-${bookIDFromCat}`} value={rating} onChange={handleRatingChange} required>
                                    <option value="" disabled>Rate</option>
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>

                                <button type="submit">Save</button>
                                {message && <p>{message}</p>}
                            </>
                        )}
                    </>) : (<><p>Already Read</p></>)
                }
            </form>
        </>
    )
}