import { BigQuery } from '@google-cloud/bigquery';
const { BQ_PROJECT_ID, BQ_DATASET_LOCATION, BQ_SERVICE_ACCOUNT_KEY_FILENAME } = require('../env.json')

const bq = new BigQuery({
  keyFilename: BQ_SERVICE_ACCOUNT_KEY_FILENAME,
  projectId: BQ_PROJECT_ID
})

export const _query = async (query: string) => {

  const [job] = await bq.createQueryJob({
    query,
    location: BQ_DATASET_LOCATION
  })

  const [rows] = await job.getQueryResults();

  return rows
}
