import { IHashtagItem } from "../type/dataTypes"

// const IS_DEV = true
const IS_DEV = false

let getHashtagListPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagList?minimumPost=1000"
let getHashtagRelationshipPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagRelationship?hashtag="
let getHashtagOverviewDataPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagOverallData"
let getHashtagEngagementDataPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagEngagementByTime?hashtag="

if (IS_DEV) {
  getHashtagRelationshipPATH = "data/hashtagRelationship_stock.json"
  getHashtagOverviewDataPATH = "data/hashtagOverviewData.json"
  getHashtagListPATH = "data/hashtagList.json"
  getHashtagEngagementDataPATH = "data/hashtagEngagementByTime.json"
}

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

export const fetchHashtagRelationshipData = async (focusHashtag: IHashtagItem) => {
  let path = getHashtagRelationshipPATH + focusHashtag.label.substring(1)
  if (IS_DEV) {
    path = getHashtagRelationshipPATH
  }

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

export const fetchHashtagOverviewData = async (hashtagList: string[]) => {
  const path = getHashtagOverviewDataPATH

  if (IS_DEV) {
    const hashtagOverviewData = await fetch(path)
      .then(res => res.json())
    return hashtagOverviewData
  } else {
    const hashtagOverviewData = await fetch(path, {
      method: 'POST',
      body: JSON.stringify({
        hashtagList: hashtagList
      })
    }).then(res => res.json())
    return hashtagOverviewData
  }

}

export const fetchHashtagEngagementData = async (focusHashtagNode: String) => {
  let path = getHashtagEngagementDataPATH + focusHashtagNode.substring(1)
  const hashtagEngagementData = await fetch(path)
    .then(res => res.json())
  return hashtagEngagementData
}
