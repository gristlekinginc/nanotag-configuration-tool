
# Chirpstack Measurement Types and Descriptions

| Measurement Key                  | Type      | Description                                    |
|----------------------------------|-----------|------------------------------------------------|
| batteryStatus                    | String    | Battery Status (Excellent, Good, Low, Critical)|
| confirmedConfigurationUnit       | Absolute  | Configured Units (0: Minutes, 1: Seconds)      |
| confirmedConfigurationUnitText   | String    | Configured Units (Minutes or Seconds)          |
| confirmedRecordPeriod            | Absolute  | Data Record Interval                           |
| confirmedReportPeriod            | Absolute  | Data Report Send Interval                      |
| frameId                          | Absolute  | Data Frame Identifier                          |
| temperatures_x_temperatureCelsius| Gauge     | Temperature in Celsius                         |
| temperatures_x_temperatureFahrenheit | Gauge | Temperature in Fahrenheit                      |
| uplinkType                       | String    | Uplink Message Type (e.g., boot_message, health_message, report_frame)|
| voltageMv                        | Gauge     | Battery Voltage in Millivolts                  |
