const express = require('express');
const cors = require('cors')


const app = express();
//midle ware
app.use(cors())
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/data', (req, res) =>{
    res.send('more caoem')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

