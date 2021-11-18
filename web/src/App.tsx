import React, { useState, useEffect } from 'react';
import { HashtagSearch } from './component/HashtagSearch';
import { EngagementChart } from './d3/engagementChart';
import { NetworkGraph } from './d3/networkGraph';
import { StackedBarChart } from './d3/stackedBarChart';
import { IHashtagItem, IHashtagRelationshipItem } from './type/dataTypes';
import { fetchHashtagListData } from './util/fetchData';
import { getHashtagEngagementData, getHashtagRelationshipData } from './util/prepareData';

require('./App.css');

function App() {
  let [hashtagList, setHashtagList] = useState<IHashtagItem[]>()
  let [focusHashtag, setFocusHashtag] = useState<IHashtagItem>()
  let [hashtagRelationshipList, setHashtagRelationshipList] = useState<IHashtagRelationshipItem>()
  let [focusHashtagNode, setFocusHashtagNode] = useState()
  let [hashtagEngagementData, setHashtagEngagementData] = useState()


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

    const fetchData = async (focusHashtagNode: string) => {
      const hashtagEngagementData = await getHashtagEngagementData(focusHashtagNode)
      console.log('fetchHashtagEngagementData will get', hashtagEngagementData)
      setHashtagEngagementData(hashtagEngagementData)
    }

    if (focusHashtagNode) {
      fetchData(focusHashtagNode)
    }
  }, [focusHashtagNode])

  useEffect(() => {
    console.log('hashtagEngagementData', hashtagEngagementData)
  }, [hashtagEngagementData])

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
                      <div> Engagement by time of {focusHashtagNode} <EngagementChart hashtagEngagementData={hashtagEngagementData} /></div> :
                      <div> Wait for clicking node</div>
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
