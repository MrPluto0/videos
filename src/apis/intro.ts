import axios from "axios";

export async function getIntros() {
  let res = await axios.get(
    "http://101.43.161.79:9002/media/introduction.json"
  );
  return res.data;
}
