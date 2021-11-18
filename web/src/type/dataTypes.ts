export interface IHashtagItem {
  id: number,
  label: string,
  value: number,
}

export interface IHashtagRelationshipItem {
  nodes: INode[],
  links: ILink[]
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

interface INode {
  id: string,
  size: number
}

interface ILink {
  source: any,
  target: any,
  value: number
}