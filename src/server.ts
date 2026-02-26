import express from "express"
import config from "./config"
import initDB from "./config/db"
const app = express()
const port = config.port

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

initDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
