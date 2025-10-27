import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './CSS/Navigation.css'

export function NavigationPage()
{
    const [userRole, setUserRole] = useState(null);
    let [data, setData] = useState([]);
    const navigate = useNavigate();

    const isStand = (userRole === 'Standard');

    useEffect(() => {
        const role = localStorage.getItem('userType');
        if(role){
            setUserRole(role);
        }

        const fetchData = async () => {
            try
            {
                let response = await fetch('http://localhost:8080/userBooks');
                let theJson = await response.json();
                console.log(theJson);
                setData(theJson); 
            }
            catch (error) {console.log(error)};
        };

        fetchData();
    }, []);

    //logs user out of application
    const logout = () => {
        localStorage.removeItem('userType');
        window.location.href = '/';
    }

    return (
        <>
            <section class="navigationBar">
                <button id="catNavButton" onClick={() => navigate('/catalog')} type="button">Catalog</button>
                {isStand ? (
                    <button id="userBooksNavButton" onClick={() => navigate('/userBooks')} type="button">User Books</button>
                ): <button id="addBookNavButton" onClick={() => navigate('/addbook')} type="button">Add Book</button>}
                <button id="logoutNavButton" onClick={logout} type="button">Log Out</button>
            </section>
        </>
    )
}