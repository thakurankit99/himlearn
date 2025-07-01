import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Css/ResetPasswordScreen.css"

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const search = useLocation().search;
  const navigate = useNavigate();
  const token = new URLSearchParams(search).get('resetPasswordToken');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.put(
        `/auth/resetpassword?resetPasswordToken=${token}`,
        {
          password,
          confirmPassword
        }
      );

      setSuccess(data.message);
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to reset password. Please try again.";
      setError(errorMessage);

      // Handle specific error cases
      if (errorMessage.includes("expired")) {
        setTokenValid(false);
      }

      setTimeout(() => {
        setError("");
      }, 8000);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="Inclusive-resetPassword-page">
        <div className="resetpassword-form">
          <h3>Invalid Reset Link</h3>
          <div className="error_msg">
            {error || "This password reset link is invalid or has expired."}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/forgotpassword" className="reset-link">
              Request New Password Reset
            </Link>
            <br />
            <Link to="/login" style={{ marginTop: '10px', display: 'inline-block' }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Inclusive-resetPassword-page">
      <form
        onSubmit={resetPasswordHandler}
        className="resetpassword-form"
      >

        <h3>Reset Password</h3>

        {error && <div className="error_msg">{error}</div>}

        {success && (
          <div className="success_msg">
            {success}
            <div style={{ marginTop: '10px' }}>
              Redirecting to login page...
            </div>
            <Link to="/login" style={{ marginTop: '10px', display: 'inline-block' }}>
              Go to Login Now
            </Link>
          </div>
        )}

        <div className="input-wrapper">
          <input
            type="password"
            required
            id="password"
            placeholder="Enter new password"
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirmpassword"> Password</label>
        </div>

        <div className="input-wrapper">

          <input
            type="password"
            required
            id="confirmpassword"
            placeholder="Confirm new password"
            autoComplete="true"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label htmlFor="confirmpassword">Confirm New Password</label>
        </div>
        <button className="resetPass-btn" disabled={loading}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>

      </form>
    </div>
  );
};

export default ResetPasswordScreen;