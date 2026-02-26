import { Pool } from "pg"
import config from "."

export const pool = new Pool({
    connectionString: `${config.connection_str}`,
    // ssl: { rejectUnauthorized: false }

})


const initDB = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS users
        (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        role TEXT CHECK(role IN('admin','customer'))
        )`
    );
    await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT,
        type TEXT CHECK(type IN('car','bike','van','SUV')),
        registration_number TEXT UNIQUE,
        daily_rent_price NUMERIC,
        availability_status TEXT CHECK(availability_status IN('available','booked'))
        )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id),
            vehicle_id INT REFERENCES vehicles(id),
            rent_start_date DATE,
            rent_end_date DATE,
            total_price NUMERIC,
            status TEXT CHECK(status IN('active','cancelled','returned'))
            )`)
}

export default initDB;