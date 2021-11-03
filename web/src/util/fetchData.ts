// const getHashtagListPATH = "http://localhost:5002/social-data-analysis-viz/asia-southeast1/getHashtagList?minimumPost=10000"
const getHashtagListPATH = "data/hashtagList.json"

export const fetchHashtagListData = async () => {
  const hashtagListData = await fetch(getHashtagListPATH)
    .then(res => res.json())
    .then(data => data.map((e: any, i: Number) => ({
      id: i,
      label: e.hashtag,
      value: e.no_hashtags
    })))
  return hashtagListData
}
