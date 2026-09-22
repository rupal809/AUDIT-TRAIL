export const stats = [
  {
    title: "Total Containers",
    value: "1,248",
    change: "+12.4%",
    icon: "📦",
  },
  {
    title: "In Transit",
    value: "842",
    change: "+8.7%",
    icon: "🚢",
  },
  {
    title: "Delivered",
    value: "356",
    change: "+15.3%",
    icon: "✓",
  },
  {
    title: "Active Alerts",
    value: "23",
    change: "+5",
    icon: "⚠",
  },
];

export const events = [
  {
    title: "Container arrived at Mumbai Port",
    id: "MSKU1234567",
    time: "10:30 AM",
    type: "success",
  },
  {
    title: "Temperature spike detected",
    id: "TCLU7654321",
    time: "09:15 AM",
    type: "warning",
  },
  {
    title: "Loaded on ship",
    id: "HLBU9876543",
    time: "07:45 AM",
    type: "info",
  },
  {
    title: "Container created",
    id: "CMAU1122334",
    time: "Yesterday",
    type: "danger",
  },
];

export const delayedContainers = [
  ["MSKU1234567", "2.4 days delay"],
  ["TCLU7654321", "1.8 days delay"],
  ["HLBU9876543", "1.2 days delay"],
  ["CMAU1122334", "0.9 days delay"],
];