import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavigationPage } from './NavigationPage.jsx';
import { AddBooktoUser } from './addBooktoUser.jsx';
import './CSS/ShowCat.css'

export function ShowCat()
{
    const [userRole, setUserRole] = useState(null);
    const [userID, setUserID] = useState(null);
    let [data, setData] = useState([]);
    const navigate = useNavigate();

    const isAdmin = (userRole === 'Administrator');

    useEffect(() => {
        const role = localStorage.getItem('userType');
        if(role){
            setUserRole(role);
        }

        const id = localStorage.getItem('_id');
        if(id)
            setUserID(id);

        const fetchData = async () => {
            try
            {
                let response = await fetch('http://localhost:8080/Books');
                let theJson = await response.json();
                console.log(theJson);
                setData(theJson); 
            }
            catch (error) {console.log(error)};
        };

        fetchData();
    }, []);
    

    return(
        <>
            <main class="showBooksMain">
                <h2 id="bookCath2">Book Catalog</h2>
                <NavigationPage/>
                <br/>
                {data && data.length > 0 ? 
                <>
                    {data.map( (item) => (
                        <div class="bookDiv" key={item._id}>
                            <img id="bookImg" src={`http://localhost:8080/covers/${item.coverImgPath.replace('uploads\\', '').replace('uploads/', '')}`} alt={`Cover for ${item.title}`}/> 
                            <div class="bookText">
                                {!isAdmin && (
                                    <AddBooktoUser id="addToUserCat" bookIDFromCat={item._id} userIDFromAcc={userID}/>
                                )}
                                {isAdmin && (
                                        <img id="editIcon" src="editing.png" alt="edit icon" onClick={() => navigate(`/editBook/${item._id}`)}/>
                                )}
                                <h3 id="bookTitle">{item.title}</h3>
                                <h4 id="bookAuthorDate">{item.author} | {item.pubDate}</h4>
                                <h5 id="bookGenre">{item.genre}</h5>
                                <p id="bookDescription">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </>
                : <><p id="noBooksp">No books in the catalog</p></>
                }
            </main>
        </>
    );
}