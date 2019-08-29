FROM nginx:1.17.1-alpine
RUN apk update
RUN apk upgrade

RUN apk add --no-cache \
	nodejs-current \
	nodejs-npm \
	git 

WORKDIR /home/ytrends

ARG GITHUB

ARG CACHE

# RUN git clone https://${GITHUB}:x-oauth-basic@github.com/zebnat/videotrends-alternative.git repo \
# 	&& cd repo \
#	&& npm install
RUN git clone https://github.com/zebnat/videotrends-alternative.git repo \
 	&& cd repo \
	&& npm install

COPY .env repo/
COPY .env.production.local repo/
COPY .env.development.local repo/

RUN cd repo \
	# CAUTION the first time we run npm run videos we might deplete free API quota for that day
	# A node-cron executed from cmd.sh will run [npm run videos] every 24 hours without CACHE and every 5 hours with env defaults (using cache)
	&& npm run videos \ 
	&& npm run build \
	&& cp -rf build/ /app/

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.vh.default.conf /etc/nginx/conf.d/default.conf

COPY cmd.sh ./cmd.sh

RUN ["chmod", "+x", "cmd.sh"]

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ./cmd.sh