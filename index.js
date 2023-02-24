const express = require('express')
const app = express()

const axios = require('axios');

const balancer = (port = 8080, ips) => {

  //choose ips round-robin style
  let counter = 0;
  const picker = () => {
    let temp = ips[counter];
    counter++;
    if (counter >= ips.length) counter = 0;
    return temp;
  }

  app.get('/test-balancer-test', (req, res) => res.send('success'));

  app.get('/*', (req, res) => {
    axios.get(picker() + req.url)
    .then(resp => {
      res.send(resp.data)
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err)
    })
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

balancer(8100, ['http://18.223.109.211:3000', 'http://18.191.183.236:3000', 'http://18.220.82.38:3000']);

module.exports = balancer