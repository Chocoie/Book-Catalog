import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export function EditBook()
{
    const{bookID} = useParams();

    const[title, setTitle] = useState("");
    const[author, setAuthor] = useState("");
    const[genre, setGenre] = useState("");
    const[coverImg, setCoverImg] = useState(null);
    const[date, setPubDate] = useState("");
    const[description, setDescription] = useState("");
    const[currBook, setCurrBook] = useState(null);
    const[message, setMessage] = useState("");
    const navigate = useNavigate();

    //get the book data
    useEffect(() => {
        async function getBookData() {
            if(!bookID) return;

            try{
                let response = await fetch(`http://localhost:8080/book/${bookID}`);
                if(!response.ok)
                    throw new Error('Failed to get book data');
                const bookData = await response.json();

                setCurrBook(bookData);
                setTitle(bookData.title || "");
                setAuthor(bookData.author || "");
                setGenre(bookData.genre || "");
                setPubDate(bookData.pubDate || "");
                setDescription(bookData.description || "");
            } catch(e) {
                console.error("Error getting book: ", e);
            }
        }
        getBookData();
    }, [bookID, navigate]);

    //update book data
    async function updateBook(event)
    {
        event.preventDefault();
        setMessage("");
        let updateData = new FormData();
        updateData.append('_id', bookID);
        updateData.append('title', title);
        updateData.append('author', author);
        updateData.append('genre', genre);
        updateData.append('pubDate', date);
        updateData.append('description', description);

        if(coverImg){
            updateData.append('coverImg', coverImg);
        }

        let response = await fetch("http://localhost:8080/book",
            {
                method: "PUT",
                body: updateData
            }
        )

        if(response.ok)
            setMessage("Book successfully updated!");
        else
            setMessage("Something went wrong updating!");
    }

    //delete book
    async function deleteBook(event)
    {
        event.preventDefault();
        setMessage("");

        const bookToDelete = {
            "_id": bookID
        } 

        let response = await fetch("http://localhost:8080/book",
            {
                method: "DELETE", 
                body: JSON.stringify(bookToDelete),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
        if(response.ok)
            setMessage("Book successfully deleted!");
        else
            setMessage("Something went wrong with deletion!");
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
        setGenre(data.targe.value);
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
                <h2>Update a book to the Catalog</h2>
                <form onSubmit={updateBook}>
                    <input onChange={handleTitleChange} type="text" id="title" placeholder="Book Title" value={title} required/>
                    <br/>
                    <br/>
                    <input onChange={handleAuthorChange} type="text" id="author" placeholder="Book Author" value={author} required/>
                    <br/>
                    <br/>
                    <input onChange={handleGenreChange} type="text" id="genre" placeholder="Book Genre" value={genre} required/>
                    <br/>
                    <br/>
                    {currBook && currBook.coverImgPath && (
                        <>
                            <p>Current Cover:</p>
                            <img 
                                src={`http://localhost:8080/covers/${currBook.coverImgPath.replace('uploads\\', '').replace('uploads/', '')}`}
                                alt="Current Book Cover"
                            />
                        </>
                    )}
                    <br/>
                    <br/>
                    <label>Select new file to change cover:</label>
                    <input onChange={handleCoverChange} type="file" id="bookImg" accept="image/png, image/jpeg, image/webp" placeholder="Book Cover"/>
                    <br/>
                    <br/>
                    <input onChange={handleDateChange} type="text" id="pubDate" pattern="\d{4}" placeholder="Publishing Date Year" maxLength={4} value={date} required/>
                    <br/>
                    <br/>
                    <input onChange={handleDescriptionChange} type="text" id="description" placeholder="Book Description" value={description} required/>
                    <br/>
                    <br/>
                    <button type="submit">Update Book</button>
                    <button onClick={deleteBook} type="button">Delete Book</button>
                    {message && (
                        <p>{message}</p>
                    )}
                    <br/>
                    <button onClick={()=> navigate('/catalog')}  type="button">Back to Catalog</button>
                </form>
            </div>
        </>
    )
}