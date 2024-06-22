const express = require('express');
const router = express.Router();
const { createPin, getPins, getPin, updatePin, deletePin } = require('../controllers/pinController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/', [auth, upload.single('image')],createPin);
router.get('/', getPins);
router.get('/:id', getPin);
router.put('/:id', auth, updatePin);
router.delete('/:id', auth, deletePin);


module.exports = router;