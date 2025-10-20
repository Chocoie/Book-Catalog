import { Routes, Route } from 'react-router-dom';
import { Welcome } from './Welcome.jsx';
import { LoginPage } from './LoginPage.jsx';
import { NewUserPage } from './NewUserPage.jsx';
import { ShowCat } from './showCat.jsx';
import { AddBook } from './addBook.jsx';
import { EditBook } from './EditBook.jsx';
import { UserBooks } from './UserBooks.jsx';
import './CSS/App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/newUser" element={<NewUserPage />} />
      <Route path="/catalog" element={<ShowCat />} />
      <Route path="/addBook" element={<AddBook />} />
      <Route path="/editBook/:bookID" element={<EditBook/>} />
      <Route path="/userBooks" element={<UserBooks />}/>
      <Route path="*" element={<h1>404: Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
