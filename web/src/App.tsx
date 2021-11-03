import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { IHashtagItem, IHashtagRelationshipItem } from './type/dataTypes';
import { fetchHashtagListData, fetchHashtagRelationshipData } from './util/fetchData';

function App() {
  let [hashtagList, setHashtagList] = useState<IHashtagItem[]>()
  let [focusHashtag, setFocusHashtag] = useState<IHashtagItem>()
  let [hashtagRelationshipList, setHashtagRelationshipList] = useState<IHashtagRelationshipItem[]>()

  useEffect(() => {
    fetchHashtagListData().then(data => setHashtagList(data))
  }, [])

  useEffect(() => {
    console.log('hashtagList', hashtagList)
  }, [hashtagList])

  useEffect(() => {
    console.log('focusHashtag, fetching hashtag data...', focusHashtag)
    if (focusHashtag) {
      fetchHashtagRelationshipData(focusHashtag).then(data => setHashtagRelationshipList(data))
    }
  }, [focusHashtag])

  useEffect(() => {
    console.log('hashtagRelationshipList', hashtagRelationshipList)
  }, [hashtagRelationshipList])

  return (
    <div className="App">
      {hashtagList &&
        <div style={{ margin: '50px' }}>
          <HashtagSearch hashtagList={hashtagList} setFocusHashtag={setFocusHashtag} />
          {focusHashtag ?
            <div>Show network graph for {focusHashtag.label}</div> :
            <div>No focus hashtag, show top trending hashtag </div>}
        </div>
      }
    </div>
  );
}

export default App;
