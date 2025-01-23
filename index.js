const express = require('express');
const axios = require('axios');

const app = express();

const webhookUrl = 'https://discord.com/api/webhooks/1331275967028658317/AaL8EuVdhJCku3QrsI0RG4195--Q-LBM33KG_n-1uPp5RLEUPCGuYNdDAQmXzAkNe2PT';

app.get('/', async (req, res) => {
    const { json } = req.query;

    if (!json) {
        return res.status(400).send('Missing "json" query parameter.');
    }

    try {
        const embedPayload = JSON.parse(decodeURIComponent(json));

        await axios.post(webhookUrl, embedPayload);

        res.status(200).send('Payload sent to webhook successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request.');
    }
});

module.exports = app;
