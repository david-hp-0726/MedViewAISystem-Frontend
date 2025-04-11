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
        model: "deepseek/deepseek-chat:free",
        messages: [{ role: "user", content: modifiedQuestion }],
        stream: true,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Fetch failed: ${response.status} ${response.statusText} — ${errorText}`
    );
  }

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

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const lineEnd = buffer.indexOf("\n");
        if (lineEnd === -1) break;

        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);

        if (!line.startsWith("data: ")) continue;

        const data = line.slice(6);

        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);

          if (parsed.error?.message) {
            throw new Error(`OpenRouter Error: ${parsed.error.message}`);
          }

          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onStream(content);
          }
        } catch (err) {
          console.error("Failed to parse stream chunk:", err, data);
          throw err; // rethrow to be caught in parent try
        }
      }
    }
  } finally {
    try {
      reader.cancel();
    } catch (err) {
      console.warn("Failed to cancel stream reader:", err);
    }
  }
}
