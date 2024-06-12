import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './bandspage.css';
import '../../styles/container.css';

function BandsPage() {
    const [bands, setBands] = useState([]);
    const [genres, setGenres] = useState([]);
    const [concertOrganizations, setConcertOrganizations] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
        genre: 'all',
        concertOrganizer: 'all',
    });
    const [isAdmin, setIsAdmin] = useState(false); // Додали стейт для перевірки ролі користувача

    useEffect(() => {
        const fetchBandsGenresAndOrganizers = async () => {
            try {
                const bandsResponse = await axios.get('http://localhost:3000/band/');
                setBands(bandsResponse.data);

                const genresResponse = await axios.get('http://localhost:3000/genre/');
                setGenres(genresResponse.data);

                const organizersResponse = await axios.get('http://localhost:3000/organization/');
                setConcertOrganizations(organizersResponse.data);

                // Декодування токену і визначення ролі користувача
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    if (decodedToken.role === 'admin') {
                        setIsAdmin(true);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchBandsGenresAndOrganizers();
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

    const filteredBands = bands.filter(band => {
        const matchSearch = band.name.toLowerCase().includes(search.toLowerCase());
        const matchGenre = filter.genre === 'all' || band.genre?._id === filter.genre;
        const matchConcertOrganizer = filter.concertOrganizer === 'all' || band.concertOrganizer?._id === filter.concertOrganizer;

        return matchSearch && matchGenre && matchConcertOrganizer;
    });

    return (
        <div className="container">
            <div className="BandsPage">
                <header className="BandsPage-header">
                    <h1>Всі гурти</h1>
                    {isAdmin && (
                        <Link to="/create-band" className="create-band-button">Створити гурт</Link>
                    )}
                </header>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Пошук за назвою гурту"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <select name="genre" value={filter.genre} onChange={handleFilterChange}>
                        <option value="all">Всі жанри</option>
                        {genres.map(genre => (
                            <option key={genre._id} value={genre._id}>{genre.name}</option>
                        ))}
                    </select>
                    <select name="concertOrganizer" value={filter.concertOrganizer} onChange={handleFilterChange}>
                        <option value="all">Всі організатори</option>
                        {concertOrganizations.map(organizer => (
                            <option key={organizer._id} value={organizer._id}>{organizer.name}</option>
                        ))}
                    </select>
                </div>
                <div className="bands-list">
                    {filteredBands.map(band => (
                        <div key={band._id} className="band-card">
                            <h3>{band.name}</h3>
                            <p><strong>Жанр:</strong> {band.genre?.name}</p>
                            <p><strong>Організатор концерту:</strong> {band.concertOrganizer?.name}</p>
                            <Link to={`/band/${band._id}`} className="view-band-button">Переглянути гурт</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BandsPage;
