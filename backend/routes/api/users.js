const router = require("express").Router();
const usersController = require('../../controllers/usersController');

// "/user"
router.route("/")
	.post(usersController.add);

// "/user/photos"
router.route("/photos")
	.get(usersController.getPhotos)
	.post(usersController.addPhoto);

module.exports = router;