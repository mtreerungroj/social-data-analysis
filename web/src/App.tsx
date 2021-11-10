import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { NetworkGraph } from './d3/networkGraph';
import { StackedBarChart } from './d3/stackedBarChart';
import { IHashtagItem, IHashtagRelationshipItem } from './type/dataTypes';
import { fetchHashtagListData, fetchHashtagRelationshipData } from './util/fetchData';

require('./App.css');

function App() {
  let [hashtagList, setHashtagList] = useState<IHashtagItem[]>()
  let [focusHashtag, setFocusHashtag] = useState<IHashtagItem>()
  let [hashtagRelationshipList, setHashtagRelationshipList] = useState<IHashtagRelationshipItem[]>()
  let [focusHashtagNode, setFocusHashtagNode] = useState()

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
            <div>
              Show network graph for {focusHashtag.label}
              <div className="focusHashtag">
                <NetworkGraph focusHashtag={focusHashtag.label} setFocusHashtagNode={setFocusHashtagNode} />
                {focusHashtagNode ?
                  <div> Show spike graph for {focusHashtagNode}</div> :
                  <div> Wait for clicking node</div>}
              </div>
            </div> :
            <div>
              No focus hashtag, show top trending hashtag
              <StackedBarChart />
            </div>
          }
        </div>
      }
    </div>
  );
}

export default App;
