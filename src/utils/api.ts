export async function fetchAIResponse(
  question: string,
  apiKey: string,
  deviceType: string,
  onStream: (chunk: string) => void
) {
  const modifiedQuestion = `You will be answering questions related to this medical device: ${deviceType}. Here's the question: ${question}`;
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free", // Use DeepSeek-V3
        messages: [{ role: "user", content: modifiedQuestion }],
        stream: true,
      }),
    }
  );

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Append new chunk to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from buffer
      while (true) {
        const lineEnd = buffer.indexOf("\n");
        if (lineEnd === -1) break;

        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);

        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onStream(content); // Send content to UI
            }
          } catch (e) {
            console.error("Error parsing response chunk", e);
          }
        }
      }
    }
  } finally {
    reader.cancel();
  }
}
