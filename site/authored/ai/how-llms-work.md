# tokens-and-context | Tokens and the context window | 1 | 10
A model reads and writes tokens, not words, and everything it can use for one answer has to fit in its context window.

## What it is
A token is a piece of text, usually a word or part of a word. "unbelievable" might be three tokens. Code, numbers and non-English text usually cost more tokens per character than plain English prose. A rule of thumb for English is about 4 characters or 0.75 words per token.

The context window is the maximum number of tokens the model can see at once. It holds your system prompt, the whole conversation so far, any files or tool results, and the answer being written. When it is full, something has to be dropped or summarized.

## Why it matters
Cost, speed and quality all follow token count. You pay per input and output token. Long inputs are slower. Past a point, quality drops too: models get worse at using facts buried in the middle of a very long context, a failure often called context rot.

Every agent design decision later in this path (retrieval, memory, subagents, compaction) is a way of deciding what goes into that window.

## Try it
Paste a paragraph of prose, a JSON blob and some code into a tokenizer viewer and compare tokens per character. Then count how many tokens your longest CLAUDE.md or system prompt takes.

## Worked example: counting tokens and cost
The sentence "I love learning about AI!" is about 7 tokens. A 1,000-word email is around 1,300 tokens. If a model charges $3 per million input tokens, that email costs about $0.004 to read. Cheap once, but an agent that re-reads a 50,000-token conversation 30 times pays for 1.5 million tokens: about $4.50. Tokens are the unit of cost, speed and memory.

## Common mistakes
Assuming a bigger window means a better answer. More text can bury what matters. Another mistake is forgetting that the answer also uses window space, so a nearly full window leaves little room to reply.

```resources
tool | Tiktokenizer | https://tiktokenizer.vercel.app/ | Vercel | Paste text, see the exact tokens for different models.
video | Let's build the GPT Tokenizer | https://www.youtube.com/watch?v=zduSFxRajkE | Andrej Karpathy | Two hours on why tokenization causes so many odd model behaviors.
article | Context Rot | https://research.trychroma.com/context-rot | Chroma | Measures how model accuracy degrades as the input gets longer.
article | Effective context engineering for AI agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic | Treats context as a finite budget to spend carefully.
```

```quiz
You paste a 300-page PDF and the answers get vague. What is the most likely cause? | The model forgot how to read PDF files ; The relevant facts are buried in a huge context ; The model got tired after a long document | 1 | Long contexts dilute attention. Retrieving or summarizing the relevant part usually works better than pasting everything.
Which text costs more tokens for the same number of characters? | Plain English prose ; Text written in capital letters only ; Source code and non-English text | 2 | Tokenizers are tuned on common English, so code and rare words split into more pieces.
A chat has used 95 percent of the context window. What is a problem with asking for a long answer? | The answer shares the window and may be cut short ; The model will refuse to answer at all ; The extra tokens are free, so nothing changes | 0 | The reply also uses window space, so a nearly full window leaves little room to answer.
```

```story
A user pastes a whole contract into a chatbot and asks one question about clause 14. The answer is vague. Nothing is broken: the contract used most of the model's attention budget, and clause 14 was one needle in a very large haystack. A short, well-chosen excerpt would have worked better and cost less.
```

# next-token-prediction | Next-token prediction and sampling | 1 | 12
An LLM is a function that scores every possible next token. Sampling settings decide which one gets picked.

## What it is
Given the tokens so far, the model outputs a probability for every token in its vocabulary. A sampler picks one, appends it, and the model runs again. An answer is just this loop repeated until a stop token appears.

Temperature rescales the probabilities before sampling. Near 0 the top token wins almost every time, so output is stable. Higher values flatten the distribution, so unlikely tokens get picked more often. Top-p keeps only the smallest set of tokens whose probabilities add up to p, then samples inside it.

## Try it
Use the sampler above. Raise the temperature and watch how the picks spread out. Then set it near zero and sample ten times.

