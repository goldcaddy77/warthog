## Docker

### Building custom Docker image

docker build _path-to-dockerfile_

docker build -t circleci/cci-demo-docker-primary:0.0.1 _path-to-dockerfile_

docker login

docker push circleci/cci-demo-docker-primary:0.0.1
