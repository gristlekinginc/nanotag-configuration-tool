#!/usr/bin/env python3
"""
Nanothings Nanotag Configuration Tool

Generates downlink payloads to configure Nanotag reporting intervals.
Based on the ChirpStack codec analysis of fPort 25 configuration acknowledgements.

Usage:
    python nanotag_config.py --preset 1min
    python nanotag_config.py --preset 5min  
    python nanotag_config.py --preset 30min
    python nanotag_config.py --record 300 --report 300 --unit seconds
"""

import argparse
import sys


def generate_config_payload(record_period, report_period, time_unit):
    """
    Generate hex payload for Nanotag configuration downlink.
    
    Args:
        record_period (int): How often to record measurements (1-65535)
        report_period (int): How often to send reports (1-65535)
        time_unit (str): 'minutes' or 'seconds'
    
    Returns:
        str: Hex payload for fPort 25 downlink
    """
    
    # Validate inputs
    if not (1 <= record_period <= 65535):
        raise ValueError("Record period must be between 1 and 65535")
    
    if not (1 <= report_period <= 65535):
        raise ValueError("Report period must be between 1 and 65535")
    
    if time_unit not in ['minutes', 'seconds']:
        raise ValueError("Time unit must be 'minutes' or 'seconds'")
    
    # Convert time unit to numeric
    unit_code = 0 if time_unit == 'minutes' else 1
    
    # Build payload based on official Nanothings format:
    # Bytes 0-1: Record period in seconds (big endian, 2 bytes)
    # Bytes 2-3: Report period in seconds (big endian, 2 bytes)
    
    # Convert to seconds if needed
    record_seconds = record_period * (60 if time_unit == 'minutes' else 1)
    report_seconds = report_period * (60 if time_unit == 'minutes' else 1)
    
    record_bytes = record_seconds.to_bytes(2, 'big')
    report_bytes = report_seconds.to_bytes(2, 'big')
    
    # Combine bytes (4 bytes total)
    payload = record_bytes + report_bytes
    hex_payload = payload.hex().upper()
    
    return hex_payload


def get_preset_config(preset):
    """Get predefined configuration presets."""
    presets = {
        '30sec': (30, 30, 'seconds'),
        '1min': (60, 60, 'seconds'),
        '5min': (300, 300, 'seconds'),
        '30min': (1800, 1800, 'seconds'),
        '1hour': (3600, 3600, 'seconds'),
    }
    
    if preset not in presets:
        available = ', '.join(presets.keys())
        raise ValueError(f"Unknown preset '{preset}'. Available: {available}")
    
    return presets[preset]


def main():
    parser = argparse.ArgumentParser(
        description='Generate Nanothings Nanotag configuration downlinks',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python nanotag_config.py --preset 1min
  python nanotag_config.py --preset 5min
  python nanotag_config.py --record 300 --report 300 --unit seconds
  python nanotag_config.py --record 5 --report 5 --unit minutes

Presets available: 30sec, 1min, 5min, 30min, 1hour
        """
    )
    
    # Preset or custom configuration
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--preset', choices=['30sec', '1min', '5min', '30min', '1hour'],
                      help='Use a predefined configuration')
    
    # Custom configuration options
    custom_group = group.add_argument_group('custom')
    group.add_argument('--custom', action='store_true', 
                      help='Use custom configuration (requires --record, --report, --unit)')
    
    parser.add_argument('--record', type=int, metavar='N',
                       help='Record period (1-65535)')
    parser.add_argument('--report', type=int, metavar='N', 
                       help='Report period (1-65535)')
    parser.add_argument('--unit', choices=['minutes', 'seconds'],
                       help='Time unit for periods')
    
    args = parser.parse_args()
    
    try:
        if args.preset:
            record, report, unit = get_preset_config(args.preset)
            config_name = args.preset
        else:
            # Custom configuration
            if not all([args.record, args.report, args.unit]):
                parser.error('Custom configuration requires --record, --report, and --unit')
            record, report, unit = args.record, args.report, args.unit
            config_name = f"{record}-{report}-{unit}"
        
        # Generate payload
        hex_payload = generate_config_payload(record, report, unit)
        
        # Display results
        print("=" * 60)
        print("🏷️  NANOTHINGS NANOTAG CONFIGURATION")
        print("=" * 60)
        print(f"Configuration: {config_name}")
        print(f"Record Period: {record} {unit}")
        print(f"Report Period: {report} {unit}")
        print()
        print("DOWNLINK DETAILS:")
        print(f"  fPort: 25")
        print(f"  Payload: {hex_payload}")
        print(f"  Length: {len(hex_payload)//2} bytes")
        print()
        print("CHIRPSTACK INSTRUCTIONS:")
        print("1. Log into your ChirpStack console")
        print("2. Navigate to your application and device")
        print("3. Go to Queue tab → Enqueue downlink")
        print("4. Set fPort: 25")
        print(f"5. Set payload: {hex_payload}")
        print("6. Set confirmed: true (recommended)")
        print("7. Click Enqueue")
        print()
        print("The device will acknowledge the new configuration on fPort 25.")
        print("=" * 60)
        
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()