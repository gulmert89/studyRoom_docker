# 1. Course: `Docker and Kubernetes The Complete Guide`
## 1.1. Dive Into Docker!
### 1.1.1. What is Docker?
* Docker makes it really easy to install and run software without worrying about setup or dependencies.
* Docker Ecosysystem:
    * Docker Client
    * Docker Hub
    * Docker Machine
    * Docker Image
    * Docker Server
    * Docker Compose
* Docker gets the images from Docker Hub.
* Docker image is a single file with all the dependencies and configurations required to run a program.
* Docker container is an instance of an image. It runs a program. There could be multiple containers linked to one image. It is a program with its own isolated set of hardware resources (memory, networking, hdd vs.).
* Docker installation has "**Docker CLI**" & "**Docker Server/Daemon**"
* Output of `docker run hello-world`:
    ```
    Hello from Docker!
    This message shows that your installation appears to be working correctly.

    To generate this message, Docker took the following steps:
    1. The Docker client contacted the Docker daemon.
    2. The Docker daemon pulled the "hello-world" image from the Docker Hub. (amd64)
    3. The Docker daemon created a new container from that image which runs the executable that produces the output you are currently reading.
    4. The Docker daemon streamed that output to the Docker client, which sent it to your terminal.
    ```
### 1.1.2. What's a Container?
* **Namespacing**: let's say program A runs in Py2, while program B in Py3. With namespacing, we can redirect these A & B which sends system call to kernel in the hard drive where we installed Py2 and Py3 to different partitions/segments. _(i.e. namespacing: isolating resources per process or group of processes)_
* **Control groups (cgroups)**: limit amount of resources used per process
* Namespacing & cgroups belong to Linux only! We can run Docker in our MacOS or Windows too because they are running a Linux Virtual Machine to create a Linux kernel. Run `docker version` on Windows and the terminal will tell you that Docker is running on `OS/Arch: linux/amd64`.
* **Container**: A process or set of processes that have a grouping of resources specifically assigned to it. i.e. Portion of hard drive, network, ram, cpu etc. made available to a process.
* **Image**: Snapshot of the file system along with very specific startup commands. _(i.e. FS Snapshot + Startup command)_
## 1.2. Manipulating Containers with The Docker Client
### 1.2.1. Docker Run in Detail
* `docker run <image name>`
    * `docker`: Reference the Docker Client
    * `run`: Try to create and run a container
    * `<image name>`: name of image to use for this container
### 1.2.2. Overriding Default Commands
* `docker run <image name> some_command`
    * `some_command` overrides the default command!
* `docker run busybox ls`
    * Lists the default folders in _busybox_ such as bin, dev, etc, home, proc, root. However, for the _hello-world_ image, `ls` command throws error since `ls` command doesn't exist in its file system image.
### 1.2.3. Listing Running Containers
* `docker ps`
    * Lists all the running containers.
* `docker ps --all`
    * Lists all the containers we have ever created.
### 1.2.4. Restarting Stopped Container
* docker run = docker create + docker start
* `docker run`
    * Used for creating and running a container from an image.
* `docker start -a abcd1234`
    * **-a** attaches to the container and watch for output coming from it and show it on my terminal!
* By default, `docker run` will show all the logs etc. but `docker start` won't show you what is coming from the container.
* If you run a container via `docker start -a abcd1234`, it will run ***the container's*** default command! For example, the _busybox_ image comes with a default command `sh` but let's say we overrode it with `echo hi there` and created a container out of it. When we initiate that container again, it runs `echo hi there` and we cannot put extra command to it like `docker start -a abcd1234 echo hello world`. It throws an error.
### 1.2.5. Removing Stopped Containers
* Output of `docker container prune` (Delete all stopped containers):
    > WARNING! This will remove all stopped containers. <br>Are you sure you want to continue? [y/N]

* Output of `docker system prune` (Delete all stopped containers):
    > WARNING! This will remove:
    > <br> \- all stopped containers
    > <br> \- all networks not used by at least one container
    > <br> \- all dangling images
    > <br> \- all dangling build cache
    > <br> Are you sure you want to continue? [y/N]
### 1.2.6. Retrieving Log Outputs
* `docker logs <container id>`
    * It's not _restarting_ or _rerunning_ the container, but gets the log of that initiated container.
