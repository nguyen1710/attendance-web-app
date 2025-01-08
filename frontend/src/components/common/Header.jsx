import { Bell, User, Settings, LogOut } from "lucide-react"; // Importing notification icon
import { useState } from "react";

const Header = ({ title}) => {
	const [hasNotification, setHasNotification] = useState(true); 
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [username, setUsername] = useState(localStorage.getItem("username"));
	const [email, setEmail] = useState(localStorage.getItem("email"));
	const [imageUrl, setImageUrl] = useState(localStorage.getItem("imageUrl"));

	return (
		<header className="max-w-full bg-[#ffffff] text-black">
			<div className="max-w-full mx-full py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
				<h1 className="text-2xl font-semibold text-black">{title}</h1>

				<div className="flex items-center gap-6">
		
					<div className="relative">
						{/* Bell Button */}
						<button
							className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200 relative"
							aria-label="Notifications"
							onClick={() => setHasNotification(false)} // Clear notification on click
						>
							<Bell className="h-3 w-3 text-gray-600" />
						</button>
						{/* Red Dot Positioned Near the Bell */}
						{hasNotification && (
							<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
						)}
					</div>

					{/* Profile Image */}
					<div className="relative">
						<img
							src={imageUrl || "https://via.placeholder.com/150"}
							alt="Profile"
							className="w-6 h-6 rounded-full object-cover border border-gray-300 cursor-pointer"
							onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
						/>

						{/* Dropdown Menu */}
						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md text-sm z-50">
								<div className="p-2 border-b flex items-center gap-3">
									<img
										src={imageUrl || "https://via.placeholder.com/150"}
										alt="Profile"
										className="w-10 h-10 rounded-full object-cover border border-gray-300"
									/>
									<div className="text-black text-xs sm:text-sm ">
										<p className="font-medium">{username}</p>
										<p className="text-gray-500 truncate max-w-[120px]">{email}</p>
									</div>
								</div>
								<ul className="py-2">
									<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
										<User className="h-4 w-4 text-gray-600" />
										My Profile
									</li>
									<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
										<Settings className="h-4 w-4 text-gray-600" />
										Settings
									</li>
									<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
										<span className="h-3 w-3 rounded-full bg-green-500"></span>
										Status
									</li>
									<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
										📄 My Account
									</li>
									<li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
										❓ Knowledge Base
									</li>
								</ul>
								<div className="py-2 border-t">
									<button
										className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center"
										onClick={() => alert("Logging out...")} // Replace with logout logic
									>
										<LogOut className="h-4 w-4 text-red-600 mr-2" /> Logout
									</button>
								</div>

							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
