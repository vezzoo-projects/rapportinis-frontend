#!/bin/bash

set -x

envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf