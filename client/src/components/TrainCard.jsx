import { Link } from 'react-router-dom';

const TrainCard = ({ train }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {train.trainNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Departure</p>
            <p className="font-medium">{train.departureTime}</p>
            <p className="text-sm">{train.source}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="font-medium">{train.arrivalTime}</p>
            <p className="text-sm">{train.destination}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            ₹{train.price}
          </span>
          <Link
            to={`/book/${train._id}`}
            className="btn-primary text-sm py-1.5 px-3"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;