import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addmembermodel.css';

function AddMemberModal({ bandId, onClose, onAddMember }) {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/');
                setMembers(response.data.filter(user => user.role === 'member' && !user.band));
            } catch (err) {
                console.error('Error fetching members:', err);
            }
        };

        fetchMembers();
    }, []);

    const handleAddMember = async () => {
        try {
            await axios.patch(`http://localhost:3000/band/${bandId}/addMember`, { memberId: selectedMember });
            onAddMember(selectedMember);
            onClose();
        } catch (err) {
            console.error('Error adding member:', err);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>&times;</span>
                <h2>Додати учасника</h2>
                <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                    <option value="">Оберіть учасника</option>
                    {members.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.firstName} {member.lastName}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddMember}>Додати</button>
            </div>
        </div>
    );
}

export default AddMemberModal;
