import { pool } from "../../config/db";

const dayDiff = (start: string, end: string) =>
  Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24)
  );

const createBooking = async (user: any, payload: any) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const vehicleRes = await client.query(
      `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
      [payload.vehicle_id]
    );

    if (!vehicleRes.rows.length) {
      throw new Error("Vehicle not available");
    }

    const vehicle = vehicleRes.rows[0];

    const days = dayDiff(
      payload.rent_start_date,
      payload.rent_end_date
    );

    if (days <= 0) throw new Error("Invalid booking date");

    const totalPrice = days * Number(vehicle.daily_rent_price);

    const booking = await client.query(
      `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
       VALUES($1,$2,$3,$4,$5,'active')
       RETURNING *`,
      [
        user.id,
        payload.vehicle_id,
        payload.rent_start_date,
        payload.rent_end_date,
        totalPrice,
      ]
    );

    await client.query(
      `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
      [payload.vehicle_id]
    );

    await client.query("COMMIT");

    return booking;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getAllBookings = async (user: any) => {
  if (user.role === "admin") {
    return pool.query(
      `SELECT b.*,u.name as customer_name,u.email,v.vehicle_name,v.registration_number
       FROM bookings b
       JOIN users u ON u.id=b.customer_id
       JOIN vehicles v ON v.id=b.vehicle_id
       ORDER BY b.id DESC`
    );
  }

  return pool.query(
    `SELECT b.*,v.vehicle_name,v.registration_number,v.type
     FROM bookings b
     JOIN vehicles v ON v.id=b.vehicle_id
     WHERE customer_id=$1
     ORDER BY b.id DESC`,
    [user.id]
  );
};

const updateBookingStatus = async (
  bookingId: number,
  user: any,
  status: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingRes = await client.query(
      `SELECT * FROM bookings WHERE id=$1`,
      [bookingId]
    );

    if (!bookingRes.rows.length) throw new Error("Booking not found");

    const booking = bookingRes.rows[0];

    if (user.role === "customer" && booking.customer_id !== user.id) {
      throw new Error("Forbidden access");
    }

    if (status === "cancelled") {
      if (new Date() >= new Date(booking.rent_start_date)) {
        throw new Error("Booking already started");
      }
    }

    await client.query(
      `UPDATE bookings SET status=$1 WHERE id=$2`,
      [status, bookingId]
    );

    await client.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};