import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseConfig } from './firebase-config';

const app = initializeApp(firebaseConfig);

const functions = getFunctions(app);

const generateUploadUrlFunction = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");

export interface Video {
    id?: string;
    uid?: string;
    filename?: string;
    status?: 'processing' | 'processed';
    title?: string;
    description?: string;
}

export async function uploadVideo(file: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await generateUploadUrlFunction({
        fileExtension: file.name.split(".").pop(),
    });

    // Upload the file to the signed URL
    const uploadResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    return uploadResult;
}

export async function getVideos() {
    const response = await getVideosFunction();
    return response.data as Video[];
}