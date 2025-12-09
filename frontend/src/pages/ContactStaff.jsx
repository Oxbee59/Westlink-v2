import { useNavigate } from "react-router-dom";

export default function ContactStaffPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-6 text-center bg-white shadow rounded mt-6">
      <h2 className="text-xl font-semibold mb-4">Order Successfully Placed ✅</h2>
      <p className="mb-4">
        Thank you for your order! Our staff will contact you shortly for delivery.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
      >
        Go Home
      </button>
    </div>
  );
}
