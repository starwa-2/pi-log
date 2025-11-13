# Pi Log Manager

A professional full-stack application for managing and monitoring log collection from multiple Raspberry Pi devices.

## 🚀 Features

- **Real-time Pi Monitoring** - Live status updates for all connected Raspberry Pis
- **One-Click Log Collection** - Start/Stop log collection across multiple devices simultaneously
- **Network Auto-Discovery** - Automatic detection of Pis via ARP scanning
- **USB Status Monitoring** - Track USB device connections on each Pi
- **Batch Management** - Organize log collections by batch ID with timestamps
- **Beautiful Dashboard** - Modern, responsive UI with dark theme
- **Activity Logging** - Real-time console logs for all operations

## 📋 Prerequisites

### Frontend
- Node.js 18+ and npm

### Backend
- Python 3.10+
- sshpass (for automated SSH)
- arp-scan (for network discovery)
- FastAPI and dependencies

## 🛠️ Installation

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env if your backend runs on a different host/port
```

3. **Start development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Backend Setup

1. **Install Python dependencies:**
```bash
pip install fastapi uvicorn pydantic sshpass
```

2. **Configure your Pis:**
Create `hot_transfer/pis.json` with your Pi MAC addresses:
```json
{
  "b8:27:eb:xx:xx:xx": "Pi-1",
  "b8:27:eb:yy:yy:yy": "Pi-2"
}
```

3. **Set environment variables (optional):**
```bash
export PI_USER="pi"
export PI_PASS="raspberry"
export API_PORT="8055"
export REMOTE_DIR="/home/pi/router_logs"
```

4. **Run the backend:**
```bash
python manager.py
```

The backend API will be available at `http://localhost:8055`

## 🎯 Usage

1. **Start the Backend**: Run `python manager.py`
2. **Start the Frontend**: Run `npm run dev`
3. **Open Dashboard**: Navigate to `http://localhost:8080/dashboard`
4. **Start Logging**: Click "Start Logging" to begin collecting logs from connected Pis
5. **Monitor Status**: Watch real-time status updates in the Pi grid
6. **Stop & Transfer**: Click "Stop & Transfer" to collect all logs

## 📁 Directory Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── PiStatusGrid.tsx
│   │   ├── LogsPanel.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── pages/
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Index.tsx
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities
├── hot_transfer/          # Backend working directory
│   ├── pis.json          # Pi configuration
│   └── footprints.json   # Transfer history
├── Target/               # Collected logs destination
└── manager.py           # FastAPI backend server
```

## 🔧 Configuration

### Frontend Configuration (.env)
```bash
VITE_API_BASE=http://localhost:8055
```

### Backend Configuration (environment variables)
- `PI_USER` - SSH username (default: "pi")
- `PI_PASS` - SSH password (default: "raspberry")
- `API_PORT` - API server port (default: 8055)
- `REMOTE_DIR` - Log directory on Pis (default: "/home/pi/router_logs")
- `SSH_CONNECT_TIMEOUT` - SSH connection timeout in seconds
- `ARP_TTL` - ARP cache TTL in seconds
- `STATUS_CONC` - Concurrent status checks
- `SCP_CONC` - Concurrent file transfers

## 🔌 API Endpoints

### GET /status
Returns current status of all Pis and active batch

### POST /start
Initiates log collection on all connected Pis

### POST /stop
Stops logging and transfers all collected logs

### GET /health
Backend health check and system status

## 🎨 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- TanStack Query for data fetching

### Backend
- FastAPI (Python)
- asyncio for concurrent operations
- SSH/SCP for remote operations
- ARP scanning for network discovery

## 🐛 Troubleshooting

**Pis not detected:**
- Ensure Pis are on the same network
- Check MAC addresses in `pis.json`
- Verify SSH credentials

**Connection timeout:**
- Increase `SSH_CONNECT_TIMEOUT`
- Check network connectivity
- Verify firewall rules

**Frontend can't connect:**
- Ensure backend is running on port 8055
- Check CORS settings
- Verify `VITE_API_BASE` in .env

## 📄 License

This project is for internal use.

## 🤝 Support

For issues or questions, please contact the development team.
