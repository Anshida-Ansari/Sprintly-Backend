import jwt from 'jsonwebtoken';


const ACCESS_TOKEN_SECERET = process.env.ACCESS_TOKEN_SECERET || "access_seceret"
const REFRESH_TOKEN_SECERET = process.env.REFRESH_TOKEN_SECERET || "refresh_seceret"


 
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECERET,{expiresIn:"15m"})
}

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECERET,{expiresIn:"7d"})
}



export const verifyToken = (token: string,type: 'access' | 'refresh')=>{
    try {
        const seceret = type === "access" ? ACCESS_TOKEN_SECERET : REFRESH_TOKEN_SECERET
        return jwt.verify(token,seceret)

    } catch (err) {

        let error = err as Error

      if(error.name === 'TokenExpiredError'){
        console.log('Token is Expired');    
      }else{
        console.log('Token is invalid',error.message);
        
      }

    }
}