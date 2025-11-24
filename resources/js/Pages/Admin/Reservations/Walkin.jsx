import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const Walkin = ({ roomTypes }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        room_type: '',
        check_in_date: '',
        check_out_date: '',
    });
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [status, setStatus] = useState('Confirmed');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleCheckAvailability = async () => {
        try {
            const response = await axios.post(route('admin.bookings.walkin.check'), formData);
            setAvailableRooms(response.data);
        } catch (error) {
            console.error(error);
            alert(error.response.data.message);
        }
    };

    const handleBooking = () => {
        router.post(route('admin.bookings.store'), {
            ...formData,
            room_id: selectedRoom,
            total_price: totalPrice,
            status: status,
        });
    };

    return (
        <AdminLayout>
            <Head title="Walk-in Booking" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Walk-in Booking</h1>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className="block font-medium text-gray-700">First Name</label>
                        <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block font-medium text-gray-700">Last Name</label>
                        <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block font-medium text-gray-700">Phone</label>
                        <input type="text" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="room_type" className="block font-medium text-gray-700">Room Type</label>
                        <select id="room_type" value={formData.room_type} onChange={handleChange} className="mt-1 block w-full">
                            <option value="">Select Room Type</option>
                            {roomTypes.map(rt => (
                                <option key={rt.id} value={rt.id}>{rt.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="check_in_date" className="block font-medium text-gray-700">Check-in Date</label>
                        <input type="date" id="check_in_date" value={formData.check_in_date} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                        <label htmlFor="check_out_date" className="block font-medium text-gray-700">Check-out Date</label>
                        <input type="date" id="check_out_date" value={formData.check_out_date} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                </div>
                <button onClick={handleCheckAvailability} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Check Availability</button>

                {availableRooms.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-2">Available Rooms</h2>
                        <select onChange={(e) => setSelectedRoom(e.target.value)} className="mt-1 block w-full">
                            <option value="">Select a Room</option>
                            {availableRooms.map(room => (
                                <option key={room.id} value={room.id}>{room.room_number}</option>
                            ))}
                        </select>
                        <div className="mt-4">
                            <label htmlFor="total_price" className="block font-medium text-gray-700">Total Price</label>
                            <input type="number" id="total_price" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className="mt-1 block w-full" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="status" className="block font-medium text-gray-700">Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full">
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Checked In">Checked In</option>
                            </select>
                        </div>
                        <button onClick={handleBooking} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Book Room</button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Walkin;
