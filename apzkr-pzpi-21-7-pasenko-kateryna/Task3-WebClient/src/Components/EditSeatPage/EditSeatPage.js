import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editseat.css';

function EditSeat() {
    const { eventId, seatId } = useParams();
    const [seatType, setSeatType] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeat = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/seat/${eventId}/${seatId}`);
                const seatData = response.data;
                setSeatType(seatData.seatType);
                setPrice(seatData.price);
            } catch (err) {
                setError('Failed to fetch seat information');
            }
        };

        fetchSeat();
    }, [eventId, seatId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`http://localhost:3000/seat/${seatId}`, {
                seatType,
                price
            });
            console.log(response.data);
            navigate(`/event/${eventId}`);
        } catch (err) {
            setError('Failed to update seat');
            console.error(err);
        }
    };

    return (
        <div className="edit-seat-container">
            <h2>Редагування місця</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="seatType">Тип місця:</label>
                    <select id="seatType" value={seatType} onChange={(e) => setSeatType(e.target.value)} required>
                        <option value="">Оберіть тип місця</option>
                        <option value="funzone">Фан-зона</option>
                        <option value="vip">ВІП зона</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Ціна:</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <button type="submit">Зберегти зміни</button>
            </form>
        </div>
    );
}

export default EditSeat;
