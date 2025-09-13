# 🌱 Agricultural Sensor Dashboard

A modern, minimalistic full-stack web application for monitoring agricultural IoT sensor readings. Features a clean React frontend with device filtering, interactive charts, and a robust Node.js/Express backend with comprehensive data management.

## 📋 Features

- **Overview Dashboard**: Key metrics at-a-glance with system status and averages
- **Device Filtering**: Filter nitrogen charts by specific device or view all devices
- **Interactive Charts**: Enhanced line charts with device selection and 30 data points
- **Pagination**: Navigate through sensor readings with clean pagination controls
- **Alert System**: Automatic alerts for nitrogen > 200 ppm or pH outside 6.0-7.0 range
- **Manual Data Entry**: Form to add new sensor readings with validation
- **REST API**: Complete backend API with validation and error handling
- **Minimalistic Design**: Clean, modern UI with excellent readability and UX

## 🏗️ Architecture

### Backend (Node.js/Express)
- SQLite database for data storage
- REST API with three main endpoints
- Input validation using Joi
- Comprehensive error handling
- CORS enabled for frontend communication

### Frontend (React)
- Modern React with hooks (useState, useEffect)
- Axios for API communication
- Recharts for data visualization
- Responsive CSS Grid layout
- Real-time data polling every 30 seconds

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone/Download the project**
   ```bash
   cd "Sensor Data dashboard"
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   npm run seed    # Load sample data
   npm start       # Start server on port 3001
   ```

3. **Set up Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start       # Start React app on port 3000
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/health

## 📡 API Endpoints

### POST /api/readings
Submit a new sensor reading
```json
{
  "deviceId": "GH001",
  "timestamp": "2024-03-15T10:30:00Z",
  "nitrogen": 150.5,
  "phosphorus": 45.2,
  "ph": 6.5
}
```

### GET /api/readings
Get all readings from the last 24 hours
```json
{
  "readings": [...],
  "count": 12,
  "timeRange": "24 hours"
}
```

### GET /api/readings/latest
Get the most recent reading for each device
```json
{
  "latestReadings": [...],
  "count": 4
}
```

## 🔧 Configuration

### Backend Configuration
- **Port**: 3001 (configurable via PORT environment variable)
- **Database**: SQLite file (`sensor_data.db`)
- **CORS**: Enabled for all origins

### Frontend Configuration
- **API Base URL**: http://localhost:3001/api
- **Polling Interval**: 30 seconds
- **Chart Library**: Recharts

## 📊 Sample Data

The application includes comprehensive sample data for 12 devices (GH001-GH012) with 303+ readings spanning 7 days. The dataset includes:

- **12 unique devices** with distinct characteristics
- **Realistic variations** including daily cycles and seasonal trends
- **Alert conditions** for demonstration (nitrogen > 200 ppm, pH outside 6.0-7.0)
- **High-frequency data** for recent readings (every 30 minutes for select devices)

### Seeding Instructions

**Initial setup** (automatically runs sample data):
```bash
cd backend
npm install
npm run seed    # Loads comprehensive sample dataset
npm start
```

**Reset/reload sample data** anytime:
```bash
cd backend
npm run seed    # Clears existing data and reloads fresh samples
```

**View database contents**:
```bash
sqlite3 backend/sensor_data.db "SELECT deviceId, COUNT(*) FROM readings GROUP BY deviceId;"
```

### Sample Data Structure
Each reading contains:
- `deviceId`: Device identifier (GH001-GH012)
- `timestamp`: ISO date string
- `nitrogen`: PPM value (80-350 range)
- `phosphorus`: PPM value (20-80 range) 
- `ph`: pH level (4.5-8.5 range)

See `sample-data.json` for example readings that can be manually imported.

## ⚠️ Alert Conditions

The system automatically triggers alerts for:
- **High Nitrogen**: > 200 ppm
- **pH Out of Range**: < 6.0 or > 7.0

Alerts appear as:
- Orange banner at the top of the dashboard
- Visual indicators on device cards
- Color coding in the chart

## 🎨 UI Components

### Dashboard Cards
- Device ID and timestamp
- Current nitrogen, phosphorus, and pH values
- Color-coded status indicators
- Hover effects and responsive design

### Nitrogen Chart
- 24-hour timeline view
- Multiple device lines with different colors
- Alert threshold line at 200 ppm
- Interactive tooltips with detailed information

### Add Reading Form
- Input validation with real-time feedback
- Success/error messaging
- Reasonable value ranges enforced
- Automatic timestamp generation

## 🔍 Data Validation

### Backend Validation (Joi)
- **deviceId**: Required string (1-50 characters)
- **timestamp**: Valid ISO date string
- **nitrogen**: Number between 0-1000 ppm
- **phosphorus**: Number between 0-500 ppm
- **ph**: Number between 0-14

