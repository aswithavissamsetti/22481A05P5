import Url from '../models/Url.js';
import shortid from 'shortid';

export const shortenUrls = async (req, res, next) => {
  try {
    const urls = req.body.urls;
    const userId = req.user.id;

    if (urls.length > 5) return res.status(400).json({ error: 'Max 5 URLs at once.' });

    const results = await Promise.all(
      urls.map(async ({ originalUrl, preferredCode, expiresIn }) => {
        const shortCode = preferredCode || shortid.generate();

        const exists = await Url.findOne({ shortCode });
        if (exists) throw new Error(`Shortcode '${shortCode}' already exists.`);

        const url = new Url({
          originalUrl,
          shortCode,
          userId,
          expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined
        });

        await url.save();
        return url;
      })
    );

    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const redirectUrl = async (req, res) => {
  const { code } = req.params;
  const url = await Url.findOne({ shortCode: code });
  if (!url || (url.expiresAt && url.expiresAt < Date.now())) return res.status(404).send('Not found');

  url.clickStats.push({
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'direct',
    ip: req.ip,
    location: 'Geo-Lookup-Pending'
  });
  await url.save();
  res.redirect(url.originalUrl);
};

export const getStats = async (req, res) => {
  const urls = await Url.find({ userId: req.user.id });
  res.json(urls);
};