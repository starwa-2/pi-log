# Quick Start Guide

Get your Pi Log Manager up and running in minutes!

## Prerequisites Check

Before starting, ensure you have:
- [ ] Python 3.10+ installed
- [ ] Node.js 18+ and npm installed
- [ ] `sshpass` and `arp-scan` installed on your system
- [ ] At least one Raspberry Pi on your network
- [ ] SSH enabled on your Raspberry Pis

## 5-Minute Setup

### Step 1: Clone or Download the Project

```bash
cd /path/to/pi-log-manager
```

### Step 2: Backend Setup (2 minutes)

```bash
# Install Python dependencies
pip install fastapi uvicorn pydantic

# Create required directories
mkdir -p hot_transfer Target

# Configure your Pis (edit with your actual MAC addresses)
cat > hot_transfer/pis.json << 'EOF'
{
  "b8:27:eb:11:22:33": "Pi-1",
  "b8:27:eb:44:55:66": "Pi-2"
}
EOF

# Start the backend
python manager.py &
```

The backend will start on http://0.0.0.0:8055

### Step 3: Frontend Setup (2 minutes)

```bash
# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:8080

### Step 4: Open Dashboard

Open your browser and navigate to:
```
http://localhost:8080/dashboard
```

## First Use

1. **Verify Connection**: You should see your configured Pis in the status grid
2. **Check Connectivity**: Look for green WiFi indicators next to connected Pis
3. **Start Logging**: Click the "Start Logging" button
4. **Monitor Progress**: Watch the Pi status grid for completion indicators
5. **Stop & Transfer**: Click "Stop & Transfer" when ready to collect logs

## Troubleshooting

### Backend won't start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
```bash
pip install --upgrade pip
pip install fastapi uvicorn pydantic
```

**Error**: `Address already in use`
```bash
# Find and kill process on port 8055
lsof -ti:8055 | xargs kill -9
```

### Frontend shows connection error

1. Verify backend is running:
```bash
curl http://localhost:8055/health
```

2. Check backend logs for errors

3. Try manual status check:
```bash
curl http://localhost:8055/status
```

### Pis not detected

1. **Verify MAC addresses in `hot_transfer/pis.json`**

   On each Pi, run:
   ```bash
   ifconfig eth0 | grep ether
   ```

2. **Test network connectivity**
   ```bash
   ping <pi-ip-address>
   ```

3. **Manual ARP scan**
   ```bash
   sudo arp-scan --localnet --interface=eth0
   ```

4. **Test SSH connection**
   ```bash
   ssh pi@<pi-ip-address>
   ```

### Pis don't appear after adding to pis.json

- Restart the backend: `python manager.py`
- Wait 10 seconds for ARP cache to populate
- Click "Refresh" button in the dashboard
- Check backend console logs for errors

## What's Next?

### Configure for Your Environment

**Custom SSH credentials:**
```bash
export PI_USER="myuser"
export PI_PASS="mypassword"
python manager.py
```

**Custom log directory:**
```bash
export REMOTE_DIR="/custom/log/path"
python manager.py
```

### Performance Tuning

For many Pis (10+):
```bash
export STATUS_CONC="4"
export SCP_CONC="2"
export SCP_KBPS="25000"
python manager.py
```

### Production Deployment

1. **Use environment variables for credentials**
2. **Set up SSH keys instead of passwords**
3. **Run backend with uvicorn:**
   ```bash
   uvicorn manager:app --host 0.0.0.0 --port 8055
   ```

4. **Build frontend for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Common Workflows

### Daily Testing Routine

```bash
# 1. Start backend
python manager.py &

# 2. Start frontend (in another terminal)
npm run dev

# 3. Open dashboard
open http://localhost:8080/dashboard

# 4. Click "Start Logging"

# 5. Wait for Pis to complete

# 6. Click "Stop & Transfer"

# 7. Check logs in Target/ directory
ls -la Target/
```

### Batch Processing

```bash
# Process multiple batches throughout the day
# Logs are automatically organized by timestamp

# Batch 1 (morning)
# Click Start → Wait → Click Stop

# Batch 2 (afternoon)
# Click Start → Wait → Click Stop

# Each batch gets a unique ID like: 20250113_091530
```

## Getting Help

### Check Logs

**Backend logs:** Console where you ran `python manager.py`

**Frontend logs:** Browser developer console (F12)

**Activity log:** In the dashboard UI at the bottom

### Debug Mode

Run backend with extra logging:
```bash
PYTHONPATH=. python -u manager.py 2>&1 | tee backend.log
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Pi shows "Offline" | Check network, verify MAC address |
| Transfer timeout | Increase `SSH_CONNECT_TIMEOUT` |
| Slow status updates | Reduce `STATUS_CONC` |
| Missing logs | Check `Target/` directory permissions |

## Support

For detailed documentation:
- Backend setup: See `BACKEND_SETUP.md`
- Full manual: See `README.md`

## Success Checklist

- [ ] Backend running on port 8055
- [ ] Frontend accessible at port 8080
- [ ] At least one Pi visible in dashboard
- [ ] Can start and stop logging
- [ ] Logs appear in Target/ directory

**Congratulations! Your Pi Log Manager is ready to use! 🎉**
