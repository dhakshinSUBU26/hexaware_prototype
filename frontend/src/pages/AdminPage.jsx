import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    const [view, setView] = useState('users'); // 'users' or 'documents'
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (view === 'users') {
            adminService.getAllUsers()
                .then(res => setUsers(res.data))
                .catch(() => toast.error("Failed to load users."))
                .finally(() => setLoading(false));
        } else {
            adminService.getAllDocuments()
                .then(res => setDocuments(res.data.documents))
                .catch(() => toast.error("Failed to load documents."))
                .finally(() => setLoading(false));
        }
    }, [view]);

    return (
        <div className="container">
            <div className={styles.adminHeader}>
                <h1 className="section__title">Administrator Panel</h1>
            </div>
            <div className={styles.tabContainer}>
                <button 
                    className={`${styles.tabButton} ${view === 'users' ? styles.activeTab : ''}`}
                    onClick={() => setView('users')}>
                    User Management
                </button>
                <button 
                    className={`${styles.tabButton} ${view === 'documents' ? styles.activeTab : ''}`}
                    onClick={() => setView('documents')}>
                    All Documents
                </button>
            </div>

            <div className="card">
                {loading ? <p>Loading data...</p> : (
                    <div className={styles.tableContainer}>
                        {view === 'users' ? (
                            <table className={styles.table}>
                                <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Joined On</th></tr></thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <table className={styles.table}>
                                <thead><tr><th>Document Name</th><th>Owner</th><th>Classification</th><th>Status</th><th>Processed On</th></tr></thead>
                                <tbody>
                                    {documents.map(doc => (
                                        <tr key={doc._id}>
                                            <td>{doc.originalName}</td>
                                            <td>{doc.owner?.username || 'N/A'}</td>
                                            <td>{doc.classification}</td>
                                            <td>{doc.status}</td>
                                            <td>{new Date(doc.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;