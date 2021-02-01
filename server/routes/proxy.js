var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.post("/post/*", function (req, res, next) {
  const path = req.url.replace('/post', '');
  const apiUrl = `https://search.torre.co${path}`;
  console.log('apiUrl', apiUrl);
  const body = req.body;
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("This is your data", data);
      res.send(data);
    });
});

module.exports = router;
