import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editbandpage.css';
import '../../styles/container.css';

function EditBandPage() {
    const { bandId } = useParams();
    const [bandData, setBandData] = useState({
        name: '',
        genre: '',
        concertOrganizer: '',
        formationDate: '',
        description: '',
        events: [],
        members: []
    });
    const [genres, setGenres] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBandData = async () => {
            try {
                const [bandResponse, genresResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/band/${bandId}`),
                    axios.get('http://localhost:3000/genre/')
                ]);
                setBandData(bandResponse.data);
                setGenres(genresResponse.data);
            } catch (err) {
                setError('Failed to fetch band data');
            }
        };

        fetchBandData();
    }, [bandId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBandData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidYear(bandData.formationDate)) {
            setError('Неправильний формат дати. Введіть рік у форматі "рррр".');
            return;
        }
        try {
            const response = await axios.patch(`http://localhost:3000/band/${bandId}`, bandData);
            console.log(response.data);
            navigate(`/band/${bandId}`);
        } catch (err) {
            setError('Failed to update band');
            console.error('Error updating band:', err);
        }
    };

    const isValidYear = (yearString) => {
        const regex = /^\d{4}$/;
        return regex.test(yearString);
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <div className="edit-band">
                <h2>Редагування гурту</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Назва:</label>
                        <input type="text" name="name" value={bandData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Жанр:</label>
                        <select name="genre" value={bandData.genre} onChange={handleChange} required>
                            <option value="">Оберіть жанр</option>
                            {genres.map(genre => (
                                <option key={genre._id} value={genre._id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Дата створення:</label>
                        <input type="text" name="formationDate" value={bandData.formationDate} onChange={handleChange} required />
                        {!isValidYear(bandData.formationDate) && <span className="error-message">Неправильний формат дати. Введіть рік у форматі "рррр".</span>}
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea name="description" value={bandData.description} onChange={handleChange} required />
                    </div>
                    <button type="submit">Зберегти зміни</button>
                </form>
            </div>
        </div>
    );
}

export default EditBandPage;
