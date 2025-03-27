import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import PaymentModal from './PaymentModal';

const BookingForm = () => {
  const { trainId } = useParams();
  const [formData, setFormData] = useState({
    journeyDate: '',
    seats: 1,
  });
  const [error, setError] = useState('');
  const [trainDetails, setTrainDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainDetails = async () => {
      try {
        const response = await api.get(`/trains/${trainId}`);
        setTrainDetails(response.data);
      } catch (err) {
        setError('Failed to load train details');
      }
    };
    fetchTrainDetails();
  }, [trainId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingData({
      train: trainId,
      journeyDate: formData.journeyDate,
      seats: formData.seats
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const response = await api.post('/bookings', bookingData);
      navigate(`/booking/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setShowPaymentModal(false);
    }
  };

  if (!trainDetails) {
    return <div>Loading train details...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Book {trainDetails.name} ({trainDetails.trainNumber})
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">From</p>
          <p className="font-medium">{trainDetails.source}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">To</p>
          <p className="font-medium">{trainDetails.destination}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Departure</p>
          <p className="font-medium">{trainDetails.departureTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-medium">₹{trainDetails.price}</p>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="journeyDate">
            Journey Date
          </label>
          <input
            id="journeyDate"
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.journeyDate}
            onChange={(e) => setFormData({...formData, journeyDate: e.target.value})}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="seats">
            Number of Seats (Max: 6)
          </label>
          <input
            id="seats"
            type="number"
            min="1"
            max="6"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.seats}
            onChange={(e) => setFormData({...formData, seats: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full btn-primary"
        >
          Proceed to Pay - ₹{trainDetails.price * formData.seats}
        </button>
      </form>

      {showPaymentModal && (
        <PaymentModal
          amount={trainDetails.price * formData.seats}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default BookingForm;