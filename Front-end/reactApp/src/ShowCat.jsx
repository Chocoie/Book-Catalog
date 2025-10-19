import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavigationPage } from './NavigationPage.jsx';
import { AddBooktoUser } from './addBooktoUser.jsx';

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
            <h2>Book Catalog</h2>
            <NavigationPage/>
            <br/>

            {isAdmin && (
                <button onClick={() => navigate('/addBook')} type="button">Add Book</button>
            )}

            {data && data.length > 0 ? 
            <>
                {data.map( (item) => (
                    <div key={item._id}>
                        <span>
                            <h3>{item.title}</h3>
                            {isAdmin && (
                                <button onClick={() => navigate(`/editBook/${item._id}`)} type="button">Edit Book</button>
                            )}
                            {!isAdmin && (
                                <AddBooktoUser bookIDFromCat={item._id} userIDFromAcc={userID}/>
                            )}
                            <h4>{item.author} | {item.pubDate}</h4>
                            <h5>{item.genre}</h5>
                            <p>{item.description}</p>
                            <img src={`http://localhost:8080/covers/${item.coverImgPath.replace('uploads\\', '').replace('uploads/', '')}`} alt={`Cover for ${item.title}`}/> 
                        </span>
                    </div>
                ))}
            </>
            : <><p>No books in the catalog</p></>
            }
        </>
    );
}