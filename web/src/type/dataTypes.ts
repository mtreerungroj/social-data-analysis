export interface IHashtagItem {
  id: number,
  label: string,
  value: number,
}

export interface IHashtagRelationshipItem {
  nodes: INode[],
  links: ILink[]
}

interface INode {
  id: string,
  size: number
}

interface ILink {
  source: any,
  target: any,
  value: number
}

export interface IHashtagEngagementRawData {
  hash: string,
  Month: number
  Time: string,
  engagement: number
  post_id: number
  total_engagement: number
  Date: string
  Order: number
}

export interface IDataTop10 {
  hashtag: string,
  composition_fb: number,
  composition_in: number,
  composition_tw: number,
  composition_yt: number,
  total: number
}
