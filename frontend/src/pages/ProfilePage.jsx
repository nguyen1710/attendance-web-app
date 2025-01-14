import Header from "../components/common/Header";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";



const ProfilePage = () => {
    const savedUserInfo = localStorage.getItem('adminInfo');
    const user = JSON.parse(savedUserInfo);

    const initialUserInfo = {
        username: user.username,
		imageUrl: user.imageUrl,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
        currentPassword: user.password,
        newPassword: '',
        confirmPassword: '',
    };

    const [userInfo, setUserInfo] = useState({initialUserInfo});

	useEffect(() => {
        setUserInfo({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            currentPassword: user.password,
            newPassword: "",
            confirmPassword: "",
            imageUrl: user.imageUrl || "",
        });
        
    }, []);

	const [passwordVisible, setPasswordVisible] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

	const handleSave = async (event) => {
        event.preventDefault();

    
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userInfo.email)) {
                toast.error("Invalid email format!");
                return;
            }else if(!userInfo.username.trim()) {
                toast.error("Username cannot be empty!");
                return;
            }else if (!userInfo.email.trim()) {
                toast.error("Email cannot be empty!");
                return;
            }else if (!userInfo.phone.trim()) {
                toast.error("Phone cannot be empty!");
                console.log("phone empty")
                return;
            }else if (!userInfo.address.trim()) {
                toast.error("Email cannot be empty!");
                console.log("address empty")
                return;
            }else if (userInfo.newPassword !== userInfo.confirmPassword) {
                toast.error("Passwords do not match!");
                console.log("not match")
                return;
            }

            let uploadedImageUrl = userInfo.imageUrl; // Giữ URL cũ nếu không có ảnh mới
    
            if (userInfo.image) {
                // Chỉ upload ảnh nếu có ảnh mới
                const data = new FormData();
                data.append("image", userInfo.image);
    
                const imageUploadResponse = await fetch(
                    "https://api.imgbb.com/1/upload?key=db96fd24d507bc171c6696ffb0bc1f6f",
                    { method: "POST", body: data }
                );
    
                const imageUploadData = await imageUploadResponse.json();
    
                if (imageUploadData.success) {
                    uploadedImageUrl = imageUploadData.data.url;
                } else {
                    console.error("Image upload failed:", imageUploadData);
                    toast.error("Tải ảnh lên thất bại, vui lòng thử lại.", { position: "top-right" });
                    return; // Ngừng tiến trình nếu upload ảnh thất bại
                }
            }

            // Cập nhật lại userInfo với thông tin mới
            const updatedUserInfo = {
                ...userInfo,
                password: userInfo.newPassword || userInfo.currentPassword,
                imageUrl: uploadedImageUrl, // Cập nhật URL ảnh mới (nếu có)
            };

            setUserInfo(updatedUserInfo);

            // Lưu userInfo vào localStorage
            localStorage.setItem('adminInfo', JSON.stringify(updatedUserInfo));


            const response = await axios.put("http://localhost:4000/admin-service/api/admin/updateProfile", updatedUserInfo);

            if (response.status === 200) {
                toast.success(response.data.message);
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error saving user data:", error);
            toast.error("An error occurred. Please try again.");
        }
    };
    

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUserInfo({
                ...userInfo,
                image: file, // Store the image file in the state
                imageUrl: imageUrl,
            });
        }
    };
    



	return (
		<div className='flex-1 overflow-auto relative z-10 bg-[#ffffff] bg-opacity-90'>
			<Header title='Profile'/>
			<main className='mx-auto py-6 px-4 lg:px-8 text-black'>
			<div className="bg-white shadow-md rounded-lg p-6">
				
            <h2 className="text-lg text-black font-semibold mb-4">Basic Information</h2>

            <div className="mb-6">
                <div className="flex items-center gap-4">
					<img
						src={userInfo.imageUrl || "https://via.placeholder.com/150"}
						alt="Profile"
						className="w-20 h-20 rounded-full object-cover border border-gray-300"
					/>

					<div className="text-black text-xs sm:text-sm ">
					<label className="block text-black font-bold ">Profile Photo</label>
					<label className="block text-gray-400 font-semibold mb-2">Recommended image size is 150px x 150px</label>
					<label className="bg-orange-500 font-bold text-white px-4 py-2 rounded cursor-pointer">
                        Upload
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>

					<button className="text-gray-600">Cancel</button>	
					</div>
					
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
                <div>
                    <label className="block font-medium mb-2">Username</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter Username"
						value={userInfo.username}
						onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter Email"
						value={userInfo.email || ""}
						onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter Phone"
                        value={userInfo.phone}
						onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    />
                </div>
            </div>

			<div className="border-t border-gray-200 my-3"></div>


            <h2 className="text-lg font-semibold mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
                <div>
                    <label className="block font-medium mb-2">Address</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter Address"
                        value={userInfo.address}
						onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">City</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Enter City"
                        value={userInfo.city || ""}
						onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                    />
                </div>
                
            </div>

			<div className="border-t border-gray-200 my-3"></div>

            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Current Password */}
            <div>
                <label className="block font-medium mb-2">Current Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible.currentPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded p-2 pr-10"
                        placeholder="Enter Current Password"
                        value={userInfo.currentPassword|| ''}
                        onChange={(e) => setUserInfo({ ...userInfo, currentPassword: e.target.value })}
                        />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("currentPassword")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                        {passwordVisible.currentPassword ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 5c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm0-2c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"/></svg>                        
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z"/></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* New Password */}
            <div>
                <label className="block font-medium mb-2">New Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible.newPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded p-2 pr-10"
                        placeholder="Enter New Password"
                        value={userInfo.newPassword || ''}
                        onChange={(e) => setUserInfo({ ...userInfo, newPassword: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                        {passwordVisible.newPassword ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 5c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm0-2c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"/></svg>                        
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z"/></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block font-medium mb-2">Confirm Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible.confirmPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded p-2 pr-10"
                        placeholder="Confirm Password"
                        value={userInfo.confirmPassword || ''}
                        onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}

                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                    >
                        {passwordVisible.confirmPassword ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 5c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm0-2c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"/></svg>                        
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z"/></svg>
                        )}
                    </button>
                </div>
            </div>
        </div>

			<div className="border-t border-gray-200 my-3"></div>


            <div className="flex justify-end gap-4">
                <button className="text-gray-800 rounded px-4 py-2 rounded">Cancel</button>
                <button className="bg-orange-500 text-white px-4 py-2 rounded"
                    type="submit"
                    onClick={handleSave}
                >   
                    Save
                </button>
            </div>
        </div>
			</main>

		</div>
	);
};
export default ProfilePage;	