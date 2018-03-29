const router = require("express").Router();
const usersController = require('../../controllers/usersController');

// "/user"
router.route("/")
	.get(usersController.get)
	.post(usersController.add);

// "/user/photos"
router.route("/photos")
	.get(usersController.getPhotos)
	.post(usersController.addPhoto);

module.exports = router;