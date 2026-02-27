import { Request, Response } from "express";
import { userService } from "./users.service";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(
      Number(req.params.userId),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(Number(req.params.userId));

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
};