import { IHashtagItem } from "../type/dataTypes"

const IS_LOCAL = window.location.hostname === "localhost"
const BASED_URI = IS_LOCAL ? "http://localhost:5002/social-data-analysis-viz/asia-southeast1/" : "https://asia-southeast1-social-data-analysis-viz.cloudfunctions.net/"
let getHashtagListPATH = BASED_URI + "getHashtagList?minimumPost=1000"
let getHashtagRelationshipPATH = BASED_URI + "getHashtagRelationship?hashtag="
let getHashtagOverviewDataPATH = BASED_URI + "getHashtagOverallData"
let getHashtagEngagementDataPATH = BASED_URI + "getHashtagEngagementByTime?hashtag="

const IS_DEV = false
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
  if (IS_DEV) {
    path = getHashtagEngagementDataPATH
  }
  const hashtagEngagementData = await fetch(path)
    .then(res => res.json())
  return hashtagEngagementData
}
