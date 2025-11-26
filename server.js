const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- MONGODB CONNECTION ---
mongoose.connect('mongodb://127.0.0.1:27017/localServices')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider'], default: 'customer' },
  service: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  distanceKm: { type: Number, default: 0 },
  etaMinutes: Number,
  priceFrom: Number,
  priceUnit: { type: String, default: 'visit' },
  budgetLevel: { type: String, enum: ['low', 'medium', 'high'] },
  lat: Number,
  lng: Number
});

const User = mongoose.model('User', userSchema);

// --- MASSIVE SEED DATA ---
async function seedDatabase() {
  try {
    const providerCount = await User.countDocuments({ role: 'provider' });

    // If we have fewer than 10 providers, assume it's old test data and refresh it
    if (providerCount < 10) {
      console.log('🔄 Detected old/empty data. Clearing and seeding 48+ providers...');
      
      // Optional: Clear existing providers to avoid duplicates if you are restarting
      await User.deleteMany({ role: 'provider' });

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('password123', salt);

      const providers = [
        // --- ELECTRICIANS (8) ---
        { name: 'Ravi Kumar', service: 'Electrician', rating: 4.8, reviews: 120, priceFrom: 350, budgetLevel: 'low', lat: 12.9716, lng: 77.5946 }, // MG Road
        { name: 'PowerFix Pros', service: 'Electrician', rating: 4.2, reviews: 45, priceFrom: 600, budgetLevel: 'medium', lat: 12.9352, lng: 77.6245 }, // Koramangala
        { name: 'Volt Masters', service: 'Electrician', rating: 4.9, reviews: 200, priceFrom: 800, budgetLevel: 'high', lat: 12.9784, lng: 77.6408 }, // Indiranagar
        { name: 'Suresh Electric', service: 'Electrician', rating: 3.9, reviews: 12, priceFrom: 250, budgetLevel: 'low', lat: 13.0285, lng: 77.5460 }, // Yeshwanthpur
        { name: 'Bright Sparks', service: 'Electrician', rating: 4.5, reviews: 88, priceFrom: 450, budgetLevel: 'medium', lat: 12.9279, lng: 77.6271 }, // Jayanagar
        { name: 'Current Care', service: 'Electrician', rating: 4.7, reviews: 150, priceFrom: 300, budgetLevel: 'low', lat: 12.9915, lng: 77.5703 }, // Malleshwaram
        { name: 'Home Energy Solutions', service: 'Electrician', rating: 4.1, reviews: 30, priceFrom: 1200, budgetLevel: 'high', lat: 12.9698, lng: 77.7500 }, // Whitefield
        { name: 'Wire Works', service: 'Electrician', rating: 4.3, reviews: 55, priceFrom: 500, budgetLevel: 'medium', lat: 12.8452, lng: 77.6602 }, // Electronic City

        // --- PLUMBERS (8) ---
        { name: 'Anita Sharma', service: 'Plumber', rating: 4.9, reviews: 85, priceFrom: 400, budgetLevel: 'medium', lat: 12.9250, lng: 77.5468 }, // Banashankari
        { name: 'Leak Stoppers', service: 'Plumber', rating: 4.5, reviews: 60, priceFrom: 300, budgetLevel: 'low', lat: 12.9592, lng: 77.6974 }, // Marathahalli
        { name: 'Quick Pipe Fix', service: 'Plumber', rating: 4.0, reviews: 22, priceFrom: 450, budgetLevel: 'medium', lat: 13.0358, lng: 77.5970 }, // Hebbal
        { name: 'Flow Master', service: 'Plumber', rating: 4.8, reviews: 110, priceFrom: 900, budgetLevel: 'high', lat: 12.9081, lng: 77.6476 }, // HSR Layout
        { name: 'Tap Tech', service: 'Plumber', rating: 3.8, reviews: 15, priceFrom: 250, budgetLevel: 'low', lat: 12.9719, lng: 77.6412 }, // Domlur
        { name: 'Water Works', service: 'Plumber', rating: 4.6, reviews: 95, priceFrom: 550, budgetLevel: 'medium', lat: 12.9345, lng: 77.6101 }, // SG Palya
        { name: 'Drain Doctor', service: 'Plumber', rating: 4.9, reviews: 300, priceFrom: 1500, budgetLevel: 'high', lat: 13.0068, lng: 77.5813 }, // Palace Orchards
        { name: 'City Plumbers', service: 'Plumber', rating: 4.2, reviews: 40, priceFrom: 350, budgetLevel: 'low', lat: 12.8399, lng: 77.6770 }, // E-City Phase 2

        // --- DRIVERS (8) ---
        { name: 'Vikas Singh', service: 'Driver', rating: 4.7, reviews: 60, priceFrom: 250, budgetLevel: 'low', lat: 12.9141, lng: 77.6189 }, // BTM Layout
        { name: 'Safe Drive', service: 'Driver', rating: 4.6, reviews: 150, priceFrom: 500, budgetLevel: 'medium', lat: 12.9165, lng: 77.5929 }, // JP Nagar
        { name: 'City Cabs', service: 'Driver', rating: 4.1, reviews: 30, priceFrom: 800, budgetLevel: 'high', lat: 12.9600, lng: 77.5600 }, // Vijayanagar
        { name: 'Go Pilot', service: 'Driver', rating: 4.8, reviews: 200, priceFrom: 300, budgetLevel: 'low', lat: 13.0100, lng: 77.5500 }, // Iskcon Area
        { name: 'Road King', service: 'Driver', rating: 4.3, reviews: 45, priceFrom: 600, budgetLevel: 'medium', lat: 12.9500, lng: 77.7000 }, // Old Airport Rd
        { name: 'Smooth Ride', service: 'Driver', rating: 4.9, reviews: 12, priceFrom: 1000, budgetLevel: 'high', lat: 12.9800, lng: 77.6000 }, // Cunningham Rd
        { name: 'Urban Drive', service: 'Driver', rating: 4.4, reviews: 78, priceFrom: 400, budgetLevel: 'medium', lat: 12.8900, lng: 77.5700 }, // KS Layout
        { name: 'Trusty Wheels', service: 'Driver', rating: 4.0, reviews: 25, priceFrom: 200, budgetLevel: 'low', lat: 13.0500, lng: 77.6000 }, // Sahakara Nagar

        // --- CARPENTERS (8) ---
        { name: 'Meena Crafts', service: 'Carpenter', rating: 4.5, reviews: 15, priceFrom: 500, budgetLevel: 'high', lat: 12.9850, lng: 77.5300 }, // Basaveshwaranagar
        { name: 'Wood Works', service: 'Carpenter', rating: 4.3, reviews: 40, priceFrom: 350, budgetLevel: 'medium', lat: 12.9400, lng: 77.5600 }, // Hanumanthnagar
        { name: 'Timber Tech', service: 'Carpenter', rating: 4.8, reviews: 110, priceFrom: 1200, budgetLevel: 'high', lat: 12.9200, lng: 77.6600 }, // Bellandur
        { name: 'Furniture Fix', service: 'Carpenter', rating: 4.1, reviews: 20, priceFrom: 250, budgetLevel: 'low', lat: 12.9900, lng: 77.6800 }, // CV Raman Nagar
        { name: 'Crafty Hands', service: 'Carpenter', rating: 4.6, reviews: 65, priceFrom: 600, budgetLevel: 'medium', lat: 12.9600, lng: 77.6400 }, // Domlur
        { name: 'Wood World', service: 'Carpenter', rating: 3.9, reviews: 10, priceFrom: 200, budgetLevel: 'low', lat: 12.8700, lng: 77.5500 }, // Thalaghattapura
        { name: 'Carve It', service: 'Carpenter', rating: 4.7, reviews: 90, priceFrom: 800, budgetLevel: 'medium', lat: 13.0800, lng: 77.5800 }, // Yelahanka New Town
        { name: 'Ply Master', service: 'Carpenter', rating: 4.4, reviews: 35, priceFrom: 450, budgetLevel: 'medium', lat: 12.9300, lng: 77.5200 }, // Girinagar

        // --- PAINTERS (8) ---
        { name: 'Color Home', service: 'Painter', rating: 4.8, reviews: 90, priceFrom: 1200, budgetLevel: 'medium', lat: 12.9100, lng: 77.6000 }, // Bannerghatta Rd
        { name: 'Royal Paints', service: 'Painter', rating: 5.0, reviews: 10, priceFrom: 2500, budgetLevel: 'high', lat: 13.0200, lng: 77.6300 }, // Kalyan Nagar
        { name: 'Wall Artistry', service: 'Painter', rating: 4.2, reviews: 50, priceFrom: 800, budgetLevel: 'low', lat: 12.9000, lng: 77.6500 }, // Parappana Agrahara
        { name: 'Fresh Coat', service: 'Painter', rating: 4.6, reviews: 130, priceFrom: 1500, budgetLevel: 'medium', lat: 12.9500, lng: 77.5900 }, // Lalbagh
        { name: 'Bright Walls', service: 'Painter', rating: 4.0, reviews: 20, priceFrom: 600, budgetLevel: 'low', lat: 12.8800, lng: 77.6200 }, // Begur
        { name: 'Color Clap', service: 'Painter', rating: 4.9, reviews: 200, priceFrom: 3000, budgetLevel: 'high', lat: 12.9700, lng: 77.7000 }, // Mahadevapura
        { name: 'Dream Walls', service: 'Painter', rating: 4.4, reviews: 75, priceFrom: 1000, budgetLevel: 'medium', lat: 13.0600, lng: 77.5200 }, // Vidyaranyapura
        { name: 'Paint Pro', service: 'Painter', rating: 4.5, reviews: 60, priceFrom: 1100, budgetLevel: 'medium', lat: 12.9400, lng: 77.7200 }, // Brookefield

        // --- CLEANERS (8) ---
        { name: 'Deep Clean Co', service: 'Cleaner', rating: 4.4, reviews: 110, priceFrom: 600, budgetLevel: 'low', lat: 12.9600, lng: 77.6100 }, // Richmond Town
        { name: 'Spotless Services', service: 'Cleaner', rating: 4.9, reviews: 230, priceFrom: 900, budgetLevel: 'medium', lat: 12.9900, lng: 77.6000 }, // Vasanth Nagar
        { name: 'Shine On', service: 'Cleaner', rating: 4.2, reviews: 40, priceFrom: 500, budgetLevel: 'low', lat: 12.9300, lng: 77.5700 }, // Basavanagudi
        { name: 'Dust Busters', service: 'Cleaner', rating: 4.7, reviews: 90, priceFrom: 1500, budgetLevel: 'high', lat: 13.0400, lng: 77.6200 }, // HRBR Layout
        { name: 'Home Glow', service: 'Cleaner', rating: 4.5, reviews: 150, priceFrom: 1200, budgetLevel: 'medium', lat: 12.9500, lng: 77.5000 }, // Nagarbhavi
        { name: 'Clean Sweep', service: 'Cleaner', rating: 4.0, reviews: 25, priceFrom: 400, budgetLevel: 'low', lat: 12.8600, lng: 77.6600 }, // E-City
        { name: 'Sparkle Squad', service: 'Cleaner', rating: 4.8, reviews: 180, priceFrom: 2000, budgetLevel: 'high', lat: 12.9200, lng: 77.6800 }, // Sarjapur Rd
        { name: 'Tidy Up', service: 'Cleaner', rating: 4.3, reviews: 55, priceFrom: 800, budgetLevel: 'medium', lat: 13.0100, lng: 77.5300 }, // Mathikere
      ];

      // Add generated fields (email, distance, eta)
      const completeData = providers.map(p => ({
        ...p,
        role: 'provider',
        email: `${p.name.replace(/\s/g, '').toLowerCase()}${Math.floor(Math.random()*100)}@test.com`,
        password: password,
        priceUnit: 'visit',
        // Calculate random distance from center (approx 12.97, 77.59) just for display logic if needed
        distanceKm: Number((Math.sqrt(Math.pow(p.lat - 12.97, 2) + Math.pow(p.lng - 77.59, 2)) * 111).toFixed(1)),
        etaMinutes: Math.floor(Math.random() * 50) + 15
      }));

      await User.insertMany(completeData);
      console.log(`✅ Database successfully seeded with ${completeData.length} providers!`);
    } else {
      console.log('ℹ️ Database already has data. Skipping seed.');
    }
  } catch (err) {
    console.error('❌ Seeding Error:', err);
  }
}
seedDatabase();

// --- API ROUTES ---

// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, role, service, priceFrom } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, email, password: hashedPassword, role,
      service: role === 'provider' ? service : undefined,
      priceFrom: role === 'provider' ? priceFrom : undefined,
      // Random offset for new users
      lat: 12.97 + (Math.random() - 0.5) * 0.1, 
      lng: 77.59 + (Math.random() - 0.5) * 0.1,
      budgetLevel: 'medium',
      distanceKm: Math.floor(Math.random() * 10) + 1
    });

    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ 
      success: true, 
      user: { id: user._id, name: user.name, role: user.role, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Providers
app.get('/api/providers', async (req, res) => {
  try {
    const { service, maxDistanceKm, budget } = req.query;
    let query = { role: 'provider' };

    if (service) query.service = { $regex: service, $options: 'i' };
    if (budget) query.budgetLevel = budget;
    if (maxDistanceKm) query.distanceKm = { $lte: Number(maxDistanceKm) };

    const providers = await User.find(query).select('-password');
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));