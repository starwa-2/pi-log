# Backend Setup Guide

This guide explains how to set up and run the FastAPI backend for the Pi Log Manager.

## Quick Start

```bash
# 1. Install dependencies
pip install fastapi uvicorn pydantic

# 2. Create configuration
mkdir -p hot_transfer Target
echo '{"b8:27:eb:xx:xx:xx": "Pi-1"}' > hot_transfer/pis.json

# 3. Run the server
python manager.py
```

## Detailed Setup

### 1. System Dependencies

Install required system tools:

```bash
# Ubuntu/Debian
sudo apt-get install sshpass arp-scan

# macOS
brew install sshpass arp-scan

# Arch Linux
sudo pacman -S sshpass arp-scan
```

### 2. Python Dependencies

```bash
pip install fastapi==0.109.0 \
            uvicorn==0.27.0 \
            pydantic==2.5.3 \
            python-multipart==0.0.6
```

### 3. Directory Structure

The backend expects this structure:

```
.
├── manager.py              # Main FastAPI application
├── hot_transfer/          # Working directory
│   ├── pis.json          # Pi configuration (create this)
│   ├── footprints.json   # Auto-generated
│   └── transfer_history.json  # Auto-generated
├── Target/               # Collected logs (auto-created)
└── .manager_state.json   # State file (auto-generated)
```

### 4. Configure Raspberry Pis

Create `hot_transfer/pis.json`:

```json
{
  "b8:27:eb:11:22:33": "Office-Pi",
  "b8:27:eb:44:55:66": "Lab-Pi-1",
  "b8:27:eb:77:88:99": "Lab-Pi-2"
}
```

**How to find MAC addresses:**

On each Pi, run:
```bash
ifconfig eth0 | grep ether
# or
ip addr show eth0 | grep ether
```

### 5. Environment Configuration

Optional environment variables:

```bash
# SSH Credentials
export PI_USER="pi"
export PI_PASS="raspberry"

# Network Settings
export REMOTE_DIR="/home/pi/router_logs"
export SSH_CONNECT_TIMEOUT="20"

# Performance Tuning
export STATUS_CONC="8"   # Concurrent status checks
export START_CONC="6"    # Concurrent start operations
export SCP_CONC="3"      # Concurrent file transfers
export SCP_KBPS="50000"  # Bandwidth limit per transfer

# Network Discovery
export SCAN_IFACES_FIRST="eth0,wlan0"
export ARP_TTL="10"      # ARP cache TTL in seconds
```

### 6. Running the Server

**Development mode:**
```bash
python manager.py
```

The server will start on `http://0.0.0.0:8055`

**Production mode with uvicorn:**
```bash
uvicorn manager:app --host 0.0.0.0 --port 8055 --workers 1
```

### 7. Testing the Backend

**Health check:**
```bash
curl http://localhost:8055/health
```

**Check status:**
```bash
curl http://localhost:8055/status
```

**Start logging:**
```bash
curl -X POST http://localhost:8055/start
```

**Stop logging:**
```bash
curl -X POST http://localhost:8055/stop
```

## How It Works

### 1. Network Discovery
- Uses `arp-scan` to discover devices on the local network
- Maintains an ARP cache with configurable TTL
- Background task continuously refreshes the cache

### 2. SSH Operations
- Uses `sshpass` for automated SSH authentication
- Concurrent connections controlled by semaphores
- Automatic retry logic for failed operations

### 3. Log Collection Workflow

**START:**
1. Generate batch ID (timestamp)
2. Clear previous logs from Target/
3. Scan network for Pis
4. SSH to each Pi and create `.get_ready_logging_<timestamp>` token
5. Pi devices detect token and start logging

**STATUS:**
1. Check ARP cache for Pi IPs
2. SSH to connected Pis
3. List remote directory for `.first_copy_done_*` tokens
4. Return status for each Pi

**STOP:**
1. SSH to each Pi
2. Transfer completed log folders via SCP
3. Clean up tokens on Pis
4. Store logs in Target/<log_id>/

### 4. Watchdog Tasks

Two background tasks run continuously:

- **Log Watchdog**: Polls Pis every 5s for completion tokens
- **USB Watchdog**: Monitors USB connection status

## Raspberry Pi Setup

On each Pi, ensure:

1. **SSH is enabled:**
```bash
sudo raspi-config
# Interface Options > SSH > Enable
```

2. **Log directory exists:**
```bash
mkdir -p /home/pi/router_logs
```

3. **Permissions are correct:**
```bash
sudo chown -R pi:pi /home/pi/router_logs
```

4. **Logging script runs** (your existing setup):
The Pi should monitor for `.get_ready_logging_*` files and:
- Start logging when detected
- Create `.first_copy_done_<log_id>` when complete
- Save logs to `/home/pi/router_logs/<log_id>/`

## Performance Tuning

### Network Congestion
If you have many Pis, adjust concurrency:
```bash
export STATUS_CONC="4"   # Reduce concurrent checks
export SCP_CONC="2"      # Fewer simultaneous transfers
export SCP_KBPS="25000"  # Throttle bandwidth
```

### Slow Network Discovery
Increase ARP cache TTL to reduce scanning:
```bash
export ARP_TTL="30"
```

### SSH Timeouts
For slow networks:
```bash
export SSH_CONNECT_TIMEOUT="30"
```

## Troubleshooting

### Pis Not Detected

**Check network connectivity:**
```bash
# Test ping
ping <pi-ip-address>

# Test SSH
ssh pi@<pi-ip-address>
```

**Verify ARP cache:**
```bash
arp -a
# or
ip neigh show
```

**Run manual ARP scan:**
```bash
sudo arp-scan --localnet --interface=eth0
```

### SSH Connection Failures

**Test credentials manually:**
```bash
sshpass -p raspberry ssh pi@<pi-ip> "echo 'Connected'"
```

**Check SSH keys:**
```bash
ssh-keyscan <pi-ip> >> ~/.ssh/known_hosts
```

### Transfer Failures

**Check remote directory:**
```bash
ssh pi@<pi-ip> "ls -la /home/pi/router_logs"
```

**Test SCP manually:**
```bash
sshpass -p raspberry scp -r pi@<pi-ip>:/home/pi/router_logs/test ./
```

### Port Already in Use

```bash
# Find process using port 8055
lsof -i :8055

# Kill the process
kill -9 <PID>
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password in Environment**: Storing passwords in environment variables is not secure for production
2. **SSH Keys Recommended**: Use SSH keys instead of passwords
3. **Network Isolation**: Run this on an isolated network
4. **Firewall Rules**: Restrict access to port 8055

## Monitoring

**Check active batch:**
```bash
cat .manager_state.json
```

**View transfer history:**
```bash
cat hot_transfer/transfer_history.json
```

**Monitor logs in real-time:**
```bash
tail -f /path/to/logs
```

## Next Steps

Once the backend is running:
1. Start the frontend (`npm run dev`)
2. Open http://localhost:8080/dashboard
3. Click "Start Logging" to begin
4. Monitor status in real-time
5. Click "Stop & Transfer" when complete

For frontend setup, see main README.md
