import jwt from "jsonwebtoken";

const UserAuth = async (req, res, next) => {
   const {token} = req.cookies;

   if(!token){
       return res.status(401).json({success:false, message:"Unauthorized"});
   }

   try{
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

      if(tokenDecode){
        req.body.userId = tokenDecode.id;
      }
      else{
         return res.status(401).json({success:false, message:"Unauthorized"});
      }
      next();
   }
   catch(error){
      res.json({success:false, message:error.message});
   }
};

export default UserAuth;