import { Router } from "express";

const router = Router();

router.post("/user", (req, res) => {
  const { name, email } = req.body;
  res.json({
    message: "User created kkkklj",
    name,
    email,
  });
});

export default router;
