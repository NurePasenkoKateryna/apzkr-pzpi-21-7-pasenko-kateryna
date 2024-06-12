import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userprofile.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`);
                setUserData(response.data);

                const role = response.data.role;
                switch (role) {
                    case 'admin':
                        setRoleName('Адміністратор');
                        break;
                    case 'user':
                        setRoleName('Користувач');
                        break;
                    case 'member':
                        setRoleName('Член групи');
                        break;
                    default:
                        setRoleName(role);
                        break;
                }
            } catch (error) {
                setError('Не вдалося отримати дані профілю користувача');
            }
        };
        fetchUserData();
    }, [userId]);

    const handleDeleteProfile = async () => {
        const confirmed = window.confirm('Ви впевнені, що хочете видалити свій профіль?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:3000/user/${userId}`);
                navigate('/login');
            } catch (err) {
                setError('Не вдалося видалити профіль користувача');
            }
        }
    };

    const handleExport = async (type) => {
        try {
            const response = await axios.get(`http://localhost:3000/export/${type}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Не вдалося експортувати дані');
        }
    };

    if (error) {
        return <div className="error">Помилка: {error}</div>;
    }

    if (!userData) {
        return <div className="loading">Завантаження...</div>;
    }



    return (
        <div className="profile-container">
            <h2 className="profile-title">Профіль користувача</h2>
            <div className="tabs">
                <button
                    className={activeTab === 'profile' ? 'active-tab' : ''}
                    onClick={() => setActiveTab('profile')}
                >
                    Профіль
                </button>
                {(userData.role === 'user' || userData.role === 'member') && (
                    <button
                        className={activeTab === 'tickets' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('tickets')}
                    >
                        Квитки
                    </button>
                )}
                {userData.role === 'admin' && (
                    <button
                        className={activeTab === 'scan' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('scan')}
                    >
                        Сканування QR-коду
                    </button>
                )}
            </div>
            {activeTab === 'profile' && (
                <div className="profile-details">
                    <p><span className="detail-label">Ім'я:</span> {userData.firstName}</p>
                    <p><span className="detail-label">Прізвище:</span> {userData.lastName}</p>
                    <p><span className="detail-label">Електронна пошта:</span> {userData.email}</p>
                    <p><span className="detail-label">Телефон:</span> {userData.phone}</p>
                    <p><span className="detail-label">Роль:</span> {roleName}</p>
                    <Link to={`/edit-profile/${userId}`} className="edit-button">Редагувати профіль</Link>
                    <button onClick={handleDeleteProfile} className="delete-button">Видалити профіль</button>
                    {userData.role === 'admin' && (
                        <div className="export-section">
                            <h3>Експорт даних</h3>
                            <button onClick={() => handleExport('event')} className="export-button">Експортувати всі
                                події та місця
                            </button>
                            <button onClick={() => handleExport('users')} className="export-button">Експортувати всіх
                                користувачів
                            </button>
                            <button onClick={() => handleExport('bands')} className="export-button">Експортувати всі
                                гурти
                            </button>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'tickets' && <TicketsTab userId={userId}/>}
            {activeTab === 'scan' && <QRScan/>}
        </div>
    );
};

const TicketsTab = ({userId}) => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/ticket/${userId}`);
                setTickets(response.data);
            } catch (error) {
                setError('Не вдалося отримати квитки');
            }
        };
        fetchTickets();
    }, [userId]);

    const downloadQRCode = async (qrCodeData) => {
        try {
            const response = await axios.get(qrCodeData, {responseType: 'blob'});
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ticket_qr_code.png');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Не вдалося завантажити QR-код');
        }
    };

    if (error) {
        return <div className="error">Помилка: {error}</div>;
    }

    if (tickets.length === 0) {
        return <div className="no-tickets">Немає куплених квитків</div>;
    }

    return (
        <div className="tickets-container">
            <h3>Куплені квитки</h3>
            <div className="tickets-list">
                {tickets.map(ticket => (
                    <div key={ticket._id} className="ticket-item">
                        <p><span className="ticket-label">Подія:</span> {ticket.event.name}</p>
                        <QRCode value={ticket.qrCode} />
                        <button onClick={() => downloadQRCode(ticket.qrCode)} className="download-btn">Завантажити QR-код</button>
                    </div>
                ))}
            </div>
        </div>
    );
};



const QRScan = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (event) => {
        const fileInput = event.target;

        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('qrCodeImage', file);

            try {
                const response = await axios.post('http://localhost:1880/scan', file, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const userId = response.data.userId;
                console.log(userId);

                const eventId = response.data.eventId;
                console.log(eventId);

                const seatId = response.data.seatId;
                console.log(seatId);

                const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);
                const userInfo = userResponse.data;
                console.log(userInfo);

                const eventResponse = await axios.get(`http://localhost:3000/event/${eventId}`);
                const eventData = eventResponse.data;
                console.log(eventData);

                const seatResponse = await axios.get(`http://localhost:3000/seat/${eventId}`);
                const seatData = seatResponse.data;
                console.log(seatData);

                const seatTypeTranslation = {
                    funzone: 'Фан-зона',
                    vip: 'ВІП-зона'
                };

                const foundSeat = seatData.find(seat => seat._id === seatId);

                const translatedSeatType = foundSeat ? seatTypeTranslation[foundSeat.seatType] : null;

                try {

                    setScanResult({
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        eventName: eventData.name,
                        seatType: translatedSeatType,
                        seatPrice: foundSeat.price
                    });

                    console.log('First Name: ' + scanResult.firstName);
                    console.log('Last Name: ' + scanResult.lastName);
                    console.log('Event Name: ' + scanResult.eventName);
                    console.log('Seat Type: ' + scanResult.seatType);
                    console.log('Price: ' + scanResult.seatType);

                } catch (err) {
                    console.log(err);
                }

            } catch (error) {
                console.error('Error uploading QR code image:', error);
            }
        }
    };

    return (
        <div className="qr-scan-container">
            <h3>Сканування QR-коду</h3>
            <input
                id="qrCodeImageInput"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
            />
            {error && <div className="error">{error}</div>}
            {scanResult && (
                <div className="scan-result">
                    <p>Отримана інформація з QR-коду:</p>
                    <p>Користувач: {scanResult.firstName} {scanResult.lastName}</p>
                    <p>Подія: {scanResult.eventName}</p>
                    <p>Місце: {scanResult.seatType}</p>
                    <p>Ціна: {scanResult.seatPrice}</p>
                </div>
            )}
        </div>
    );
};


export default UserProfilePage;
