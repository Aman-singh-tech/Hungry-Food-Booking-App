import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authMiddleware: authHeader exists:", !!authHeader, "value starts with:", authHeader ? authHeader.substring(0, 15) : "undefined");
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  console.log("authMiddleware: extracted token exists:", !!token, "value starts with:", token ? token.substring(0, 10) : "undefined");

  if (!token) {
    console.log("authMiddleware: missing token, returning 401");
    return res.status(401).json({ success: false, message: "Not Authorized: missing token" });
  }

  // If JWT_SECRET is missing, ALL tokens will fail verification.
  console.log("authMiddleware: JWT_SECRET exists in env:", !!process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) {
    console.log('JWT_SECRET is not set');
    return res.status(401).json({ success: false, message: "Server misconfigured: JWT secret missing" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("authMiddleware: token verified successfully, decoded id:", token_decode.id);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("JWT_VERIFY_ERROR:", error.message);
    console.log("authMiddleware: token verify failed. JWT_SECRET ends with:", process.env.JWT_SECRET ? process.env.JWT_SECRET.slice(-5) : "undefined");
    return res.status(401).json({ success: false, message: "Not Authorized: invalid token" });
  }
};
    

export default authMiddleware;
