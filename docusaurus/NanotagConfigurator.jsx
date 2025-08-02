import React, { useState } from 'react';
import styles from './NanotagConfigurator.module.css';

const NanotagConfigurator = () => {
  const [recordPeriod, setRecordPeriod] = useState(60);
  const [reportPeriod, setReportPeriod] = useState(60);
  const [timeUnit, setTimeUnit] = useState(1);
  const [result, setResult] = useState(null);

  const setPreset = (record, report, unit) => {
    setRecordPeriod(record);
    setReportPeriod(report);
    setTimeUnit(unit);
    generateConfig(record, report, unit);
  };

  const generateConfig = (record = recordPeriod, report = reportPeriod, unit = timeUnit) => {
    // Validate inputs
    if (record < 1 || record > 65535) {
      alert('Record period must be between 1 and 65535');
      return;
    }
    if (report < 1 || report > 65535) {
      alert('Report period must be between 1 and 65535');
      return;
    }

    // Generate hex payload using official Nanothings format:
    // Bytes 0-1: Record period in seconds (big endian)
    // Bytes 2-3: Report period in seconds (big endian)
    
    // Convert to seconds if needed
    const recordSeconds = record * (unit === 0 ? 60 : 1);
    const reportSeconds = report * (unit === 0 ? 60 : 1);
    
    const recordHex = recordSeconds.toString(16).padStart(4, '0').toUpperCase();
    const reportHex = reportSeconds.toString(16).padStart(4, '0').toUpperCase();
    
    const hexPayload = recordHex + reportHex;
    
    const unitText = unit === 0 ? 'minutes' : 'seconds';
    
    setResult({
      hexPayload,
      record,
      report,
      unitText,
      recordSeconds,
      reportSeconds
    });
  };

  React.useEffect(() => {
    generateConfig();
  }, []);

  return (
    <div className={styles.container}>
      <h2>🏷️ Nanothings Nanotag Configuration Tool</h2>
      
      <div className={styles.currentStatus}>
        <h3>📊 Configuration Tool</h3>
        <p><strong>Payload Format:</strong> 4-byte verified format for Nanothings Nanotags</p>
        <p><strong>Compatibility:</strong> All Nanothings Nanotag devices via LoRaWAN</p>
        <p><strong>Target fPort:</strong> 25 (configuration port)</p>
        <p><strong>Response:</strong> Device acknowledges on fPort 25</p>
      </div>

      <div className={styles.section}>
        <h3>⚡ Quick Presets</h3>
        <div className={styles.presetButtons}>
          <button className={styles.presetBtn} onClick={() => setPreset(1, 1, 0)}>
            1 Minute Interval
          </button>
          <button className={styles.presetBtn} onClick={() => setPreset(5, 5, 0)}>
            5 Minutes Interval
          </button>
          <button className={styles.presetBtn} onClick={() => setPreset(30, 30, 0)}>
            30 Minutes Interval
          </button>
          <button className={styles.presetBtn} onClick={() => setPreset(60, 60, 0)}>
            1 Hour Interval
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>🔧 Custom Configuration</h3>
        
        <div className={styles.inputGroup}>
          <label htmlFor="recordPeriod">Record Period:</label>
          <input 
            type="number" 
            id="recordPeriod" 
            value={recordPeriod}
            onChange={(e) => setRecordPeriod(parseInt(e.target.value))}
            min="1" 
            max="65535"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="reportPeriod">Report Period:</label>
          <input 
            type="number" 
            id="reportPeriod" 
            value={reportPeriod}
            onChange={(e) => setReportPeriod(parseInt(e.target.value))}
            min="1" 
            max="65535"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="timeUnit">Time Unit:</label>
          <select 
            id="timeUnit" 
            value={timeUnit}
            onChange={(e) => setTimeUnit(parseInt(e.target.value))}
          >
            <option value="0">Minutes</option>
            <option value="1">Seconds</option>
          </select>
        </div>
        
        <button className={styles.generateBtn} onClick={() => generateConfig()}>
          Generate Configuration
        </button>
      </div>

      {result && (
        <div className={styles.result}>
          <h3>📤 Downlink Configuration</h3>
          <p><strong>fPort:</strong> 25</p>
          <p><strong>Hex Payload:</strong></p>
          <div className={styles.hexOutput}>{result.hexPayload}</div>
          <div className={styles.configDetails}>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>Record Period: {result.record} {result.unitText} ({result.recordSeconds} seconds)</li>
              <li>Report Period: {result.report} {result.unitText} ({result.reportSeconds} seconds)</li>
              <li>Payload Format: Official 4-byte Nanothings format</li>
              <li>Payload Length: 4 bytes</li>
            </ul>
            <p><em>The device will send data every {result.report} {result.unitText} and record measurements every {result.record} {result.unitText}.</em></p>
          </div>
        </div>
      )}

      <div className={styles.instructions}>
        <h3>📋 How to Send Downlink via ChirpStack</h3>
        <ol>
          <li>Log into your ChirpStack console</li>
          <li>Navigate to your application and device</li>
          <li>Go to the "Queue" tab</li>
          <li>Click "Enqueue downlink"</li>
          <li>Set fPort to <strong>25</strong></li>
          <li>Paste the generated hex payload</li>
          <li>Set confirmed to <strong>true</strong> (recommended)</li>
          <li>Click "Enqueue"</li>
        </ol>
        <p><em>💡 Tip: The device will acknowledge the configuration on fPort 25 when it receives and applies the new settings.</em></p>
      </div>
    </div>
  );
};

export default NanotagConfigurator;