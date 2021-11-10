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