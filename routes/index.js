const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const placeRouter = require('./placeRouter');
const typeRouter = require('./typeRouter');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/place', placeRouter);

module.exports = router;