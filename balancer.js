const express = require('express')
const app = express()

const axios = require('axios');

const balancer = (port = 8080, ...ips) => {

  //choose ips round-robin style
  let counter = 0;
  const picker = () => {
    let temp = ips[counter];
    counter++;
    if (counter >= ips.length) counter = 0;
    return temp;
  }


  app.use(express.json());
  app.get('/test-balancer-test', (req, res) => res.send('success'));

  app.get('/*', (req, res) => {
    console.log(req.headers)
    axios.get(picker() + req.url, {headers: req.headers})
    .then(resp => {
      res.send(resp.data)
    })
    .catch(err => {
      res.status(400).send(err)
    })
  })

  app.post('/*', (req, res) => {
    axios.post(picker() + req.url, req.body, {headers: req.headers})
    .then(resp => {
      res.send(resp.data)
    })
    .catch(err => {
      res.status(400).send(err)
    })
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

}

balancer(8010, 'http://localhost:8001', 'http://localhost:8002', 'http://localhost:8003')

module.exports = balancer