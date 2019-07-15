#!/bin/sh

# Execute node-cron in background
node /home/ytrends/ytrends/cron/cron.js &

# execute nginx
nginx -g "daemon off;"