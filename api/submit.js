import fs from 'fs';
import path from 'path';

const submissions = new Map();
const pointsTable = [25,18,15,12,10,8,6,4,2,1];
const HF_TOKEN = process.env.HF_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { huntId, userId, userName, imageData, itemName } = req.body;
  
  if (!imageData) {
    return res.status(400).json({success: false, reason: 'Foto wajib'});
  }
  
  // Kirim ke AI Hugging Face
  try {
    const aiRes = await fetch('https://api-inference.huggingface.co/models/google/vit-base-patch16-224', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: imageData })
    });
    
    const predictions = await aiRes.json();
    const topLabel = predictions[0]?.label?.toLowerCase() || '';
    const target = itemName.toLowerCase();
    
    // Cek kecocokan sederhana
    const isValid = topLabel.includes(target.split(' ')[0]) || 
                    target.includes(topLabel.split(',')[0]);
    
    if (!isValid) {
      return res.status(200).json({
        success: false, 
        reason: `AI deteksi: ${topLabel}. Cari ${itemName} yang benar!`
      });
    }
    
  } catch (e) {
    // Jika AI error, fallback ke random (biar game tetap jalan)
    console.log('AI error, fallback');
  }
  
  const key = huntId;
  if (!submissions.has(key)) submissions.set(key, []);
  
  const huntSubs = submissions.get(key);
  const position = huntSubs.length + 1;
  
  huntSubs.push({ userId, userName, time: Date.now(), position });
  
  const pointsEarned = position <= 10 ? pointsTable[position-1] : 0;
  
  res.status(200).json({
    success: true,
    position,
    pointsEarned,
    message: position <= 10 ? `VALID! Kamu rank #${position}! +${pointsEarned} poin` : 'Terlambat'
  });
}
