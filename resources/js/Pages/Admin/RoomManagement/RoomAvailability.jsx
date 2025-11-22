import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { addDays, format, eachDayOfInterval, startOfDay } from 'date-fns';

const bookingStatusStyles = {
    Pending: 'bg-yellow-400 border-yellow-500',
    Confirmed: 'bg-blue-500 border-blue-600',
    CheckedIn: 'bg-green-500 border-green-600',
    Maintenance: 'bg-gray-400 border-gray-500',
};

const RoomAvailability = ({ rooms, bookings, startDate, endDate }) => {
    const [dates, setDates] = useState({
        start: startDate,
        end: endDate,
    });

    const [filterType, setFilterType] = useState('All');

    const dateInterval = eachDayOfInterval({
        start: new Date(dates.start),
        end: new Date(dates.end),
    });

    useEffect(() => {
        // This effect will run when the component mounts and dates change.
        // It triggers a refetch of data.
        const delayDebounceFn = setTimeout(() => {
            if (dates.start && dates.end) {
                router.get(
                    route('admin.room_availability.index'),
                    {
                        start_date: dates.start,
                        end_date: dates.end,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    }
                );
            }
        }, 500); // Debounce to avoid rapid firing of requests

        return () => clearTimeout(delayDebounceFn);
    }, [dates]);

    const handleDateChange = (e) => {
        setDates((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredRooms = rooms.filter(room => filterType === 'All' || room.room_type.name === filterType);
    
    const isToday = (date) => format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    const roomTypes = [...new Set(rooms.map(room => room.room_type.name))];

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
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mr-2">Start Date</label>
                            <input type="date" name="start" value={dates.start} onChange={handleDateChange} className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mr-2">End Date</label>
                            <input type="date" name="end" value={dates.end} onChange={handleDateChange} className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mr-2">Room Type</label>
                            <select onChange={(e) => setFilterType(e.target.value)} value={filterType} className="w-48 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="All">All</option>
                                {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Availability Grid */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="grid gap-px" style={{ gridTemplateColumns: `120px repeat(${dateInterval.length}, minmax(60px, 1fr))`}}>
                            {/* Header: Room */}
                            <div className="sticky left-0 z-20 bg-gray-100 p-3 flex items-center justify-center">
                                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Room</span>
                            </div>
                            {/* Header: Dates */}
                            {dateInterval.map(date => (
                                <div key={date.toString()} className={`p-3 text-center ${isToday(date) ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                    <p className={`font-semibold ${isToday(date) ? 'text-blue-700' : 'text-gray-700'}`}>{format(date, 'd')}</p>
                                    <p className={`text-xs ${isToday(date) ? 'text-blue-600' : 'text-gray-500'}`}>{format(date, 'EEE')}</p>
                                </div>
                            ))}

                            {/* Room Rows */}
                            {filteredRooms.map(room => (
                                <React.Fragment key={room.id}>
                                    <div className="sticky left-0 z-10 bg-white p-3 flex items-center justify-center font-bold text-gray-800 border-t border-gray-200">
                                        {room.room_number}
                                        <p className="text-xs text-gray-500 ml-2">({room.room_type.name})</p>
                                    </div>
                                    <div className="col-span-full grid" style={{ gridTemplateColumns: `repeat(${dateInterval.length}, minmax(60px, 1fr))` }}>
                                        {dateInterval.map(date => (
                                            <div key={date.toString()} className={`h-full border-r border-t border-gray-200 ${isToday(date) ? 'bg-blue-50/50' : ''}`}></div>
                                        ))}

                                        {/* Bookings for this room */}
                                        {bookings.filter(b => b.room_id === room.id).map(booking => {
                                            const bookingStart = startOfDay(new Date(booking.check_in_date));
                                            const bookingEnd = startOfDay(new Date(booking.check_out_date));

                                            const dayIndex = dateInterval.findIndex(d => format(d, 'yyyy-MM-dd') === format(bookingStart, 'yyyy-MM-dd'));
                                            
                                            if (dayIndex === -1) return null;

                                            const duration = (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 3600 * 24); // Day difference
                                            
                                            return (
                                                 <div 
                                                    key={booking.id} 
                                                    className={`absolute z-10 h-12 my-1 rounded-lg text-white p-2 text-xs flex items-center shadow-lg ${bookingStatusStyles[booking.status] || 'bg-gray-500'}`}
                                                    style={{ left: `${dayIndex * 100 / dateInterval.length}%`, width: `${duration * 100 / dateInterval.length}%` }}
                                                    title={`Booking #${booking.id}\nStatus: ${booking.status}`}
                                                >
                                                    <p className="font-semibold truncate">Booking #{booking.id}</p>
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