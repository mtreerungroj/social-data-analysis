import * as functions from "firebase-functions";
import { _query } from "./bigquery";
import { BQ_PROJECT_ID, BQ_DATASET_ID, BG_TABLE_HASHTAG_RELATIONSHIP, BG_TABLE_HASHTAG_COUNT } from "./env.json";

export const getHashtagRelationship = functions.region('asia-southeast1').https.onRequest(async (request, response) => {
  const hashtag: string = request.query.hashtag as string;
  const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_RELATIONSHIP} WHERE hashtagA = "${"#" + hashtag}" OR hashtagB = "${"#" + hashtag}"`;
  const res = await _query(query);

  response.send(res);
});

const MINIMUM_POST = 11;

export const getHashtagList = functions.region('asia-southeast1').https.onRequest(async (request, response) => {
  const minimumPost: number = Number(request.query.minimumPost as string) || MINIMUM_POST;
  const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_COUNT} WHERE no_hashtags >= ${minimumPost} ORDER BY no_hashtags DESC`;
  const res = await _query(query);

  response.send(res);
});
