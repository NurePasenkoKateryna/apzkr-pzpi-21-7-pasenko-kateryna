import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createbandpage.css';

function CreateBandPage() {
    const navigate = useNavigate();
    const [bandData, setBandData] = useState({
        name: '',
        genre: '',
        concertOrganizer: '',
        formationDate: '',
        description: '',
        events: [],
        members: []
    });
    const [error, setError] = useState('');
    const [dateError, setDateError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [genres, setGenres] = useState([]);
    const [concertOrganizers, setConcertOrganizers] = useState([]);

    useEffect(() => {
        const fetchGenresAndUsers = async () => {
            try {
                const genresResponse = await axios.get('http://localhost:3000/genre/');
                setGenres(genresResponse.data);

                const usersResponse = await axios.get('http://localhost:3000/user/');
                setUsers(usersResponse.data.filter(user => user.role === 'member' && !user.band));

                const organizersResponse = await axios.get('http://localhost:3000/organization/');
                setConcertOrganizers(organizersResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchGenresAndUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBandData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMemberChange = (e) => {
        const { options } = e.target;
        const selectedMembers = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedMembers.push(options[i].value);
            }
        }
        setSelectedMembers(selectedMembers);
    };

    const isValidYear = (yearString) => {
        const regex = /^\d{4}$/;
        return regex.test(yearString);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidYear(bandData.formationDate)) {
            setDateError('Неправильний формат дати. Введіть рік у форматі "рррр"');
            return;
        }
        setDateError('');
        try {
            const band = { ...bandData, members: selectedMembers };
            const response = await axios.post('http://localhost:3000/band/create', band);
            console.log(response.data);
            navigate('/bands');
        } catch (err) {
            setError('Failed to create band');
            console.error('Error creating band:', err);
        }
    };

    return (
        <div className="container">
            <div className="create-band">
                <h2>Створення гурту</h2>
                {error && <div className="error">{error}</div>}
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
                        <label>Організатор концерту:</label>
                        <select name="concertOrganizer" value={bandData.concertOrganizer} onChange={handleChange} required>
                            <option value="">Оберіть організатора</option>
                            {concertOrganizers.map(organizer => (
                                <option key={organizer._id} value={organizer._id}>{organizer.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Дата створення (рік):</label>
                        <input type="text" name="formationDate" value={bandData.formationDate} onChange={handleChange} required />
                        {dateError && <div className="error">{dateError}</div>}
                    </div>
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea name="description" value={bandData.description} onChange={handleChange} required />
                    </div>
                    <button type="submit">Створити гурт</button>
                </form>
            </div>
        </div>
    );
}

export default CreateBandPage;
