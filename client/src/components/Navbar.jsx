import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Railway Booking
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            to="/trains" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Trains
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/bookings" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                My Bookings
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;