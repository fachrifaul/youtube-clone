import express, { Request, Response } from "express";
import { isVideoNew, setVideo } from "./firestore";
import {
    convertVideo,
    deleteProcessedVideo,
    deleteRawVideo,
    downloadRawVideo,
    setupDiretories,
    uploadProcessedVideo
} from "./storage";

setupDiretories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req: Request, res: Response) => {
    let data;

    try {
        const message = Buffer.from(req.body.message.data, "base64").toString("utf-8");
        data = JSON.parse(message);

        if (!data.name) {
            throw new Error("Invalid message payload received.");
        }
    } catch (error) {
        console.error("Error processing video:", error);
        res.status(400).send("Bad Request: missing filename.");
        return;
    }

    const inputFileName = data.name; // uid-date.extension
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split(".")[0];

    if (!isVideoNew(videoId)) {
        res.status(400).send("Bad Request: video already processed.");
        return;
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split("-")[0],
            status: "processing"
        });
    }

    // Download raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    try {
        // Convert raw video to processed video 360p
        await convertVideo(inputFileName, outputFileName);

        // Upload processed video to Cloud Storage
    } catch (error) {
        console.error("Error processing video:", error);

        // Cleanup before responding with an error
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);

        res.status(500).send("Internal Server Error: Video processing failed.");
        return;
    }

    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
        status: "processed",
        filename: outputFileName,
    });

    // Cleanup original files
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    res.status(200).send("Video processing completed.");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});
