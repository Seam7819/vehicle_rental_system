import express from "express"
import config from "./config"
import initDB from "./config/db"
import { authRoutes } from "./modules/auth/auth.routes"
import { userRoutes } from "./modules/users/users.routes"
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes"
import { bookingRoutes } from "./modules/bookings/bookings.routes"
const app = express()
const port = config.port

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/v1/auth", authRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/vehicles', vehicleRoutes);

app.use('/api/v1/bookings', bookingRoutes);

initDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
