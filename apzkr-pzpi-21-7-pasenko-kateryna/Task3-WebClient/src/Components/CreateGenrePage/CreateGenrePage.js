import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './creategenrepage.css';
import '../../styles/container.css';

function CreateGenrePage() {
    const [genreData, setGenreData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGenreData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!genreData.name || !genreData.description) {
            setError('Будь ласка, заповніть усі поля');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/genre/create', genreData);
            console.log(response.data);
            navigate('/genres');
        } catch (err) {
            setError('Failed to create genre');
            console.error('Error creating genre:', err);
        }
    };

    return (
        <div className="container">
            <div className="create-genre">
                <h2>Створення жанру</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Назва:</label>
                        <input type="text" name="name" value={genreData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea name="description" value={genreData.description} onChange={handleChange} required />
                    </div>
                    <button type="submit">Створити жанр</button>
                </form>
            </div>
        </div>
    );
}

export default CreateGenrePage;
