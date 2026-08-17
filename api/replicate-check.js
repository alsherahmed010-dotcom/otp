export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const REP = process.env.REPLICATE_API_KEY;
    if (!REP) return res.status(500).json({ error: 'not set' });
    const pid = req.query.id;
    const resp = await fetch('https://api.replicate.com/v1/predictions/' + pid, {
        headers: { 'Authorization': 'Bearer ' + REP }
    });
    const data = await resp.json();
    return res.status(200).json(data);
}
