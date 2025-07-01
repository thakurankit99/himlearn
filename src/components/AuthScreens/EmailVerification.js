import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../Css/EmailVerification.css';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            verifyEmail(token);
        } else {
            setStatus('error');
            setMessage('Invalid verification link. Please check your email for the correct link.');
        }
    }, [searchParams]);

    const verifyEmail = async (token) => {
        try {
            const { data } = await axios.get(`/auth/verify-email?token=${token}`);
            setStatus('success');
            setMessage(data.message);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setStatus('error');

            // Handle network errors
            if (!error.response) {
                setMessage('Network error. Please check your internet connection and try again.');
                return;
            }

            const errorMessage = error.response?.data?.error || 'Verification failed. Please try again.';
            setMessage(errorMessage);

            // If already verified, show success instead
            if (errorMessage.includes("already verified")) {
                setStatus('success');
                setMessage("Email is already verified! You can now log in to your account.");
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        }
    };

    const handleResendEmail = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        setResendLoading(true);
        setMessage(''); // Clear previous messages

        try {
            const { data } = await axios.post('/auth/resend-verification', { email });
            setMessage(data.message);
            setEmail('');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to resend verification email';
            setMessage(errorMessage);

            // Handle rate limiting message
            if (error.response?.status === 429) {
                setMessage(`⏰ ${errorMessage}`);
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="email-verification-page">
            <div className="verification-container">
                <div className="verification-content">
                    {status === 'verifying' && (
                        <>
                            <div className="verification-icon verifying">
                                <div className="spinner"></div>
                            </div>
                            <h2>Verifying Your Email...</h2>
                            <p>Please wait while we verify your email address.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="verification-icon success">
                                ✓
                            </div>
                            <h2>Email Verified Successfully!</h2>
                            <p>{message}</p>
                            <p>Redirecting to login page...</p>
                            <Link to="/login" className="login-link">
                                Go to Login Now
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="verification-icon error">
                                ✗
                            </div>
                            <h2>Verification Failed</h2>
                            <p>{message}</p>
                            
                            <div className="resend-section">
                                <h3>Need a new verification link?</h3>
                                <form onSubmit={handleResendEmail} className="resend-form">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={resendLoading}
                                        className="resend-btn"
                                    >
                                        {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                                    </button>
                                </form>
                            </div>

                            <div className="help-links">
                                <Link to="/login">Back to Login</Link>
                                <Link to="/register">Create New Account</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
