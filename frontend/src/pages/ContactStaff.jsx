import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function ContactStaffPage() {
  const navigate = useNavigate();

  // Staff contact details
  const email = "Westlink.winstyles@gmail.com";
  const phone = "08105168263"; // Nigerian number (local format)
  const intlPhone = "2348105168263"; // International format for WhatsApp

  return (
    <div className="max-w-md mx-auto p-6 text-center bg-white shadow rounded mt-6">
      <h2 className="text-xl font-semibold mb-4">Order Successfully Placed ✅</h2>

      <p className="mb-4">
        Thank you for your order! Our staff will contact you shortly for delivery.
      </p>

      <div className="bg-gray-100 p-4 rounded mb-5">
        <p className="font-semibold mb-2">Contact Our Staff</p>

        <p className="mb-1">
          <strong>Email:</strong> {email}
        </p>

        <p className="mb-3">
          <strong>Phone:</strong> {phone}
        </p>

        <div className="flex flex-col gap-3 items-center">

          {/* Call Button */}
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full justify-center"
          >
            <FaPhoneAlt size={18} />
            Call Staff
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${intlPhone}?text=Hello%20Westlink,%20I%20just%20placed%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full justify-center"
          >
            <FaWhatsapp size={22} />
            Chat on WhatsApp
          </a>

        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
      >
        Go Home
      </button>
    </div>
  );
}
