const express = require('express');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

const analyticsLimiter = rateLimiter({ windowMs: 60 * 1000, max: 30 });

const MAX_PAYLOAD_SIZE = 4096;

router.post('/events', analyticsLimiter, async (req, res, next) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ message: 'events 必须是非空数组。' });
    }

    if (events.length > 100) {
      return res.status(400).json({ message: '单次最多提交 100 条事件。' });
    }

    const docs = [];
    for (const event of events) {
      const payload = event.payload && typeof event.payload === 'object' ? event.payload : {};
      const payloadJson = JSON.stringify(payload);
      if (payloadJson.length > MAX_PAYLOAD_SIZE) {
        return res.status(400).json({ message: `事件 payload 大小不能超过 ${MAX_PAYLOAD_SIZE} 字节。` });
      }

      let occurredAt;
      if (event.at) {
        const parsed = new Date(event.at);
        occurredAt = isNaN(parsed.getTime()) ? new Date() : parsed;
      } else {
        occurredAt = new Date();
      }

      docs.push({
        name: typeof event.name === 'string' && event.name.length > 0 && event.name.length <= 64
          ? event.name
          : 'unknown',
        payload,
        occurredAt
      });
    }

    await AnalyticsEvent.insertMany(docs);
    return res.status(201).json({ received: docs.length });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
