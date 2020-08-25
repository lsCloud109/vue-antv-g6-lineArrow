'use strict'
let buildtype = process.argv.slice(2)[0]
console.log('-----start build-----' )
console.log('---The production environment is ' + buildtype +"---")
let obj = {
  NODE_ENV: '"production"'
}
switch (buildtype) {
  case 'dev': //内网开发
    process.env.srconfig = 'dev'
    obj.srconfig = '"dev"'
    break;
  case 'pro': //生产
    process.env.srconfig = 'pro'
    obj.srconfig = '"pro"'
    break;
  case 'beta': //测试
    process.env.srconfig = 'beta'
    obj.srconfig = '"beta"'
    break;
  default: //默认
    process.env.srconfig = ''
    obj.srconfig = '""'
    break;
}

module.exports = obj;