import { pool } from "../../config/db"
import bcrypt from "bcryptjs"

const signUp = async (payload: Record<string,unknown>)=>{
    const {name,email,password,phone,role} = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);
    const user = await pool.query(`INSERT INTO users(name,email,password,phone,role)
     VALUES($1,$2,$3,$4,$5) RETURNING name,email,password,phone,role`,[name,email,hashedPass,phone,role]);
     console.log(user.rows[0]);
    return user;
}

export const authService = {
    signUp
}