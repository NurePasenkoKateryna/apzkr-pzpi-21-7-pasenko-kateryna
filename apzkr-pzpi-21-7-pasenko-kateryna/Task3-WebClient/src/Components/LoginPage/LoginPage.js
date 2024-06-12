import React, { useState } from 'react';
import axios from 'axios';
import './loginpage.css';
import { Link, useNavigate  } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Будь ласка, заповніть всі поля форми.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/authorization/login', { email, password });
            const token = response.data.token;

            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            console.log('Успішно авторизовано. Токен:', token);

            navigate(`/profile/${userId}`);
        } catch (err) {
            console.error('Помилка:', err);
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        setError('Невірний запит. Будь ласка, перевірте введені дані.');
                        break;
                    case 401:
                        setError('Неправильний логін або пароль.');
                        break;
                    case 500:
                        setError('Внутрішня помилка сервера. Будь ласка, спробуйте ще раз пізніше.');
                        break;
                    default:
                        setError(err.response.data.message || 'Щось пішло не так. Будь ласка, спробуйте ще раз.');
                }
            } else {
                setError('Щось пішло не так. Будь ласка, спробуйте ще раз.');
            }
        }
    };


    return (
        <div className="login-container">
            <h2 className='login-page-title'>Форма авторизації</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Електронна пошта:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='register-login-page'>
                    <p>Відсутній обліковий запис? <Link to="/registration" className='registration-link'>Зареєструйтеся</Link></p>
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="submit-button">Увійти</button>
            </form>
        </div>
    );
}

export default LoginForm;
