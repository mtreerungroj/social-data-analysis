import { Autocomplete, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';

function App() {
  let [hashtagList, sethashtagList] = useState(null)
  let [focusHashtag, setFocusHashtag] = useState(null)

  useEffect(() => {
    // const hashtagListDataPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagList?minimumPost=10000"
    const hashtagListDataPATH = "data/hashtagList.json"
    fetch(hashtagListDataPATH)
      .then(res => res.json())
      .then(data => sethashtagList(data.map((e: any, i: Number) => ({
        id: i,
        label: e.hashtag,
        value: e.no_hashtags
      }))))
  }, [])

  useEffect(() => {
    console.log('hashtagList', hashtagList)
  }, [hashtagList])

  useEffect(() => {
    console.log('focusHashtag', focusHashtag)
  }, [focusHashtag])

  return (
    <div className="App">
      {hashtagList &&
        <div style={{ margin: '50px' }}>
          <Autocomplete
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
        </div>
      }
    </div>
  );
}

export default App;
