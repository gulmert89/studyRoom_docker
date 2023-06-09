# Docker and Kubernetes The Complete Guide
## Section 1: Dive Into Docker!
### Lesson 4: What is Docker?
* Docker, gets the images from Docker Hub.
* Container is a program with its own isolated set of hardware resources (memory, networking, hdd vs.) _(see: Lesson 13)_

### Lesson 5: -
* Docker installation has "**Docker CLI**" & "**Docker Server/Daemon**"

### Lesson 13: What's a Container?
* **Namespacing**: let's say program A runs in Py2, while program B in Py3. With namespacing, we can redirect these A & B which sends system call to kernel in the hard drive where we installed Py2 and Py3 to different partitions. _(i.e. namespacing: isolating resources per process or group of processes)_
* **Control groups (cgroups)**: limit amount of resources used per process
* Namespacing & cgroups belong to Linux only!
* **Container**: A process / set of processes that have a grouping of resources specifically assigned to it.
* **Image**: Snapshot of the file system along with very specific startup commands.

## Section 2: Manipulating Containers with The Docker Client
### Lesson 16: Overriding Default Commands
\> `docker run "image_name" some_command` (to override the default command!)

\> `docker run busybox ls`: list the default folders in _busybox_ such as bin, dev, etc, home, proc, root. However, for the _hello-world_ image, `ls` command throws error since IT DOESN'T EXIST in its file system.

### Lesson 17: Listing Running Containers
\> `docker ps`: list all the running containers

\> `docker ps --all`: listing all the containers we ever created.

### Lesson 18: Container Lifecycle
* docker run = docker create + docker start

\> `docker run`: Used for creating and running a container from an image.

\> `docker create "image name"`

\> `docker start "container id"`
	
\> `docker start -a asg786`: (`-a`: attach to the container and watch for output coming from it and show it on my terminal!)

* By default, `docker run` will show all the logs etc. but `docker start` won't show you what is coming from the container.

### Lesson 19: Restarting Stopped Containers
\> `docker ps --all`. I chose one of the earlier containers listed by this command, e.g. 2658434a46d7 which pings google. Then I start it again:

\> `docker start -a 2658434a46d7`

### Lesson 20: Removing Stopped Containers
\> `docker system prune`: Delete all stopped containers.

### Lesson 21: Retrieving Log Outputs
\> `docker logs "container id"`: It's not restarting or rerunning the container, but gets the log of that initiated container.

### Lesson 22: Stopping Containers
\> `docker stop "container id"`: Sends SIGTERM -terminate signal- message. It gives the process a bit of time to clean up, ends the job or prints a message etc. 10 secs later, it kills the process anyway!

\> `docker kill "container id"`: Sends SIGKILL -kill signal- message. Immediately shuts down the process, no grace period.

### Lesson 23: Multi-Command Containers
* W/o docker: start _redis-server_, open a _redis-cli_ to issue commands.

\> `docker run redis` but we can't run _redis-cli_ in another terminal. We need to get inside this container to enter this command!

### Lesson 24: Executing Commands in Running Containers
\> `docker exec -it "container id" command_to_execute`: Execute an additional command in a container (Check help file for the flags.)

\> `docker exec -it 2e532f124ba8 redis-cli`

### Lesson 25: The Purpose of the IT (-i -t) Flag
* When you are running Docker on your machine, every single container you are running is running inside of a VM running Linux.
* Every process we create in a running Linux env has 3 communication channels attached to it:<br>`ping google.com`
    * **STDIN**: Stuff you type
    * **STDOUT & STDERR**: Stuff that shows up on the screen
* `-i, --interactive`: Attaches to our terminal's STDIN.
* `-t, --tty`: Basically, prettifies/formats and shows up the output on our screen (actually, it does a bit more than that).

### Lesson 26: Getting a Command Prompt in a Container
* We'll open up a shell and not use `docker exec` over and over again.

\> `docker exec -it 2e532f124ba8 sh`: Opens up a shell. Then comes:<br>
`# echo "hi there"`<br>
`# export b=5`<br>
`# echo $b` --> _Outputs_ `5`<br>
`# redis-cli`<br>
`# apt list` and then `exit` or **Ctrl+D** and so on...<br>
* What is `sh`? Well, _bash_, _powershell_, _zsh_, _sh_ are command processors/shell.

