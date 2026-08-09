const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


let roomList = [
    { id: "101", title: "Single Standard Room", price: 800, status: "available", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500", desc: "Cozy room with free Wi-Fi and king bed." },
    { id: "102", title: "Single Executive Room", price: 1000, status: "occupied", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500", desc: "Executive workspace & smart TV." },
    { id: "201", title: "Deluxe Double Room", price: 5000, status: "dirty", img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500", desc: "Spacious luxury room designed for couples." },
    { id: "202", title: "Super Deluxe Double Room", price: 7500, status: "available", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500", desc: "Balcony access and complimentary breakfast." },
    { id: "301", title: "Executive Double Ocean View", price: 10000, status: "maintenance", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500", desc: "Panoramic view with luxury ocean deck." },
    { id: "401", title: "Royal Family Suite", price: 20000, status: "occupied", img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500", desc: "Multi-bedroom suite for families." },
    { id: "501", title: "Presidential VIP Suite", price: 35000, status: "available", img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500", desc: "VIP suite with private lounge." },
    { id: "601", title: "Royal Palace Villa", price: 50000, status: "available", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500", desc: "Private villa with infinity pool." }
];

let bookings = [
    { id: "GP-8801", guestName: "Arif Chowdhury", guestEmail: "arif@example.com", guestPhone: "+8801711112233", roomNumber: "401", roomType: "Royal Family Suite", checkIn: "2026-08-01", checkOut: "2026-08-05", totalBill: 80000, status: "Confirmed", avatar: "https://ui-avatars.com/api/?name=Arif+Chowdhury&background=c5a880&color=fff" }
];

let guests = [
    { id: "G-101", name: "Arif Chowdhury", email: "arif@example.com", phone: "+8801711112233" }
];



// 1. Get All Rooms
app.get('/api/rooms', (req, res) => {
    res.json(roomList);
});

// 2. Add New Room
app.post('/api/rooms', (req, res) => {
    const newRoom = req.body;
    roomList.push(newRoom);
    res.status(201).json({ message: 'Room added successfully', room: newRoom });
});

// 3. Update Room Price
app.patch('/api/rooms/:id/price', (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    const room = roomList.find(r => r.id === id);
    if (room) {
        room.price = Number(price);
        return res.json({ message: 'Price updated', room });
    }
    res.status(404).json({ error: 'Room not found' });
});

// 4. Toggle/Update Room Status
app.patch('/api/rooms/:id/status', (req, res) => {
    const { id } = req.params;
    const room = roomList.find(r => r.id === id);
    if (room) {
        const statuses = ['available', 'occupied', 'dirty', 'maintenance'];
        const idx = statuses.indexOf(room.status);
        room.status = statuses[(idx + 1) % statuses.length];
        return res.json({ message: 'Status updated', room });
    }
    res.status(404).json({ error: 'Room not found' });
});

// 5. Get Bookings
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// 6. Create New Booking
app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;
    bookings.unshift(bookingData);

    // Auto-update Room status to occupied
    const room = roomList.find(r => r.id === bookingData.roomNumber);
    if (room) room.status = 'occupied';

    // Auto-add guest if unique
    const existingGuest = guests.find(g => (bookingData.guestEmail && g.email === bookingData.guestEmail) || (bookingData.guestPhone && g.phone === bookingData.guestPhone));
    if (!existingGuest) {
        guests.unshift({
            id: 'G-' + Math.floor(100 + Math.random() * 900),
            name: bookingData.guestName,
            email: bookingData.guestEmail,
            phone: bookingData.guestPhone
        });
    }

    res.status(201).json({ message: 'Booking confirmed', booking: bookingData });
});

// 7. Get Guests
app.get('/api/guests', (req, res) => {
    res.json(guests);
});

// 8. Staff Login Endpoint
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email.toLowerCase() === 'admin@grandpalace.com' && password === 'admin123') {
        res.json({
            success: true,
            role: 'admin',
            user: {
                role: 'ADMINISTRATOR',
                name: 'MD. EMTIAZ HOSSAIN SAMI',
                email: email,
                phone: '+8801700000000',
                avatar: 'Md. EmTIAZ hOSSAIN sAMI LOGO.png'
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Credentials!' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Grand Palace Server running on http://localhost:${PORT}`);
});