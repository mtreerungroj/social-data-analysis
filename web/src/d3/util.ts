import * as d3 from 'd3'
import { IHashtagEngagementRawData } from '../type/dataTypes'
import format from 'date-fns/format'

export const prepareHashtagEngagementData = (hashtagEngagementRawData: IHashtagEngagementRawData[]) => {
  const hashtagEngagementData = [...d3.rollup(hashtagEngagementRawData, v => v, d => d.Time)]
    .map(e => ({
      Time: e[0],
      avg: e[1][0].total_engagement,
      Order: e[1][0].Order,
      data: e[1].map(d => (({ Month, Date: _Date, engagement }) => {
        // @ts-ignore
        const foo = format(new Date(_Date["value"]), 'M/d/yyyy')
        // @ts-ignore
        return ({ Month, Date: foo, engagement })
      })(d))
    }))
    .sort((a, b) => d3.ascending(a.Order, b.Order))

  return hashtagEngagementData
}
