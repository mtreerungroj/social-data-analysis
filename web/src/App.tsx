import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { NetworkGraph } from './d3/networkGraph';
import { StackedBarChart } from './d3/stackedBarChart';
import { IHashtagItem, IHashtagRelationshipItem } from './type/dataTypes';
import { topN } from './util/arrayUtil';
import { fetchHashtagListData, fetchHashtagNodeSize, fetchHashtagRelationshipData } from './util/fetchData';

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
      fetchHashtagRelationshipData(focusHashtag).then(data => {
        // get top 20 higghest node value
        const topNHashtagRelation = topN(data, 'value', 20)
        if (!topNHashtagRelation) return

        // modify data to be compatible with network graph (follow hashtagRelationship_stock.json)
        const unique_hashtagA = topNHashtagRelation.map((x: any) => x.nodeA)
        const unique_hashtagB = topNHashtagRelation.map((x: any) => x.nodeB)
        const unique_hashtag = Array.from(new Set(unique_hashtagA.concat(unique_hashtagB)))
        console.log('unique_hashtag', unique_hashtag)

        // fetch hashtag node size
        fetchHashtagNodeSize(unique_hashtag).then(data => { })

        // check again if topN works
        setHashtagRelationshipList(data)
      })
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
                <NetworkGraph hashtagRelationshipList={hashtagRelationshipList} focusHashtag={focusHashtag.label} setFocusHashtagNode={setFocusHashtagNode} />
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
