# Introduction

Upload your own image and place it into itemframe-map in minecraft server!

Made with `node.js`, `typescript`, `express`, `bootstrap`, `html`

![main.png](./screenshots/main.png)

<br><br>

# Getting Started

Make sure docker is installed. otherwise, you can launch the server with [node.js](https://nodejs.org).

<br>

1. Download `docker-compose.yml`.

```sh
curl -o docker-compose.yml https://raw.githubusercontent.com/solo5star/minecraft-imagemap-gallery/main/docker-compose.yml
```

<br>

2. Edit `docker-compose.yml` to change directory where images will be saved.

```yml
version: '3'
services:
    minecraft-imagemap-gallery:
        container_name: minecraft-imagemap-gallery
        image: solo5star/minecraft-imagemap-gallery
        restart: unless-stopped
        ports:
            # Edit here to change port
            - 3111:3111
        volumes:
            # Edit here to change image directory
            - /myspigot/plugins/ImageMap/images:/images
        environment:
            - IMAGE_DIRECTORY=/images
```

<br>

3. Launch with docker command.

```sh
docker-compose up -d
```
