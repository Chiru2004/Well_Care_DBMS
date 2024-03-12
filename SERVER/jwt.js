import jwt  from 'jsonwebtoken';
const JWT_SECRET = 'your_jwt_secret_key';

 export const createTokens=(user)=>{
    const accessToken = jwt.sign({ email: user.Email, username: user.PatientName ,gender:user.GENDER, patient_id:user.idPatient}, JWT_SECRET,);
return accessToken;
};

export const validateToken=(req,res,next)=>{
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Token verified, send user info
        res.json({ user: decoded });
    });

}
