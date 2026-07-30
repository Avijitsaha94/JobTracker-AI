import { Request, Response } from "express";
import { signupSchema, loginSchema } from "../utils/validators";
import { createUser, loginUser, generateToken } from "../services/auth.service";

export async function signup(req: Request, res: Response) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues[0].message,
    });
  }

  const { name, email, password } = result.data;

  try {
    const user = await createUser(name, email, password);
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues[0].message,
    });
  }

  const { email, password } = result.data;

  try {
    const user = await loginUser(email, password);
    const token = generateToken(user.id);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}