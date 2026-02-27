import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const vehicle = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status)
     VALUES($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return vehicle;
};

const getAllVehicles = async () => {
  return pool.query(`SELECT * FROM vehicles ORDER BY id DESC`);
};

const getSingleVehicle = async (id: number) => {
  return pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
};

const updateVehicle = async (id: number, payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  return pool.query(
    `UPDATE vehicles
     SET vehicle_name=$1,type=$2,registration_number=$3,daily_rent_price=$4,availability_status=$5
     WHERE id=$6
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
};

const deleteVehicle = async (id: number) => {
  return pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};