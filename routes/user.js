const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares');

const {
  createUser,
  deleteUser,
  dataSeed,
  loginUser,
  updateUser,
  getUser,
  getUsers,
  createUserSubjectNote,
  updateUserSubjectNote,
  getStudentAverage,
} = require('../controllers/user');

const {
  isUniqueEmail,
  isValidUserId,
  isValidSubject,
  isValidSubjectId,
  isValidNote,
  isValidStudentId,
} = require('../helpers/db-validations');

const { validateJWT } = require('../middlewares/validate-jwt');
const { validateRole } = require('../middlewares/validate-role');

const router = Router();

router.get('/data-seed', dataSeed);
router.post(
  '/',
  [
    check('email', 'The email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields,
  ],
  loginUser
);

router.post(
  '/register',
  [
    check('name', 'The name is required').not().isEmpty(),
    check('role', 'Roles is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check('email').custom(isUniqueEmail),
    check('id','Id is required').isNumeric(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    validateJWT,
    validateRole('admin'),
    check('id', ' user id is required'),
    validateFields,
  ],
  updateUser
);

router.get('/', [validateJWT, validateRole('admin')], getUsers);
router.get(
  '/:id',
  [validateJWT, check('id', 'Id is required').isNumeric(), validateFields],
  getUser
);

router.delete(
  '/:id',
  [
    validateJWT,
    validateRole('admin'),
    check('id', 'The id is required').isNumeric(),
    validateFields,
  ],
  deleteUser
);

router.post(
  '/:userId/subject/:subjectId',
  [
    validateJWT,
    validateRole('admin'),
    check('userId', 'User ID is required').isNumeric(),
    check('userId').custom(isValidStudentId),
    check('subjectId', 'Subject ID is required').isNumeric(),
    check('subjectId').custom(isValidSubjectId),
    check('note', 'The note is required').isFloat(),
    check('note').custom(isValidNote),
    validateFields,
  ],
  createUserSubjectNote
);

router.put(
  '/:userId/subject/:subjectId',
  [
    validateJWT,
    validateRole('admin'),
    check('userId', 'User ID is required').isNumeric(),
    check('userId').custom(isValidStudentId),
    check('subjectId', 'Subject ID is required').isNumeric(),
    check('subjectId').custom(isValidSubjectId),
    check('note', 'The note is required').isFloat(),
    check('note').custom(isValidNote),
    validateFields,
  ],
  updateUserSubjectNote
);

router.get(
  '/student/average/:userId',
  [
    validateJWT,
    check('userId').isNumeric(),
    check('userId').custom(isValidStudentId),
    validateFields,
  ],
  getStudentAverage
);
module.exports = router;
