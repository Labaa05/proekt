import express from "express"
import {register} from "./user.js"
const app = express()
const port = 3000
app.use(express.static('public'))
app.use("/signin",(req,res) =>{
   const result = register(req.query)
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
