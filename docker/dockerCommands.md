**Docker**

Note: Original commits can be seen at this address: <https://github.com/note-repos/docker-notes/blob/main/docker.md>, moved to this repo for completeness

`docker run -it node` to interact with node.js
`docker ps` to see running container  
`docker ps -a` to see all container  

`docker run -p 3000:80 <imgId>` 3000 for hosting , 80 for EXPOSE.
> Running in the foreground.  
`docker run -p 3000:80 -d <imgId>` to run in background.

`docker stop <containerName>` containerName can be found with ps command

`--help` to see all available option.  

`docker start <existedContainer>` to restart in the background.
`docker start -a <existedContainer>` to restart container in attach mode.
`docker attach <backgroundContainerName>` to attach container that run in background.  

`docker logs <containerName>` to see passed logs.  
`docker logs -f <containerName>` to see passed logs and keep listening.  

`docker run -it <imageName>` input something and terminal exposed.  
`docker start -ai <containerName>`to restart with interactive mode.  

`docker rm <stoppedContainerName>` to remove container.  
`docker container prune` to remove all containers.  

`docker images` to see all images.  
`docker rmi <imgId>` to remove image.Before that all container must be removed including the stopped one.  
`docker image prune -a` to remove all images.  
`docker run ps -p -d --rm 3000:80 <imgName>` to remove the container after it stopped
`docker image inspect <imgName>` to learn information about image.  

`docker cp folder/. <runningContainerName>:/test` to copy folder inside container
`docker cp <containerName>:/test folder` to copy folder outside of the container.  

`docker run ps -p -d --rm 3000:80 --name testApp <imgName>` to give a name to the container.  

`docker builds -t testName:testTag .` to give a name and tag to the image.  

`docker push <imgName>` to share.  
`docker pull <imgName>` to copy.  
`docker tag <oldImgName>:<oldTagName> <newImgName>:<newTagName>` newTagName can be copied from docker hub. Old image stay.  
`docker login` to login docker hub.  

