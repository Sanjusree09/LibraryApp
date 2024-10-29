const express = require('express');
const app = express();
const port = 3600;
//const { v4: uuidv4 } = require('uuid');
const jetit  = require('@jetit/id');


app.use(express.json());

let bookList = [];
let adminRegister = [];
let memberList = [];
let registry = [];

//AUTHENTICATION
app.post('/admin/Signup', (req, res) => {
    const {id, name, email, role  } = req.body;
    if (!name || !email || !role) {
        return res.status(400).send('Signup Unsuccessful need name, email, role');
    }

    const signup = {id:jetit.generateID(), name, email, role };
    adminRegister.push(signup);
    console.log("Admin Signup UserId", signup.id);
    res.status(201).send('Signup Successful');
});
app.get('/admin/:name', (req, res) => {
    const name = req.params['name'];
    const adminLogin = adminRegister.find(user => user.name === name);
    console.log('Login:',adminLogin)
    if (!adminLogin) {
        return res.status(404).send('User not found');
    }
   res.send(adminLogin);
});

app.patch('/admin/updateAdminDetails/:name', (req, res) => {
    const name = req.params['name'].trim();
    const user = adminRegister.find(update => update.name === name);
    console.log('User from Patch:', user);
    if (!user) {
        return res.status(404).send('Admin not found');
    }

    Object.keys(req.body).forEach(key => {
        if (user[key] !== undefined) {
            user[key] = req.body[key];
        }
    });

    return res.status(200).send('Admin Details Updated Successfully');
});

app.delete('/admin/deleteadmin/:name', (req, res) => {
    const del = req.params['name'].trim();
    const userIndex = adminRegister.findIndex(deleteUser => deleteUser.name === del);
    if (userIndex === -1) {
        return res.status(404).send('Admin Details not Found');
    }

    adminRegister.splice(userIndex, 1);
    return res.status(200).send('Admin deleted successfully');
});


app.get('/admin/Signup', (req, res) => {
    res.send(adminRegister);
});



//LIST OF BOOKS
app.post('/addBooks', (req, res) => {
    const {id, title, author, quantity, edition } = req.body;

    if (!title || !author || !quantity ||!edition) {
        return res.status(400).json({ error: 'Title, Author, Quantity and Edition are required' });
    }

    
    const existingBook = bookList.find(b => b.title.toLowerCase() === title.toLowerCase());
    if (existingBook) {
        return res.status(400).json({ error: 'A book with this title already exists' });
    }

    const newBook = {id: jetit.generateID('HEX'), title, author, quantity, edition};

    bookList.push(newBook);
    console.log('Book ID',newBook.id + ' ' + 'BookTitle:' + newBook.title);
    res.status(201).json(newBook);
});

app.get('/bookList/getBooks/:id', (req, res) => {
    const id = req.params['id'];
    const book = bookList.find(book => book.id === id);
   
    if (!book) {
        return res.status(404).send('Book not found');
    }
    res.send(book);
});

app.put('/bookList/updateBooks/:id', (req, res) => {
    const id = req.params['id'];
    console.log('Updating book with ID:', id); 

    const { title, author, quantity, edition } = req.body;
    const book = bookList.find(book => book.id === id);
    if (!book) {
         res.status(404).send('Book not found');
    }
    console.log('Title:', title);

    if (title) book.title = title;
    if (author) book.author = author;
    if (quantity) book.quantity = quantity;
    if (edition) book.edition = edition;

     res.status(200).send('Book Updated Successfully');
});

app.patch('/bookList/updateBook/:id', (req, res) => {
    const id = req.params['id'];
    const book = bookList.find(book => book.id === id);
    //console.log('Book from Patch:', user);
    if (!book) {
        return res.status(404).send('Book not found');
    }

    Object.keys(req.body).forEach(key => {
        if (book[key] !== undefined) {
            book[key] = req.body[key];
        }
    });

    return res.status(200).send('Book Details Updated Successfully');
});

// app.delete('/bookList/deleteBooks/:id', (req, res) => {
//     const id = req.params['id'].trim();
//     const bookIndex = bookList.findIndex(book => book.bookId === id);
//     if (bookIndex === -1) {
//         return res.status(404).send('Book not Found');
//     }

