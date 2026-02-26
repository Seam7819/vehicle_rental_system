import { pool } from "../../config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../config";

const signUp = async (payload: Record<string,unknown>)=>{
    const {name,email,password,phone,role} = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);
    const user = await pool.query(`INSERT INTO users(name,email,password,phone,role)
     VALUES($1,$2,$3,$4,$5) RETURNING name,email,password,phone,role`,[name,email,hashedPass,phone,role]);
    //  console.log(user.rows[0]);
    return user;
}

const signIn = async (email:string, password:string)=>{

    const user = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
     console.log(user.rows[0]);
     if(user.rows.length === 0){
        throw new Error('invalid credential');
    }

    const matchedPass = await bcrypt.compare(password, user.rows[0].password)
    if(!matchedPass){
        throw new Error('invalid password');
    }
    const JwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email : user.rows[0].email,
        role : user.rows[0].role
    }

    const secret = config.jwt_secret
    const token = jwt.sign(JwtPayload,secret as string, {expiresIn: "7d"});

    
    // console.log({token,user});
    delete (user.rows[0].password);

    return {user: user.rows[0],token};
}

export const authService = {
    signUp,
    signIn
}