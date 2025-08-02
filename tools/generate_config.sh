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

function generate_hex() {
    local record=$1
    local report=$2
    local unit=$3
    
    # Convert to seconds (unit: 0=minutes, 1=seconds)
    if [ $unit -eq 0 ]; then
        record=$((record * 60))
        report=$((report * 60))
    fi
    
    # Convert to hex (big endian, 2 bytes each)
    local record_hex=$(printf "%04X" $record)
    local report_hex=$(printf "%04X" $report)
    
    # Build payload: record_period + report_period (4 bytes total)
    echo "${record_hex}${report_hex}"
}

function show_config() {
    local preset=$1
    local record=$2
    local report=$3
    local unit_name=$4
    local hex_payload=$5
    
    echo -e "${GREEN}Configuration: ${preset}${NC}"
    echo -e "Record Period: ${record} ${unit_name}"
    echo -e "Report Period: ${report} ${unit_name}"
    echo ""
    echo -e "${YELLOW}DOWNLINK DETAILS:${NC}"
    echo -e "  fPort: 25"
    echo -e "  Payload: ${hex_payload}"
    echo ""
    echo -e "${BLUE}Copy this payload and send via ChirpStack Queue tab${NC}"
    echo "======================================================"
}

# Main logic
case "${1:-help}" in
    "1min")
        hex=$(generate_hex 60 60 1)
        show_config "1 Minute Interval" 60 60 "seconds" $hex
        ;;
    "5min")
        hex=$(generate_hex 300 300 1)
        show_config "5 Minutes Interval" 300 300 "seconds" $hex
        ;;
    "30min")
        hex=$(generate_hex 1800 1800 1)
        show_config "30 Minutes Interval" 1800 1800 "seconds" $hex
        ;;
    "1hour")
        hex=$(generate_hex 3600 3600 1)
        show_config "1 Hour Interval" 3600 3600 "seconds" $hex
        ;;
    "help"|*)
        show_help
        exit 1
        ;;
esac