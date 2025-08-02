# Changelog

All notable changes to the Nanothings Nanotag Configuration Tools project.

## [1.1.0] - 2025-08-02

### 🔧 **Updated fPort Configuration**

- Corrected fPort usage based on original Nanothings documentation
- **fPort 28**: For sending values in minutes 
- **fPort 29**: For sending values in seconds
- **fPort 25**: Device acknowledges configuration (read-only)

### 📊 **Documentation Updates**

- Updated README with correct fPort information
- Added fPort selection guidance  
- Cleaned PII from test data files

---

## [1.0.0] - 2025-01-01

### ✅ **Initial Release**

Complete toolkit for configuring Nanothings Nanotag devices via LoRaWAN downlinks.

### 🛠️ **Tools Included**

**Command Line Tools:**
- `tools/nanotag_config.py` - Python configuration script with presets
- `tools/generate_config.sh` - Bash script for quick configuration
- `tools/test_tools.js` - Cross-tool verification and testing

**Web Interfaces:**
- `tools/nanotag_config_tool.html` - Standalone HTML configuration tool
- `docusaurus/NanotagConfigurator.jsx` - React component for documentation sites

### 📊 **Payload Format**

- **Format**: 4-byte big-endian configuration payloads
- **Structure**: `[2-byte record seconds][2-byte report seconds]`
- **fPort**: 28/29 (LoRaWAN configuration ports)
- **Verified**: All tools generate identical payloads

### 📚 **Documentation**

- Complete usage guide and technical specifications
- Docusaurus integration guide for embedding in documentation
- Cross-tool verification and testing suite
- Professional payload format documentation

### 🧪 **Testing**

- All tools verified to generate correct 4-byte payloads
- Cross-tool consistency verification
- Example configurations for common use cases

### 🗂️ **Repository Structure**

```
nanothings/
├── tools/              # Configuration tools
├── docusaurus/         # Docusaurus integration components
├── docs/               # Documentation
├── reference/          # Reference data and codecs
└── README.md           # Main documentation
```

### ✅ **Verified Configurations**

| Interval | Payload | Record/Report |
|----------|---------|---------------|
| 1 minute | `003C003C` | 60s / 60s |
| 5 minutes | `012C012C` | 300s / 300s |
| 30 minutes | `07080708` | 1800s / 1800s |
| 1 hour | `0E100E10` | 3600s / 3600s |

---

## Development Notes

### **Payload Format**
The 4-byte payload format consists of:
- Bytes 0-1: Record period in seconds (big-endian)
- Bytes 2-3: Report period in seconds (big-endian)

### **Device Compatibility**
- Tested with Nanothings Nanotag devices
- Uses LoRaWAN Class A operation
- Configurations acknowledged on fPort 25

### **Tool Consistency**
All tools implement identical payload generation logic and are cross-verified to ensure consistency across different interfaces.