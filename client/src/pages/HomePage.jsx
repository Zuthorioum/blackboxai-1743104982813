import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to Railway Booking
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Book your train tickets with ease and convenience
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/trains"
          className="btn-primary"
        >
          View Trains
        </Link>
        <Link
          to="/bookings"
          className="btn-primary bg-green-600 hover:bg-green-700"
        >
          My Bookings
        </Link>
      </div>
    </div>
  );
};

export default HomePage;