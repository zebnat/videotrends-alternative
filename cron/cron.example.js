var CronJob = require('cron').CronJob
var exec = require('child_process').exec

new CronJob(
  '1 * * * * *',
  function() {
    exec('echo "Hello from CronJob"', (error, stdout, stderr) => {
      if (error) console.log(error)
    })
  },
  null,
  true,
  null
)