### Lesson 27: Starting with a Shell
\> `docker run -it busybox sh`: Directly starts with a shell, but most probably you are not be running any another process. So, it's more common to start your container and then later attach to it by running `docker exec` command.

### Lesson 28: Container Isolation
* Between two containers, they don't automatically share their file systems.
* For example, open two different terminals and run the same command: `docker run -it busybox sh`. Create a file in one of them and type `ls` in the other one. Yep, it's not there. They use two different, isolated FS. They have two distinct **CONTAINER ID** anyway.

## Section 3: Building Custom Images Through Docker Server
### Lesson 29: Creating Docker Images
* Dockerfile: Configuration to define how our container should behave
* Dockerfile --> Docker Client (cli) --> Docker Server (Take the dockerfile and builds a usable img) --> Usable Image
* Dockerfile flow:
    * Specify a base img (`FROM` command)
    * Run some commands to install programs (`RUN` command)
    * Specify a startup command (`CMD` command)
### Lesson 31: Building a Dockerfile
\> `docker build .` : This uses the Dockerfile in that folder.

* Then it builds the image and says `Successfully built 7bb33751abb2`. You can use `docker run 7bb33751abb2` to run the container.
### Lesson 33: What's a Base Image?
* Base image, like `alpine` contains useful set of programs. It's like an OS.
### Lesson 34: The Build Process in Detail
* The `.` in `docker build .` is the **build context**. It's the set of files and folders that belong to our project which we want to encapsulate or wrap in the container.
* Every command in the Dockerfile can be observed as `STEP 1/3: FROM alpine` etc.
* After the first line of code (e.g. `FROM alpine`), following commands create an intermediate container (e.g. from the terminal log: `---> Running in 30as98d7fh`) to run the command on it. Then, the intermediate container gets shut down (e.g. from the terminal log: `Removing intermediate container 30as98d7fh`).
* Each command gets the image from the previous step and creates a container out of it to build on top of it. When the commands end, the last container is presented to us as our usable image!
### Lesson 36: Rebuilds with Cache
* Assume we added another `RUN` command (e.g. `RUN apk add --updage gcc`) to the Dockerfile and build it once more. This time, the Docker will use the cache and don't create a new intermediate container as mentioned above to fetch and install that package previously built. See the `---> Using cache` line in the terminal log.
* This makes Docker installs much more faster.
* Order of the operations matters even though the packages stay the same! If you change the order, Docker won't use the cached versions.
### Lesson 37: Tagging an Image
* It is easier to use an image tag instead of its image ID. So, you can use the `-t` tag flag to define a name to your image.

\> `docker build -t mert/mydockerproject:latest .`

* This is a naming convention:
    * `your_docker_id/repo_or_project_name:version`
    * It's better to use a version number instead of `latest`.
* Then you use:

\> `docker run mert/mydockerproject` (If you don't specify version, it'll use the latest by default.)
### Lesson 38: Manual Image Generation with Docker Commit
* We are not going to use this method much or at all but it's fun to learn.

