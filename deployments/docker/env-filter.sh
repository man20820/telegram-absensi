#!/bin/bash

CONTAINER_PATH="/deployment/docker/container.sh"

# container
sed -i "s|{{ MONGO_URI }}|$MONGO_URI|g" $CONTAINER_PATH
sed -i "s|{{ TELEGRAM_BOT_TOKEN }}|$TELEGRAM_BOT_TOKEN|g" $CONTAINER_PATH
sed -i "s|{{ IMAGE_NAME }}|$IMAGE_NAME|g" $CONTAINER_PATH
sed -i "s|{{ IMAGE_NAME_RAW }}|$IMAGE_NAME_RAW|g" $CONTAINER_PATH
sed -i "s|{{ APP_NAME }}|$APP_NAME|g" $CONTAINER_PATH