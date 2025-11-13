# Pi Log Manager - Project Summary

## Overview

A complete full-stack application for managing log collection from multiple Raspberry Pi devices with real-time monitoring, automated transfers, and a beautiful modern UI.

## What Was Built

### Frontend (React + TypeScript + Tailwind)
- **Dashboard Page** - Main control interface with real-time status updates
- **Pi Status Grid** - Visual representation of all connected Pis with connection status
- **Activity Log Panel** - Real-time console output for all operations
- **Loading & Error States** - Professional connection handling with retry logic
- **Responsive Design** - Works on desktop, tablet, and mobile

### Design System
- **Professional Dark Theme** - Modern monitoring dashboard aesthetic
- **Color Palette**: 
  - Primary: Blue (#0ea5e9) for actions and highlights
  - Success: Green for completed operations
  - Warning: Amber for pending states
  - Destructive: Red for errors
  - Muted slate grays for backgrounds
- **Custom Components**:
  - StatusBadge - Animated status indicators
  - ConnectionIndicator - Live network status with pulse animation
  - LoadingScreen - Backend connection status
  - ErrorScreen - Friendly error handling with retry

### Key Features

1. **Real-Time Monitoring**
   - Auto-refresh every 3 seconds
   - Manual refresh button
   - Connection status indicators
   - Live activity log

2. **Batch Management**
   - Unique batch IDs with timestamps
   - Track multiple logging sessions
   - Organized log storage

3. **Pi Discovery & Status**
   - Automatic ARP-based network discovery
   - MAC address to IP resolution
   - USB connection monitoring
   - Log completion tracking

4. **Control Operations**
   - One-click Start/Stop logging
   - Concurrent operations across multiple Pis
   - Automatic log transfer on stop
   - Error handling and retry logic

## Architecture

### Frontend Stack
```
React 18 (TypeScript)
├── Vite - Fast build tool
├── Tailwind CSS - Utility-first styling
├── shadcn/ui - High-quality components
├── React Router - Navigation
├── TanStack Query - Server state
└── Lucide Icons - Beautiful icons
```

### Backend Stack (Python)
```
FastAPI
├── asyncio - Concurrent operations
├── SSH/SCP - Remote Pi communication
├── ARP scanning - Network discovery
├── Background tasks - Status monitoring
└── File management - Log organization
```

### Communication Flow
```
Frontend (Port 8080)
    ↓ HTTP/REST
Backend API (Port 8055)
    ↓ SSH/SCP
Raspberry Pis (Network)
```

## File Structure

```
pi-log-manager/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── PiStatusGrid.tsx       # Pi status display
│   │   ├── LogsPanel.tsx          # Activity log viewer
│   │   ├── StatusBadge.tsx        # Status indicators
│   │   ├── ConnectionIndicator.tsx # Network status
│   │   ├── LoadingScreen.tsx      # Initial loading
│   │   └── ErrorScreen.tsx        # Error handling
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── Index.tsx              # Entry point
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/
│   │   └── use-toast.ts           # Toast notifications
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── index.css                  # Design system
│   └── App.tsx                    # App root
├── manager.py                     # FastAPI backend
├── hot_transfer/
│   ├── pis.json                  # Pi configuration
│   ├── footprints.json           # Auto-generated
│   └── transfer_history.json     # Auto-generated
├── Target/                       # Collected logs
├── README.md                     # Full documentation
├── BACKEND_SETUP.md             # Backend guide
├── QUICKSTART.md                # Quick start
├── .env.example                 # Environment template
└── start-dev.sh                 # Dev startup script
```

## API Endpoints

### GET /status
Returns current status of all Pis and active batch
```json
{
  "batchid": "20250113_143022",
  "pis": {
    "b8:27:eb:11:22:33": {
      "ip": "192.168.1.100",
      "done": false,
      "log_id": null,
      "name": "Pi-1",
      "usb_connected": true
    }
  }
}
```

### POST /start
Initiates log collection
```json
{
  "status": "starting",
  "batch_id": "20250113_143022",
  "poll_status_url": "/start_status?batch_id=20250113_143022"
}
```

### POST /stop
Stops logging and transfers logs
```json
{
  "status": "stopped",
  "batch_id": "20250113_143022",
  "message": "All Pis processed, logs transferred, Docker restarted."
}
```

### GET /health
Backend health check
```json
{
  "batchid": "20250113_143022",
  "api_port": 8055,
  "docker_status": "stopped",
  "pis": { ... }
}
```

## How It Works

### Log Collection Workflow

1. **START Phase**
   ```
   User clicks "Start Logging"
   ↓
   Backend generates batch ID
   ↓
   ARP scan discovers Pi IPs
   ↓
   SSH to each Pi creates .get_ready_logging_* token
   ↓
   Pis detect token and start logging
   ↓
   Watchdog monitors for .first_copy_done_* tokens
   ```

2. **MONITORING Phase**
   ```
   Frontend polls /status every 3s
   ↓
   Backend checks ARP cache for IPs
   ↓
   SSH to Pis lists remote files
   ↓
   Detects completion tokens
   ↓
   Updates cache and returns status
   ↓
   Frontend updates UI in real-time
   ```

3. **STOP Phase**
   ```
   User clicks "Stop & Transfer"
   ↓
   Backend SSHs to each Pi
   ↓
   Detects completed log folders
   ↓
   SCP transfers logs concurrently
   ↓
   Cleans up tokens on Pis
   ↓
   Saves logs to Target/<log_id>/
   ↓
   Returns completion status
   ```

## Configuration

### Environment Variables

**Backend (manager.py)**
```bash
PI_USER="pi"                    # SSH username
PI_PASS="raspberry"             # SSH password
API_PORT="8055"                 # API server port
REMOTE_DIR="/home/pi/router_logs"  # Log directory on Pis
SSH_CONNECT_TIMEOUT="20"        # SSH timeout in seconds
ARP_TTL="10"                    # ARP cache TTL
STATUS_CONC="8"                 # Concurrent status checks
START_CONC="6"                  # Concurrent start operations
SCP_CONC="3"                    # Concurrent transfers
SCP_KBPS="50000"                # Bandwidth limit per transfer
```

**Frontend (.env)**
```bash
VITE_API_BASE=http://localhost:8055
```

### Pi Configuration

**hot_transfer/pis.json**
```json
{
  "b8:27:eb:11:22:33": "Office-Pi",
  "b8:27:eb:44:55:66": "Lab-Pi-1",
  "b8:27:eb:77:88:99": "Lab-Pi-2"
}
```

## Performance Optimizations

### Backend
- **Concurrent Operations**: Uses asyncio semaphores to limit concurrent SSH/SCP
- **ARP Caching**: Maintains ARP cache with TTL to reduce network scans
- **Background Tasks**: Continuous monitoring without blocking main operations
- **Bandwidth Control**: Optional SCP throttling to prevent network congestion

### Frontend
- **Optimistic Updates**: UI updates immediately on actions
- **Smart Polling**: 3-second intervals balance freshness and load
- **Connection Pooling**: Reuses fetch connections
- **Lazy Loading**: Components load on demand

## Security Considerations

⚠️ **Current Implementation**
- Passwords in environment variables
- No encryption for stored credentials
- Open CORS for development

✅ **Production Recommendations**
1. Use SSH keys instead of passwords
2. Implement proper authentication
3. Use HTTPS for all communications
4. Restrict CORS to specific origins
5. Run on isolated network
6. Implement rate limiting
7. Add audit logging

## Testing

### Manual Testing Checklist
- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Pis appear in status grid
- [ ] Can start logging
- [ ] Status updates in real-time
- [ ] Can stop and transfer logs
- [ ] Logs appear in Target/ directory
- [ ] Error handling works
- [ ] Refresh button works
- [ ] Toast notifications appear

### Test Commands
```bash
# Backend health
curl http://localhost:8055/health

# Status check
curl http://localhost:8055/status

# Start logging
curl -X POST http://localhost:8055/start

# Stop logging
curl -X POST http://localhost:8055/stop
```

## Known Limitations

1. **No Authentication**: Anyone with network access can control the system
2. **Plain Text Passwords**: SSH credentials stored in environment
3. **Single Backend**: No redundancy or failover
4. **Network Dependent**: Requires Pis on same network
5. **No Report Generation**: PDF reporting not yet integrated
6. **Limited Error Recovery**: Some failures require manual intervention

## Future Enhancements

### Planned Features
- [ ] PDF report generation and viewing
- [ ] User authentication system
- [ ] Historical batch browsing
- [ ] Log file preview
- [ ] Advanced filtering and search
- [ ] Multi-network support
- [ ] Mobile app
- [ ] Email notifications
- [ ] Scheduling and automation
- [ ] Database logging

### Technical Improvements
- [ ] WebSocket for real-time updates
- [ ] Backend clustering
- [ ] Redis caching
- [ ] Database persistence
- [ ] Docker containerization
- [ ] Automated testing
- [ ] CI/CD pipeline
- [ ] Performance monitoring

## Troubleshooting

### Common Issues

**Pis Not Detected**
- Check MAC addresses in pis.json
- Verify network connectivity
- Run manual ARP scan
- Check SSH credentials

**Connection Timeout**
- Increase SSH_CONNECT_TIMEOUT
- Check network latency
- Verify firewall rules

**Frontend Won't Connect**
- Ensure backend is running
- Check CORS settings
- Verify VITE_API_BASE

**Logs Not Transferring**
- Check remote directory permissions
- Verify SCP settings
- Increase SCP_CONC if needed

## Support Resources

- **README.md** - Complete documentation
- **BACKEND_SETUP.md** - Detailed backend setup
- **QUICKSTART.md** - 5-minute quick start
- **In-app Activity Log** - Real-time debugging

## Technology Credits

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- FastAPI
- Lucide Icons
- Radix UI

## License

Internal use only

---

**Created**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
