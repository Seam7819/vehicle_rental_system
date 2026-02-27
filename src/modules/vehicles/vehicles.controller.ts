import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();

    res.status(200).json({
      success: true,
      message: vehicles.rows.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data: vehicles.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getSingleVehicle(
      Number(req.params.vehicleId)
    );

    if (!vehicle.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      Number(req.params.vehicleId),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await vehicleService.deleteVehicle(Number(req.params.vehicleId));

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};