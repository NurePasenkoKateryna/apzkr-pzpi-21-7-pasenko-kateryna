import React, { useState } from 'react';
import axios from 'axios';
import './registrationpage.css';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            console.log('Submitting form data:', formData);
            const response = await axios.post('http://localhost:3000/authorization/registration', formData);
            console.log('Response from server:', response);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError('Помилка реєстрації');
        }
    };

    return (
        <div className="registration-container">
            <h2 className="registration-title">Реєстрація</h2>
            {error && <div className="registration-error">{error}</div>}
            <form className="registration-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ім'я"
                    className="registration-input"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Прізвище"
                    className="registration-input"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Електронна пошта"
                    className="registration-input"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Номер телефону"
                    className="registration-input"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    className="registration-input"
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="registration-select"
                    required
                >
                    <option value="">Оберіть роль</option>
                    <option value="admin">Адміністратор</option>
                    <option value="user">Користувач</option>
                    <option value="member">Член групи</option>
                </select>
                <button type="submit" className="registration-button">Зареєструватися</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
