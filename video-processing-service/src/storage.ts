import { Storage } from "@google-cloud/storage";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const storage = new Storage();

const rawVideoBucketName = "nc-yt-raw-video";
const processedVideoBucketName = "nc-yt-processed-video";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


/**
 * Ensures that the local directories used for storing raw and processed videos exist.
 * If the directories do not exist, they are created.
 */
export function setupDiretories() {
    ensureDirectoriesExist(localRawVideoPath);
    ensureDirectoriesExist(localProcessedVideoPath);
}
/**
 * Converts a raw video file to a processed video file with 360p resolution.
 *
 * @param rawVideoName - The name of the raw video file convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the processed video file to {@link localProcessedVideoPath}..
 * @returns A Promise that resolves when the video processing is completed, or rejects if an error occurs.
 */

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    // ffmpeg -i input.mp4 -vf "scale=-1:360" output.mp4

    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360") // 360p resolution
            .on("end", () => {
                console.log("Video processing completed");
                resolve();
            })
            .on("error", (err) => {
                console.error(`An error occurred: ${err.message}`);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })
}


/**
 * Downloads a raw video from {@link rawVideoBucketName} to the local
 * directory specified by {@link localRawVideoPath}.
 *
 * @param fileName - The name of the raw video file to download.
 * @returns A Promise that resolves when the download is complete, or rejects if an error occurs.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}` });

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`);
}

/**
 * Uploads a processed video to the {@link processedVideoBucketName} bucket and sets its permissions to public.
 *
 * @param fileName - The name of the processed video file to upload.
 * @returns A Promise that resolves when the upload is completed, or rejects if an error occurs.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName,
    });

    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}`);

    await bucket.file(fileName).makePublic();
}

/**
 * Deletes a file at the given path.
 *
 * @param filePath - The path to the file to delete.
 * @returns A Promise that resolves when the file is deleted, or rejects if an error occurs.
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}`, err.message);
                    reject(err);
                } else {
                    console.log(`File ${filePath} deleted`);
                    resolve();
                }
            })
        } else {
            console.log(`File not found at ${filePath}, skipping delete`);
            resolve();
        }
    })
}

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


function ensureDirectoriesExist(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory ${dirPath} created`);
    }
}