## Worked example: one step
Prompt: "The capital of France is". The model scores possible next tokens: "Paris" 92 percent, "a" 2 percent, "Lyon" 1 percent, and so on. The sampler picks one, usually "Paris". Now the prompt is "The capital of France is Paris" and the model predicts the next token again, maybe a period. Repeat until it predicts an end marker.

## Why this explains the weirdness
The model never plans the whole answer. That is why it can start a sentence confidently and then paint itself into a corner. It is also why asking it to write out its reasoning first often helps. Those reasoning words become part of the context for the final answer.

## Common mistake
Believing the model "looks up" facts. It predicts likely text. When a fact was common in training, the likely text is right. When it was rare, the likely text can be a convincing guess.

## The math, when you are ready
The step that turns scores into probabilities is called softmax. It has a worked example with small numbers in [Probability and softmax](/ai/docs/building-blocks/probability-and-softmax). You do not need it to use models. It makes more sense once you have built something, so come back to it later in the path.

```resources
video | Intro to Large Language Models | https://www.youtube.com/watch?v=zjkBMFhNj_g | Andrej Karpathy | One hour that gives the right mental model of what an LLM is.
video | Large Language Models explained briefly | https://www.youtube.com/watch?v=LPZh9BOjkQs | 3Blue1Brown | Eight minutes, the fastest accurate overview.
course | Neural Networks: Zero to Hero | https://karpathy.ai/zero-to-hero.html | Andrej Karpathy | Builds a language model from a bigram counter up to GPT.
```

```quiz
An extraction job must return the same JSON every run. What should you change? | Raise the temperature to 1.5 ; Lower the temperature toward 0 ; Add a longer greeting to the prompt | 1 | Low temperature makes the most likely token win almost every time, so output is repeatable.
Why does "think step by step" often improve answers? | It switches the model over to a larger version ; It makes the model look facts up online ; The written reasoning becomes context for later tokens | 2 | The model predicts one token at a time, so intermediate steps give it something to build the answer on.
A model's top token is "Paris" at 92 percent. At temperature 0, what does it output? | Paris, almost every time ; A random token from the list ; Lyon, one time in ten | 0 | Temperature near 0 makes the highest-probability token win nearly always.
```

```story
Your phone's keyboard suggests the next word as you type. A language model is that feature scaled up enormously: instead of three suggestions based on your messages, it weighs every word in its vocabulary using patterns learned from a large part of the internet, and it does it one word after another until the answer is done.
```

# sampling-parameters | Sampling parameters | 1 | 12
A handful of settings control how the next token is chosen and when the answer stops. Knowing them lets you tune behavior without changing the prompt.

## The settings
Temperature rescales probabilities: near 0 is repeatable, higher is more varied. Top-k keeps only the k most likely tokens, for example 40, and samples among them. Top-p (nucleus sampling) keeps the smallest set of tokens whose probabilities add up to p, for example 0.9, so the set grows when the model is unsure and shrinks when it is confident. Repetition or frequency penalties lower the score of tokens that already appeared, reducing loops. Max tokens caps the answer length. Stop sequences end generation when a given string appears. A seed makes sampling repeatable on providers that support it.

## Example
Probabilities for the next token: A 0.50, B 0.25, C 0.15, D 0.07, E 0.03. Top-k 2 keeps A and B and rescales them to 0.67 and 0.33. Top-p 0.9 keeps A, B and C (0.50 + 0.25 + 0.15 = 0.90) and drops D and E.

## Rules of thumb
Extraction, classification and code: temperature 0 to 0.3. Brainstorming and creative writing: 0.8 to 1.0. Change either temperature or top-p, not both. Some reasoning models fix these values and ignore your settings. Even at temperature 0, output can differ between calls on some providers, so do not rely on bit-exact repeatability.

## A worked example: same prompt, three settings
Prompt: "Name a fruit." Temperature 0: "Apple" every time. Temperature 0.7: apple, banana, mango across runs. Temperature 1.5: occasionally "dragonfruit" or something odd. For a form that must name exactly one valid fruit from a list, use 0. For brainstorming ten product names, use 0.9.

