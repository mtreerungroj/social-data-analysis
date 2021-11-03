import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { IHashtagItem } from './type/dataTypes';
import { fetchHashtagListData } from './util/fetchData';

function App() {
  let [hashtagList, sethashtagList] = useState<IHashtagItem[]>()
  let [focusHashtag, setFocusHashtag] = useState()

  useEffect(() => {
    fetchHashtagListData().then(data => sethashtagList(data))
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
          <HashtagSearch hashtagList={hashtagList} setFocusHashtag={setFocusHashtag} />
        </div>
      }
    </div>
  );
}

export default App;
