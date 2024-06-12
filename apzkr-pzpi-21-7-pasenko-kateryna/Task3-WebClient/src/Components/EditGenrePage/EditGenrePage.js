import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editgenrepage.css';
import '../../styles/container.css';

function EditGenrePage() {
    const { genreId } = useParams();
    const [genreData, setGenreData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenreData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/genre/${genreId}`);
                setGenreData(response.data);
            } catch (err) {
                setError('Failed to fetch genre data');
            }
        };

        fetchGenreData();
    }, [genreId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGenreData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`http://localhost:3000/genre/${genreId}`, genreData);
            console.log(response.data);
            navigate('/genres');
        } catch (err) {
            setError('Failed to update genre');
            console.error('Error updating genre:', err);
        }
    };

    return (
        <div className="container">
            <div className="edit-genre">
                <h2>Редагування жанру</h2>
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
                    <button type="submit">Зберегти зміни</button>
                </form>
            </div>
        </div>
    );
}

export default EditGenrePage;
