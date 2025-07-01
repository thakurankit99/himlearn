import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard'
        },
        {
            id: 'users',
            label: 'User Management',
            icon: 'users'
        },
        {
            id: 'stories',
            label: 'Content Management',
            icon: 'content',
            disabled: true
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: 'analytics',
            disabled: true
        }
    ];

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">
                <Link to="/" className="admin-logo-link">
                    <h2>HimLearning Admin</h2>
                </Link>
            </div>
            
            <nav className="admin-nav">
                <ul className="admin-nav-list">
                    {menuItems.map(item => (
                        <li key={item.id} className="admin-nav-item">
                            <button
                                className={`admin-nav-link ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                                onClick={() => !item.disabled && setActiveTab(item.id)}
                                disabled={item.disabled}
                            >
                                <span className={`admin-nav-icon icon-${item.icon}`}></span>
                                <span className="admin-nav-label">{item.label}</span>
                                {item.disabled && <span className="coming-soon">Coming Soon</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="admin-sidebar-footer">
                <Link to="/" className="back-to-site">
                    ← Back to Site
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;
