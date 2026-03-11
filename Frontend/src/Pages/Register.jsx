const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    return setError("Passwords do not match");
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    navigate("/login");

  } catch (err) {
    setError(err.message);
  }
};