\> `docker run -it alpine sh` <br>
\> `# apk add --update redis` (we are in that container's shell!)<br>
_- - - Switch to another terminal - - -_<br>
\> `docker ps` (Get the running container ID) <br>
\> `docker commit -c "CMD ['redis-server']" 42d67b4a3bcc` <br>
\> `sha256:598729347yuıh54jb43k25hj4b6........` <br>
\> `docker run 598729347yu` (Docker gets the rest of the ID. Don't need to write it all.)

## Section 4: Making Real Projects with Docker (`simpleweb`)
### Lesson 42: A Few Planned Errors
* `npm install` the dependencies for Node JS Apps.
* `npm start` to start up the server.
### Lesson 44: Base Image Issues
* You can look for specific tags from images on the Hub.
* `alpine` version/tag means that you are using the most stripped down version of that image.
### Lesson 46: Copying Build Files
* The previous container doesn't have your local build files! Thus, you need to copy them into that container.
* In the command `COPY ./ ./`, the first path is where your local files is. You guess the second path :D
### Lesson 47: Container Port Mapping
\> `docker run -p 8080:8080 image_id/name`: Route incoming requests to the (first) port on local host to the (second) port inside the container.
* The ports don't need to be identical. Our port could be 5000. (e.g. `-p 5000:8080`)
### Lesson 48: Specifying a Working Directory
* The command for it is `WORKDIR`.
* You can directly enter to that WORKDIR folder. Example with `exec` command (for fun. there could be another way.):
    * \> `docker run -p 8080:8080 mert/simpleweb`
    * In another terminal:
        * \> `docker ps`
        * \> `docker exec -it 1f37acb2b2a8 sh`
        * ...and we are in the `/usr/app` directory.
### Lesson 49: Unnecessary Rebuilds
* If you change the `index.js` file, you have to build the image once again.
* ...and install all the dependencies. This is tiresome!
### Lesson 50: Minimizing Cache Busting and Rebuilds
* We split the `COPY` command so that unless the dependencies are changed, the rebuild process will use their cached versions and only copy the updated `index.js` to the image. The rebuild process will be much faster. 
## Section 5: Docker Compose with Multiple Local Containers (`visits`)
### Lesson 51: App Overview
* Let's say we have a simple website with a Node app + Redis server, where Redis server counts the number of visits to the page. We can gather these two in a single container, but when we need to scale things up, creating multiple containers with these two might cause us trouble since those scaled Redis servers counts the visits separately. Thus, it's better to scale Node apps up and then connect these multiple containers to our Redis container.
### Lesson 52: App Overview
* The dependency, `redis` is a JS client library for connecting to the Redis server to pull/update information.
### Lesson 54: Introducing Docker Compose
* When we tried to run the node app container, it throws an error about failing to connect Redis server. We run a Redis server in another terminal but it still throws the error. Why? Because these two containers don't have any automatic communication between two. They are two isolated processes, separate containers! To connect them, we have 2 options:
    * Docker CLI's Networking Features
        * It's pain in the arse! Need to handle bunch of commands and rerun every single time!
        * The teacher said that he had never seen a person that did this in the industry.
    * Docker Compose
        * It's a separate CLI tool.
        * Used to start up multiple containers at the same time.
        * Automates some of the long-winded arguments we were passing to `docker run`.
### Lesson 55: Docker Compose Files
* `docker-compose.yml` file contains all the options we'd normally pass to `docker-cli`. We're gonna tell that file:
    * _Here are the containers I want created:_
        * ***redis-server***
            * _Make it using the `redis` image._
        * ***node-app***
            * _Make it using the Dockerfile in the current directory._
            * _Map port 8081 to 8081._
* Inside the `yml` file, under the `services`, we use `build: .` to build the Dockerfile inside our directory.
* Dash (`-`) in `yml` file specifies an array. So we can map many ports we want.
### Lesson 56: Networking with Docker Compose
* In the `yml` file at the line `host: 'redis-server'`, docker will see this host name as a http request and understand that it is looking for the other container named `redis-server`.
* `port: 6379` is the default port but we added it anyway.
* Then docker compose will automatically connect those containers.
### Lesson 57: Docker Compose Commands
\> `docker-compose up` is the equivalent of `docker run myimage`<br>
\> `docker-compose up --build` is `docker build .` + `docker run myimage`<br>
### Lesson 58: Stopping Docker Compose Containers
* Launch in the background: `docker-compose up -d`.
* Since we have multiple containers running in our docker-compose, it would be a pain to stop them all one by one with `docker stop container_id`. So, we have `docker-compose down`.
### Lesson 59, 60:  Container Maintenance with Compose, Automatic Container Restarts
* We changed the `index.js` to make our server crashed. (see the error: `visits_node-app_1 exited with code 0`)
    * `code 0` means that _we exited and everything is OK_. 1, 2, 3, etc. means that _we exited because something went wrong!_
* However, only the node-app has crashed and redis server is still online. How about we restart the container?
    * ***Restart Policies:***
        * **"no"**: Never attempt to restart this container if it stops or crashed.
        * **always**: If stops for any reason, always attempt to restart it.
        * **on-failure**: Only restart if the container stops with an error code.
        * **unless-stopped**: Always restart unless we (the developers) forcibly stop it.
* We added `restart: always` under the `node-app` in our `yml` file.
### Lesson 61:  Container Status with Docker Compose
* `docker-compose ps` is the equivalent of `docker ps` **BUT** it only works in where your related `yml` file is. Thus, it doesn't work globally as `docker ps`. It throws an error if it can't find the file in the working directory.
## Section 6: Creating a Production-Grade Workflow (`frontend`)
### Lesson 69: Creating the Dev Dockerfile
* `npm run start` in the Docker container is for development.
* `npm run build` is for production.
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