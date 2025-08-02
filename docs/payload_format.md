# Nanothings Nanotag Payload Format 📋

**Technical specification for Nanothings Nanotag configuration downlinks.**

## 🎯 **Format Specification**

**Payload Structure**: `[2-byte record period][2-byte report period]`

- **Total Length**: 4 bytes
- **Encoding**: Big-endian 16-bit unsigned integers
- **Units**: Seconds (for both record and report periods)
- **Range**: 1-65535 seconds per field
- **LoRaWAN fPort**: 25

## 📊 **Payload Examples**

| Configuration | Record (s) | Report (s) | Hex Payload | Description |
|---------------|------------|------------|-------------|-------------|
| High frequency | 10 | 30 | `000A001E` | Record every 10s, report every 30s |
| Real-time | 60 | 60 | `003C003C` | 1-minute intervals |
| Standard | 300 | 300 | `012C012C` | 5-minute intervals |
| Power saving | 1800 | 1800 | `07080708` | 30-minute intervals |
| Long-term | 3600 | 3600 | `0E100E10` | 1-hour intervals |
| Batch reporting | 300 | 1800 | `012C0708` | Record every 5min, report every 30min |

## 🔧 **Encoding Process**

### Step 1: Convert to Seconds
- **Minutes → Seconds**: Multiply by 60
- **Hours → Seconds**: Multiply by 3600

### Step 2: Encode as Big-Endian 16-bit
```python
record_bytes = record_seconds.to_bytes(2, 'big')
report_bytes = report_seconds.to_bytes(2, 'big')
payload = record_bytes + report_bytes
```

### Step 3: Convert to Hex String
```python
hex_payload = payload.hex().upper()
```

## 📋 **Validation Rules**

### **Range Limits**
- **Minimum**: 1 second (0x0001)
- **Maximum**: 65535 seconds (0xFFFF) ≈ 18.2 hours

### **Practical Considerations**
- **Battery Life**: Longer intervals = longer battery life
- **Data Freshness**: Shorter intervals = more current data
- **Network Usage**: Consider LoRaWAN duty cycle limits

### **Common Intervals**
| Interval | Seconds | Use Case |
|----------|---------|----------|
| 1 minute | 60 | Real-time monitoring |
| 5 minutes | 300 | Frequent updates |
| 15 minutes | 900 | Standard monitoring |
| 30 minutes | 1800 | Power-efficient |
| 1 hour | 3600 | Long-term deployment |
| 6 hours | 21600 | Daily patterns |

## 🔄 **Device Response**

### **Configuration Acknowledgment**
- **fPort**: 25 (same as downlink)
- **Response Type**: `configuration_acknowledgement`
- **Contains**: Confirmed record/report periods and units

### **Expected Fields**
```json
{
  "uplinkType": "configuration_acknowledgement",
  "confirmedRecordPeriod": 60,
  "confirmedReportPeriod": 60,
  "confirmedConfigurationUnit": 1
}
```

## 🧪 **Testing & Verification**

### **Payload Generation Test**
```bash
# Test all tools generate identical payloads
node tools/test_tools.js
```

### **Manual Verification**
```python
# Verify 1-minute interval payload
record_seconds = 60
report_seconds = 60
expected = "003C003C"

payload = f"{record_seconds:04X}{report_seconds:04X}"
assert payload == expected
```

## ⚠️ **Common Mistakes**

### **Incorrect Byte Order**
- ❌ **Little-endian**: `3C00` (wrong)
- ✅ **Big-endian**: `003C` (correct)

### **Wrong Units**
- ❌ **Minutes**: Sending 60 for 60 minutes
- ✅ **Seconds**: Convert 60 minutes to 3600 seconds

### **Incorrect Length**
- ❌ **6 bytes**: Adding command or unit bytes
- ✅ **4 bytes**: Only record and report periods

## 🔗 **References**

- [Configuration Guide](./configuration_guide.md) - Complete usage instructions
- [Technical Specs](./technical_specs.txt) - Device specifications
- [Tools Documentation](../tools/) - Available configuration tools

---

**This format is verified to work with Nanothings Nanotag devices via LoRaWAN downlinks on fPort 25.**