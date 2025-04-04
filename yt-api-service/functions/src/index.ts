/* eslint-disable */

import { Storage } from "@google-cloud/storage";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { onCall } from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucketName = "nc-yt-raw-video";

export const createUser = functions.region("asia-southeast1").auth.user().onCreate((user) => {
    const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    }

    firestore.collection("users").doc(user.uid).set(userInfo);

    logger.info(`User created: ${JSON.stringify(userInfo)}`);

    return;
});

export const generateUploadUrlV1 = functions.region("asia-southeast1").https.onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        )
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // generate unique filemane
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // get a v4 signed url for uploading file
    const [url] = await bucket
        .file(fileName)
        .getSignedUrl({
            version: "v4",
            action: "write",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

    return { url, fileName };
})

export const generateUploadUrl = onCall(
    { region: "asia-southeast1", maxInstances: 1 },
    async (request) => {

        if (!request.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "The function must be called while authenticated."
            )
        }

        const auth = request.auth;
        const data = request.data;

        const bucket = storage.bucket(rawVideoBucketName);

        // generate unique filemane
        const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

        // get a v4 signed url for uploading file
        const [url] = await bucket
            .file(fileName)
            .getSignedUrl({
                version: "v4",
                action: "write",
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            });

        return { url, fileName };
    }
);