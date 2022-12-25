docker rm -f {{ APP_NAME }}
docker rmi $(docker images | grep '{{ IMAGE_NAME_RAW }}')
docker run -d --name {{ APP_NAME }} \
    -e MONGO_URI="{{ MONGO_URI }}" \
    -e TELEGRAM_BOT_TOKEN="{{ TELEGRAM_BOT_TOKEN }}" \
    --restart always \
    {{ IMAGE_NAME }}