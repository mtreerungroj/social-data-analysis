import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { NetworkGraph } from './d3/networkGraph';
import { StackedBarChart } from './d3/stackedBarChart';
import { IHashtagItem, IHashtagRelationshipItem } from './type/dataTypes';
import { topN } from './util/arrayUtil';
import { fetchHashtagListData, fetchHashtagOverviewData, fetchHashtagRelationshipData } from './util/fetchData';

require('./App.css');

function App() {
  let [hashtagList, setHashtagList] = useState<IHashtagItem[]>()
  let [focusHashtag, setFocusHashtag] = useState<IHashtagItem>()
  let [hashtagRelationshipList, setHashtagRelationshipList] = useState<IHashtagRelationshipItem>()
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
      fetchHashtagRelationshipData(focusHashtag).then(async data => {
        // get top 20 higghest node value
        const topNHashtagRelation = topN(data, 'value', 20)
        if (!topNHashtagRelation) return
        // console.log('topNHashtagRelation', topNHashtagRelation)

        // modify data to be compatible with network graph (follow hashtagRelationship_stock.json)
        const uniqueHashtagA = topNHashtagRelation.map((x: any) => x.nodeA)
        const uniqueHashtagB = topNHashtagRelation.map((x: any) => x.nodeB)
        const uniqueHashtag = Array.from(new Set(uniqueHashtagA.concat(uniqueHashtagB)))
        // console.log('uniqueHashtag', uniqueHashtag)

        // fetch hashtag node size
        const hashtagOverviewData = await fetchHashtagOverviewData(uniqueHashtag)
        // console.log('hashtagOverviewData', hashtagOverviewData)

        const nodesData = uniqueHashtag.map(hashtag => ({
          id: hashtag,
          size: hashtagOverviewData.find((x: any) => x.hashtag === hashtag)?.total_posts || 0,
        }))
        // console.log('nodesData', nodesData)

        const linksData = topNHashtagRelation.map(x => ({
          source: x.nodeA,
          target: x.nodeB,
          value: x.value
        }))
        // console.log('linksData', linksData)

        const hashtag_relation = { nodes: nodesData, links: linksData }
        console.log('hashtag_relation', hashtag_relation)
        setHashtagRelationshipList(hashtag_relation)
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
