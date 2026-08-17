export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
    try {
        const { model, prompt, image } = req.body || {};
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-3.6-flash'}:generateContent?key=${API_KEY}`;
        const parts = [{ text: prompt || 'hello' }];
        if (image) parts.push({ inline_data: { mime_type: 'image/jpeg', data: image } });
        const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }] }) });
        const data = await resp.json();
        return res.status(200).json(data);
    } catch (e) { return res.status(500).json({ error: e.message }); }
}
