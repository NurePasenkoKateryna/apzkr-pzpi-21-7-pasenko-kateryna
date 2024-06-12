import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './eventpage.css';
import '../../styles/container.css';

function EventPage() {
    const { eventId } = useParams(); // Get the event ID from the URL parameters
    const [event, setEvent] = useState(null); // State to store event details
    const [seats, setSeats] = useState([]); // State to store seat details
    const [error, setError] = useState(''); // State to store any errors
    const [purchaseError, setPurchaseError] = useState(''); // State to store purchase errors
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Function to fetch event details
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/event/${eventId}`);
                setEvent(response.data);
            } catch (err) {
                setError('Failed to fetch event information');
            }
        };

        // Function to fetch seat details
        const fetchSeats = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/seat/${eventId}`);
                setSeats(response.data);
            } catch (err) {
                setError('Failed to fetch seat information');
            }
        };

        fetchEvent();
        fetchSeats();

        // Check if the user is an admin
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === 'admin') {
                setIsAdmin(true);
            }
        }
    }, [eventId]);

    // Function to handle event deletion
    const handleDeleteEvent = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this event?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3000/event/${eventId}`);
                navigate('/events');
            } catch (err) {
                setError('Failed to delete event');
            }
        }
    };

    // Function to handle seat deletion
    const handleDeleteSeat = async (seatId) => {
        const confirmed = window.confirm('Are you sure you want to delete this seat?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3000/seat/${seatId}`);
                setSeats(seats.filter(seat => seat._id !== seatId));
            } catch (err) {
                setError('Failed to delete seat');
            }
        }
    };

    // Function to handle ticket purchase
    const handlePurchaseTicket = () => {
        if (seats.length === 0) {
            setPurchaseError('Sorry, there are no seats available at the moment');
        } else {
            navigate(`/purchase/${eventId}`);
        }
    };

    // Function to translate seat types to Ukrainian
    const translateSeatType = (seatType) => {
        switch (seatType) {
            case 'funzone':
                return 'Fan-zone';
            case 'vip':
                return 'VIP-zone';
            default:
                return seatType;
        }
    };

    // Render error message if any error occurred
    if (error) {
        return <div className="error">{error}</div>;
    }

    // Render loading message while data is being fetched
    if (!event) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className='container'>
            <div className="event-page">
                <h2>{event.name}</h2>
                <div className="event-details">
                    <p><strong>Description:</strong> {event.description}</p>
                    <p><strong>Genre:</strong> {event.genre?.name}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Band:</strong> {event.band?.name}</p>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Seat Count:</strong> {event.seatCount}</p>
                </div>
                <div className="seats-list">
                    <h3>Available Seats</h3>
                    {seats.length > 0 ? (
                        <div className="seats-grid">
                            {seats.map((seat) => (
                                <div key={seat._id} className="seat-card">
                                    <p><strong>Seat Type:</strong> {translateSeatType(seat.seatType)}</p>
                                    <p><strong>Price:</strong> {seat.price} UAH</p>
                                    {isAdmin && (
                                        <div className="seat-actions">
                                            <Link to={`/edit-seat/${eventId}/${seat._id}`} className="edit-seat-btn">Edit</Link>
                                            <button onClick={() => handleDeleteSeat(seat._id)} className="delete-seat-btn">Delete</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No available seats</p>
                    )}
                </div>
                {isAdmin && (
                    <div className="admin-actions">
                        <Link to={`/edit-event/${eventId}`} className="edit-event-btn">Edit Event</Link>
                        <button onClick={handleDeleteEvent} className="delete-event-btn">Delete Event</button>
                        <Link to={`/create-seat/${eventId}`} className="create-seat-btn">Create Seat</Link>
                    </div>
                )}
                {!isAdmin && (
                    <div>
                        <button onClick={handlePurchaseTicket} className="purchase-ticket-btn">Purchase Ticket</button>
                        {purchaseError && <div className="purchase-error">{purchaseError}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventPage;
