const {addMessage,getMessages}=require("../controllers/messagescontrollers");

const router = require("express").Router();

router.post("/addmsg",addMessage);
router.post("/getmsg",getMessages);

module.exports = router;