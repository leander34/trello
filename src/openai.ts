import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-xCXLhv5GXfRQo4XLjnyZ8isi",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;
