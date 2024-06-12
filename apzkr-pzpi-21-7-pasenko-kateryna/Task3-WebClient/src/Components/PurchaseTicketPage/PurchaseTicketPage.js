import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './buyticket.css';
import '../../styles/container.css';

function PurchaseTicketPage() {
    const { eventId } = useParams();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userId: ''
    });
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCVV] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [error, setError] = useState('');
    const [cards, setCards] = useState([]);
    const [showCardForm, setShowCardForm] = useState(false);
    const navigate = useNavigate();
    const [cardId, setCardId] = useState('');

    useEffect(() => {
        const fetchUserData = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`);
                const userData = response.data;
                console.log('User data from API:', userData);
                setUser({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    userId: userData._id || ''
                });
            } catch (err) {
                setError('Не вдалося отримати інформацію про користувача');
            }
        };

        const fetchUserCards = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:3000/card/${userId}`);
                setCards(response.data);
            } catch (err) {
                setError('Не вдалося отримати інформацію про картки');
            }
        };

        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);

        if (token) {
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken);
            const userId = decodedToken.id || decodedToken.sub;
            console.log('User ID:', userId);
            if (userId) {
                fetchUserData(userId);
                fetchUserCards(userId);
            }
        }

        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/event/${eventId}`);
                setEvent(response.data);
            } catch (err) {
                setError('Не вдалося отримати інформацію про подію');
            }
        };

        const fetchSeats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/seat/${eventId}`);
                setSeats(response.data);
            } catch (err) {
                setError('Не вдалося отримати інформацію про місця');
            }
        };

        fetchEvent();
        fetchSeats();
    }, [eventId]);

    const handleSubmit = async (e) => {
        console.log(user.userId,
            user.firstName,
            user.lastName,
            user.email,
            eventId, selectedSeat,
            cardNumber,
            expiryDate,
            cvv,
            cardholderName);
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/ticket/buy', {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                eventId,
                seatId: selectedSeat,
                cardId: cardId,
                cardNumber,
                expiryDate,
                cvv,
                cardholderName
            });
            console.log(response.data);
            navigate(`/profile/${user.userId}`);
        } catch (err) {
            setError('Не вдалося придбати квиток');
            console.error(err);
        }
    };

    const handleAddCard = async () => {
        try {
            const response = await axios.post('http://localhost:3000/card/create', {
                userId: user.userId,
                cardNumber,
                expiryDate,
                cvv,
                cardholderName
            });
            console.log('Card added:', response.data);
            setCards([...cards, response.data]);
            setShowCardForm(false);
            setCardNumber('');
            setExpiryDate('');
            setCVV('');
            setCardholderName('');
            setCardId(response.data._id);
        } catch (err) {
            setError('Не вдалося додати картку');
            console.error(err);
        }
    };

    const translateSeatType = (seatType) => {
        switch (seatType) {
            case 'funzone':
                return 'Фан-зона';
            case 'vip':
                return 'ВІП-зона';
            default:
                return seatType;
        }
    };

    return (
        <div className='container'>
            <div className="purchase-ticket-page">
                <h2>Купівля квитка</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">Ім'я:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={user.firstName}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Прізвище:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={user.lastName}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Електронна пошта:</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            required
                        />
                    </div>
                    {event && (
                        <div className="event-info">
                            <p><strong>Подія:</strong> {event.name}</p>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="seat">Місце:</label>
                        <select
                            id="seat"
                            value={selectedSeat}
                            onChange={(e) => setSelectedSeat(e.target.value)}
                            required
                        >
                            <option value="">Оберіть місце</option>
                            {seats.map((seat) => (
                                <option key={seat._id} value={seat._id}>
                                    {translateSeatType(seat.seatType)} - {seat.price} грн
                                </option>
                            ))}
                        </select>
                    </div>
                    {cards.length > 0 ? (
                        <div className="form-group">
                            <label htmlFor="savedCards">Збережені картки:</label>
                            <select
                                id="savedCards"
                                onChange={(e) => {
                                    const selectedCard = cards.find(card => card._id === e.target.value);
                                    if (selectedCard) {
                                        setCardNumber(selectedCard.cardNumber);
                                        setExpiryDate(selectedCard.expiryDate);
                                        setCVV(selectedCard.cvv);
                                        setCardholderName(selectedCard.cardholderName);
                                        setCardId(selectedCard._id);
                                    }
                                }}
                            >
                                <option value="">Оберіть картку</option>
                                {cards.map(card => (
                                    <option key={card._id} value={card._id}>
                                        {card.cardNumber} - {card.cardholderName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setShowCardForm(true)}>Додати картку</button>
                    )}
                    {showCardForm && (
                        <>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Номер картки:</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="expiryDate">Термін дії:</label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvv">CVV:</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    value={cvv}
                                    onChange={(e) => setCVV(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cardholderName">Ім'я власника картки:</label>
                                <input
                                    type="text"
                                    id="cardholderName"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="button" onClick={handleAddCard}>Додати картку</button>
                        </>
                    )}
                    <button type="submit">Купити квиток</button>
                </form>
            </div>
        </div>
    );
}

export default PurchaseTicketPage;
