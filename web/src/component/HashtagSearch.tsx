import { Autocomplete, TextField } from "@mui/material"
import { IHashtagItem } from "../type/dataTypes"

interface IHashtagSearchProps {
  hashtagList: IHashtagItem[],
  setFocusHashtag: (arg0: any) => void
}

export const HashtagSearch = (props: IHashtagSearchProps) => {
  const { hashtagList, setFocusHashtag } = props
  return <Autocomplete
    autoHighlight
    id="hashtag-search"
    options={hashtagList}
    sx={{ width: 400 }}
    popupIcon={""}
    noOptionsText={'No hashtag'}
    renderInput={(params) => <TextField {...params} label="Search hashtag" />}
    onChange={(event, newValue: any, reason: string) => {
      if (reason === 'selectOption') {
        setFocusHashtag(newValue)
      } else {
        return
      }
    }}
  />
}