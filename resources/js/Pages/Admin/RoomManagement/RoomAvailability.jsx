import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChevronLeft, ChevronRight, Bed, Calendar, Filter, Search } from 'lucide-react';
import { addDays, format, isWithinInterval, startOfDay } from 'date-fns';

// --- MOCK DATA ---
const mockRooms = [
    { id: '101', type: 'Standard' },
    { id: '102', type: 'Standard' },
    { id: '201', type: 'Deluxe' },
    { id: '202', type: 'Deluxe' },
    { id: '301', type: 'Suite' },
    { id: '302', type: 'Suite' },
    { id: '401', type: 'Family' },
];

const today = startOfDay(new Date());
const mockBookings = [
    { id: 'BK001', roomId: '101', guest: 'John Doe', from: today, to: addDays(today, 4), status: 'Confirmed' },
    { id: 'BK002', roomId: '202', guest: 'Jane Smith', from: addDays(today, 1), to: addDays(today, 6), status: 'CheckedIn' },
    { id: 'BK003', roomId: '301', guest: 'Peter Jones', from: addDays(today, 5), to: addDays(today, 10), status: 'Pending' },
    { id: 'BK004', roomId: '102', guest: 'Mary Johnson', from: addDays(today, 8), to: addDays(today, 12), status: 'Confirmed' },
    { id: 'BK005', roomId: '401', guest: 'David Williams', from: addDays(today, 2), to: addDays(today, 7), status: 'Confirmed' },
    { id: 'BK006', roomId: '201', guest: 'Maintenance', from: addDays(today, 9), to: addDays(today, 11), status: 'Maintenance' },
];

const bookingStatusStyles = {
    Pending: 'bg-yellow-400 border-yellow-500',
    Confirmed: 'bg-blue-500 border-blue-600',
    CheckedIn: 'bg-green-500 border-green-600',
    Maintenance: 'bg-gray-400 border-gray-500',
};

const RoomAvailability = () => {
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const [viewDays, setViewDays] = useState(14);
    const [filterType, setFilterType] = useState('All');

    const dateRange = Array.from({ length: viewDays }, (_, i) => addDays(startDate, i));

    const handlePrev = () => setStartDate(prev => addDays(prev, -viewDays));
    const handleNext = () => setStartDate(prev => addDays(prev, viewDays));

    const filteredRooms = mockRooms.filter(room => filterType === 'All' || room.type === filterType);
    
    const isToday = (date) => format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Room Availability</h1>
                    <p className="text-gray-500 mt-1">Visualize room occupancy and availability over time.</p>
                </div>

                {/* Controls */}
                <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-200/80 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-gray-100 transition"><ChevronLeft className="w-5 h-5"/></button>
                            <span className="font-semibold text-gray-700 w-72 text-center">
                                {format(startDate, 'MMM d, yyyy')} - {format(addDays(startDate, viewDays - 1), 'MMM d, yyyy')}
                            </span>
                            <button onClick={handleNext} className="p-2 rounded-lg hover:bg-gray-100 transition"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mr-2">Room Type</label>
                            <select onChange={(e) => setFilterType(e.target.value)} value={filterType} className="w-48 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="All">All</option>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                                <option value="Family">Family</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Availability Grid */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="grid gap-px" style={{ gridTemplateColumns: `120px repeat(${viewDays}, minmax(60px, 1fr))`}}>
                            {/* Header: Room */}
                            <div className="sticky left-0 z-20 bg-gray-100 p-3 flex items-center justify-center">
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Room</span>
                            </div>
                            {/* Header: Dates */}
                            {dateRange.map(date => (
                                <div key={date.toString()} className={`p-3 text-center ${isToday(date) ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                    <p className={`font-semibold ${isToday(date) ? 'text-blue-700' : 'text-gray-700'}`}>{format(date, 'd')}</p>
                                    <p className={`text-xs ${isToday(date) ? 'text-blue-600' : 'text-gray-500'}`}>{format(date, 'EEE')}</p>
                                </div>
                            ))}

                            {/* Room Rows */}
                            {filteredRooms.map(room => (
                                <React.Fragment key={room.id}>
                                    <div className="sticky left-0 z-10 bg-white p-3 flex items-center justify-center font-bold text-gray-800 border-t border-gray-200">
                                        {room.id}
                                        <p className="text-xs text-gray-500 ml-2">({room.type})</p>
                                    </div>
                                    <div className="col-span-full grid" style={{ gridTemplateColumns: `repeat(${viewDays}, minmax(60px, 1fr))` }}>
                                        {dateRange.map(date => (
                                            <div key={date.toString()} className={`h-full border-r border-t border-gray-200 ${isToday(date) ? 'bg-blue-50/50' : ''}`}></div>
                                        ))}

                                        {/* Bookings for this room */}
                                        {mockBookings.filter(b => b.roomId === room.id).map(booking => {
                                            const bookingStart = startOfDay(booking.from);
                                            const bookingEnd = startOfDay(booking.to);

                                            const dayIndex = dateRange.findIndex(d => format(d, 'yyyy-MM-dd') === format(bookingStart, 'yyyy-MM-dd'));
                                            
                                            if (dayIndex === -1) return null;

                                            const duration = (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 3600 * 24) + 1;
                                            
                                            return (
                                                 <div 
                                                    key={booking.id} 
                                                    className={`absolute z-10 h-12 my-1 rounded-lg text-white p-2 text-xs flex items-center shadow-lg ${bookingStatusStyles[booking.status]}`}
                                                    style={{ left: `${dayIndex * 100 / viewDays}%`, width: `${duration * 100 / viewDays}%` }}
                                                    title={`Booking #${booking.id} - ${booking.guest}\nStatus: ${booking.status}`}
                                                >
                                                    <p className="font-semibold truncate">{booking.guest}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default RoomAvailability;