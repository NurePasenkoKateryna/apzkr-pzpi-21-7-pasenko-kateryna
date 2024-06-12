import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createevent.css';

function CreateEvent() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const [location, setLocation] = useState('');
    const [band, setBand] = useState('');
    const [bands, setBands] = useState([]);
    const [date, setDate] = useState('');
    const [seatCount, setSeatCount] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenresAndBands = async () => {
            try {
                const genresResponse = await axios.get('http://localhost:3000/genre/');
                setGenres(genresResponse.data);

                const bandsResponse = await axios.get('http://localhost:3000/band/');
                setBands(bandsResponse.data);
            } catch (err) {
                setError('Не вдалося отримати жанри або гурти');
                console.error(err);
            }
        };
        fetchGenresAndBands();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/event/create', {
                name,
                description,
                genre,
                location,
                band,
                date,
                seatCount
            });
            console.log(response.data);

            navigate(`/event/${response.data._id}`);
        } catch (err) {
            setError('Не вдалося створити подію');
            console.error(err);
        }
    };

    const handleCreateSeats = () => {
        navigate('/create-seats');
    };

    return (
        <div className="create-event-container">
            <h2>Створення нової події</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Назва:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Опис:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Жанр:</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="">Оберіть жанр</option>
                        {genres.map((genre) => (
                            <option key={genre._id} value={genre._id}>{genre.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Локація:</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Гурт:</label>
                    <select value={band} onChange={(e) => setBand(e.target.value)} required>
                        <option value="">Оберіть гурт</option>
                        {bands.map((band) => (
                            <option key={band._id} value={band._id}>{band.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Дата:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label>Кількість місць:</label>
                    <input type="number" value={seatCount} onChange={(e) => setSeatCount(e.target.value)} required/>
                </div>
                <button type="submit" className='create-event-btn'>Створити подію</button>
            </form>
        </div>
    );
}

export default CreateEvent;