## Common mistake
Turning both temperature and top-p up at once, which compounds the randomness and produces nonsense. Change one dial, test, then decide.

## The math, when you are ready
Temperature is one number inside the softmax formula. See it with real numbers in [Probability and softmax](/ai/docs/building-blocks/probability-and-softmax).

```resources
docs | Messages API parameters | https://docs.anthropic.com/en/api/messages | Anthropic | Temperature, top-p, top-k, max tokens and stop sequences.
article | How to generate text: decoding methods | https://huggingface.co/blog/how-to-generate | Hugging Face | Greedy, beam, top-k and top-p, with code.
video | Let's build GPT: from scratch, in code, spelled out | https://www.youtube.com/watch?v=kCc8FmEb1nY | Andrej Karpathy | Sampling is built into the generation loop near the end.
```

```quiz
Token probabilities are A 0.50, B 0.25, C 0.15, D 0.07, E 0.03. Which does top-p 0.9 keep? | Only A ; A, B and C ; All five tokens | 1 | 0.50 + 0.25 + 0.15 reaches 0.90, so D and E are dropped.
What does a stop sequence do? | Raises the temperature for one token ; Blocks the model from a topic ; Ends generation when the string appears | 2 | It cuts the output at a chosen marker, such as the end of a field.
You want ten different product name ideas. Which setting fits best? | A higher temperature such as 0.9 ; Temperature 0 with top-k 1 ; A very short maximum output | 0 | Brainstorming benefits from variety, which higher temperature provides.
```

```story
A chef follows a recipe the same way every time for a customer who wants consistency, and improvises when a customer asks for something surprising. Sampling settings are the model's "how much to improvise" dials. For a tax form you want the first kind of chef. For a poem you might want the second.
```

# transformers-and-attention | Transformers and attention | 2 | 20
The transformer lets every token look at every earlier token and decide which ones matter for the next prediction.

## What it is
The transformer is the design behind modern language models. Its key idea is that every token can look at every earlier token and decide which ones matter.

Here is the path a piece of text takes. First it is split into tokens. Each token becomes a vector, which is a list of numbers called an embedding. Then the vectors pass through a stack of identical blocks. Each block does two jobs. Attention lets a token pull in information from other tokens. A feed-forward step then thinks about each token on its own. At the very end, the last vector is turned into a score for every possible next token.

In attention, each token makes three vectors. The query says what it is looking for. The key says what it contains. The value says what it offers. A token compares its query with every earlier key, and the best matches contribute their values. This is how the word "it" can pull in the meaning of the noun it refers to.

## Why it matters
You do not need the math to use models, but this picture explains real limits. Attention compares every token with every earlier token, so the work grows quickly with length. That is why long inputs cost more. It also explains why position in a prompt matters, and why models can copy a pattern from examples you give them. Earlier keys and values are saved in a KV cache, so repeated prefixes are cheap. That idea is behind prompt caching.

## A worked example
Take "The bank of the river was muddy." When the model handles "bank", attention pulls in "river", so the vector for "bank" moves toward "edge of water". In "The bank approved my loan", it pulls in "loan" and "approved" and moves toward "financial institution". The word is the same, but its meaning is set by its neighbors.

## Go deeper
Watch the 3Blue1Brown chapters first. Then play with an interactive visualization. Then read the original paper or the illustrated walkthrough.

## Common mistake
Thinking more layers always means a smarter model. Depth helps, but data and training matter just as much.

## The math, when you are ready
Attention is a few dot products, a softmax and a weighted average. The step-by-step numbers are in [Attention in numbers](/ai/docs/building-blocks/attention-math), in the Building Blocks chapter later in the path. Read it after you have used and built with models, and it will feel much easier.

```resources
video | Transformers, the tech behind LLMs | https://www.youtube.com/watch?v=wjZofJX0v4M | 3Blue1Brown | The clearest animated explanation of embeddings and attention.
tool | Transformer Explainer | https://poloclub.github.io/transformer-explainer/ | Georgia Tech Polo Club | Runs GPT-2 in your browser and lets you change temperature live.
tool | LLM Visualization | https://bbycroft.net/llm | Brendan Bycroft | A 3D walkthrough of every operation in a small GPT.
article | The Illustrated Transformer | https://jalammar.github.io/illustrated-transformer/ | Jay Alammar | The classic diagram-by-diagram walkthrough.
paper | Attention Is All You Need | https://arxiv.org/abs/1706.03762 | Vaswani et al. | The original transformer paper.
```

