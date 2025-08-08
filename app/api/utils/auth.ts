import jwt from "jsonwebtoken";

export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}
