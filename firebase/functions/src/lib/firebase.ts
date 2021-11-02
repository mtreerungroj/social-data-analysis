import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

import { FB_REGION, FB_PROJECT_ID, FB_SERVICE_ACCOUNT_KEY_FILENAME } from "../env.json";

// Admin service account key
firebase.initializeApp({
  projectId: FB_PROJECT_ID,
  keyFilename: FB_SERVICE_ACCOUNT_KEY_FILENAME,
} as firebase.AppOptions);

export const HttpsError = functions.https.HttpsError;

export const cors = (request: any, response: any, func: any) => {
  response.set("Access-Control-Allow-Origin", "*");

  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");
    response.status(204);
  } else {
    response.status(200);
  }
  return func(request, response);
};

export const onRequest = functions.region(FB_REGION).https.onRequest;
export const onRequestCORS = (func: (req: functions.https.Request, resp: functions.Response<any>) => void | Promise<void>) => onRequest((request, response) => cors(request, response, func));

const _onCall = functions.region(FB_REGION).https.onCall;
export const onCall = <T>(handler: (data: T, context: functions.https.CallableContext) => any) =>
  _onCall((d, c) => handler(d, c));

export const authUser = functions.region(FB_REGION).auth.user;

export const admin = firebase;

export const getDatabase = (isTest?: boolean) => {
  const db = admin.firestore();

  return {
    runTransaction: db.runTransaction,
    db: isTest ? db.collection("test").doc(
      `${new Date()
        .toISOString()
        .split("T")[0]
        .slice(0, 7)}`
    ) : db,
    batch: db.batch(),
  };
};

// functions.logger.info("Hello logs!", { structuredData: true });
export const logger = functions.logger;
export const schedule = functions.pubsub.schedule;
