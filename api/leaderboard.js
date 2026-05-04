
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Mock data - in production query database
  const mockLeaderboard = [
    { rank: 1, name: 'Budi', points: 15420, level: 18 },
    { rank: 2, name: 'Sari', points: 14200, level: 17 },
    { rank: 3, name: 'Agus', points: 12800, level: 16 },
    { rank: 4, name: 'Rina', points: 11500, level: 15 },
    { rank: 5, name: 'Kamu', points: 0, level: 1 },
  ];
  
  res.status(200).json({
    daily: mockLeaderboard,
    weekly: mockLeaderboard,
    prizePool: 2450000 // Rp 2.45jt
  });
}
