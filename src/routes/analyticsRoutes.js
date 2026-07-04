const express = require('express');
const AnalyticsEvent = require('../models/AnalyticsEvent');

const router = express.Router();

router.post('/events', async (req, res, next) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ message: 'events 必须是非空数组。' });
    }

    if (events.length > 100) {
      return res.status(400).json({ message: '单次最多提交 100 条事件。' });
    }

    const docs = events.map((event) => ({
      name: typeof event.name === 'string' && event.name.length > 0 && event.name.length <= 64
        ? event.name
        : 'unknown',
      payload: event.payload || {},
      occurredAt: event.at ? new Date(event.at) : new Date()
    }));

    await AnalyticsEvent.insertMany(docs);
    return res.status(201).json({ received: docs.length });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
