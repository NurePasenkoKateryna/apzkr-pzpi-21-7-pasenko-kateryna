import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import './createseat.css';

function CreateSeat() {
    const { eventId } = useParams();
    const [seatType, setSeatType] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/seat/${eventId}/create`, {
                seats: [{ seatType, price }]
            });
            console.log(response.data);

            setSeatType('');
            setPrice('');
            setError('');

            navigate(`/event/${eventId}`);
        } catch (err) {
            setError('Не вдалося створити місце');
            console.error(err);
        }
    };

    return (
        <div className="create-seat-container">
            <h2>Створення нового місця</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Тип місця:</label>
                    <select value={seatType} onChange={(e) => setSeatType(e.target.value)} required>
                        <option value="">Оберіть тип місця</option>
                        <option value="funzone">Фан-зона</option>
                        <option value="vip">ВІП зона</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Ціна:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <button type="submit">Створити місце</button>
            </form>
        </div>
    );
}

export default CreateSeat;
