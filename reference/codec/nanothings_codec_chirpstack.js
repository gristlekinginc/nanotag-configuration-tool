function decodeUplink(input) {
  const { fPort, bytes } = input;
  const hexBytes = bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
  const decoded = {};

  switch (fPort) {
    case 1:
      decoded.uplinkType = "boot_message";
      decoded.voltageMv = parseInt(hexBytes.slice(2, 4).join(""), 16);
      decoded.batteryStatus = getSimpleBatteryStatus(decoded.voltageMv);
      const bootByte = hexBytes[0];
      if (bootByte === "FC") decoded.error = errors.temperatureSensor.communicationError;
      if (bootByte === "FF") decoded.error = errors.temperatureSensor.outOfRangeBootHealth;
      break;

    case 13:
      decoded.uplinkType = "health_message";
      decoded.voltageMv = parseInt(hexBytes.slice(2, 4).join(""), 16);
      decoded.batteryStatus = getSimpleBatteryStatus(decoded.voltageMv);
      const healthByte = hexBytes[0];
      if (healthByte === "FC") decoded.error = errors.temperatureSensor.communicationError;
      if (healthByte === "FF") decoded.error = errors.temperatureSensor.outOfRangeBootHealth;
      break;

    case 21:
      decoded.uplinkType = "device_status_response";
      decoded.voltageMv = parseInt(hexBytes.slice(0, 2).join(""), 16);
      decoded.batteryStatus = getSimpleBatteryStatus(decoded.voltageMv);
      break;

    case 25:
      decoded.uplinkType = "configuration_acknowledgement";
      decoded.confirmedRecordPeriod = parseInt(hexBytes.slice(1, 3).join(""), 16);
      decoded.confirmedReportPeriod = parseInt(hexBytes.slice(3, 5).join(""), 16);
      decoded.confirmedConfigurationUnit = parseInt(hexBytes[5], 16);
      decoded.confirmedConfigurationUnitText = decoded.confirmedConfigurationUnit ? "seconds" : "minutes";
      break;

    case 26:
      decoded.uplinkType = "report_frame";
      decoded.frameId = parseInt(hexBytes.slice(0, 2).join(""), 16);
      decoded.temperatures = getTemperaturesFromFrame(hexBytes);
      break;

    case 27:
      decoded.uplinkType = "recover_response";
      decoded.frameId = parseInt(hexBytes.slice(0, 2).join(""), 16);
      decoded.temperatures = getTemperaturesFromFrame(hexBytes);
      break;

    case 28:
      decoded.uplinkType = "configuration_request";
      break;

    case 31:
      decoded.uplinkType = "low_voltage_warning";
      decoded.voltageMv = parseInt(hexBytes.join(""), 16);
      decoded.batteryStatus = getSimpleBatteryStatus(decoded.voltageMv);
      break;

    case 32:
      decoded.uplinkType = "device_shutdown_acknowledgement";
      decoded.voltageMv = parseInt(hexBytes.join(""), 16);
      decoded.batteryStatus = getSimpleBatteryStatus(decoded.voltageMv);
      break;
  }

  return { data: decoded };
}

// Helper Functions
function getSimpleBatteryStatus(voltageMv) {
  if (voltageMv > 2850) return "Excellent";
  if (voltageMv > 2750) return "Good";
  if (voltageMv > 2650) return "Low";
  return "Critical";
}

function getTemperaturesFromFrame(hexBytes) {
  const temperatureFrame = hexBytes.slice(2);
  const combinedHexValues = combineBytePairs(temperatureFrame).map((e) => e.join(""));
  return combinedHexValues.map((value) => {
    if (value === "FFFF") {
      return {
        temperatureCelsius: null,
        temperatureFahrenheit: null,
        error: errors.temperatureSensor.outOfRangeTemperatureFrame
      };
    }
    const parsed = parseInt(value, 16);
    const tempC = (parsed - 5000) / 100;
    const tempF = +(tempC * 9 / 5 + 32).toFixed(2);
    return {
      temperatureCelsius: tempC,
      temperatureFahrenheit: tempF
    };
  });
}

function combineBytePairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1]]);
  }
  return pairs;
}

const errors = {
  temperatureSensor: {
    communicationError: {
      errorCode: "FC",
      errorMessage: "Unable to communicate with temperature sensor. NanoTag should be considered unreliable"
    },
    outOfRangeBootHealth: {
      errorCode: "FF",
      errorMessage: "Collected temperature sample is out of operating range"
    },
    outOfRangeTemperatureFrame: {
      errorCode: "FFFF",
      errorMessage: "One or more collected temperature samples are out of operating range"
    }
  }
};