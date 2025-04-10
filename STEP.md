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


## Create Web app using Next.js


```
npx create-next-app@latest . 
```


## Firebase 


```
npm install -g firebase-tools 

firebase login
```


## update cors

```
gcloud storage buckets update gs://nc-yt-raw-video --cors-file=utils/gcs-cors.json

```

## invoke role to all users

```
gcloud run services add-iam-policy-binding generateUploadUrl \
  --region="us-central1" \
  --member="allUsers" \
  --role="roles/run.invoker"

```


## Redeploy service

```
docker build --platform linux/amd64 -t asia-southeast1-docker.pkg.dev/yt-clone-f52b3/video-processing-repo/video-processing-service .

docker push asia-southeast1-docker.pkg.dev/yt-clone-f52b3/video-processing-repo/video-processing-service 

gcloud run deploy video-processing-service --image asia-southeast1-docker.pkg.dev/yt-clone-f52b3/video-processing-repo/video-processing-service \
  --region=asia-southeast1  \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1 \
  --ingress=internal

```

## deploy web-client
1. create registry

```

gcloud artifacts repositories create yt-web-client \
--repository-format=docker \
--location=asia-southeast1 \
--description="Docker repo for yt-web-client"

```

2. build docker
```
docker build --platform linux/amd64 -t asia-southeast1-docker.pkg.dev/yt-clone-f52b3/yt-web-client-repo/yt-web-client .

docker push asia-southeast1-docker.pkg.dev/yt-clone-f52b3/yt-web-client-repo/yt-web-client
```

3. Deploy

```
gcloud run deploy yt-web-client --image asia-southeast1-docker.pkg.dev/yt-clone-f52b3/yt-web-client-repo/yt-web-client \
  --region=asia-southeast1  \
  --platform managed \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=1

```