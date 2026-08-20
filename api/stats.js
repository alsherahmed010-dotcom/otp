export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const response = await fetch('https://numberpanel.tech/api/stats/detailed?period=daily');
        const data = await response.json();
        res.json(data);
    } catch(e) {
        res.json({success: false});
    }
}
