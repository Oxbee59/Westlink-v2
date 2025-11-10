import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">You need to log in first.</p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 mt-10 rounded">
      <h2 className="text-xl font-bold mb-4 text-yellow-600">Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mt-4 text-gray-600">Welcome to Westlink Supermarket!</p>
    </div>
  );
}

export default Profile;
