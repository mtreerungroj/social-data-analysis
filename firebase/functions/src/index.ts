import { _query } from "./bigquery";
import { BQ_PROJECT_ID, BQ_DATASET_ID, BG_TABLE_HASHTAG_RELATIONSHIP, BG_TABLE_HASHTAG_COUNT, BG_TABLE_HASHTAG_POST_ENGAGEMENT } from "./env.json";
import { onRequestCORS } from "./lib/firebase";

export const getHashtagRelationship = onRequestCORS(async (request, response) => {
  const hashtag: string = request.query.hashtag as string;
  const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_RELATIONSHIP} WHERE hashtagA = "${"#" + hashtag}" OR hashtagB = "${"#" + hashtag}"`;
  const res = await _query(query);

  response.send(res);
});

const MINIMUM_POST = 11;

export const getHashtagList = onRequestCORS(async (request, response) => {
  const minimumPost: number = Number(request.query.minimumPost as string) || MINIMUM_POST;
  const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_COUNT} WHERE no_hashtags >= ${minimumPost} ORDER BY no_hashtags DESC`;
  const res = await _query(query);

  response.send(res);
});


export const getHashtagOverallData = onRequestCORS(async (request, response) => {
  const json = JSON.parse(request.body)
  const { hashtagList } = json
  const hashtagString = hashtagList.map((hashtag: string) => "'" + hashtag + "'").join(',')
  const query = `SELECT hashtag, total_posts, total_engagements FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_POST_ENGAGEMENT} WHERE hashtag in (${hashtagString})`;
  const res = await _query(query);

  response.send(res);
});
