import { IHashtagItem, IHashtagRelationshipItem } from "../type/dataTypes"
// import { topN } from "./arrayUtil"
import { fetchHashtagOverviewData, fetchHashtagRelationshipData } from "./fetchData"

export const getHashtagRelationshipData = async (focusHashtag: IHashtagItem) => {
  const data = await fetchHashtagRelationshipData(focusHashtag)
  console.log('fetchHashtagRelationshipData data', data)
  // get top 20 higghest node value
  // const topNHashtagRelation = topN(data, 'value', 40)
  // if (!topNHashtagRelation) return
  // console.log('topNHashtagRelation', topNHashtagRelation)

  return data
}

export const prepareHashtagRelationshipData = async (data: any) => {
  // modify data to be compatible with network graph (follow hashtagRelationship_stock.json)
  const uniqueHashtagA = data.map((x: any) => x.nodeA)
  const uniqueHashtagB = data.map((x: any) => x.nodeB)
  const uniqueHashtag: string[] = Array.from(new Set(uniqueHashtagA.concat(uniqueHashtagB)))
  console.log('uniqueHashtag', uniqueHashtag)

  // fetch hashtag node size
  const hashtagOverviewData = await fetchHashtagOverviewData(uniqueHashtag)
  console.log('hashtagOverviewData', hashtagOverviewData)

  const nodesData = uniqueHashtag.map(hashtag => ({
    id: hashtag,
    size: hashtagOverviewData.find((x: any) => x.hashtag === hashtag)?.total_posts || 0,
  }))
  // console.log('nodesData', nodesData)

  const linksData = data.map((x: any) => ({
    source: x.nodeA,
    target: x.nodeB,
    value: x.value
  }))
  // console.log('linksData', linksData)

  const hashtag_relation: IHashtagRelationshipItem = { nodes: nodesData, links: linksData }
  return hashtag_relation
}