//     bookList.splice(bookIndex, 1);
//     return res.status(200).send('Book deleted successfully');
// });




app.get('/addBooks', (req, res) => {
    res.send(books);
});

// app.get('/getAllBooks/:name', (req, res) => {
//     const{id, title, author} = req.body;
//     const book = bookList.find(b => b.id == id);
//     if(!book){
//         res.send("not found");
//     }
//     res.send(book);

// })


//*********************************PATRON DETAILS***************************************** */
app.post('/member/Signup', (req, res) => {
    const {id, name, email, contactNumber, address, occupation } = req.body;

    if (!name || !email || !contactNumber ||!address ||!occupation) {
        return res.status(400).json({ error: 'name, email, contactNumber, address and occupation are required' });
    }

    // Check if a book with the same title already exists (case-insensitive)
    const existingMember = memberList.find(b => b.name.toLowerCase() === name.toLowerCase());
    if (existingMember) {
        return res.status(400).json({ error: 'Member already exists' });
    }

    const newMember = {id: jetit.generateRRN(), name, email, contactNumber, address, occupation};

    memberList.push(newMember);
    console.log('Member ID',newMember.id + ' ' + 'MemberName:' + newMember.name);
    res.status(201).json(newMember);
});



app.get('/member/:id', (req, res) => {
    const memberId = req.params['id'];
    const member = memberList.find(user => user.id === memberId);
    console.log('Login:',member)
    if (!member) {
        return res.status(404).send('Member not found');
    }
   res.send(member);
});

app.patch('/updateMemberDetails/:id', (req, res) => {
    const memberId = req.params['id'].trim();
    const user = memberList.find(update => update.id === memberId);
    console.log('Patron from Patch:', user);
    if (!user) {
        return res.status(404).send('Member not found');
    }

    Object.keys(req.body).forEach(key => {
        if (user[key] !== undefined) {
            user[key] = req.body[key];
        }
    });

    return res.status(200).send('Member Details Updated Successfully');
});

// app.delete('/deleteMember/:name', (req, res) => {
//     const del = req.params['name'].trim();
//     const userIndex = patronList.findIndex(deleteUser => deleteUser.name === del);
//     if (userIndex === -1) {
//         return res.status(404).send('Patron Details not Found');
//     }

//     patronList.splice(userIndex, 1);
//     return res.status(200).send('Patron deleted successfully');
// });


app.get('/member/Signup', (req, res) => {
    res.send(memberList);
});




//*********************************REGISTRY***************************************** */

app.post('/registry/addBooks', (req, res) => {
    const {bookId,title, memberId, memberName, borrowedDate, Return} = req.body;
    if (!bookId || !memberId ||!memberName ) {
        return res.status(400).send('bookId, memberId, memberName, borrowedDate are required');
    }
    const book = {bookId, title, memberId, memberName, borrowedDate: new Date(), Return };
    registry.push(book);
    console.log('Book ID (Registry)',book.bookId + ' ' + 'MemberId:' + book.memberId, + ' ' + 'ReturnBook:' + Return);
    res.status(201).send('Book Registry is added');
});
app.get('/getRegistry/:bookId', (req, res) => {
    const id = req.params['bookId'];
    const book = registry.find(user => user.bookId === id);
    console.log('Get Registry:',book)
    if (!book) {
        return res.status(404).send('Registry not found');
    }
   res.send(book);
});

app.patch('/updateRegistry/:bookId', (req, res) => {
    const name = req.params['bookId'].trim();
    const user = registry.find(update => update.bookId === name);
    console.log('Book Status from Patch:', user);
    if (!user) {
        return res.status(404).send('Registry not found');
    }

    Object.keys(req.body).forEach(key => {
        if (user[key] !== undefined) {
            user[key] = req.body[key];
        }
    });

    return res.status(200).send('Registry Updated Successfully');
});

app.delete('/deleteRegistry/:name', (req, res) => {
    const del = req.params['name'].trim();
    const userIndex = registry.findIndex(deleteUser => deleteUser.name === del);
    if (userIndex === -1) {
        return res.status(404).send('Registry Details not Found');
    }

    registry.splice(userIndex, 1);
    return res.status(200).send('Registry deleted successfully');
});


app.get('/registry/addBooks', (req, res) => {
    res.send(registry);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
