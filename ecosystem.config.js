module.exports = {
  apps : [{
    name: "express-ts",
    script: "dist/app.js",
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: "one two",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    exec_mode:"fork",
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }],
  deploy : {
    production : {
      user : "root",
      host : "xxx.xxx.xxx.xxx",// 线上服务器ip 这个要自行修改设置
      ref  : "origin/master",//origin
      repo : "git@github.com:xiwang007/express-ts.git",// 这个要自行修改设置
      path : "/home/code/express-ts",// 这个要自行修改设置
      "post-deploy" : "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
}

// pm2 deploy ecosystem.config.js production setup