module.exports = {
  apps: [
    {
      name: "shuffle-alarm",
      instances: 1,
      script: "npm install && npm run start"
    }
  ]
};
