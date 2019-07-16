var CronJob = require('cron').CronJob
var exec = require('child_process').exec

new CronJob(
  '0 0 */24 * * *',
  function() {
    exec(
      'cd /home/ytrends/repo/ && CACHE=NO npm run videos && cp /home/ytrends/repo/public/data/*.json /app/data/',
      (error, stdout, stderr) => {
        if (error) {
          console.log(error)
        }
        console.log(stdout)
        if (stderr && stderr.length > 0) console.log('STDERROR: ' + stderr)
      }
    )
  },
  null,
  true,
  null
)

new CronJob(
  '0 0 */5 * * *',
  function() {
    exec(
      'cd /home/ytrends/repo/ && npm run videos && cp /home/ytrends/repo/public/data/*.json /app/data/',
      (error, stdout, stderr) => {
        if (error) {
          console.log(error)
        }
        console.log(stdout)
        if (stderr && stderr.length > 0) console.log('STDERROR: ' + stderr)
      }
    )
  },
  null,
  true,
  null
)
