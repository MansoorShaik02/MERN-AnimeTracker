import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CurrentlyAiring from './pages/CurrentlyAiring';
import Homepage from './pages/Homepage';
import Trending from './pages/Trending';
import Navbar from './components/Navbar';
import AnimeSearch from './pages/AnimeSearch';
import AnimeDetails from './pages/AnimeDetails';
import Aniwatchapi from './pages/Aniwatchapi';
import CharacterDetails from './pages/CharacterDetails';
import Genrepage from './pages/Genrepage';
import Register from './components/Register';
import Login from './components/Login';
import UserLists from './pages/UserLists';
import { AuthProvider } from './context/AuthContext';
import Profilepage from './pages/Profilepage';
import Forgotpassword from './components/Forgotpassword';
import Passwordreset from './components/Passwordreset';
import News from './pages/News';
function App() {



  return (
    <AuthProvider>

      <Router>
        <Navbar></Navbar>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route path="/search" exact element={< AnimeSearch />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/currentlyairing" element={<CurrentlyAiring />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="aniwatchapi" element={<Aniwatchapi />}></Route>
            <Route path="/character/:id" element={<CharacterDetails />} />
            <Route path="/genre/:genreId" element={<Genrepage />} />
            <Route path="register" element={<Register />}></Route>
            <Route path="profile" element={<Profilepage />}></Route>

            <Route path="/forgot-password" element={<Forgotpassword />} />

            <Route path='/reset-password/:token' element={<Passwordreset />} ></Route>

            <Route path="/userlists" element={<UserLists />} />
            <Route path="/news" element={<News />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