### 1.2.7. Stopping Containers
* `docker stop <container id>`
    * Sends `SIGTERM` -terminate signal- message. It gives the process a bit of time to clean up, ends the job or prints a message etc. 10 secs later, it kills the process anyway!
* `docker kill <container id>`
    * Sends `SIGKILL` -kill signal- message. Immediately shuts down the process, no grace period.
### 1.2.8. Multi-Command Containers
* Without docker,
    * we start `redis-server` (and in-memory, it is ready to store data now with this command),
    * then open a `redis-cli` to issue commands to the redis server.
* When we run `docker run redis`, we can't run `redis-cli` in another terminal because it runs inside the container! We need to get inside this container to enter this command!
### 1.2.9. Executing Commands in Running Containers
* `docker exec -it <container id> <command>`
    * Execute an additional command in a container (Check ``help`` file for the flags.)
* `docker exec -it 2e532f124ba8 redis-cli`
### 1.2.10. The Purpose of the IT (-i -t) Flag
* When you are running Docker on your machine, every single container you are running is running inside of a VM running Linux.
* Every process we create in a running Linux env has 3 communication channels attached to it:
    1. **STDIN**: Stuff you type
    2. & 3. **STDOUT & STDERR**: Stuff that shows up on the screen
* `-i, --interactive`: Attaches to our terminal's STDIN.
* `-t, --tty`: Basically, prettifies/formats and shows up the output on our screen (actually, it does a bit more than that. "Allocates a pseudo-TTY [terminal]" as stated in help file).
### 1.2.11. Getting a Command Prompt in a Container
* We'll open up a shell and not use `docker exec` over and over again.
* `docker exec -it 2e532f124ba8 sh`: Opens up a shell. Then comes:<br>
`# echo "hi there"`<br>
`# export b=5`<br>
`# echo $b` --> _Outputs_ `5`<br>
`# redis-cli`<br>
`# apt list` and then `exit` or **Ctrl+D** and so on...<br>
* What is `sh`? Well, _bash_, _powershell_, _zsh_, _sh_ are command processors/shell.
### 1.2.12. Starting with a Shell
* `docker run -it busybox sh`
    * Directly starts with a shell, but most probably you are not be running any another process. So, it's more common to start your container and then later attach to it by running `docker exec` command.
### 1.2.13. Container Isolation
* Between two containers, they don't automatically share their file systems.
* For example, open two different terminals and run the same command: `docker run -it busybox sh`. Create a file in one of them and type `ls` in the other one. Yep, it's not there. They use two different, isolated FS. They have two distinct **CONTAINER ID** anyway.
## 1.3. Building Custom Images Through Docker Server
### 1.3.1. Creating Docker Images
* ``Dockerfile``: Configuration to define how our container should behave
* ``Dockerfile`` --> ``Docker Client (cli)`` --> ``Docker Server`` (Take the dockerfile and builds a usable img) --> ``Usable Image``
* Dockerfile flow:
    1. Specify a base img (`FROM` command)
    2. Run some commands to install programs (`RUN` command)
    3. Specify a startup command (`CMD` command)
### 1.3.2. Building a Dockerfile
* **Note**: Students who have the most recent versions of Docker will now have ``Buildkit`` enabled by default. If so, you will notice a slightly different output in your terminal when building from a Dockerfile.
    * To see the legacy outputs/logs, type: `docker build --no-cache --progress=plain .`
    * To match the course output, you can disable `Buildkit`.
        1. Click the Docker Icon in the system tray (Windows) or menu bar (macOS)
        2. Select **Settings**
        3. Select **Docker Engine**
        4. Change ``buildkit`` from ``true`` to ``false``. And apply & restart.
```js
{
    ...
    "features": {
        "buildkit": false
        },
    "experimental": false
    ...
}
```
* _Mert: I won't disable it. I liked the `buildkit` output more._
* `docker build .`
    * This uses the Dockerfile in that folder.
### 1.3.3. Dockerfile Teardown
* `FROM`: Specifies the docker image we want to use as a base
* `RUN`: Used to execute some command.
* `CMD`: Specifies what should be executed when our image starts up a brand new container.
* So, overall the structure is like that: `INSTRUCTION argument`
    * e.g. `FROM alpine`, `CMD ["redis-server"]`, `RUN apk add --update redis`
