export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const REP = process.env.REPLICATE_API_KEY;
    if (!REP) return res.status(500).json({ error: 'REPLICATE_API_KEY not set' });
    
    const { prompt, image } = req.body || {};
    
    const inputObj = {
        prompt: prompt || 'a cute cat',
        resolution: '1 MP',
        aspect_ratio: '1:1',
        output_format: 'webp',
        safety_tolerance: 2
    };
    
    // لو فيه صورة - نضيفها
    if (image && image.length > 100) {
        // نتأكد إن الصورة بصيغة Data URI
        const imgData = image.startsWith('data:') ? image : 'data:image/jpeg;base64,' + image;
        inputObj.input_images = [imgData];
        console.log('📷 تم استلام صورة بحجم:', imgData.length);
    }
    
    console.log('طلب Replicate:', { prompt: inputObj.prompt, hasImage: !!inputObj.input_images });
    
    const resp = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + REP, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            version: 'black-forest-labs/flux-2-pro',
            input: inputObj
        })
    });
    const data = await resp.json();
    return res.status(200).json(data);
}
