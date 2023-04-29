import axios from "axios";

export async function getVideos(type: "mp4" | "hls" | "dash") {
  let res;
  switch (type) {
    case "mp4":
      res = await axios.get("http://101.43.161.79:9002/media/mp4.json");
      break;
    case "hls":
      res = await axios.get("http://101.43.161.79:9002/media/hls.json");
      break;
    case "dash":
      res = await axios.get("http://101.43.161.79:9002/media/dash.json");
  }
  return res.data;
}
