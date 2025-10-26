import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavigationPage } from './NavigationPage';
import './CSS/UserBooks.css'

export function UserBooks()
{
    const [userID, setUserID] = useState(null);
    let [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userID = localStorage.getItem('_id');
        if(userID){
            setUserID(userID);
        }

        const fetchUserBooks = async () => {
            if(!userID)
            {
                console.log("UserID missing during fetch attempt.");
                return;
            }

            try
            {
                let response = await fetch(`http://localhost:8080/userBooks/${userID}`);
                if(!response.ok)
                    throw new Error('Failed to fetch user books');

                let theJson = await response.json();
                console.log(theJson);
                setData(theJson); 
            }
            catch (error) {console.log(error)};
        };

        fetchUserBooks();
    }, []);
    

    return(
        <>
            <main class="userBooksCatMain">
                <h2 id="userBooksh2">Books You've Read</h2>
                <NavigationPage/>
                <br/>

                {Array.isArray(data) && data.length > 0 ? 
                <>
                    {data.map( (item) => (
                        <section class="userBooks" key={item._id}>
                            <img id="bookImgUser" src={`http://localhost:8080/covers/${item.coverImgPath.replace('uploads\\', '').replace('uploads/', '')}`} alt={`Cover for ${item.title}`}/> 
                            <div class="bookInfo">
                                <h3 id="bookTitleUser">{item.title}</h3>
                                <h4 id="bookAuthorDateUser">{item.author} | {item.pubDate}</h4>
                                <h5 id="bookGenreUser">{item.genre}</h5>
                                <p id="bookRatingUser">Rating: {item.rating}</p>
                            </div>                            
                        </section>
                    ))}
                </>
                : <><p id="noBooksMarked">You have not marked any books yet!</p></>
                }
            </main>
        </>
    );
}