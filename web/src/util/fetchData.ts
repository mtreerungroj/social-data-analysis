import { IHashtagItem } from "../type/dataTypes"

// const getHashtagListPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagList?minimumPost=10000"
const getHashtagListPATH = "data/hashtagList.json"

export const fetchHashtagListData = async () => {
  const hashtagListData = await fetch(getHashtagListPATH)
    .then(res => res.json())
    .then(data => data.map((e: any, i: Number) => ({
      id: i,
      label: e.hashtag,
      value: e.no_hashtags
    })))
  return hashtagListData
}

const getHashtagRelationshipPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagRelationship?hashtag="
// const getHashtagRelationshipPATH = "data/hashtagRelationship_stock.json"

export const fetchHashtagRelationshipData = async (focusHashtag: IHashtagItem) => {
  const path = getHashtagRelationshipPATH + focusHashtag.label.substring(1)
  // const path = getHashtagRelationshipPATH
  const hashtagRelationshipData = await fetch(path)
    .then(res => res.json())
    .then(data => data.map((e: any, i: Number) => ({
      id: i,
      nodeA: e.hashtagA,
      nodeB: e.hashtagB,
      value: e.total_posts
    })))
  return hashtagRelationshipData
}

const getHashtagOverviewDataPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagOverallData"
// const getHashtagRelationshipPATH = "data/hashtagRelationship_stock.json"

export const fetchHashtagOverviewData = async (hashtagList: string[]) => {
  // const path = getHashtagOverviewDataPATH + focusHashtag.label.substring(1)
  const path = getHashtagOverviewDataPATH
  const hashtagOverviewData = await fetch(path, {
    method: 'POST',
    body: JSON.stringify({
      hashtagList: hashtagList
    })
  }).then(res => res.json())
  return hashtagOverviewData
}
