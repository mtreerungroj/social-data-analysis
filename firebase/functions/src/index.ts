import { BigQuery } from '@google-cloud/bigquery';
import * as functions from "firebase-functions";
const { BQ_PROJECT_ID, BQ_DATASET_ID, BQ_DATASET_LOCATION, BG_TABLE_HASHTAG_RELATIONSHIP, BG_TABLE_HASHTAG_COUNT, BQ_SERVICE_ACCOUNT_KEY_FILENAME } = require('../env.json')

const bq = new BigQuery({
  keyFilename: BQ_SERVICE_ACCOUNT_KEY_FILENAME,
  projectId: BQ_PROJECT_ID
})


const _getHashtagRelationship = async (hashtag: string) => {
  const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_RELATIONSHIP} WHERE hashtagA = "${"#" + hashtag}" OR hashtagB = "${"#" + hashtag}"`

  const [job] = await bq.createQueryJob({
    query,
    location: BQ_DATASET_LOCATION
  })

  const [rows] = await job.getQueryResults();

  return rows
}

export const getHashtagRelationship = functions.https.onRequest(async (request, response) => {
  const hashtag: string = request.query.hashtag as string
  const res = await _getHashtagRelationship(hashtag)
  response.send(res);
});



const MINIMUM_POST = 11

const _getHashtagList = async (minimumPost: number = MINIMUM_POST) => {
  const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${BG_TABLE_HASHTAG_COUNT} WHERE no_hashtags >= ${minimumPost} ORDER BY no_hashtags DESC`

  const [job] = await bq.createQueryJob({
    query,
    location: BQ_DATASET_LOCATION
  })

  const [rows] = await job.getQueryResults();

  return rows
}

export const getHashtagList = functions.https.onRequest(async (request, response) => {
  const minimumPost: number = Number(request.query.minimumPost as string) || MINIMUM_POST
  const res = await _getHashtagList(minimumPost)
  response.send(res);
});
