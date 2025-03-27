import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {booking.train.name} ({booking.train.trainNumber})
          </h3>
          <p className="text-sm text-gray-500">
            Booking ID: {booking._id}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          booking.status === 'confirmed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Journey Date</p>
          <p>{format(new Date(booking.journeyDate), 'PPP')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Seats</p>
          <p>{booking.seats.join(', ')}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">
          ₹{booking.totalAmount}
        </span>
        <Link
          to={`/booking/${booking._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookingCard;