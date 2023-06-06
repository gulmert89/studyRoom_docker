# Sample Scripts from Some of My Projects

## Project: Product Mapping - Image Feature
`> docker build -t pub:torch_py38 .` <br>
`> docker run -d -it --gpus all -v $PWD:/home/pub_container_user/product_mapping-img --name pm_img pub:torch_py38`
* `-d`: detached
* `-it`: interactive & with pseudo-terminal
* `-v`: connect working dir to the specified folder
* `--name`: container's tag
* `-w`: container's working dir

and also,

- **pulled image**: pub/product_mapping:py38
- **startup command**: `None`

## Dockerfile:
```Dockerfile
FROM nvidia/cuda:11.7.0-base-ubuntu22.04

ARG DEBIAN_FRONTEND=noninteractive
ARG PYTHON_VERSION=3.8

# Needed for string substitution
SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update

RUN apt-get update && apt-get install -y --no-install-recommends --no-install-suggests \
          python${PYTHON_VERSION} \
          python3-pip \
          python${PYTHON_VERSION}-dev \
          python${PYTHON_VERSION}-distutils \
          python${PYTHON_VERSION}-venv \
          nano \
          tree \
          tmux \
          git \
          libxml2-dev \
          libxslt1-dev \
          zlib1g-dev \
          libffi-dev \
          libssl-dev \
          python3-opencv \
          libgtk2.0-0 \
          libsm6 \
          libxext6 \
# Change default python
    && cd /usr/bin \
    && ln -sf python${PYTHON_VERSION}         python3 \
    && ln -sf python${PYTHON_VERSION}m        python3m \
    && ln -sf python${PYTHON_VERSION}-config  python3-config \
    && ln -sf python${PYTHON_VERSION}m-config python3m-config \
    && ln -sf python3                         /usr/bin/python \
# Update pip and add common packages
    && python -m pip install --upgrade pip \
    && python -m pip install --upgrade \
        setuptools \
        wheel \
        six \
# Cleanup (it's for foot. if $HOME, change it.)
    && apt-get clean \
    && rm -rf /root/.cache/pip

WORKDIR "/usr/app/product_mapping-img"

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install numpy pip --upgrade --quiet

CMD ["bash"]

## These would be used with --build-arg while building the image.
## Note: This image, needs to be built specifically for each machine it will run on to make sure everything is in order.
## > docker build -t pub:py38 --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) .
# ARG USER_ID
# ARG GROUP_ID
# RUN addgroup --gid $GROUP_ID container_user
# RUN adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID container_user
# USER pub_container_user
# WORKDIR "/home/container_user/product_mapping-img"
```

## requirements.txt
```python
git+https://github.com/kornia/kornia
kornia_moons
opencv-python
matplotlib
pandas
pydegensac
einops
yacs
pip
```
***
## Project: Image Accuracy
`> docker build -t mert/img_acc .` <br>
`> docker run -it --rm -v $PWD/SUNUM:/img_acc/SUNUM mert/img_acc bash`
* `--rm`: remove container after done working
* You can remove `bash` and let it run `app.py` as shown in `Dockerfile`.

### Dockerfile:
```Dockerfile
FROM python:3.10.4

WORKDIR "/img_acc"

COPY requirements.txt requirements.txt

RUN apt update
RUN apt install -y libxml2-dev libxslt1-dev zlib1g-dev libffi-dev libssl-dev python3-opencv libgtk2.0-0 libsm6 libxext6 tree tmux
RUN pip3 install -r requirements.txt

COPY . .

CMD ["python3", "app.py"]
```

### requirements.txt
```python
torch==1.12.1
torchvision==0.13.1
torchaudio==0.12.1
boto3<=1.24
pandas==1.4.3
matplotlib<=3.5
opencv-python>4,<4.7
```