### Frontend Validation
- Client-side validation before submission
- Real-time error display
- Form state management
- Loading states during submission

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start      # Start with hot reload
```

### Database Management
```bash
# View database (requires sqlite3 CLI)
sqlite3 backend/sensor_data.db
.tables
SELECT * FROM readings LIMIT 5;
```

## 📁 Project Structure

```
Sensor Data dashboard/
├── backend/
│   ├── package.json
│   ├── server.js          # Main Express server
│   ├── seed.js           # Sample data seeding
│   └── sensor_data.db    # SQLite database (created on first run)
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js        # Main React component
│       ├── App.css       # Global styles
│       └── components/
│           ├── Dashboard.js      # Latest readings display
│           ├── NitrogenChart.js  # Data visualization
│           ├── AddReadingForm.js # Manual data entry
│           └── AlertBanner.js    # Alert notifications
└── README.md
```

## 🔮 Future Enhancements

With more time, I would add:

### Backend Improvements
- User authentication and authorization
- Data aggregation endpoints (hourly/daily averages)
- WebSocket support for real-time updates
- Data export functionality (CSV/JSON)
- Database migrations and better schema management
- Rate limiting and API security
- Comprehensive logging system

### Frontend Enhancements
- Historical data filtering (date ranges)
- Multiple chart types (bar, scatter, heatmap)
- Device management interface
- User preferences and settings
- Offline support with service workers
- Advanced alert configuration
- Data export UI
- Mobile app using React Native

### DevOps & Production
- Docker containerization
- CI/CD pipeline
- Environment-specific configurations
- Database backups and recovery
- Monitoring and alerting
- Load balancing for multiple instances
- HTTPS and security headers

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 3001 is available
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (v14+ required)

**Frontend can't connect to backend**
- Verify backend is running on port 3001
- Check CORS configuration
- Ensure API_BASE_URL is correct in App.js

**Database issues**
- Delete `sensor_data.db` and restart backend
- Run `npm run seed` to reload sample data
- Check file permissions in backend directory

**Chart not displaying**
- Ensure sample data exists in database
- Check browser console for JavaScript errors
- Verify Recharts library is installed

## 🤖 AI Usage

### Tools Used
- **Codex CLI with GPT-5 high reasoning**: Primary development assistant for full-stack architecture, React components, Node.js backend, database design, and UI/UX improvements
- **Windsurf**: As the IDE - used mainly for quick code edits & minute changes (Driver was Claude Sonnet 4)

### Helpful Prompt
**"What you've generated is very messy with a lot of unecessary graphical clutter and typical AI generated gradients. I want you to do a complete UI/UX overhaul. It Functionally works but the UI is not clean. Do the following - Make the whole UI very minimalistic  in nature where the Data is the focus. Remove uneccessary graphical clutter. Instead of having the 3 sections stacked next to each other horizontally, could you add an "Overview" section on top and then have a detailed view of these 3 sections below it stacked horizontally. Also for the nitrgoen line graph, could you also add a filter where you can view based on the DeviceID? Again, remember, the goal of this project is to be minimalistic in terms of it's UI but functionality should be rock solid"**

This prompt was particularly helpful because it:
- I believe AI can do the first 80% of the work but it's the last 20% that's the most important which also requires a ton of QA & testing and also nudging it in the right direction. This is where "Taste" comes in and understanding what the project should lookk like and directing the AI in the right direction to complete the remaining 20% of the work is where the real value lies in. This prompt does just that. 


### AI Fix Required
1) The UI was ugly. It was extremely cluttered and I had to direct AI to fix it
2) The Nitrogen Line graph did not have a filter option to filter based on DeviceID so it ended up with the graph being really cluttered.
3) **Issue**: React Hooks Rules Violation
- **Problem**: Initially placed `useMemo` hooks after conditional returns in NitrogenChart component
- **Error**: "React Hook 'useMemo' is called conditionally. React Hooks must be called in the exact same order in every component render"
- **Fix**: Moved all hooks to the top of the component before any conditional logic


### Key Decisions & Trade-offs

**1. Database Choice: SQLite vs PostgreSQL**
- **Decision**: Used SQLite for simplicity and local development
- **Trade-off**: Sacrificed scalability for ease of setup and deployment
- **Rationale**: Perfect for prototype/demo, but would need migration for production

**2. UI Design: Minimalistic vs Feature-rich**
- **Decision**: Prioritized clean, minimalistic design over complex features
- **Trade-off**: Reduced visual complexity but maintained full functionality
- **Rationale**: User specifically requested "clean, simple, minimalistic feel"

**3. Chart Filtering: Client-side vs Server-side**
- **Decision**: Implemented client-side device filtering with useMemo optimization
- **Trade-off**: Uses more client memory but provides instant filtering response
- **Rationale**: Better UX for small datasets, would need server-side for large datasets

**4. Data Structure: Normalized vs Denormalized**
- **Decision**: Simple flat table structure for readings
- **Trade-off**: Some data duplication but simpler queries and faster development
- **Rationale**: Appropriate for sensor data where device info is minimal


### Architecture Decisions
- **Vertical Layout**: Changed from horizontal to vertical sections for better information hierarchy
- **Overview Section**: Added key metrics dashboard at the top for quick system status
- **Pagination**: Implemented for better data management and performance
- **Device Expansion**: Increased from 5 to 12 devices for richer testing data

## 📝 Assumptions Made

1. **Single-tenant system**: No multi-user authentication required
2. **Local deployment**: Designed for localhost development  
3. **SQLite sufficiency**: No need for production database initially
4. **Real-time polling**: 30-second intervals sufficient for monitoring needs
5. **Device naming**: GH001-GH012 convention acceptable for greenhouse sensors
6. **Data retention**: 7-day window provides adequate historical context
7. **Modern browsers**: ES6+ and React hooks support assumed
8. **Network reliability**: Local development environment with stable connections

## 🧪 Testing

### Manual Testing Checklist
- [ ] Backend starts without errors
- [ ] Sample data loads correctly
- [ ] All API endpoints respond properly
- [ ] Frontend displays data from backend
- [ ] Charts render with sample data
- [ ] Form submission works and updates display
- [ ] Alerts appear for threshold violations
- [ ] Responsive design works on mobile
- [ ] Error handling displays user-friendly messages

### API Testing
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test getting readings
curl http://localhost:3001/api/readings

# Test adding reading
curl -X POST http://localhost:3001/api/readings \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"TEST001","timestamp":"2024-03-15T10:30:00Z","nitrogen":150.5,"phosphorus":45.2,"ph":6.5}'
```

## 📄 License

MIT License - feel free to use this code for learning and development purposes.

---

**Built with ❤️ for agricultural IoT monitoring**
