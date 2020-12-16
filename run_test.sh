#!/usr/bin/env bash

while :
do
	npm run client:js &
	npm run client:go &
	npm run client:ruby &
	sleep 5
done
