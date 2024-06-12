import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editprofile.css';
import { jwtDecode } from "jwt-decode";

const EditProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
    });
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}`);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    phoneNumber: response.data.phone,
                    role: formData.role || response.data.role,
                });
            } catch (error) {
                setError('Failed to fetch user profile');
            }
        };
        fetchUserData();
    }, [userId, formData.role]);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            if (!formData.role) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    role: decodedToken.role
                }));
            }
        }
    }, [token, formData.role]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.patch(`http://localhost:3000/user/${userId}`, formData);
            navigate(`/profile/${userId}`);
        } catch (error) {
            setError('Помилка редагування профілю');
        }
    };

    return (
        <div className="edit-profile-container">
            <h2 className="edit-profile-title">Редагувати профіль</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label htmlFor="firstName">Ім'я:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Прізвище:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Електронна пошта:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Телефон:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="submit-button-edit-page">Зберегти зміни</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
