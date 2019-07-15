var CronJob = require('cron').CronJob
var exec = require('child_process').exec

new CronJob(
  '* * * * * *',
  function() {
    exec('echo "Hello from CronJob every minute"', (error, stdout, stderr) => {
      if (error) console.log(error)
      console.log(stdout)
      if (stderr && stderr.length > 0) console.log('STDERROR: ' + stderr)
    })
  },
  null,
  true,
  null
)

new CronJob(
  '* * * * * *',
  function() {
    exec('echo "Testing multiple cronjobs"', (error, stdout, stderr) => {
      if (error) console.log(error)
      console.log(stdout)
      if (stderr && stderr.length > 0) console.log('STDERROR: ' + stderr)
    })
  },
  null,
  true,
  null
)
