export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    const service = req.query.service || 'WhatsApp';
    
    try {
        const response = await fetch(`https://numberpanel.tech/api/countries?service=${service}`);
        const data = await response.json();
        res.json(data);
    } catch(e) {
        res.json({success: false, countries: []});
    }
}
