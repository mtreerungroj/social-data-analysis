import { Slider } from "@mui/material"

interface INodeAdjustmentProps {
  numberOfNode: number,
  setNumberOfNode: (arg0: any) => void,
  maxNumberOfNode: number
}

export const NodeAdjustment = (props: INodeAdjustmentProps) => {
  const { numberOfNode, setNumberOfNode, maxNumberOfNode } = props

  const handleChange = (event: Event, newValue: number | number[]) => {
    setNumberOfNode(newValue as number);
  };

  return <Slider
    aria-label="NodeAdjustment"
    defaultValue={numberOfNode}
    onChange={handleChange}
    valueLabelDisplay="on"
    step={10}
    marks
    min={10}
    max={maxNumberOfNode} />
}