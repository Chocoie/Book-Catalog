Hello! Welcome to my project 2, The Book Catalog! 
This project utilizes the MERN stack development technologies as well as implements the CRUD operations.

**To start my webserver:
    1. Open the terminal (one for the front-end, one for the back-end).
    2. Run the back-end in the first terminal.
        a. "cd Book Catalog\Back-end"
        b. "node server.js"
    4. In MongoDB compass create a new connection called "Book Catalog".
        a. The URI should be "mongodb://localhost:27017/"
    5. Create a new database under the "Book Catalog" connection called "BookDB".
    6. Create 3 collections:
        a. "Books"
        b. "UserBooks"
        c. "Users"
    3. Run the front-end in the second terminal.
        a. "cd Book Catalog\Front-end\reactApp"
        b. "npm run dev"
    4. In your browser go to "http://localhost:5173/" (should now see the welcome page).


**There are two types of user roles:
1. Administrator:
    a. View the catalog
    b. Be able to add a book to the catalog.
    c. Edit a book in the catalog.
        I. On this page the Administrator will be able to update or delete a book in the catalog.
2. Standard:
    a. View the catalog
    b. Add books to their own catalog of read books.


**Example books to add to the catalog (role must be 'Administrator'):
1. 
    Title: "Project Hail Mary"
    Author: "Andy Weir"
    Genre: "Science Fiction"
    Cover: "ProjectHailMary.jpg"
    Publishing Data: "2021"
    Description: "Project Hail Mary is a 2021 science fiction novel by Andy Weir about a junior high science teacher, Ryland Grace, who wakes up alone on a spaceship with amnesia. He gradually pieces together that he is on a mission to save Earth from an extinction-level event caused by a solar-dimming organism. As he works to solve the scientific mystery, he encounters and befriends an alien engineer from another star system, and the two form an unlikely partnership to save both their species."
2.
    Title: "To Kill A MockingBird"
    Author: "Harper Lee"
    Genre: "Southern Fiction"
    Cover: "ToKillAMockingbird.jpg"
    Publishing Data: "1960"
    Description: "To Kill a Mockingbird is a 1960 novel by Harper Lee that describes a Southern town's prejudice through the eyes of a young girl named Scout Finch. The story is centered on her widowed father, a lawyer named Atticus Finch, who defends a Black man, Tom Robinson, against false accusations of rape in the Depression-era South. The novel explores themes of racism, injustice, and courage while also serving as a coming-of-age story for Scout and her brother, Jem."
3. 
    Title: "1984"
    Author: "George Orwell"
    Genre: "Science Fiction"
    Cover: "1984.jpg"
    Publishing Data: "1949"
    Description: "George Orwell's 1984 is a dystopian novel published in 1949 that portrays a totalitarian society ruled by the Party and its figurehead, Big Brother. The story follows protagonist Winston Smith as he secretly rebels against the Party's oppressive control through surveillance, historical manipulation, and thought-policing, but is ultimately broken and forced to love Big Brother. The book is a cautionary tale about the dangers of totalitarianism, surveillance, and the manipulation of truth."
4.
    Title: "Malibu Raising"
    Author: "Taylor Jenkins Reid"
    Genre: "Historical Fiction"
    Cover: "MalibuRaising.jpg"
    Publishing Data: "2021"
    Description: "Malibu Rising is a novel by Taylor Jenkins Reid about the Riva family, four famous siblings who throw an epic end-of-summer party in Malibu in 1983. Over 24 hours, the party descends into chaos as the siblings are forced to confront their family's history, including the scandalous legacy of their legendary singer father, Mick Riva, and their own personal drama and secrets. The story is a family drama that culminates with the Riva mansion catching fire"

***(I have provided the example book covers jpgs in "Book Catalog\Front-end\Book Covers")***