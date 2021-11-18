import { IHashtagItem, IHashtagRelationshipItem } from "../type/dataTypes"
import { topN } from "./arrayUtil"
import { fetchHashtagEngagementData, fetchHashtagOverviewData, fetchHashtagRelationshipData } from "./fetchData"

export const getHashtagRelationshipData = async (focusHashtag: IHashtagItem) => {
  const data = await fetchHashtagRelationshipData(focusHashtag)
  // get top 20 higghest node value
  const topNHashtagRelation = topN(data, 'value', 20)
  if (!topNHashtagRelation) return
  // console.log('topNHashtagRelation', topNHashtagRelation)

  // modify data to be compatible with network graph (follow hashtagRelationship_stock.json)
  const uniqueHashtagA = topNHashtagRelation.map((x: any) => x.nodeA)
  const uniqueHashtagB = topNHashtagRelation.map((x: any) => x.nodeB)
  const uniqueHashtag = Array.from(new Set(uniqueHashtagA.concat(uniqueHashtagB)))
  // console.log('uniqueHashtag', uniqueHashtag)

  // fetch hashtag node size
  const hashtagOverviewData = await fetchHashtagOverviewData(uniqueHashtag)
  // console.log('hashtagOverviewData', hashtagOverviewData)

  const nodesData = uniqueHashtag.map(hashtag => ({
    id: hashtag,
    size: hashtagOverviewData.find((x: any) => x.hashtag === hashtag)?.total_posts || 0,
  }))
  // console.log('nodesData', nodesData)

  const linksData = topNHashtagRelation.map(x => ({
    source: x.nodeA,
    target: x.nodeB,
    value: x.value
  }))
  // console.log('linksData', linksData)

  const hashtag_relation: IHashtagRelationshipItem = { nodes: nodesData, links: linksData }
  return hashtag_relation
}

export const getHashtagEngagementData = async (focusHashtagNode: String) => {
  const data = await fetchHashtagEngagementData(focusHashtagNode)

  // prepare data for chart
  return data
}
