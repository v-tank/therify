const router = require("express").Router();
const photosController = require('../../controllers/photosController');

// "/photos"
router.route("/")
	.post(photosController.add);

// "photos/:id"
router.route("/:id")
	.get(photosController.getWithComments)
	.delete(photosController.remove);

// "/photos/location"
router.route("/location")
	//post so that location data can be sent not in the URL
	.post(photosController.findByLocation);

// "photos/location/date"
router.route("/location/date")
	.post(photosController.findByLocationAndDate)

//THE NEXT TWO ARE WHY COMMENTS HAVE NO ROUTES OF THEIR OWN

// "/photos/comment/add/:id"
router.route("/comment/add/:id")
	.post(photosController.addComment);

// "/photos/comment/remove/:id"
router.route("/comment/remove/:id")
	.delete(photosController.removeComment);

module.exports = router;