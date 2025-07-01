import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../Css/ForgotPassword.css"
import { BsArrowBarLeft } from 'react-icons/bs'
const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        "/auth/forgotpassword",
        { email }
      );

      setSuccess(data.message);
      setEmail(""); // Clear email after success
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to send reset email. Please try again.";
      setError(errorMessage);

      // Handle rate limiting message
      if (error.response?.status === 429) {
        setError(`⏰ ${errorMessage}`);
      }

      setTimeout(() => {
        setError("");
      }, 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Inclusive-forgotPassword-page">

      <div className="forgotPassword-big-wrapper">
        <Link to="/" className="back_home">
          <BsArrowBarLeft />
        </Link>
        <form
          onSubmit={forgotPasswordHandler}
        >
          <div className="top-forgotpassword-explain">
            <h3>Forgot Password</h3>
            <p>
              Please enter the email address you registered your account with. We
              will send you a password reset link to this email address.
            </p>
          </div>

          {error && <div className="error_message">{error}</div>}
          {success && (
            <div className="success_message">
              {success}
              <div style={{ marginTop: '10px' }}>
                <Link to="/login" className="ml-3">Go to Login</Link>
                {" | "}
                <Link to="/" className="ml-3">Go Home</Link>
              </div>
            </div>
          )}

          <div className="input-wrapper">

            <input
              type="email"
              required
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">E-mail</label>

          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>

        </form>

      </div>

    </div>

  );
};

export default ForgotPasswordScreen;