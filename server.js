const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const GEMINI_KEY = "AIzaSyCRLf-KQ7nG5CPfIAy6nPSd3uwGSaR4tcc";
const AGNES_KEY = "Sk-eV8aSN0NWxNYGnTdvws5nIGAcMWvUk0G2i0u5MdGIdyl2H1Q";

// 1. إصلاح مسار Gemini مع دعم الذاكرة والملفات
app.post('/api/chat', async (req, res) => {
    try {
        const { history } = req.body;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: history })
        });
        
        const data = await response.json();
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'خطأ في الاتصال بالسيرفر' });
    }
});

// 2. نموذج Agnes للصور
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, image, model } = req.body;
        const selectedModel = model || "agnes-image-2.1-flash";
        
        const bodyData = {
            model: selectedModel,
            prompt: prompt,
            size: "1K",
            ratio: "1:1",
            extra_body: { response_format: "url" }
        };

        if (image) bodyData.extra_body.image = [image];

        const response = await fetch('https://apihub.agnes-ai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AGNES_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'خطأ أثناء إنشاء الصورة' });
    }
});

// 3. نموذج Agnes للفيديو
app.post('/api/generate-video', async (req, res) => {
    try {
        const { prompt, image, model } = req.body;
        const selectedModel = model || "agnes-video-v2.0";

        const bodyData = {
            model: selectedModel,
            prompt: prompt,
            height: 768,
            width: 1152,
            num_frames: 121,
            frame_rate: 24
        };

        if (image) bodyData.image = image;

        const response = await fetch('https://apihub.agnes-ai.com/v1/videos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AGNES_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'خطأ أثناء بدء الفيديو' });
    }
});

// 4. استعلام الفيديو
app.get('/api/video-status/:id', async (req, res) => {
    try {
        const response = await fetch(`https://apihub.agnes-ai.com/agnesapi?video_id=${req.params.id}`, {
            headers: { 'Authorization': `Bearer ${AGNES_KEY}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'خطأ جلب فيديو' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
