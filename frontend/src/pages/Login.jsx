import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Detect returning users
  useEffect(() => {
    const existingUser = localStorage.getItem("user");

    if (existingUser) {
      const userObj = JSON.parse(existingUser);
      setWelcomeMsg(`Welcome back, ${userObj.name}! Continue your journey with Westlink.`);
    } else {
      setWelcomeMsg("Start your journey with Westlink — explore a wide range of quality collections.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // SAVE USER + STAFF STATUS
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token || "");

      // FIX: map backend isAdmin → frontend is_staff
      localStorage.setItem("is_staff", data.user.isAdmin ? "true" : "false");

      alert("Login successful!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <h2 className="text-2xl font-bold mb-2">Login</h2>

      {/* Customer Interaction Message */}
      <p className="text-gray-700 text-center max-w-md mb-4">
        {welcomeMsg}
      </p>

      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded shadow">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-3 rounded pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-2 text-sm text-gray-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600"
        >
          Login
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
