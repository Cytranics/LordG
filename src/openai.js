const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);
const robot = async (prompt) => {
  try {
    const rs = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    return await Promise.resolve(rs);
  } catch (e) {
    throw e;
  }
};

export default robot;
