import React, { useEffect, useState } from 'react';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Header() {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.id;
            const userRoleFromToken = decodedToken.role;
            if (userIdFromToken) {
                setUserId(userIdFromToken);
            }
            if (userRoleFromToken) {
                setUserRole(userRoleFromToken);
            }
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="Header">
            <div className="container">
                <Link to="/" className="logo">BandBridge</Link>
                <nav>
                    <ul>
                        {!token && (
                            <>
                                <li><Link to="/login">Логін</Link></li>
                                <li><Link to="/registration">Реєстрація</Link></li>
                                <li><Link to="/bands">Гурти</Link></li>
                                <li><Link to="/events">Концерти</Link></li>
                            </>
                        )}
                        {token && (
                            <>
                                {userId && (
                                    <li><Link to={`/profile/${userId}`}>Профіль</Link></li>
                                )}
                                <li><Link to="/bands">Гурти</Link></li>
                                <li><Link to="/events">Концерти</Link></li>
                                {userRole === 'admin' && (
                                    <li><Link to="/genres">Жанри</Link></li>
                                )}
                                <li><span onClick={handleLogout} className='exit-login-btn'>Вихід</span></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
