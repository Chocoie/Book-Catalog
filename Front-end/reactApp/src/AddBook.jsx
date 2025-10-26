import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/AddBook.css'

export function AddBook()
{
    const[title, setTitle] = useState("");
    const[author, setAuthor] = useState("");
    const[genre, setGenre] = useState("");
    const[coverImg, setCoverImg] = useState(null);
    const[date, setPubDate] = useState("");
    const[description, setDescription] = useState("");
    const[message, setMessage] = useState("");
    const[formKey, setFormKey] = useState(0);
    const navigate = useNavigate();

    //add new book to the catalog
    async function handleSubmit(event){
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('genre', genre);
        formData.append('pubDate', date);
        formData.append('description', description);

        if(coverImg){
            formData.append('coverImg', coverImg);
        }

        try{
            let response = await fetch("http://localhost:8080/book", {
                method: "POST",
                body: formData
            });

            if(response.ok)
            {
                setTitle("");
                setAuthor("");
                setGenre("");
                setPubDate(""); 
                setDescription("");
                setCoverImg(null);

                const coverFile = document.getElementById('bookImg');
                if(coverFile)
                    coverFile.value = '';

                setFormKey(prevKey => prevKey + 1);
                setMessage("Book was successfully added to the catalog!")
            }
            else
                setMessage("Something went wrong!");
        } catch (e) {
            console.log(e);
        }
    }
    

    function handleTitleChange(data)
    {
        setTitle(data.target.value);
    }

    function handleAuthorChange(data)
    {
        setAuthor(data.target.value);
    }

    function handleGenreChange(data)
    {
        setGenre(data.target.value);
    }

    function handleCoverChange(data)
    {
        setCoverImg(data.target.files[0]);
    }

    function handleDateChange(data)
    {
        setPubDate(data.target.value);
    }

    function handleDescriptionChange(data)
    {
        setDescription(data.target.value);
    }

    return(
        <>
            <main class="addNewBookMain">
                <h2 id="addNewBookh2">Add a book to the Catalog</h2>
                <form class="addNewBookForm" onSubmit={handleSubmit} key={formKey}>
                    <input onChange={handleTitleChange} type="text" id="addBookTitle" placeholder="Book Title" value={title} required/>
                    <br/>
                    <br/>
                    <input onChange={handleAuthorChange} type="text" id="addBookAuthor" placeholder="Book Author" value={author} required/>
                    <br/>
                    <br/>
                    <input onChange={handleGenreChange} type="text" id="addBookGenre" placeholder="Book Genre" value={genre} required/>
                    <br/>
                    <br/>
                    <input onChange={handleCoverChange} type="file" id="addBookImg" accept="image/png, image/jpeg, image/webp" placeholder="Book Cover" required/>
                    <br/>
                    <br/>
                    <input onChange={handleDateChange} type="text" id="addBookPubDate" pattern="\d{4}" placeholder="Publishing Date Year" maxLength={4} value={date} required/>
                    <br/>
                    <br/>
                    <textarea onChange={handleDescriptionChange} rows="5" cols="40" id="addBookDescription" placeholder="Book Description" value={description} required/>
                    <br/>
                    <br/>
                    <button id="addNewBookButton" type="submit">Add Book</button>
                    <br/>
                    {message && (
                        <p id="addNewBookMessage">{message}</p>
                    )}
                    <button id="backToCat" onClick={()=> navigate('/catalog')}  type="click">Back to Catalog</button>
                </form>
            </main>
        </>
    )
}