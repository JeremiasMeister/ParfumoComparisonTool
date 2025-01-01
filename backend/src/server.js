const express = require('express');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const scraperRouter = require('./routes/scraper');

const app = express();

app.use(cors());
app.use(express.json());

const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ error: 'Too many requests' });
  }
});

app.use('/api', scraperRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});