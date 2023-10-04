const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subject');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateRole } = require('../middlewares/validate-role');

const router = Router();

router.post(
  '/',
  [
    validateJWT,
    validateRole('admin'),
    check('name', 'The name is required').not().isEmpty(),
    validateFields,
  ],
  createSubject
);

router.get('/', [validateJWT,validateRole('student')], getSubjects);
router.get('/:id', [validateJWT,validateRole('student')], getSubject);

router.put(
  '/:id',
  [
    validateJWT,
    validateRole('admin'),
    check('id', 'Subject id is required').isNumeric(),
    validateFields,
  ],
  updateSubject
);
router.delete(
  '/:id',
  [
    validateJWT,
    validateRole('admin'),
    check('id', 'Subject id is required').isNumeric(),
    validateFields,
  ],
  deleteSubject
);

module.exports = router;
