const { Router } = require("express");
const router = Router();

const checkAuthentication = require("../middlewares/auth");
const { handleUserSignUp, handleUserSignIn, handleGetCurrentUser, handleLogoutUser } = require("../controllers/user-controller");



router.post('/signup', handleUserSignUp)

router.post('/signin', handleUserSignIn);

router.get("/me", checkAuthentication, handleGetCurrentUser)

router.get("/logout", checkAuthentication, handleLogoutUser)


module.exports = router;