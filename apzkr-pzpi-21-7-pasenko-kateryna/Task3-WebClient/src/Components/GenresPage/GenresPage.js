import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './genrespage.css';
import '../../styles/container.css';

function GenresPage() {
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:3000/genre/');
                setGenres(response.data);
            } catch (err) {
                setError('Failed to fetch genres');
                console.error('Error fetching genres:', err);
            }
        };

        fetchGenres();
    }, []);

    const handleEdit = (genreId) => {
        navigate(`/edit-genre/${genreId}`);
    };

    const handleDelete = async (genreId) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей жанр?')) {
            try {
                await axios.delete(`http://localhost:3000/genre/${genreId}`);
                setGenres(genres.filter(genre => genre._id !== genreId));
            } catch (err) {
                setError('Failed to delete genre');
                console.error('Error deleting genre:', err);
            }
        }
    };

    const handleCreate = () => {
        navigate('/create-genre');
    };

    return (
        <div className="container">
            <div className="genres-page">
                <h2 className='genre-header'>Жанри</h2>
                <button onClick={handleCreate} className="create-genre-button">Створити жанр</button>
                {error && <div className="error">{error}</div>}
                <div className="genres-list">
                    {genres.map(genre => (
                        <div key={genre._id} className="genre-item">
                            <h3>{genre.name}</h3>
                            <p>{genre.description}</p>
                            <div className="genre-buttons">
                                <button onClick={() => handleEdit(genre._id)}>Редагувати жанр</button>
                                <button onClick={() => handleDelete(genre._id)}>Видалити жанр</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GenresPage;
