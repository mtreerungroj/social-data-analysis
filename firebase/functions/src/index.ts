import { BigQuery } from '@google-cloud/bigquery';
import * as functions from "firebase-functions";
const { BQ_PROJECT_ID, BQ_DATASET_LOCATION, BQ_SERVICE_ACCOUNT_KEY_FILENAME } = require('../env.json')
// const { BQ_PROJECT_ID, BQ_DATASET_ID, BQ_DATASET_LOCATION, BQ_SERVICE_ACCOUNT_KEY_FILENAME } = require('../env.json')

const bq = new BigQuery({
  keyFilename: BQ_SERVICE_ACCOUNT_KEY_FILENAME,
  projectId: BQ_PROJECT_ID
})

// const HASHTAG_RELATIONSHIP_TABLE = 'hashtag_relatonship'

const _getHashtagRelationship = async (location: string = BQ_DATASET_LOCATION) => {
  // Options
  // const query = `SELECT * FROM ${BQ_PROJECT_ID}.${BQ_DATASET_ID}.${HASHTAG_RELATIONSHIP_TABLE} LIMIT 10`
  const query = "SELECT * FROM `social-data-analysis-viz.social_data.hashtag_relatonship` LIMIT 10"

  // Run the query as a job
  const [job] = await bq.createQueryJob({
    query,
    location
  })

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log('Rows:');
  rows.forEach((row: any) => console.log(row));

  return rows
}

export const helloWorld = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });

  const res = await _getHashtagRelationship()

  console.log(res);

  response.send(res);
});
