import { Search, Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-3">
      <div className="flex items-center gap-2 w-1/3">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full border-none focus:outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-600 cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <User className="text-gray-600" />
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
