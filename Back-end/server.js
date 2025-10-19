const express = require('express');
const app = express();
const PORT = 8080;
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs/promises');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//configure sure to allow other origins to use
const cors = require('cors');
const { default: mongoose } = require('mongoose');
app.use(
    cors(
        {origin: ["http://localhost:5173"]}
    )
);

//get book cover images
app.use('/covers', express.static('uploads'));

let db;

//connect to mongodb server
async function connectDB(){
    const uri = 'mongodb://localhost:27017/';
    const client = new MongoClient(uri);

    try{
        await client.connect();
        db = client.db("BookDB");
        console.log("MongoDB connected successfully.")

        //show port to command line
        app.listen(PORT, () => {
            console.log("Now listening on port " + PORT);
        });
    }
    catch(error){
        console.log("Failed to connect to MongoDB:", error);
        return null;
    }
}
connectDB();

//add data to user collection
app.post("/users", (req, res) => {
    try{
        let collection = db.collection("Users");
        let result = collection.insertOne(req.body);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send("Error");
    }
});

//add data to book collection
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
app.post("/book", upload.single('coverImg'), async (req, res) => {
    try{
        let bookData = {
            ...req.body,
            coverImgPath: req.file ? req.file.path : null
        }
        let collection = db.collection("Books");
        let result = await collection.insertOne(bookData);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send("Error");
    }
});

//add books to userBooks collection
app.post("/userBooks", async (req, res) => {
    const{uID, bID, isRead, rating} = req.body;

    if(!uID || !bID)
        return res.send("Missing user or book ID.");

    let filter;

    const update = {
        $set: {
            isRead: isRead,
            rating: rating
        }
    }

    try{
        filter = {
            uID: new ObjectId(uID),
            bID: new ObjectId(bID)
        }

        let collection = db.collection("UserBooks");
        let result = await collection.updateOne(
            filter,
            update,
            { upsert: true }
        );
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send("Error");
    }
});

//ensure login
app.post("/login", async (req, res) => {
    try{
        const {uName, pass} = req.body;

        const tempUser = await db.collection('Users').findOne({uName: uName});

        if(tempUser){
            if(tempUser.pass.trim() === pass.trim())
            {
                console.log("Success");
                return res.status(200).json({
                    status: "Success",
                    userType: tempUser.uType,
                    userID: tempUser._id.toString()
                });
            }
            else
            {
                console.log("Incorrect Password");
                return res.status(401).json("Incorrect password")
            }
        } else {
            console.log("no user found");
            return res.status(401).json("No user found")
        }
    } catch(e) {
        console.error("Server login error:", e);
        return res.status(500).json({ message: "Internal server error." });
    }
});

//check if username already exists
app.get("/users/checkuser", async (req, res) => {
    try{
        const {uName} = req.query;

        const tempUser = await db.collection("Users").findOne({uName: uName});
        const isTakenStat = !!tempUser;
        return res.status(200).json({isTaken: isTakenStat});
    } catch (e) {
        return res.status(500).json( "Internal server error.");
    }
});

//show books in db
app.get("/books", async (req, res) => {
    try{
        let body = req.body;
        let filter = {};
        if(body)
        {
            filter = {"_id": ObjectId(body._id)};
            console.log(body);
        }
        let collection = db.collection("Books");
        let result = await collection.find(filter).toArray();
        res.json(result);
    }
    catch(e){
        console.log(e);
    }
});

//show user's books in db (got from AI)
app.get("/userBooks/:userID", async (req, res) => {
    const userID = req.params.userID;
    console.log("Hit route for user");
    if(!userID)
        return res.status(400).send("Missing user ID");

    try{
        const userObjectID = new ObjectId(userID);

        const userReadBooks = await db.collection("UserBooks").aggregate([
            {
                $match: {uID: userObjectID, $or: [{isRead: true}, {isRead: "true"}]}
            },
            {
                $addFields: {bookObjectId: { $toObjectId: "$bID" }}
            },
            {
                $lookup: {
                    from: "Books",
                    localField: "bookObjectId",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $project: {
                    _id: "$_id",
                    isRead: 1,
                    rating: 1,
                    title: "$bookDetails.title",
                    author: "$bookDetails.author",
                    genre: "$bookDetails.genre",
                    coverImgPath: "$bookDetails.coverImgPath",
                    pubDate: "$bookDetails.pubDate"
                }
            }
        ]).toArray();

        res.status(200).json(userReadBooks);
        
    } catch (e) {
        console.error("Aggregation Error:", e);
        res.status(500).send({ message: "Error fetching user's read books." });
    }
});

//get book data for update
app.get("/book/:id", async (req, res) => {
    try {
        const bookID = req.params.id;
        if(!bookID){
            return res.json({ message: "Missing book ID." });
        }

        const collection = db.collection("Books");
        const objID = new ObjectId(bookID);
        const result = await collection.findOne({"_id": objID});

        if (!result) {
            return res.json({ message: "Book not found." });
        }

        res.json(result);
    } catch(e) {
        console.log("Error getting book: ", e);
        res.json({ message: "Internal server error or invalid ID format." });
    }
})

//update book in db (got from AI how to update with the cover image path)
app.put("/book/", upload.single('coverImg'), async (req, res) => {
    
    const {_id, title, author, genre, pubDate, description} = req.body;
    let updateFields = {title, author, genre, pubDate, description};
    let oldCovPath = null;

    //check for id
    if(!_id)
    {
        if (req.file) { await fs.unlink(req.file.path).catch(e => console.error("Cleanup error:", e)); }
        return res.status(400).send({ message: "Missing book ID for update." });
    }

    try{
        let collection = db.collection("Books");
        let objid = new ObjectId(req.body._id);
        let filter = {"_id": objid};
        
        //update cover image path
        if(req.file) {
            const tempBook = await collection.findOne(filter);

            if(tempBook && tempBook.coverImgPath)
                oldCovPath = tempBook.coverImgPath;

            const newCovImg = req.file.path;
            updateFields.coverImgPath = newCovImg;
        }

        let result = collection.updateOne(filter, {$set: updateFields}, {upsert: false});
        
        // the book was not found
        if(result.matchedCount === 0) {
            if (req.file) { await fs.unlink(req.file.path).catch(e => console.error("Cleanup error:", e)); }
            return res.status(404).send({ message: "Book not found." });
        }

        //delete the old cover image path
        if (oldCovPath) {
            await fs.unlink(oldCovPath)
                .then(() => console.log(`Successfully deleted old cover: ${oldCovPath}`))
                .catch(err => console.error(`Failed to delete old cover file ${oldCovPath}:`, err));
        }

        res.status(200).send({ message: "Book updated successfully.", result });
    }
    catch(e){
        console.log(e);

        //cleaning: delete new file that was created if update fails
        if (req.file) {
            await fs.unlink(req.file.path).catch(err => console.error("Failed to delete temp file:", err));
        }
        res.send("Error");
    }
});

//delete book in db
app.delete("/book", async (req,res) => {
    try{
        let collection = db.collection("Books");
        let query = {_id: new ObjectId(req.body._id)};

        const book = await collection.findOne(query);
        const oldCovPath = book ? book.coverImgPath : null;
        if(oldCovPath){
            await fs.unlink(oldCovPath)
                .catch(err => console.error(`Failed to delete file ${oldCovPath}:`, err));
        }
        let result = await collection.deleteOne(query);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send("Error");
    }
});