var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");

router.post("/", function (req, res, next) {
  const apiUrl = "https://monkeylearn.com/word-cloud/api/extract/";
  const body = req.body;
  console.log("##############body", body);
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie:
        "csrftoken=LwLnTOn367TWl5cUJeQZgpvbzTzXdNOQy6dQ7qRWFJlmuVynZQQYDPEKBQOBMuyg",
      "X-CSRFTOKEN":
        "LwLnTOn367TWl5cUJeQZgpvbzTzXdNOQy6dQ7qRWFJlmuVynZQQYDPEKBQOBMuyg",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("This is your data", data);
      res.send(data);
    });
});

module.exports = router;
