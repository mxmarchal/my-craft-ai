import OpenAI from "openai";
import { isElement, type Element } from "./types/Element";

const openai = new OpenAI({
  apiKey: Bun.env["OPENAI_API_KEY"],
});

export async function getNewElement(element1: Element, element2: Element) {
  const prompt = `Combine ${element1.label} and ${element2.label} to create a new element.`;
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are an AI designed to craft new label-emoji pairs based on given input. Follow these rules:
  
          **Prompt Rules for Crafting New Label-Emoji Pairs**
  
          Given a JSON input containing pairs of label-emoji combinations, craft a new pair with the following specifications:
  
          - **Label**: The name of the new element (no more than 2 words).
          - **Emoji**: An emoji related to this new element.
  
          The output must adhere to the following rules:
  
          1. **Label Length**: The label must be short (no more than 2 words).
          2. **Emoji Selection**: The emoji must be related to the new element. It's always a single emoji.
          3. **Relation to Elements**: The new element must be related to both provided elements. Example: fire + water = vapor or cloud.
          4. **Inclusion of Names**: The new element can be a word or a name (e.g., countries, cities, continents, planets).
          5. **JSON Structure**: The output must respect the JSON structure, with a label and an emoji inside a result object.
          6. **Case Handling**: Maintain the original casing of the provided labels unless otherwise specified.
          7. **Edge Cases**: If elements do not naturally combine, choose a concept that is a close approximation.
          8. **Priority of Elements**: Elements should be merged equally unless a clear precedence is evident.
          9. **JSON Only**: The response must contain only the JSON output. Do not include any explanations or sentences.
  
          **Example Input**:
  
          {
              "first_element": {
                  "label": "world",
                  "emoji": "🌍"
              },
              "second_element": {
                  "label": "baguette",
                  "emoji": "🥖"
              }
          }
  
          **Example Output**:
  
          {
              "result": {
                  "label": "france",
                  "emoji": "🇫🇷"
              }
          }
        `,
      },
      {
        role: "user",
        content: JSON.stringify({
          first_element: {
            label: element1.label,
            emoji: element1.emoji,
          },
          second_element: {
            label: element2.label,
            emoji: element2.emoji,
          },
        }),
      },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  console.log(chatCompletion.choices[0].message.content);
  if (!chatCompletion.choices[0].message.content) {
    console.error("No response from OpenAI");
    return null;
  }
  const response = JSON.parse(chatCompletion.choices[0].message.content);
  const result = response.result;
  if (!isElement(result)) {
    console.error("Invalid response from OpenAI");
    return null;
  }
  return result;
}
