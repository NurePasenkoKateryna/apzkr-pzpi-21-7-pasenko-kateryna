import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './eventspage.css';
import '../../styles/container.css';
import { jwtDecode } from "jwt-decode";

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [genres, setGenres] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        available: 'all',
        genre: 'all',
        location: ''
    });
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventsAndGenres = async () => {
            try {
                const eventsResponse = await axios.get('http://localhost:3000/event/');
                setEvents(eventsResponse.data);

                const genresResponse = await axios.get('http://localhost:3000/genre/');
                setGenres(genresResponse.data);
            } catch (err) {
                console.error('Error fetching events or genres:', err);
            }
        };

        fetchEventsAndGenres();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const filteredEvents = events.filter(event => {
        const matchSearch = (event.name?.toLowerCase().includes(search.toLowerCase()) || event.band?.name?.toLowerCase().includes(search.toLowerCase()));
        const matchAvailability = filter.available === 'all' || (filter.available === 'available' && event.seatCount > 0);
        const matchGenre = filter.genre === 'all' || event.genre?._id === filter.genre;
        const matchLocation = filter.location === '' || event.location?.toLowerCase().includes(filter.location.toLowerCase());

        return matchSearch && matchAvailability && matchGenre && matchLocation;
    });

    let isAdmin = false;
    if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken.role);
        isAdmin = decodedToken.role === 'admin'
        console.log(isAdmin);
    }

    return (
        <div className="container">
            <div className="EventsPage">
                <header className="EventsPage-header">
                    <h1>Події</h1>
                    {isAdmin && (
                        <button onClick={() => navigate('/create-event')} className='create-event-button'>Створити нову подію</button>
                    )}
                </header>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Пошук за назвою або гуртом"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <select name="genre" value={filter.genre} onChange={handleFilterChange}>
                        <option value="all">Всі жанри</option>
                        {genres.map(genre => (
                            <option key={genre._id} value={genre._id}>{genre.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Пошук за локацією"
                        name="location"
                        value={filter.location}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="events-list">
                    {filteredEvents.map(event => (
                        <div key={event._id} className="event-card">
                            <h3>{event.name}</h3>
                            <p><strong>Опис:</strong> {event.description}</p>
                            <p><strong>Жанр:</strong> {event.genre?.name}</p>
                            <p><strong>Локація:</strong> {event.location}</p>
                            <p><strong>Дата:</strong> {event.date}</p>
                            <p><strong>Гурт:</strong> {event.band?.name}</p>
                            <p><strong>Кількість місць:</strong> {event.seatCount}</p>
                            <Link to={`/event/${event._id}`} className="view-event-button">Переглянути подію</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventsPage;

