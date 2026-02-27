import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(
      req.user,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings(req.user);

    res.status(200).json({
      success: true,
      message:
        req.user?.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    await bookingService.updateBookingStatus(
      Number(req.params.bookingId),
      req.user,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};