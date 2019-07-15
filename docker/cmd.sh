#!/usr/bin/env ash

# Execute node-cron in background
node /home/ytrends/repo/cron/cron.js &

# execute nginx
nginx -g "daemon off;"