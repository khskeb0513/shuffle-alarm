module.exports = {
  apps: [
    {
      name: "shuffle-alarm",
      script: "npm install && npm run start",
      exec_mode: "cluster"
    }
  ]
};
