import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            <div>
                <h2>Add a book to the Catalog</h2>
                <form onSubmit={handleSubmit} key={formKey}>
                    <input onChange={handleTitleChange} type="text" id="title" placeholder="Book Title" value={title} required/>
                    <br/>
                    <br/>
                    <input onChange={handleAuthorChange} type="text" id="author" placeholder="Book Author" value={author} required/>
                    <br/>
                    <br/>
                    <input onChange={handleGenreChange} type="text" id="genre" placeholder="Book Genre" value={genre} required/>
                    <br/>
                    <br/>
                    <input onChange={handleCoverChange} type="file" id="bookImg" accept="image/png, image/jpeg, image/webp" placeholder="Book Cover" required/>
                    <br/>
                    <br/>
                    <input onChange={handleDateChange} type="text" id="pubDate" pattern="\d{4}" placeholder="Publishing Date Year" maxLength={4} value={date} required/>
                    <br/>
                    <br/>
                    <input onChange={handleDescriptionChange} type="text" id="description" placeholder="Book Description" value ={description} required/>
                    <br/>
                    <br/>
                    <button type="submit">Add Book</button>
                    <br/>
                    {message && (
                        <p>{message}</p>
                    )}
                    <br/>
                    <button onClick={()=> navigate('/catalog')}  type="click">Back to Catalog</button>
                </form>
            </div>
        </>
    )
}