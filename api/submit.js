import items from '../data/items.json' assert { type: 'json' };

const submissions = new Map();
const pointsTable = [25,18,15,12,10,8,6,4,2,1];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { huntId, userId, userName, photo } = req.body;
  
  if (!huntId || !userId) {
    return res.status(400).json({error: 'Missing data'});
  }
  
  // Simulate verification (in production use Google Vision)
  const isValid = Math.random() > 0.1; // 90% pass rate for demo
  
  if (!isValid) {
    return res.status(200).json({success: false, reason: 'Foto tidak jelas, coba lagi'});
  }
  
  const key = huntId;
  if (!submissions.has(key)) submissions.set(key, []);
  
  const huntSubs = submissions.get(key);
  const position = huntSubs.length + 1;
  
  huntSubs.push({
    userId,
    userName,
    time: Date.now(),
    position
  });
  
  const pointsEarned = position <= 10 ? pointsTable[position-1] : 0;
  
  res.status(200).json({
    success: true,
    position,
    pointsEarned,
    message: position <= 10 ? `Kamu rank #${position}! +${pointsEarned} poin` : 'Terlambat, coba hunt berikutnya'
  });
}
