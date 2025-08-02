# Post-18:32 Deployment Checklist 📋

**Use this checklist after the 18:32 device uplink to verify success and deploy the Docusaurus tool.**

## ✅ **Step 1: Verify Device Response (18:32-18:35)**

### **Expected Events**
- [ ] Device uplinks at ~18:32 (fPort 26 report_frame OR fPort 21 status)
- [ ] `configuration_acknowledgement` appears on fPort 25
- [ ] Acknowledgement shows 60-second intervals

### **Check ChirpStack Events Tab**
```bash
# Look for these indicators:
- New fPort 25 event with uplinkType: "configuration_acknowledgement"
- confirmedRecordPeriod: 60 (seconds)
- confirmedReportPeriod: 60 (seconds)
- confirmedConfigurationUnit: 1 (seconds)
```

## ✅ **Step 2: Monitor 1-Minute Intervals (18:33-18:40)**

### **Expected Behavior**
- [ ] Device starts sending every ~60 seconds
- [ ] New events appear at 18:33, 18:34, 18:35, etc.
- [ ] fPort changes from previous patterns

### **If Successful**
- [ ] 🎉 Document the success
- [ ] Take screenshots of Events tab
- [ ] Note exact timing of new intervals

### **If Unsuccessful**
- [ ] Wait until 19:32 for next 60-minute cycle
- [ ] Check queue is clear
- [ ] Consider sending 5-minute interval instead: `012C012C`

## ✅ **Step 3: Deploy Docusaurus Integration (After Success)**

### **Copy Files to Docusaurus Project**
```bash
# In your Docusaurus project:
cp docusaurus-embedded-configurator-tool/NanotagConfigurator.jsx src/components/
cp docusaurus-embedded-configurator-tool/NanotagConfigurator.module.css src/components/
```

### **Create Configuration Page**
```bash
# Use the example as a starting point:
cp docusaurus-embedded-configurator-tool/example-docusaurus-page.mdx docs/nanotag-config.mdx
```

### **Test Local Deployment**
```bash
npm run start
# Navigate to /docs/nanotag-config
# Verify tool loads and generates correct payloads
```

### **Update Device Status in Component**
- [ ] Update current device status in `NanotagConfigurator.jsx`
- [ ] Change "Next Expected Uplink" to current intervals
- [ ] Update success story in status section

## ✅ **Step 4: Test Next Configuration (5 Minutes)**

### **If 1-Minute Works Successfully**
- [ ] Generate 5-minute payload: `012C012C`
- [ ] Send via ChirpStack at next 1-minute window
- [ ] Verify device switches to 5-minute intervals
- [ ] Document the progression

## ✅ **Step 5: Create Success Documentation**

### **Document the Journey**
- [ ] Before/after comparison
- [ ] Timeline of discovery
- [ ] Wayback Machine reference
- [ ] Working payload examples

### **Update Tool Documentation**
- [ ] Add success screenshots
- [ ] Update current device status
- [ ] Add "verified working" badges
- [ ] Include battery life observations

## 🚨 **Troubleshooting Scenarios**

### **Scenario A: No Response at 18:32**
- Device may have received previous downlinks and changed schedule
- Check for any activity in Events tab
- Wait for next natural uplink window

### **Scenario B: Wrong Acknowledgement**
- Device acknowledges but with different values
- May indicate payload interpretation issues
- Document the actual response for analysis

### **Scenario C: No Configuration Change**
- Device acknowledges but continues old pattern
- May need to wait for next reporting cycle
- Consider sending shutdown/restart command

## 📊 **Success Metrics**

### **Primary Success**
- [ ] Device acknowledges `003C003C` payload
- [ ] Switches to 60-second reporting intervals
- [ ] Continues stable operation

### **Secondary Success**  
- [ ] Docusaurus tool deploys successfully
- [ ] Generates correct payloads in browser
- [ ] Documentation is complete and accurate

### **Full Success**
- [ ] Progressive interval testing (1min → 5min → 30min)
- [ ] All tools verified working
- [ ] Complete embedded documentation deployed

---

**⏰ Timer set for 18:32 - Ready to verify the corrected payload format! 🚀**