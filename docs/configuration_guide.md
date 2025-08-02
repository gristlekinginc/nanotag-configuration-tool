# Nanothings Nanotag Configuration Guide 📋

**Complete guide for configuring Nanothings Nanotag devices using LoRaWAN downlinks.**

## 🎯 **Quick Start**

### 1. Choose Your Tool

**Python (Recommended for automation):**
```bash
python3 tools/nanotag_config.py --preset 1min
```

**Bash (Quick one-liners):**
```bash
./tools/generate_config.sh 1min
```

**Web Interface:**
Open `tools/nanotag_config_tool.html` in your browser

### 2. Send the Downlink

1. Copy the generated hex payload (e.g., `003C003C`)
2. In your ChirpStack console:
   - Navigate to your device
   - Go to **Queue** tab
   - Click **Enqueue downlink**
   - Set **fPort**: `25`
   - Paste the **payload**
   - Set **confirmed**: `true`
   - Click **Enqueue**

### 3. Verify Configuration

- Check the **Events** tab for `configuration_acknowledgement`
- Device should confirm the new intervals
- Reporting should change to the new schedule

## 🛠️ **Tool Reference**

### **Python Script** (`tools/nanotag_config.py`)

**Presets:**
```bash
python3 tools/nanotag_config.py --preset 30sec   # 30-second intervals
python3 tools/nanotag_config.py --preset 1min    # 1-minute intervals  
python3 tools/nanotag_config.py --preset 5min    # 5-minute intervals
python3 tools/nanotag_config.py --preset 30min   # 30-minute intervals
python3 tools/nanotag_config.py --preset 1hour   # 1-hour intervals
```

**Custom Configuration:**
```bash
python3 tools/nanotag_config.py --custom --record 300 --report 1800 --unit seconds
# Record every 5 minutes, report every 30 minutes
```

### **Bash Script** (`tools/generate_config.sh`)

**Usage:**
```bash
./tools/generate_config.sh 1min     # 1-minute intervals
./tools/generate_config.sh 5min     # 5-minute intervals
./tools/generate_config.sh 30min    # 30-minute intervals
./tools/generate_config.sh 1hour    # 1-hour intervals
```

### **HTML Web Tool** (`tools/nanotag_config_tool.html`)

- Open in any web browser
- No installation required
- Interactive preset buttons
- Custom configuration options
- Real-time payload generation

## 📊 **Configuration Patterns**

### **Real-Time Monitoring**
- **Record**: Every 60 seconds
- **Report**: Every 60 seconds  
- **Payload**: `003C003C`
- **Use Case**: Critical monitoring, immediate alerts

### **Standard Monitoring**
- **Record**: Every 5 minutes
- **Report**: Every 5 minutes
- **Payload**: `012C012C`
- **Use Case**: Regular environmental monitoring

### **Power-Efficient**
- **Record**: Every 30 minutes
- **Report**: Every 30 minutes
- **Payload**: `07080708`
- **Use Case**: Long-term deployment, battery conservation

### **Batch Reporting**
- **Record**: Every 5 minutes
- **Report**: Every 30 minutes
- **Payload**: `012C0708`
- **Use Case**: Multiple readings per transmission

## 🔧 **Advanced Usage**

### **Custom Intervals**

**Example: 15-minute recording, 1-hour reporting**
```bash
# Record period: 15 minutes = 900 seconds = 0x0384
# Report period: 1 hour = 3600 seconds = 0x0E10
# Payload: 03840E10
```

### **Calculating Custom Payloads**

```python
def generate_payload(record_seconds, report_seconds):
    record_hex = f"{record_seconds:04X}"
    report_hex = f"{report_seconds:04X}"
    return record_hex + report_hex

# Example: 10 minutes record, 1 hour report
payload = generate_payload(600, 3600)  # Returns: "025A0E10"
```

## ⚠️ **Important Considerations**

### **Battery Life Impact**
- **1-minute intervals**: ~3 months battery life
- **5-minute intervals**: ~8 months battery life  
- **30-minute intervals**: ~2+ years battery life
- **1-hour intervals**: ~3+ years battery life

### **LoRaWAN Duty Cycle**
- Consider regional duty cycle limitations
- Frequent transmissions may hit duty cycle limits
- Plan intervals according to local regulations

### **Data Storage**
- Devices have limited internal storage
- Long record periods with short report periods may cause data overflow
- Ensure report period ≤ record period × storage capacity

## 🚨 **Troubleshooting**

### **Device Not Acknowledging**

**Check:**
- ✅ Payload sent to **fPort 25**
- ✅ Payload is **exactly 4 bytes** (8 hex characters)
- ✅ Device has **uplink window** available (Class A)
- ✅ **Confirmed downlink** enabled

**Solutions:**
- Wait for device's next scheduled uplink
- Verify payload format is correct
- Check ChirpStack queue shows downlink delivered

### **Wrong Configuration Applied**

**Symptoms:**
- Device acknowledges but uses different intervals
- Configuration partially applied

**Solutions:**
- Verify payload calculation
- Check byte order (must be big-endian)
- Ensure values are in seconds, not minutes

### **No Configuration Change**

**Symptoms:**
- Device acknowledges but continues old behavior

**Solutions:**
- Wait 1-2 reporting cycles for change to take effect
- Check if device requires restart after configuration
- Verify the acknowledged values match your intent

## 📋 **Verification Checklist**

### **Before Sending Downlink**
- [ ] Payload is exactly 8 hex characters (4 bytes)
- [ ] Values are in seconds, not minutes
- [ ] fPort is set to 25
- [ ] Confirmed downlink is enabled

### **After Sending Downlink**
- [ ] Device acknowledges configuration (fPort 25)
- [ ] Acknowledged values match your configuration
- [ ] Device behavior changes within 1-2 cycles
- [ ] New reporting interval is consistent

## 🧪 **Testing Your Setup**

**1. Start with longer intervals** (easier to verify):
```bash
./tools/generate_config.sh 5min
```

**2. Verify the change takes effect**
- Monitor Events tab for new reporting pattern

**3. Progress to shorter intervals** once confirmed working:
```bash
./tools/generate_config.sh 1min
```

## 🔗 **References**

- [Payload Format](./payload_format.md) - Technical payload specification
- [Technical Specs](./technical_specs.txt) - Device specifications
- [Tool Documentation](../tools/) - Individual tool usage

---

**Ready to configure your Nanothings Nanotags! Follow this guide step-by-step for reliable results.**