import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header';
import MainPage from './Components/MainPage/MainPage';
import LoginForm from './Components/LoginPage/LoginPage';
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage";
import UserProfilePage from "./Components/UserProfile/UserProfile";
import EditProfilePage from "./Components/EditProfile/EditProfile";
import BandsPage from "./Components/BandsPage/BandsPage";
import BandPage from "./Components/BandPage/BandPage";
import EventPage from "./Components/EventPage/EventPage";
import { AuthProvider } from './context/AuthContext';
import CreateEventPage from "./Components/CreateEvent/CreateEventPage";
import EventsPage from "./Components/EventsPage/EventsPage";
import EditEventPage from "./Components/EditEventPage/EditEventPage";
import CreateBandPage from "./Components/CreateBandPage/CreateBandPage";
import EditBandPage from "./Components/EditBandPage/EditBandPage";
import GenresPage from "./Components/GenresPage/GenresPage";
import CreateGenrePage from "./Components/CreateGenrePage/CreateGenrePage";
import EditGenrePage from "./Components/EditGenrePage/EditGenrePage";
import CreateSeat from "./Components/CreateSeatPage/CreateSeatPage";
import EditSeat from "./Components/EditSeatPage/EditSeatPage";
import PurchaseTicketPage from "./Components/PurchaseTicketPage/PurchaseTicketPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Header isAuthenticated={isAuthenticated} />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/registration" element={<RegistrationPage />} />
                        <Route path="/profile/:userId" element={<UserProfilePage />} />
                        <Route path="/edit-profile/:userId" element={<EditProfilePage />} />
                        <Route path="/bands" element={<BandsPage />} />
                        <Route path="/band/:bandId" element={<BandPage />} />
                        <Route path="/event/:eventId" element={<EventPage />} />
                        <Route path="/create-event" element={<CreateEventPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/edit-event/:eventId" element={<EditEventPage />} />
                        <Route path="/create-band" element={<CreateBandPage />} />
                        <Route path="/band/edit/:bandId" element={<EditBandPage />} />
                        <Route path="/genres" element={<GenresPage />} />
                        <Route path="/create-genre" element={<CreateGenrePage />} />
                        <Route path="/edit-genre/:genreId" element={<EditGenrePage />} />
                        <Route path="/create-seat/:eventId" element={<CreateSeat />} />
                        <Route path="/edit-seat/:eventId/:seatId" element={<EditSeat />} />
                        <Route path="/purchase/:eventId" element={<PurchaseTicketPage />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
