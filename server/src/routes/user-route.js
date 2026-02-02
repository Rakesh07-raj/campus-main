const { Router } = require("express");
const router = Router();

const handleCheckAuthentication = require("../middlewares/auth");
const { handleUserSignUp, handleUserSignIn, handleGetCurrentUser, handleLogoutUser } = require("../controllers/user-controller");



router.post('/signup', handleUserSignUp)

router.post('/signin', handleUserSignIn);

router.get("/me", handleCheckAuthentication, handleGetCurrentUser)

router.get("/logout", handleCheckAuthentication, handleLogoutUser)


module.exports = router;