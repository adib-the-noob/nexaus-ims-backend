import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err, "err");
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
