import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavigationPage } from './NavigationPage';

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
            <NavigationPage/>
            <h2>Books You've Read</h2>
            <br/>

            {Array.isArray(data) && data.length > 0 ? 
            <>
                {data.map( (item) => (
                    <div key={item._id}>
                        <span>
                            <h3>{item.title}</h3>
                            <h4>{item.author} | {item.pubDate}</h4>
                            <h5>{item.genre}</h5>
                            <p>Rating: {item.rating}</p>
                            <img src={`http://localhost:8080/covers/${item.coverImgPath.replace('uploads\\', '').replace('uploads/', '')}`} alt={`Cover for ${item.title}`}/> 
                        </span>
                    </div>
                ))}
            </>
            : <><p>You have not marked any books yet!</p></>
            }
        </>
    );
}