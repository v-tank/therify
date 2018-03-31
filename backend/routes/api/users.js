const router = require("express").Router();
const usersController = require('../../controllers/usersController');

// "/user"
// router.route("/")
// 	.get(usersController.get)

// "/user/login"
router.route("/login")
	.post(usersController.login)

// "/user/photos"
router.route("/photos")
	.get(usersController.getPhotos);

module.exports = router;