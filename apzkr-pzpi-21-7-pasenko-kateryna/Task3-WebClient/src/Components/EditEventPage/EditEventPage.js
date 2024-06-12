import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editeventpage.css';
import '../../styles/container.css';

function EditEvent() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        name: '',
        description: '',
        genre: '',
        location: '',
        band: '',
        date: '',
        seatCount: ''
    });
    const [genres, setGenres] = useState([]);
    const [bands, setBands] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/event/${eventId}`);
                setEvent(response.data);
            } catch (err) {
                setError('Failed to fetch event information');
            }
        };

        const fetchGenresAndBands = async () => {
            try {
                const genresResponse = await axios.get('http://localhost:3000/genre/');
                const bandsResponse = await axios.get('http://localhost:3000/band/');
                setGenres(genresResponse.data);
                setBands(bandsResponse.data);
            } catch (err) {
                setError('Failed to fetch genres and bands');
            }
        };

        fetchEvent();
        fetchGenresAndBands();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:3000/event/${eventId}`, event);
            navigate(`/event/${eventId}`);
        } catch (err) {
            setError('Failed to update event');
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <div className="edit-event">
                <h2>Редагування події</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Назва:</label>
                        <input type="text" name="name" value={event.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea name="description" value={event.description} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Жанр:</label>
                        <select name="genre" value={event.genre} onChange={handleChange} required>
                            <option value="">Оберіть жанр</option>
                            {genres.map(genre => (
                                <option key={genre._id} value={genre._id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Локація:</label>
                        <input type="text" name="location" value={event.location} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Гурт:</label>
                        <select name="band" value={event.band} onChange={handleChange} required>
                            <option value="">Оберіть гурт</option>
                            {bands.map(band => (
                                <option key={band._id} value={band._id}>{band.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Дата:</label>
                        <input type="date" name="date" value={event.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Кількість місць:</label>
                        <input type="number" name="seatCount" value={event.seatCount} onChange={handleChange} required />
                    </div>
                    <button type="submit">Оновити подію</button>
                </form>
            </div>
        </div>
    );
}

export default EditEvent;
