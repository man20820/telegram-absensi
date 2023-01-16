docker rm -f {{ APP_NAME }}
docker rmi $(docker images | grep '{{ IMAGE_NAME_RAW }}')
docker run -d --name {{ APP_NAME }} \
    -e MONGO_URI="{{ MONGO_URI }}" \
    -e TELEGRAM_BOT_TOKEN="{{ TELEGRAM_BOT_TOKEN }}" \
    -e TELEGRAM_REPORT_CHAT_ID="{{ TELEGRAM_REPORT_CHAT_ID }}" \
    -e STICKERSET_TITLE="{{ STICKERSET_TITLE }}" \
    -e STICKERSET_OWNER_ID="{{ STICKERSET_OWNER_ID }}" \
    -e STICKERSET_DEFAULT_IMAGE="{{ STICKERSET_DEFAULT_IMAGE }}" \
    --restart always \
    {{ IMAGE_NAME }}