```quiz
What does attention let a token do? | Look only at the single token just before it ; Weigh all earlier tokens by how relevant they are ; Skip the feed-forward step in each block | 1 | Queries are matched against keys of earlier tokens, and the best matches contribute their values.
Why are very long inputs expensive? | Longer words use a different tokenizer entirely ; The vocabulary grows with the length of the input ; Attention compares every token with all earlier ones | 2 | Cost rises roughly with the square of the length because of those comparisons.
In "The bank approved my loan", what moves the meaning of "bank" toward money? | Attention pulling in "approved" and "loan" ; The word being capitalized in the sentence ; The sentence being short enough to fit | 0 | Neighbouring words set the meaning: attention blends their information into the word's vector.
```

```story
A student reads a textbook paragraph and, before answering a question, flips back through the pages looking for the lines that matter. A transformer does this for every word it writes: it looks back over everything so far, scores what is relevant, and uses that. The ability to look back, in parallel, is why models can follow a long instruction or keep a story consistent.
```

# training-pipeline | Pretraining, fine-tuning and RL | 2 | 15
Models are built in stages. Each stage changes what the model is good at and why it behaves the way it does.

## What it is
A chatbot is built in stages. Each stage teaches it something different.

Stage one is pretraining. The model reads a huge amount of text and learns to predict the next token. This is where its knowledge and its ability with language come from. The result is a base model. It can continue any text, but it does not know it is supposed to help you.

Stage two is supervised fine-tuning, or SFT. People write thousands of example conversations: a question, then a good answer. The model trains on them and starts to answer like an assistant.

Stage three is preference tuning. People compare two answers and pick the better one, and the model is nudged toward the kind people prefer. You will see the names RLHF and DPO for this. Both mean learning from human preferences.

Stage four, used for reasoning models, is reinforcement learning on tasks with checkable answers, such as math and code. The model gets a reward when the final answer is right, so it learns to think longer and more carefully.

## Why it matters
Pretraining has a cutoff date, so the model knows nothing newer. Politeness, refusals and tool use come from the later stages. That is why a prompt can change how a model behaves, but cannot reliably teach it new facts.

When you need new facts, retrieve them and put them in the prompt. When you need the same style or format every time at large scale, consider fine-tuning.

## A worked example: what each stage adds
Ask a base model "How do I bake bread?" It might continue with "How do I bake a cake? How do I bake cookies?", like a list of search suggestions. After instruction tuning it gives steps. After preference tuning the steps get clearer, safer and better organized. After reasoning training it can work through a long problem, such as scaling a recipe for 37 people.

## Common mistake
Fine-tuning a model to "teach" it your company facts. Facts are better supplied when the question is asked, through retrieval. That keeps them up to date and shows the sources.

## The math, when you are ready
Training is repeated guessing, measuring the error and nudging the weights. The numbers behind that loop are in [Loss and gradient descent](/ai/docs/building-blocks/loss-and-gradient-descent). It is optional for now.

```resources
video | Deep Dive into LLMs like ChatGPT | https://www.youtube.com/watch?v=7xTGNNLPyMI | Andrej Karpathy | Three hours covering pretraining, SFT and RL end to end.
video | How I use LLMs | https://www.youtube.com/watch?v=EWvNQjAaOHw | Andrej Karpathy | Practical companion to the deep dive, with real workflows.
paper | Training language models to follow instructions with human feedback | https://arxiv.org/abs/2203.02155 | OpenAI | The InstructGPT paper that defined the RLHF recipe.
course | Hugging Face LLM Course | https://huggingface.co/learn/llm-course | Hugging Face | Free, hands-on path through transformers, fine-tuning and evaluation.
```

