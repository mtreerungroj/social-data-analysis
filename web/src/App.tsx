import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { EngagementChart } from './d3/engagementChart';
import { NetworkGraph } from './d3/networkGraph';
import { StackedBarChart } from './d3/stackedBarChart';
import { IHashtagEngagementRawData, IHashtagItem, IHashtagRelationshipItem } from './type/dataTypes';
import { fetchHashtagEngagementData, fetchHashtagListData } from './util/fetchData';
import { getHashtagRelationshipData } from './util/prepareData';

require('./App.css');

function App() {
  let [hashtagList, setHashtagList] = useState<IHashtagItem[]>()
  let [focusHashtag, setFocusHashtag] = useState<IHashtagItem>()
  let [hashtagRelationshipList, setHashtagRelationshipList] = useState<IHashtagRelationshipItem>()
  let [focusHashtagNode, setFocusHashtagNode] = useState()
  let [hashtagEngagementRawData, setHashtagEngagementRawData] = useState<IHashtagEngagementRawData[]>()


  useEffect(() => {
    fetchHashtagListData().then(data => setHashtagList(data))
  }, [])

  useEffect(() => {
    console.log('hashtagList', hashtagList)
  }, [hashtagList])

  useEffect(() => {
    console.log('focusHashtag, fetching hashtag data...', focusHashtag)

    const fetchData = async (focusHashtag: IHashtagItem) => {
      const hashtagRelationshipData = await getHashtagRelationshipData(focusHashtag)
      console.log('fetchHashtagRelationshipData will get', hashtagRelationshipData)
      setHashtagRelationshipList(hashtagRelationshipData)
    }

    if (focusHashtag) {
      fetchData(focusHashtag)
    }
  }, [focusHashtag])

  useEffect(() => {
    console.log('hashtagRelationshipList', hashtagRelationshipList)
  }, [hashtagRelationshipList])

  useEffect(() => {
    console.log('focusHashtagNode', focusHashtagNode, 'fetching engagement data...')
    if (!focusHashtagNode) return
    fetchHashtagEngagementData(focusHashtagNode).then(data => setHashtagEngagementRawData(data))
  }, [focusHashtagNode])

  useEffect(() => {
    console.log('hashtagEngagementData', hashtagEngagementRawData)
  }, [hashtagEngagementRawData])

  return (
    <div className="App">
      {hashtagList &&
        <div style={{ margin: '50px' }}>
          <HashtagSearch hashtagList={hashtagList} setFocusHashtag={setFocusHashtag} />
          {focusHashtag ?
            <div>
              Show network graph for {focusHashtag.label}
              <div>
                {hashtagRelationshipList ?
                  <div className="focusHashtag">
                    <NetworkGraph hashtagRelationshipList={hashtagRelationshipList} focusHashtag={focusHashtag.label} setFocusHashtagNode={setFocusHashtagNode} />
                    {focusHashtagNode ?
                      <div>
                        Engagement by time of {focusHashtagNode}
                        {hashtagEngagementRawData ?
                          <EngagementChart hashtagEngagementRawData={hashtagEngagementRawData} /> :
                          <div>Loading...</div>}
                      </div> :
                      <div> Clicking node to see more detail about hashtag engagement</div>
                    }
                  </div> :
                  <div>Loading...</div>
                }
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
