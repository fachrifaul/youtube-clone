import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase app (if not already initialized)
const app = initializeApp(firebaseConfig);

// Get functions with region set to "asia-southeast1"
const functions = getFunctions(app, "asia-southeast1");

const generateUploadUrlFunction = httpsCallable(functions, "generateUploadUrl");
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

const generateUploadUrlV1Function = httpsCallable(functions, "generateUploadUrlV1");
export async function uploadVideoV1(file: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await generateUploadUrlV1Function({
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
