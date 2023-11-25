const Users=require("../models/userModel");
const brycpt=require("bcrypt");

module.exports.register= async (req,res,next)=>{
    try {
        const {username,password,email}=req.body;
        const usernamecheck=await Users.findOne({username});
        if(usernamecheck){
            return res.json({msg:"Username Alredy Used",status:false});
        }
        const emailcheck= await Users.findOne({email});
        if(emailcheck){
            return res.json({msg:"Email Alredy Used",status:false});
        }
        const hashedPassword = await brycpt.hash(password,10);
        const user= await Users.create({
            email,
            username,
            password:hashedPassword,
        });
        delete user.password
        return res.json({status:true,user});

    } catch (error) {
        next(error);
    }
};

module.exports.login= async (req,res,next)=>{
    try {
        const {username,password}=req.body;
        const usernamecheck=await Users.findOne({username});
        if(!usernamecheck){
            return res.json({msg:"Incorrect username or password",status:false});
        }
        const ispasswordvalid=await brycpt.compare(password,usernamecheck.password);
        if(!ispasswordvalid){
            return res.json({msg:"Incorrect username or password",status:false});
        }
        delete usernamecheck.password
        return res.json({status:true,usernamecheck});

    } catch (error) {
        next(error);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    const userId = req.params.id;
    const avtarImage = req.body.image;

    try {
      const userData = await Users.findByIdAndUpdate(
        userId,
        { $set: { avtarImage: avtarImage, isAvtarImageSet: true } },
        { new: true } // This option returns the modified document
      );
    
      if (userData) {
        // Do something if the update is successful
        res.status(200).json({ isSet: true, image: userData.avtarImage });
      } else {
        // Handle the case where the user is not found
        res.status(404).json({ isSet: false, error: "User not found" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error updating avatar:", error);
      res.status(500).json({ isSet: false, error: "Internal Server Error" });
    }
    
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "_id",
            "avtarImage",
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }

}
