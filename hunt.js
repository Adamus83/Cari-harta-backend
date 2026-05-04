import items from '../data/items.json' assert { type: 'json' };

let currentHunt = null;
let startTime = null;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const now = Date.now();
  // Reset hunt every 15 minutes
  if (!currentHunt || !startTime || (now - startTime) > 15*60*1000) {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    currentHunt = {
      id: 'hunt_' + now,
      item: randomItem,
      startTime: now,
      endTime: now + 15*60*1000,
      submissions: []
    };
    startTime = now;
  }
  
  res.status(200).json({
    huntId: currentHunt.id,
    item: currentHunt.item,
    timeLeft: Math.max(0, currentHunt.endTime - now),
    participants: currentHunt.submissions.length
  });
}
