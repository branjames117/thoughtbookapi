const router = require('express').Router();

// import all API routes from /api/index.js
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).json({ message: 'The resource you seek is not here.' });
});

module.exports = router;
