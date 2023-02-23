const express = require('express')
const app = express()

const axios = require('axios');

const balancer = (port = 8080, ips, loaderio) => {

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

  app.get(`/${loaderio}`, (req, res) => res.send(loaderio));

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

  app.post('/*', (req, res) => {
    axios.post(picker() + req.url, req.body)
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

module.exports = balancer