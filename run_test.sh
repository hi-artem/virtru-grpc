#!/usr/bin/env bash

SLEEP_INTERVAL=8

while :
do
	npm run client:js &
	npm run client:go &
	npm run client:ruby &
	sleep $SLEEP_INTERVAL
done
