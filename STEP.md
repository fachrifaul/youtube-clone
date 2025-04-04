## Docker

```
docker build --platform linux/amd64 -t video-processing-service .

docker run --platform -p 3000:3000 -d video-processing-service

```


## Enabled gcloid

```
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
```



## Glcoud
1. Repo

```
gcloud auth login

gcloud artifacts repositories create video-processing-repo \
--repository-format=docker \
--location=asia-southeast1 \
--description="Docker repo for video processing service"
```


2. docker auth

```
gcloud auth configure-docker asia-southeast1-docker.pkg.dev
```

3. docker build

```
docker build --platform linux/amd64 -t asia-southeast1-docker.pkg.dev/yt-clone-f52b3/video-processing-repo/video-processing-service .
```

4. docker push

```
docker push asia-southeast1-docker.pkg.dev/yt-clone-f52b3/video-processing-repo/video-processing-service 
```

## Bucket

```
gsutil mb -l asia-southeast1 --pap=enforced gs://nc-yt-raw-video

gsutil notification create -t video-uploads-topic -f json OBJECT_FINALIZE gs://nc-yt-raw-video

gsutil mb -l asia-southeast1 gs://nc-yt-processed-video
```