Server - deployed using fly sprite + peerjs docker

setup:

* create the sprite: `sprite create` and console in
* install docker inside as a service
* docker run -p 8080:9000 -d peerjs/peerjs-server
* exit sprite
* serve publicly: `sprite url update --auth public`
