# ThreatPulse — Threat Intelligence Platform

> Aggregated Cyber Threat Intelligence & IOC Management System

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue) ![React](https://img.shields.io/badge/React-18+-61DAFB) ![License](https://img.shields.io/badge/License-MIT-green)

## Overview

ThreatPulse is a threat intelligence aggregation platform that collects, correlates, and visualizes IOCs (Indicators of Compromise) from multiple threat feeds. Built for SOC analysts and threat hunters who need a centralized view of the threat landscape.

## Features

- 🌍 **Multi-Feed Aggregation** — OTX, MISP, AbuseIPDB, VirusTotal
- 🔗 **IOC Correlation** — Link IPs, domains, hashes, and threat actors
- 🗺️ **Threat Map** — Real-time global attack visualization
- 🏷️ **TTP Mapping** — MITRE ATT&CK framework alignment
- 🔔 **Alerting** — Notify when known IOCs appear in your environment
- 📤 **Export** — STIX/TAXII, JSON, CSV formats

## Installation

```bash
git clone https://github.com/plplgyt465-sys/guard-bot-engine-e4282484
cd ThreatPulse
npm install
npm run dev
```

## Supported Threat Feeds

| Feed | Type |
|------|------|
| AlienVault OTX | IP, Domain, Hash |
| AbuseIPDB | Malicious IPs |
| VirusTotal | File & URL reputation |
| MISP | Community IOCs |

## Disclaimer

> For authorized security operations and research only.

## Author

**Shadow Core** — Threat Intelligence Analyst | SOC Specialist