const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// مفاتيح الـ API المحمية داخل السيرفر (مخفية عن العميل)
const GEMINI_KEY = "AIzaSyCRLf-KQ7nG5CPfIAy6nPSd3uwGSaR4tcc";
const AGNES_KEY = "Sk-eV8aSN0NWxNYGnTdvws5nIGAcMWvUk0G2i0u5MdGIdyl2H1Q";

// 1. مسار المحادثة والتحليل عبر Gemini (مع دعم الذاكرة)
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
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'خطأ في الاتصال بالذكاء الاصطناعي' });
    }
});

// 2. مسار توليد وتعديل الصور عبر Agnes Image 2.1 Flash
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, image } = req.body;
        const bodyData = {
            model: "agnes-image-2.1-flash",
            prompt: prompt,
            size: "1K",
            ratio: "1:1",
            extra_body: { response_format: "url" }
        };

        if (image) {
            bodyData.extra_body.image = [image];
        }

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

// 3. مسار إنشاء الفيديو عبر Agnes Video V2.0
app.post('/api/generate-video', async (req, res) => {
    try {
        const { prompt, image } = req.body;
        const bodyData = {
            model: "agnes-video-v2.0",
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
        res.status(500).json({ error: 'خطأ أثناء بدء مهمة الفيديو' });
    }
});

// 4. استعلام عن حالة الفيديو
app.get('/api/video-status/:id', async (req, res) => {
    try {
        const response = await fetch(`https://apihub.agnes-ai.com/agnesapi?video_id=${req.params.id}`, {
            headers: { 'Authorization': `Bearer ${AGNES_KEY}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'خطأ في جلب حالة الفيديو' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
