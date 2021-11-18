import * as d3 from 'd3'
import { IHashtagEngagementRawData } from '../type/dataTypes'

export const prepareHashtagEngagementData = (hashtagEngagementRawData: IHashtagEngagementRawData[]) => {
  const hashtagEngagementData = [...d3.rollup(hashtagEngagementRawData, v => v, d => d.Time)]
    .map(e => ({
      Time: e[0],
      avg: e[1][0].total_engagement,
      Order: e[1][0].Order,
      data: e[1].map(d => (({ Month, Date, engagement }) => ({ Month, Date, engagement }))(d))
    }))
    .sort((a, b) => d3.ascending(a.Order, b.Order))

  return hashtagEngagementData
}