### 1.3.4. What's a Base Image?
* Base image, like `alpine` contains useful set of programs. It's like an OS.
### 1.3.5. The Build Process in Detail
* The `.` in `docker build .` is the **build context**. It's the set of files and folders that belong to our project which we want to encapsulate or wrap in the container.
* Every command in the Dockerfile can be observed as `STEP 1/3: FROM alpine` etc.
* After the first line of code (e.g. `FROM alpine`), following commands create an intermediate container (e.g. from the terminal log: `---> Running in 30as98d7fh`) to run the command on it. Then, the intermediate container gets shut down (e.g. from the terminal log: `Removing intermediate container 30as98d7fh`).
* Each command gets the image from the previous step and creates a container out of it to build on top of it. When the commands end, the last container modifies the file system and the newest image is presented to us as our final image!
### 1.3.6. Rebuilds with Cache
* Assume we added another `RUN` command (e.g. `RUN apk add --updage gcc`) to the Dockerfile and build it once more. This time, Docker will use the cache up to the changed line and don't create a new intermediate container as mentioned above to fetch and install that package previously built. See the `---> Using cache` line in the terminal log.
* This makes Docker installs much more faster.
* Order of the operations matters even though the packages stay the same! If you change the order, Docker won't use the cached versions.
### 1.3.7. Tagging an Image
* It is easier to use an image tag instead of its image ID. So, you can use the `-t` tag flag to define a name to your image.
* `docker build -t mert/mydockerproject:latest .`
* This is a naming convention:
    * `your_docker_id/repo_or_project_name:version`
    * It's better to use a version number instead of `latest`.
