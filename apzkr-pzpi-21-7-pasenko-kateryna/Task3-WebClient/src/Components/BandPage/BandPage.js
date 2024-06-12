import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import AddMemberModal from '../AddMemberModel/AddMemberModel';
import './bandpage.css';
import '../../styles/container.css';

function BandPage() {
    const { bandId } = useParams();
    const [band, setBand] = useState(null);
    const [error, setError] = useState('');
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const userRole = decodedToken ? decodedToken.role : null;

    useEffect(() => {
        const fetchBand = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/band/${bandId}`);
                setBand(response.data);
            } catch (err) {
                setError('Failed to fetch band information');
            }
        };

        fetchBand();
    }, [bandId]);

    const handleDeleteBand = async () => {
        const confirmDelete = window.confirm('Ви впевнені, що хочете видалити цей гурт?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/band/${bandId}`);
                navigate('/bands');
            } catch (err) {
                console.error('Error deleting band:', err);
                setError('Failed to delete band');
            }
        }
    };

    const handleAddMember = (memberId) => {
        setBand(prevBand => ({
            ...prevBand,
            members: [...prevBand.members, { _id: memberId }]
        }));
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await axios.patch(`http://localhost:3000/band/${bandId}/removeMember/${memberId}`);
            setBand(prevBand => ({
                ...prevBand,
                members: prevBand.members.filter(member => member._id !== memberId)
            }));
        } catch (err) {
            console.error('Error removing member:', err);
        }
    };

    const openAddMemberModal = () => {
        setShowAddMemberModal(true);
    };

    const closeAddMemberModal = () => {
        setShowAddMemberModal(false);
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!band) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className='container'>
            <div className="band-page">
                <h2>{band.name}</h2>
                <div className="band-details">
                    <p><strong>Жанр:</strong> {band.genre?.name}</p>
                    <p><strong>Дата формування:</strong> {band.formationDate}</p>
                    <p><strong>Опис:</strong> {band.description}</p>
                    <p><strong>Учасники гурту:</strong></p>
                    {band.members.length === 0 ? (
                        <p>Учасників немає</p>
                    ) : (
                        <ul className='member-card-band'>
                            {band.members.map(member => (
                                <li className="member-card-item" key={member._id}>
                                    {member.firstName} {member.lastName}
                                    {userRole === 'admin' && (
                                        <button className="remove-member" onClick={() => handleRemoveMember(member._id)}>
                                            &times;
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {userRole === 'admin' && (
                    <div className="admin-actions">
                        <button onClick={handleDeleteBand} className='delete-band-btn'>Видалити гурт</button>
                        <button onClick={() => navigate(`/band/edit/${bandId}`)} className='edit-band-btn'>Редагувати гурт</button>
                        <button onClick={openAddMemberModal} className='add-member-btn'>Додати учасника</button>
                    </div>
                )}
            </div>
            {showAddMemberModal && (
                <AddMemberModal bandId={bandId} onClose={closeAddMemberModal} onAddMember={handleAddMember} />
            )}
        </div>
    );
}

export default BandPage;
