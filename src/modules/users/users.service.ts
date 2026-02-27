import { pool } from "../../config/db";

const getAllUsers = async () => {
  const users = await pool.query(
    `SELECT id,name,email,phone,role FROM users ORDER BY id DESC`
  );
  return users;
};

const updateUser = async (id: number, payload: any) => {
  const { name, email, phone, role } = payload;

  const user = await pool.query(
    `UPDATE users
     SET name=$1, email=$2, phone=$3, role=$4
     WHERE id=$5
     RETURNING id,name,email,phone,role`,
    [name, email, phone, role, id]
  );

  return user;
};

const deleteUser = async (id: number) => {
  return pool.query(`DELETE FROM users WHERE id=$1`, [id]);
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};