* Then you use: `docker run mert/mydockerproject` (If you don't specify version, it'll use the latest by default.)
### 1.3.8. Manual Image Generation with Docker Commit
**Quick Note for Windows Users:** In the upcoming lecture, we will be running a command to create a new image using docker commit with this command:<br>
\> `docker commit -c 'CMD ["redis-server"]' CONTAINERID`<br>
If you are a Windows user you may get an error like ``"/bin/sh: [redis-server]: not found"`` or ``"No Such Container"``<br>
Instead, try running the command like this:<br>
\> ``docker commit -c "CMD 'redis-server'" CONTAINERID``
* We are not going to use this method much or at all but it's fun to learn.
* So what's the deal here? We create and run a container with `alpine` base, modify it and `commit` it with and create a new image out of that container! Fun, huh?
    * `docker run -it alpine sh` <br>
    * `> apk add --update redis` (we are in that container's shell!)<br>
    _- - - Switch to another terminal - - -_<br>
    * `docker ps` (Get the running container ID) <br>
    * `docker commit -c "CMD ['redis-server']" 42d67b4a3bcc` <br>
    * `sha256:598729347yuıh54jb43k25hj4b6........` <br>
    * `docker run 598729347yu` (Docker gets the rest of the ID. Don't need to write it all.)
## 1.4. Making Real Projects with Docker (`simpleweb`)
### 1.4.1. A Few Planned Errors
* Remember the legacy builder command for more verbose:
    * `docker build --no-cache --progress=plain .`
* `npm install`: the dependencies for Node JS Apps.
* `npm start`: to start up the server.
* **npm:** Node Package Manager
### 1.4.2. Base Image Issues
* You can look for specific tags from images on the Hub.
* `alpine` version/tag means that you are using the most stripped down version of that image.
### 1.4.3. Copying Build Files
* The previous container doesn't have your local build files! Thus, you need to copy them into that container.
* In the command `COPY ./ ./`
    * the first `./` is the path to folder to copy from on _your machine_ relative to build context (which comes from `docker build .`),
    * the second `./` is the place to copy stuff to inside _the container_.
### 1.4.4. Container Port Mapping
* `docker run -p 8080:8080 image_id_name/project_name`: Route incoming requests to the (first #) port on local host to the (second #) port inside the container.
* The ports don't need to be identical. Our local port could be 5000. (e.g. `-p 5000:8080`)
* A container can reach out to the outer world (like the internet in `npm install` etc.) but local computer cannot get inside the docker container! This is why there needs to be a port mapping specified.
### 1.4.5. Specifying a Working Directory
* Copying local project folders and files into the container's root directory (with `COPY` command in the ``Dockerfile``) may cause problems.
    * For example, there could be a folder named `lib` in your project and it might **overwrite** the `lib` folder inside the container!
    * Hence, it is a better idea to specify a working directory ***in the container*** so you can work in a safe place (which you specified) without any conflict.
* The command for it is `WORKDIR`.
    * ``WORKDIR /usr/app``: 
* So, we changed the `Dockerfile` and performed these steps to confirm we are in the working directory:
    * `docker build --no-cache --progress=plain -t mert/simpleweb .`
    * [in a second terminal] `docker ps`: To get the running container id.
    * [in the second terminal] `docker exec -it c41e0a33dee3 sh`
    * Here we are `/usr/app #`, waiting for a command in the terminal.
* All of the files we copied including the dependencies installed with `npm install` is currently in ``/usr/app`` safely.
### 1.4.6. Unnecessary Rebuilds
* If you change the `index.js` file, you have to build the image once again.
* ...and install all the dependencies. This is tiresome!
### 1.4.7. Minimizing Cache Busting and Rebuilds
* We split the `COPY` command [see the latest version of the Dockerfile in the `simpleweb` folder] so that unless the dependencies are changed, the rebuild process will use their cached versions and only copy the updated `index.js` to the image. The rebuild process will be much faster. 
## 1.5. Docker Compose with Multiple Local Containers (`visits`)
### 1.5.1. App Overview
* Let's say we have a simple website with a Node app + Redis server, where Redis server counts the number of visits to the page. We can gather these two in a single container, but when we need to scale things up, creating multiple containers with these two might cause us trouble since the containers count the visits separately on their own. Thus, it's better to scale Node apps up and then connect these multiple containers to our Redis container.
* The dependency `redis` is a JS client library for connecting to the Redis server to pull/update information.
### 1.5.2. App Server Starter Code
* In the `javascript` code we wrote, I couldn't grasp what `.set` method does in either the last time I studied the course or now. Then I searched about it and the part I was struggling with dawned on me: I thought that constant was a string. No! That Redis method returns a _map object_! Thus, it has a key & value pairs.
    * ``client.set('visits', 0);`` ---> Here, we set `visits` key to a value, which is zero. `client` is a map object. I thought it was related to a URL or something on the server we were building but no! It's a simple `key: value` pair (as in Python). 
* Also, I changed a line to format the js string. BUT REMEMBER: To format a string in js, the brackets should be \`, not **'** or **"**.
### 1.5.3. Introducing Docker Compose
* When we tried to run the node app container, it throws an error about failing to connect Redis server. We run a Redis server in another terminal but it still throws the error. Why? Because these two containers don't form any communication automatically. They are two isolated processes, i.e. separate containers! To connect them, we have 2 options:
    * Docker CLI's Networking Features
        * It's pain in the arse! Need to handle bunch of commands and rerun every single time!
        * The teacher said that he had never seen a person that did this in the industry.
    * Docker Compose
        * It's a separate CLI tool.
        * Used to start up multiple containers at the same time.
        * Automates some of the long-winded arguments we were passing to `docker run`.
### 1.5.4. Docker Compose Files
* About docker-compose file versioning: "If only the major version is given (``version: '3'``), the latest minor version is used by default." - From [Docker docs](https://docs.docker.com/compose/compose-file/compose-versioning/#version-3)
* `docker-compose.yml` file contains all the options we'd normally pass to `docker-cli`. We're gonna tell that file:
    * _Here are the containers I want created:_
        * ***redis-server***
            * _Make it using the `redis` image._
        * ***node-app***
            * _Make it using the Dockerfile in the current directory._
            * _Map port 8081 to 8081._
* Inside the `yml` file, under the `services`, we use `build: .` to build the Dockerfile inside our directory.
* `services` are like container. Thus, we list the containers under it but it's not like _containers_ exactly!
* Dash (`-`) in `yml` file specifies an array. So we can map many ports etc. we want.
### 1.5.5. Networking with Docker Compose
* About the line `host: 'redis-server'` in the `index.js`: Docker will see this host name as a http request and understand that it is looking for the container named `redis-server`. If it was a normal node app, the value would be a regular URL.
    * Also, we specified the `port: 6379` in the same dictionary under `host`. It is the default port for redis server but we added it anyway.
* Then docker-compose will automatically connect those containers/services.
### 1.5.6. Docker Compose Commands
* `docker-compose up`:
    * The equivalent of `docker run myimage`
    * If it is not built already, docker-compose builds it.
    * We don't specify an image name. It finds them in the docker-compose file.
* `docker-compose up --build`:
    *  `docker build .` + `docker run myimage`
    * ``--build``: It builds the services once again if something has been changed. Without this, the already built services will run and the changes will be ignored. 
### 1.5.7. Stopping Docker Compose Containers
* Launch in the background: `docker-compose up -d`.
    * `-d` or `--detach`: detach
* Since we have multiple containers running in our docker-compose, it would be a pain to stop them all one by one with `docker stop container_id`. So, we have:
    * `docker-compose down`
### 1.5.8. Container Maintenance with Compose + Automatic Container Restarts
* We changed the `index.js` to make our server crashed. (see the error: `visits_node-app_1 exited with code 0`)
    * `code 0` means that _we exited and everything is OK_. 1, 2, 3, etc. means that _we exited because something went wrong!_
* However, only the node-app has crashed and redis server is still online. How about we restart the container?
    * ***Restart Policies:***
        * **"no"**: Never attempt to restart this container if it stops or crashed.
            * Note the quotes around `no`! In a ``yml`` file, `no` without the quotes is a boolean value. Thus, we make it a string `"no"`, with single or double quotes.
        * **always**: If stops for any reason, always attempt to restart it.
        * **on-failure**: Only restart if the container stops with an error code.
            * Hence, it won't restart on ``process.exit(0)`` since ``code 0`` means _we exited and everything is OK_. It'll restart other than ``code 0``.
            * We can use it with workers doing a scheduled job like in Pubtimer. When everything successfully finish, it stops the container. Or else, it restarts the job/worker. It's pretty useful when I think about the database issues in Pubtimer. I have to restart them manually when things are fucked up!
        * **unless-stopped**: Always restart unless we (the developers) forcibly stop it.
* These policies are defined under the `yml` file.
    * We added `restart: on-failure` under the `node-app` service.
### 1.5.9. Container Status with Docker Compose
* `docker-compose ps` is the equivalent of `docker ps` **BUT** it only works in where your related `yml` file is. Thus, it doesn't work globally as `docker ps`. It throws an error if it can't find the file in the working directory.
* I found [this repo](https://github.com/compose-spec/compose-spec/blob/master/spec.md#services-top-level-element) for docker-compose syntax and keywords.
## 1.6. Creating a Production-Grade Workflow (`frontend`)
### 1.6.1. Necessary Commands
* `npm run start` starts up a development server. _For development use only!_
* `npm run build` builds a production version of the application.
* `npm run test` tests our app and we are only concerned here that all the test are passed or not.

<br>========================================================<br>
============OLD NOTES BELOW. WILL BE REVISED.===========<br>
========================================================<br>
===========OLD NOTES BELOW. WILL BE REVISED.===========<br>
========================================================<br>




### Lesson 69: Creating the Dev Dockerfile

* We created `Dockerfile.dev` for development purposes. For the prod, good old Dockerfile is sufficient.
* To run a custom Dockerfile name, use `docker build -f Dockerfile.dev .`
### Lesson 70: Duplicating Dependencies
* We deleted `node_modules` folder for duplicate dependencies. `build` became much faster.
### Lesson 72: Docker Volumes
* Instead of copying the local files to our Docker image, we can give reference to them so that when we change something in our local files (like the React app in the tutorial), it is also reflected to the container. So, we don't have to build the image again and again.
* Using the `volume` feature is a bit pain in the arse considering the syntax.
* `docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app mert/frontend`
    * First `-v` puts a bookmark on the `node_modules` folder.
        * Without `:`, we say _"Don't try to map it up against anything. It's a placeholder and we don't want to accidently overwrite this directory."_.
    * Second `-v` maps the `pwd` into the `/app` folder.
        * `:` maps the folder inside the container (`/app`) to the one outside the container (`$PWD`).
### Lesson 75: Shorthand with Docker Compose
* We can wrap things up (see the previous lesson) in a `docker-compose.yml`.
### Lesson 78: Executing Tests
* `docker run 61a63368e07c npm run test` performed the test but we weren't connected to STDIN so we couldn't give any command afterwards. Thus, please remember to add the `-it` flags!
### Lesson 78 [lesson numbers seem to be updated]: Shortcomings on Testing
* Every different process inside the container has their own instances of STDIN, STDOUT, STDERR.

`> docker attach 38agsas8g45`: This attaches to the STDIN, STDOUT and STDERR to the primary process in that container. However, this doesn't work as we expected. We see nothing.<br>
* We write `> docker exec -it 38ags.. sh` and connect to the container and see the running processes by `ps` in the `sh`. We understand that the primary process is `npm` which STARTS the **run test** command. Thus, we are attaching to `npm` command instead of `run test` process, which would communicate with STDIN etc. actually. That's why we cannot interact with the STDIN on the terminal.
### Lesson 79: Need for Nginx
`> npm run build`: Builds a **production** version of the application. Takes all the js files, processes them together, puts them all together in a single file etc. <br>
* `nginx`: Pronounced as _engine x_. It takes incoming traffic and somehow routing it or somehow responding to it with some static files.
### Lesson 80: Multi-Step Docker Builds
* We are going to create another Dockerfile, for the **production** this time!
* So, these are the steps for building our prodution image:
    1) Use `node:alpine`
    2) Copy the `package.json` file
    3) Install dependencies
    4) Run `npm run build`
    5) Start `nginx`
* However, there are problems with these type of building. First, the dependencies just to create the `main.js` files fill up the disk because we don't need them after we build the image. Second, how do we start `nginx` for God's sake!? We need another base image for that!
* Thus, we separate the phases as **Build Phase** and **Run Phase**. There will be two different builds:
    * **Build Phase**
        * Same as the steps 1 to 4.
    * **Run Phase**
        1) Use `nginx`
        2) Copy over the result of `npm run build`
        3) Start `nginx`
### Lesson 81: Implementing Multi-Step Builds
* [See the Dockerfile] Except the `/app/build` folder, everything on the `builder` container will be dumped. This saves some space for us.
* You can read the comments in the `Dockerfile` as well.
### Lesson 82: Running Nginx
* We build the image (`docker build .`) without specifying the file with `-f` flag because we have created a regular `Dockerfile`.
* `nginx` uses 80 as its default port.

`> docker run -p 8080:80 51hj2g3k1j`
## Section 7: Continuous Integration and Deployment with AWS (`same project continues`)
**Note from the lecturer:** Travis CI is not totally free anymore. On the [website](https://www.travis-ci.com/), select Monthly Plans and then the free Trial Plan. This will give you 10,000 free credits to use within 30 days. If you run out of credits, are unable to register for a Travis account, or, if you simply do not wish to use Travis - We have provided guidance to use ***Github Actions*** instead. Click [here](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11437142#questions/17673926) to get to the featured question.<br>
**Note from Mert:** I am going to use Travis CI to learn about the tool until the credits expire. Then, I might switch back to the Github Actions later.
### Lesson 87: Travis YML File Configuration
* Remeber the leading dot in the name of `.travis.yml` file.
* In the `yml` file, we used the Docker username under `before_install` section but it's not essential really. Only Travis is going to use it. It's just a good naming convention.
### Lesson 89: A Touch More Travis Setup
* We added the property `language: generic` to the `.travis.yml` file to include necessary services and languages. Click [here](https://docs.travis-ci.com/user/languages/minimal-and-generic/) to get more information about it.
* The flag `-e` under the `script` section of the `yml` file is to _Set environment variables_. See the ["ENV (environment variables)"](https://docs.docker.com/engine/reference/run/#env-environment-variables) sectionin Docker documents.
* We use it instead of `--coverage` flag now and set an env var `CI=true` because _The test command will force Jest to run in CI-mode, and tests will only run once instead of launching the watcher._ See [here](https://create-react-app.dev/docs/running-tests/#linux-macos-bash) for more information.
### Lesson 90-101: AWS Configuration Cheat Sheet
* AWS configuration has been changed since the last recording of the lectures. Thus, check the cheat sheet on this specific lesson if required.
* We didn't need the `EXPOSE` parameter to map the default port to the environment.
* The `Dockerfile.dev` is for development, regular one is for production stage.
* The repo for the build can be found here: [gulmert89/docker-react](https://github.com/gulmert89/docker-react)
## Section 8: Building a Multi-Container Application
### Lesson
