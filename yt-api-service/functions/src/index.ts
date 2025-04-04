/* eslint-disable object-curly-spacing, indent, semi, eol-last */

import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";

initializeApp();

const firestore = new Firestore();

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