```quiz
A model does not know about a product released last month. What is the right fix? | Fine-tune it on one sentence about the product ; Raise the temperature so it guesses more ; Give it the facts through the prompt or retrieval ; Wait for the next pretraining run | 2 | Knowledge comes from pretraining and has a cutoff. Supplying facts in context is cheap and reliable.
Which stage mainly produces instruction-following behavior? | Pretraining on a very large text corpus ; Supervised fine-tuning and preference tuning ; Tokenizing the text before any training starts | 1 | A base model only continues text. Post-training teaches the assistant behavior.
You want every answer in a strict house format, millions of times a day. What should you consider? | Retraining the base model from scratch each month ; A longer system prompt with the facts included ; Fine-tuning a smaller model on examples of that format | 2 | Fine-tuning shines for consistent style or format at scale, and a smaller tuned model can be cheaper.
```

```story
Think of training a new employee in three stages. First they read every book in the library (pretraining), so they know a lot but have no idea how to behave at work. Then a mentor shows them example conversations with customers (fine-tuning). Finally they get feedback on their real work, "that answer was better" (RLHF and reinforcement learning). Each stage changes a different thing.
```

# limits-and-hallucinations | Limits and hallucinations | 1 | 10
Models produce plausible text, not verified facts. Knowing the failure modes tells you where to add checks.

## What it is
A hallucination is a confident answer that is not supported by the model's knowledge or the provided sources. It happens because the training objective rewards fluent continuations, and the model has no built-in signal for "I do not know". Common failure areas are precise facts and citations, arithmetic done in its head, events after the knowledge cutoff, and long tasks where an early mistake carries forward.

Capabilities are also uneven. A model can solve a hard proof and then miscount letters in a word.

## Why it matters
Design around the failure instead of hoping it disappears. Give the model sources and ask for quotes. Let it call a calculator or run code instead of computing in its head. Add verification steps that check the output against something independent, such as tests, a schema or a second look from a separate prompt. Then measure how often it still fails (see the evals chapter).

## Worked example: three guard rails
Task: summarize a customer's contract. Rail one: give the model the contract text and tell it to answer only from it. Rail two: require a short quote for every claim, which you can check with a text search. Rail three: have a second prompt (or a person) verify a sample. None of these make the model perfect. Together they make errors visible.

## Where models are weak
Exact arithmetic with long numbers, precise dates and names that are rare, anything after the knowledge cutoff, and counting letters in words (tokens hide letters). Where possible give the model a tool: a calculator, a search, a code runner.

## Common mistake
Reading confidence as accuracy. The tone is equally fluent when the answer is wrong.

```resources
article | Why language models hallucinate | https://openai.com/index/why-language-models-hallucinate/ | OpenAI | Explains how training and benchmarks reward guessing over abstaining.
article | What We've Learned From A Year of Building with LLMs | https://applied-llms.org/ | Yan, Husain, Liu and others | Practitioner lessons on prompts, retrieval, evals and operations.
article | Building LLM applications for production | https://huyenchip.com/2023/04/11/llm-engineering.html | Chip Huyen | Where LLM apps break and how teams handle it.
```

```quiz
Which fix reduces arithmetic mistakes most reliably? | Letting the model call a calculator or run code ; Writing a longer and more polite prompt ; Raising the temperature a little | 0 | Hand exact computation to a tool instead of asking the model to compute it token by token.
How can you reduce made-up citations? | Ask the model to be honest in the prompt ; Provide sources and require checkable quotes ; Request shorter answers on every question | 1 | Grounding in given text and requiring checkable quotes gives you something to verify mechanically.
The model states a date in a confident tone. What does the tone tell you? | That the date is probably correct ; That the date came from a trusted database ; Nothing about whether the date is right | 2 | Fluent confidence is the same whether the answer is right or wrong, so check what matters.
```

```story
A lawyer once submitted a legal brief containing six court cases that a chatbot had invented, with convincing names and citations. None existed. The model was not lying. It produced text that looked like legal citations, because that is what it is built to do. The lawyer skipped the step of checking.
```

