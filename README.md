# Nanothings Nanotag Configuration Tools
 
You used to be able to go to a Nanothings/Nanotags site and configure downloads, but that page has been removed.  Teague [found it on the Wayback Machine](https://web.archive.org/web/20241208203034/https://www.nanothingsinc.com/configuration-response-downlink-encoder), but that can be slow to load and I wanted something I could embed on the MetSci site for a post I'm writing.

Me & Cursor built this so I could embed it on the MetSci site and just make it generally available.

This works if you're using the [MetSci Console](https://console.meteoscientific.com/front/), and (I imagine) any other LNS.

The only thing that'll really catch you out is not remembering that Port 28 is for minutes and Port 29 is for seconds.  Ask me how I know.

## ⚠️ **Disclaimer**

This is an independent tool for configuring Nanothings devices. 
Not affiliated with or endorsed by Nanothings or whoever bought them.


## **Quick Start**

Generate a 1-minute interval configuration:

```bash
# Using bash script
./tools/generate_config.sh 1min

# Using Python script  
python3 tools/nanotag_config.py --preset 1min

# Expected output: 003C003C
```

Then send `003C003C` to your device on **fPort 25** via ChirpStack.

## 📁 **Project Structure**

```
nanothings/
├── tools/              # Configuration tools
│   ├── nanotag_config.py          # Python CLI tool
│   ├── generate_config.sh         # Bash script
│   ├── nanotag_config_tool.html   # Web interface
│   └── test_tools.js              # Cross-tool verification
├── docusaurus/         # Docusaurus integration
│   ├── NanotagConfigurator.jsx    # React component
│   ├── integration-guide.md       # Setup instructions
│   └── example-page.mdx           # Example documentation page
├── docs/               # Documentation
│   ├── payload_format.md
│   ├── configuration_guide.md
│   └── technical_specs.txt
├── reference/          # Reference data
│   ├── codec/                     # ChirpStack codec
│   ├── wayback_data/              # Original tool data
│   └── test_data/                 # Device test events
└── CHANGELOG.md        # Version history
```

## **Payload Format**

**Format**: `[2-byte record seconds][2-byte report seconds]` (4 bytes total)

- **Encoding**: Big-endian 16-bit integers
- **Units**: Always seconds
- **fPort**: 28 (minutes) or 29 (seconds)

| Configuration | Payload | Breakdown |
|---------------|---------|-----------|
| 1 minute | `003C003C` | 60s record + 60s report |
| 5 minutes | `012C012C` | 300s record + 300s report |
| 30 minutes | `07080708` | 1800s record + 1800s report |
| 1 hour | `0E100E10` | 3600s record + 3600s report |

## 🛠️ **Tools Available**

### **Command Line Tools**
- **`tools/nanotag_config.py`** - Full-featured Python script with presets
- **`tools/generate_config.sh`** - Quick bash script for common intervals
- **`tools/test_tools.js`** - Verify all tools generate consistent payloads

### **Web Interfaces**  
- **`tools/nanotag_config_tool.html`** - Standalone HTML tool
- **`docusaurus/NanotagConfigurator.jsx`** - Embeddable React component

## 🚀 **Embedding in Documentation**

For Docusaurus sites, see [Integration Guide](./docusaurus/integration-guide.md):

```mdx
import NanotagConfigurator from '@site/src/components/NanotagConfigurator';

# Configure Your Nanotags

<NanotagConfigurator />
```

## **Usage with ChirpStack**

1. **Generate payload** using any of the tools
2. **Send downlink** via ChirpStack console:
   - **fPort**: 28 (for minutes) or 29 (for seconds)
   - **Payload**: Generated hex (e.g., `003C003C`)
   - **Confirmed**: Recommended
3. **Verify**: Device should acknowledge on fPort 25

# **fPort Selection - Minutes vs Seconds**

- **fPort 28**: Send when values are in **minutes** (e.g., `00010001` = 1min/1min)
- **fPort 29**: Send when values are in **seconds** (e.g., `003C003C` = 60s/60s) 
- **fPort 25**: Device **acknowledges** configuration (read-only)

## 🔧 **How It Works**

These tools generate the correct 4-byte payload format for Nanothings Nanotag configuration:

1. **Input**: Desired recording and reporting intervals
2. **Process**: Convert to seconds and encode as big-endian 16-bit integers
3. **Output**: 4-byte hex payload ready for LoRaWAN downlink

## 📚 **Documentation**

- [Configuration Guide](./docs/configuration_guide.md) - Complete usage guide
- [Technical Specs](./docs/technical_specs.txt) - Device specifications  
- [Payload Format](./docs/payload_format.md) - Technical details about the format
- [CHANGELOG](./CHANGELOG.md) - Version history

##  **Testing**

All tools are cross-verified to generate identical payloads. Run the test suite:

```bash
node tools/test_tools.js
```

**Expected**: All tests pass ✅

---
