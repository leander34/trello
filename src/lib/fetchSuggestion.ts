import transformTodosForAI from "./transformTodosForAI";

const fetchSuggestion = async (board: Board) => {
  const todos = transformTodosForAI(board);

  const response = await fetch("http://localhost:3000/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await response.json();
  const { content } = GPTdata;
  return content;
};

export default fetchSuggestion;
