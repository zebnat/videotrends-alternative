var CronJob = require('cron').CronJob
var exec = require('child_process').exec

// runs at second 0 minute 0 hour 12
const apiFetchingJob = () => {
  new CronJob(
    '0 0 12 * * *',
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
}

// delays 24 hours then setup a cron
//
// considerations: if you deploy at 13 hour, you will have to delay 24h, then wait until the next 12 hour
setTimeout(apiFetchingJob, 24 * 60 * 60 * 1000)

// run every second 0, minute 0, every 4th hour step
new CronJob(
  '0 0 */4 * * *',
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
