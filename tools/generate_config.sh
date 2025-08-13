#!/bin/bash

# Nanothings Nanotag Quick Configuration Generator
# Usage: ./generate_config.sh [1min|5min|30min|1hour]

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function show_help() {
    echo -e "${BLUE}Nanothings Nanotag Configuration Generator${NC}"
    echo ""
    echo "Usage: $0 [preset]"
    echo ""
    echo "Available presets:"
    echo "  1min   - 1 minute intervals"
    echo "  5min   - 5 minute intervals" 
    echo "  30min  - 30 minute intervals"
    echo "  1hour  - 1 hour intervals"
    echo ""
    echo "Example: $0 1min"
}

function generate_config() {
    local record=$1
    local report=$2
    local unit=$3
    
    # Validate that report period is multiple of record period
    if [ $((report % record)) -ne 0 ]; then
        echo "Error: Report period must be a multiple of record period" >&2
        exit 1
    fi
    
    # Use raw values (not converted to seconds)
    # Port determines the time unit: 28 = minutes, 29 = seconds
    local port
    if [ $unit -eq 0 ]; then
        port=28
    else
        port=29
    fi
    
    # Convert to hex (big endian, 2 bytes each)
    local record_hex=$(printf "%04X" $record)
    local report_hex=$(printf "%04X" $report)
    
    # Build payload: record_period + report_period (4 bytes total)
    local hex_payload="${record_hex}${report_hex}"
    
    # Generate base64 for Helium
    local base64_payload=$(echo -n $hex_payload | xxd -r -p | base64)
    
    echo "$hex_payload,$base64_payload,$port"
}

function show_config() {
    local preset=$1
    local record=$2
    local report=$3
    local unit_name=$4
    local config_result=$5
    
    IFS=',' read -r hex_payload base64_payload port <<< "$config_result"
    
    echo -e "${GREEN}Configuration: ${preset}${NC}"
    echo -e "Record Period: ${record} ${unit_name}"
    echo -e "Report Period: ${report} ${unit_name}"
    echo ""
    echo -e "${YELLOW}DOWNLINK DETAILS:${NC}"
    echo -e "  fPort: ${port} (${unit_name})"
    echo -e "  Hex Payload: ${hex_payload}"
    echo -e "  Base64 Payload: ${base64_payload} (for Helium)"
    echo ""
    echo -e "${BLUE}Copy the appropriate payload and send via ChirpStack Queue tab${NC}"
    echo -e "${BLUE}Use confirmed downlinks for best reliability on Helium${NC}"
    echo "======================================================"
}

# Main logic
case "${1:-help}" in
    "1min")
        config=$(generate_config 1 1 0)
        show_config "1 Minute Interval" 1 1 "minutes" "$config"
        ;;
    "5min")
        config=$(generate_config 5 5 0)
        show_config "5 Minutes Interval" 5 5 "minutes" "$config"
        ;;
    "30min")
        config=$(generate_config 30 30 0)
        show_config "30 Minutes Interval" 30 30 "minutes" "$config"
        ;;
    "1hour")
        config=$(generate_config 60 60 0)
        show_config "1 Hour Interval" 60 60 "minutes" "$config"
        ;;
    "help"|*)
        show_help
        exit 1
        ;;
esac