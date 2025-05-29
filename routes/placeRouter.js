const Router = require('express')
const placeController = require('../controllers/placeController')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, checkRole('ADMIN'), placeController.create)
router.get('/', placeController.getAll)
router.get('/:id', placeController.getOne)
router.put('/:id', authMiddleware, checkRole('ADMIN'), placeController.update)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), placeController.delete)

module.exports = router