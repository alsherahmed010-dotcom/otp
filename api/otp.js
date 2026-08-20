export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    const count = req.query.count || 50;
    
    try {
        const response = await fetch(`https://numberpanel.tech/api/otp?count=${count}`);
        const data = await response.json();
        res.json(data);
    } catch(e) {
        res.json([]);
    }
}
