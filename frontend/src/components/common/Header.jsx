const Header = ({ title, username, email }) => {
	return (
	// 	<header className='bg-secondary text-primary-900 bg-opacity-50 backdrop-blur-md shadow-lg'>

	// 	<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
	// 	  <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
	// 	  <div className='text-gray-100 text-sm sm:text-base'>
	// 		<p>Name: {username}</p>
	// 		<p>{email}</p>
	// 	  </div>
	// 	</div>
	// </header>
	<header className='max-w-full bg-[#f9fafb] text-black-pink bg-opacity-70 backdrop-blur-md shadow-lg'>
	<div className='max-w-full mx-full py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
		<h1 className='text-2xl font-semibold text-black'>{title}</h1>
		<div className='text-black text-sm sm:text-base'>
			<p>Name: {username}</p>
			<p>{email}</p>
    	</div>
  </div>
</header>

	);
};
export default Header;