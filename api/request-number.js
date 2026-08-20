export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const { service, country } = req.body;
    
    try {
        const response = await fetch('https://numberpanel.tech/api/request_number', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer np_live_6DknI4df2uZ0_BFv6CGGpX_BCBAq60TG1sKev64WPkw',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({service, country})
        });
        const data = await response.json();
        res.json(data);
    } catch(e) {
        res.json({success: false});
    }
}
