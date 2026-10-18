# ai-origins | The beginnings: 1950 to the first AI winters | 1 | 12
AI started as a 1950s question: can a machine think? Two early ideas, rules and learning, competed for decades.

## What happened
In 1950 Alan Turing asked whether machines can think and proposed the imitation game, now called the Turing test. In 1956 a summer workshop at Dartmouth coined the term "artificial intelligence". Early programs proved theorems and played checkers, and researchers predicted human-level AI within a generation.

Two approaches formed. Symbolic AI wrote rules by hand: if the patient has a fever and a rash, then consider measles. Connectionism copied the brain's idea instead. In 1958 Frank Rosenblatt built the perceptron, a single artificial neuron that learns its weights from examples. In 1969 Minsky and Papert showed a single perceptron cannot learn simple functions like XOR. Many researchers and funders moved away from neural networks afterward.

## The winters
Promises ran far ahead of results. Machine translation and general problem solving turned out to be much harder than expected. Government reports cut funding in the 1970s, the first AI winter. Expert systems, hand-written rule bases for narrow jobs, brought a boom in the 1980s. They were expensive to maintain and brittle outside their narrow domain, and the market collapsed around 1987, the second winter.

IBM's Deep Blue beat world chess champion Garry Kasparov in 1997, but it won by searching millions of positions per second with hand-tuned evaluation. It did not learn.

## Why it matters
The pattern repeats: a method works on a narrow task, expectations balloon, then reality corrects. The shift that finally broke the cycle was not a smarter rule. It was letting models learn from large amounts of data with a lot of compute, which is the next chapter of the story.

## In plain words
Early AI was a bet on two different ideas. One bet said: intelligence is rules, so write enough of them. The other said: intelligence is learning, so build something that can learn from examples, like a brain does. For about forty years the rules side won the money, because rules were easier to run on slow computers. Learning needed two things nobody had yet: huge amounts of data and fast chips.

## A worked example: why rules break
Suppose you write rules to spot spam: "if the email contains FREE and MONEY, it is spam." It works for a week. Then spammers write "fr33 m0ney". You add a rule. They change again. A rule-writer is always one step behind, and a real inbox needs thousands of rules that interact in strange ways. A learning system instead sees ten thousand examples of spam and not-spam and finds the patterns itself, including ones no person would think to write down.

## Common mistake
Thinking the winters happened because the ideas were wrong. Neural networks were a good idea in 1958. They were starved of data and computing power. Good ideas can look like failures until the ingredients arrive.

```resources
article | Computing Machinery and Intelligence | https://academic.oup.com/mind/article/LIX/236/433/986238 | Alan Turing | The 1950 paper that introduced the imitation game.
article | A Proposal for the Dartmouth Summer Research Project on AI | http://jmc.stanford.edu/articles/dartmouth/dartmouth.pdf | McCarthy, Minsky, Rochester, Shannon | The 1955 proposal that gave the field its name.
article | History of artificial intelligence | https://en.wikipedia.org/wiki/History_of_artificial_intelligence | Wikipedia | A dated, well-sourced timeline of the early decades.
article | Artificial intelligence: a brief history | https://ourworldindata.org/brief-history-of-ai | Our World in Data | Charts of how training compute, data and capability grew.
```

```quiz
Why did funding for neural networks drop in the late 1960s? | They were too expensive ; A single perceptron could not learn simple functions like XOR ; Computers were banned | 1 | Minsky and Papert's analysis showed the limits of single-layer perceptrons. Multi-layer networks trained with backpropagation came later.
What is the core difference between symbolic AI and the learning approach? | Symbolic uses rules written by people, learning fits parameters from data ; Symbolic is faster ; Learning needs no computers | 0 | Symbolic systems encode knowledge by hand. Learning systems extract it from examples.
```

```story
In 1966 a program called ELIZA played a therapist by matching patterns in what you typed and turning them into questions. "I am sad" became "Why are you sad?" Some users poured their hearts out to it. Its creator was alarmed: it understood nothing. That gap between sounding smart and being smart is the oldest theme in AI.
```

# ml-basics | Machine learning basics | 1 | 15
Machine learning means fitting a function to examples instead of writing the rules yourself. A few ideas cover most of it.

## Three ways to learn
Supervised learning has inputs with the right answers attached: emails labeled spam or not spam, houses with sale prices. The model learns the mapping. Unsupervised learning has no answers: the model finds structure, such as grouping similar customers. Reinforcement learning learns from rewards after actions, as in game playing. Language models use a clever variant of supervised learning: the "answer" for each position is simply the next token in the text, so no human labeling is needed.

## Two kinds of prediction
Classification picks a category (spam or not). Regression predicts a number (a price). Both work the same way: compute a prediction, compare with the truth using a loss, adjust parameters to reduce it.

## Features, training and testing
A feature is an input measurement, such as a house's area or age. Data is split into a training set that the model learns from, a validation set used to tune choices, and a test set touched once at the end. If a model scores far better on training data than on validation data, it is overfitting: memorizing instead of learning. More data, simpler models and regularization help.

## Classic machine learning still matters
Gradient-boosted trees often beat neural networks on tables of numbers. Recommender systems, fraud and anomaly detection, forecasting and ranking are mostly classic machine learning. A common mistake is reaching for an LLM when a small model on your own data is cheaper, faster and easier to evaluate.

## A worked example: predicting a house price
Say you have five houses. Area in square meters and price in thousands: (50, 150), (70, 210), (90, 270), (110, 330), (130, 390). A model learns a line, price = 3 × area. For a new 100 square meter house it predicts 300. That is all supervised learning is: find a function that fits the examples, then use it on new inputs. Real models have millions of inputs and curvy functions, but the loop is the same: guess, measure the error, adjust.

## Why we split the data
Imagine studying for an exam by memorizing the exact practice questions. You would score 100 percent on the practice and fail the exam. A model can do the same. So we hide some data (the test set) and only look at it at the end. If the score on hidden data is far lower than on practice data, the model memorized instead of learned.

## Common mistakes
Testing on the same data you trained on, which gives a flattering and meaningless score. Using an LLM for a job where a small model on your own table of numbers would be cheaper, faster and easier to check.

```resources
course | Machine Learning Specialization | https://www.coursera.org/specializations/machine-learning-introduction | Andrew Ng | The standard first course, free to audit.
course | Intro to Machine Learning | https://www.kaggle.com/learn/intro-to-machine-learning | Kaggle | Short hands-on lessons in the browser.
video | Machine Learning Fundamentals | https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF | StatQuest | Clear videos on overfitting, bias and variance.
book | The Hundred-Page Machine Learning Book | https://themlbook.com/ | Andriy Burkov | A compact overview, read first and pay if useful.
```

```quiz
Spam filter trained on emails labeled spam or not. What kind of learning? | Supervised ; Unsupervised ; Reinforcement | 0 | Labels are the correct answers the model learns to predict.
Training accuracy 99 percent, validation accuracy 70 percent. What is happening? | Overfitting ; Underfitting ; Nothing | 0 | The model memorized the training data and does not generalize.
```

```story
A bank wants to know which loan applicants will not repay. A rule-writer would guess at rules ("unemployed means risky"). A machine learning engineer instead gives the computer ten years of past loans with the outcome of each, and lets it find what actually predicted trouble. It often finds things the rule-writer never thought of, and sometimes things nobody should use, which is why humans still review the results.
```

# ml-and-deep-learning | Machine learning and the deep learning turn | 1 | 15
Between 1986 and 2016, three ingredients came together: a way to train deep networks, large datasets and GPUs. Then the results arrived all at once.

## Learn instead of program
Machine learning flips programming. Instead of writing rules, you provide examples of inputs and desired outputs, and an algorithm adjusts a model until it fits. In 1986 Rumelhart, Hinton and Williams popularized backpropagation, the method that trains networks with many layers. In the 1990s Yann LeCun's convolutional networks read handwritten digits on bank checks.

## The 2012 moment
ImageNet was a dataset of over a million labeled images, started by Fei-Fei Li in 2009. In 2012 a convolutional network called AlexNet, trained on two gaming GPUs, cut the top-5 error of the annual ImageNet contest from about 26 percent to about 15 percent. The runner-up methods were hand-engineered feature pipelines. After that, nearly every field moved to deep learning.

## What came after
Word2vec in 2013 showed that words could be turned into vectors where directions carry meaning. Sequence-to-sequence networks with attention improved translation in 2014 and 2015. ResNets made networks hundreds of layers deep trainable in 2015. In 2016 DeepMind's AlphaGo beat Lee Sedol at Go, a game thought to be a decade away. Each success used the same recipe: a flexible model, lots of data, lots of compute.

## What "deep" means
A neural network is layers of simple units. "Deep" just means many layers. In an image model, the first layer learns to spot tiny edges, the next combines edges into corners and curves, the next combines those into eyes and wheels, and the last layer says "cat". Nobody programs those steps. The layers fit themselves to the data by training.

## A worked example: why GPUs mattered
A network's main job is multiplying big grids of numbers. A normal processor does a few calculations at a time. A graphics card (GPU) was built to color millions of pixels at once, so it can do thousands of multiplications in parallel. Training that took months on a regular chip could take days. The idea of deep networks was old. GPUs plus the ImageNet dataset made it practical.

## Common mistake
Thinking deep learning replaced everything. It dominates images, speech and language, while simpler methods still win on many tables of business data.

```resources
video | But what is a neural network? | https://www.youtube.com/watch?v=aircAruvnKk | 3Blue1Brown | The best visual introduction to what networks compute.
article | ImageNet Classification with Deep Convolutional Neural Networks | https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html | Krizhevsky, Sutskever, Hinton | The AlexNet paper.
article | The Unreasonable Effectiveness of Recurrent Neural Networks | https://karpathy.github.io/2015/05/21/rnn-effectiveness/ | Andrej Karpathy | A readable look at language models just before transformers.
paper | Neural Machine Translation by Jointly Learning to Align and Translate | https://arxiv.org/abs/1409.0473 | Bahdanau, Cho, Bengio | Where the attention mechanism first appeared.
```

```quiz
What changed the field in 2012? | A new programming language ; A deep network trained on GPUs beat hand-engineered methods on ImageNet ; A new law of physics | 1 | AlexNet showed that learned features at scale beat hand-designed ones, and the field followed.
What does machine learning replace? | Computers ; Hand-written rules with parameters fitted from examples ; Data | 1 | You supply examples and a training algorithm finds the rules.
```

```story
Before 2012, to teach a computer to recognise cats you had to describe cats: pointy ears, whiskers, certain edges. Teams of researchers spent years inventing such descriptions. Then a network trained on a million labelled photos found its own description, better than theirs, in about a week on two gaming graphics cards. Almost every lab changed direction that year.
```

# transformer-era | The transformer launch and the models that followed | 1 | 15
In June 2017 a Google paper introduced the transformer. Within three years it had replaced almost every other architecture for language.

## The launch
"Attention Is All You Need" (Vaswani et al., 2017) dropped recurrence. Earlier models read text one token at a time, which was slow to train and forgot early words. The transformer processes all tokens in parallel and lets each one attend to the others. That fit GPUs well, so models could grow.

## Two branches
In 2018 Google's BERT read text in both directions and became the standard for understanding tasks like search and classification. OpenAI's GPT read left to right and predicted the next token, which is also how it generates text. GPT-2 (2019, 1.5 billion parameters) wrote surprisingly coherent paragraphs. GPT-3 (2020, 175 billion parameters) could do new tasks from a few examples in the prompt, with no retraining. That behavior is called in-context learning, and it is why prompting became a skill.

## Scaling laws
In 2020 researchers at OpenAI showed that test loss falls as a smooth power law as you increase parameters, data and compute. In 2022 DeepMind's Chinchilla work found that many large models were undertrained: for a fixed compute budget, parameters and training tokens should grow together, roughly 20 tokens per parameter. This predictability is why labs were willing to spend huge sums on larger runs.

## Two ways to learn language
BERT learns by hiding a word in the middle of a sentence and guessing it: "The cat sat on the ___ and purred." Because it sees words on both sides, it is good at understanding. GPT learns by hiding the future: given "The cat sat on the", guess the next word. That is exactly the job of writing text, so GPT-style models became the chatbots.

## A worked example: growth in a few years
GPT-1 (2018) had about 117 million parameters. GPT-2 (2019) had 1.5 billion, roughly 13 times more. GPT-3 (2020) had 175 billion, another 117 times. Each jump needed more data and compute, and each brought new abilities nobody had explicitly trained for, like translating a sentence after seeing two examples in the prompt.

## Common mistake
Calling the transformer "the AI". It is an architecture, a way of wiring a network. What made chatbots was that architecture plus huge data, huge compute and later, training to follow instructions.

```resources
paper | Attention Is All You Need | https://arxiv.org/abs/1706.03762 | Vaswani et al. | The transformer paper.
paper | BERT | https://arxiv.org/abs/1810.04805 | Devlin et al. | Bidirectional pretraining for understanding tasks.
paper | Language Models are Few-Shot Learners | https://arxiv.org/abs/2005.14165 | Brown et al. | The GPT-3 paper that showed in-context learning at scale.
paper | Scaling Laws for Neural Language Models | https://arxiv.org/abs/2001.08361 | Kaplan et al. | Loss as a power law in size, data and compute.
paper | Training Compute-Optimal Large Language Models | https://arxiv.org/abs/2203.15556 | Hoffmann et al. | The Chinchilla paper on balancing parameters and tokens.
article | The Illustrated GPT-2 | https://jalammar.github.io/illustrated-gpt2/ | Jay Alammar | A visual walk through a decoder-only transformer.
```

```quiz
Why did the transformer scale better than earlier language models? | It processes all tokens in parallel, which suits GPUs ; It has fewer parameters ; It does not need data | 0 | Parallel training over tokens made it practical to train much larger models on much more data.
What did GPT-3 show? | Models can only be fine-tuned ; A big enough model can learn new tasks from examples in the prompt ; Attention is unnecessary | 1 | In-context learning is why prompting became useful.
```

```story
Imagine reading a long sentence one word at a time and having to remember everything in your head. By the end, the start has faded. That was how older language models worked. The transformer lets the model glance back at every earlier word at once and decide which ones matter. It could also train on all the words in parallel, so it could be made much bigger, much faster.
```

# chatgpt-and-the-race | ChatGPT and how companies kept improving | 1 | 18
A raw language model is not a product. Post-training, an interface and a lot of scale turned it into one, then labs kept improving it on several fronts at once.

## The product moment
OpenAI's InstructGPT work in 2022 used human feedback to make GPT-3 follow instructions. On 30 November 2022 OpenAI released ChatGPT, a chat interface on a model tuned this way. It reached a hundred million users in about two months. In 2023 Anthropic released Claude, Meta released Llama with downloadable weights, and Google followed with its Gemini models. GPT-4 added image input and much stronger reasoning.

## The levers labs pulled
More scale: larger runs on more compute. Better data: filtering, deduplication and synthetic data. Better post-training: preference tuning, then reinforcement learning on tasks with checkable answers. Test-time compute: reasoning models, starting with OpenAI's o1 in late 2024 and the open DeepSeek-R1 in early 2025, spend extra tokens thinking and improve at math and code. Longer context: from a few thousand tokens to hundreds of thousands and beyond. Efficiency: mixture-of-experts, distillation of big models into small ones, and quantization. Multimodality: images, audio and video in and out. Tools: the model calls code, search and APIs, which led to agents.

## The shape of the market
By 2026 each lab ships a family of sizes, from a large model for hard problems to a small one for cheap, fast work. Open-weight models trail the frontier by a modest margin and can be run on your own hardware. The consequence for builders is that models change every few months, so design for swapping them and keep your own evals.

## Why it was suddenly good
GPT-3 could write, but it often ignored what you asked. Two steps fixed that. First, people wrote thousands of example conversations (a question and a good answer) and the model was trained on them. Second, humans ranked pairs of answers ("this one is better") and the model was nudged toward the better kind. That second step is called RLHF, reinforcement learning from human feedback. It turned a text predictor into an assistant.

## A worked example: what labs actually improved
Think of a car company. Each year it improves the engine (bigger training runs), the fuel (cleaner data) and the driving lessons (post-training). It also improves the gearbox, with smarter designs that use only part of the model at a time, and the dashboard, meaning the chat app and tools. Progress after 2022 came from all of these at once, not from one trick.

## Common mistake
Assuming the newest model is always best for your task. Different models trade off quality, speed and price. Test on your own examples.

```resources
article | Introducing ChatGPT | https://openai.com/index/chatgpt/ | OpenAI | The announcement post from November 2022.
paper | Training language models to follow instructions with human feedback | https://arxiv.org/abs/2203.02155 | OpenAI | The InstructGPT paper.
paper | Llama 2 | https://arxiv.org/abs/2307.09288 | Meta | A detailed open description of how a chat model is trained.
article | Learning to reason with LLMs | https://openai.com/index/learning-to-reason-with-llms/ | OpenAI | The o1 announcement of test-time reasoning.
paper | DeepSeek-R1 | https://arxiv.org/abs/2501.12948 | DeepSeek | An open recipe for reasoning via reinforcement learning.
article | State of AI | https://www.stateof.ai/ | Air Street Capital | Yearly free report that summarizes research, industry and policy.
```

```quiz
What turned GPT-3 into ChatGPT? | A bigger model only ; Instruction tuning with human feedback plus a chat interface ; A new architecture | 1 | Post-training made the model follow instructions, and the interface made it usable.
What is test-time compute? | Faster chips ; Spending extra tokens thinking before answering ; Testing the code | 1 | Reasoning models trade latency and cost for accuracy on hard problems.
```

```story
In November 2022 a research lab put a chat box on top of a model that had existed for months in a developer tool. Nothing about the model had changed overnight, but the box made it usable by anyone. A hundred million people tried it within about two months. The lesson: a capability becomes a revolution when someone makes it easy to use.
```

# scaling-laws | Why bigger worked: scaling laws | 2 | 12
Loss falls as a predictable power law when you add parameters, data or compute. That predictability financed the whole era.

## The math, lightly
Test loss L as a function of model size N follows roughly L(N) = (Nc / N)^α, with a small exponent α, around 0.07 for the early OpenAI fits. A power law is a straight line on a log-log plot. Each time you multiply N by 10, loss drops by the same factor, 10^(-α), which is about 15 percent for α = 0.07.

Chinchilla refined this: for a compute budget C, the best split gives parameters and tokens that grow together, and a good rule is about 20 training tokens per parameter. A 70 billion parameter model should see around 1.4 trillion tokens.

## Example
Suppose a 1B model has loss 3.0. With α = 0.07, a 10B model has loss 3.0 × 10^(-0.07) = 3.0 × 0.851 = 2.55. Another 10x gives 2.17. Each step costs ten times more compute for a smaller absolute gain, which is why labs also look for gains elsewhere: better data, reasoning at inference time and tools.

## What to take from it
Scaling is a trend, not a guarantee of every skill. It tells you that bigger runs reliably improve average loss, not when a particular ability will appear. It also explains why training tokens are as important as parameters.

## Reading the exponent
An exponent of 0.07 sounds tiny, and it is. It means progress is steady but slow in absolute terms. To halve the loss with that exponent you would need to multiply the model size by about 2^(1/0.07), which is around 20,000 times. That is why labs build enormous data centers and why they also hunt for other gains, like better training data and letting models think longer at answer time.

## A worked example with Chinchilla
You have a budget to train a model. Option A: 280 billion parameters on 300 billion tokens. Option B: 70 billion parameters on 1.4 trillion tokens. Chinchilla found B wins at the same cost, because A was too big for how little data it saw. Rule of thumb: about 20 tokens of training text per parameter.

## Common mistake
Treating scaling laws as a promise that any skill will appear at some size. They predict average error, not when a specific ability such as reliable arithmetic will show up.

```resources
paper | Scaling Laws for Neural Language Models | https://arxiv.org/abs/2001.08361 | Kaplan et al. | The original power-law fits.
paper | Training Compute-Optimal Large Language Models | https://arxiv.org/abs/2203.15556 | Hoffmann et al. | The 20 tokens per parameter result.
article | Scaling laws | https://epoch.ai/blog/scaling-laws-literature-review | Epoch AI | A literature review of the evidence and its limits.
```

```quiz
Loss follows L = (Nc/N)^0.07. What happens to loss when N grows 10x? | It drops about 15 percent ; It halves ; It stays the same | 0 | 10^(-0.07) is about 0.85, so loss falls by roughly 15 percent.
Chinchilla's rule of thumb? | 1 token per parameter ; About 20 training tokens per parameter ; Parameters only | 1 | Compute-optimal training balances model size with the amount of data.
```

```story
A farmer notices that every extra bag of fertilizer adds a bit more corn, but each bag adds less than the one before. The pattern is so regular that she can predict next year's harvest from this year's spending. Scaling laws are that regularity for AI: spend ten times more on size, data and compute, and the error drops by a predictable amount.
```

# ai-engineer-role | What is an AI engineer? | 1 | 10
An AI engineer builds products on top of existing models. It is a different job from training the models.

## The roles
An AI researcher invents new methods and trains frontier models. A machine learning engineer trains and deploys custom models on an organization's data. An AI engineer uses pretrained models through APIs or open weights, and builds the system around them: prompts, retrieval, tools, evals and deployment. Software engineers already have most of the skills: APIs, databases, testing and operations. What is new is working with a non-deterministic component.

## What the work looks like
Choose a model. Design prompts and context. Add retrieval and tools. Build evals to know whether it works. Trace and monitor it in production. Control cost and latency. Keep it safe. The roadmap in this site follows that order.

## AI is narrow, AGI is a goal
All current systems are narrow in the sense that they have uneven abilities: superhuman on some tasks and brittle on others. AGI, artificial general intelligence, has no agreed definition. Do not design around it. Design around what the model measurably does on your task today.

## How to grow
Build small projects that break in interesting ways. Read traces of your own system. Learn evals early. Keep a short list of sources and ignore the noise.

## A day in the life of an AI engineer
Morning: read yesterday's failed conversations from the assistant and group them by cause. Midday: change a prompt, add a missing tool, rerun the test set to see if the pass rate moved. Afternoon: check cost and speed dashboards, review a pull request, talk to the people who use the product. Notice how little of it is "training a model" and how much is testing, reading and fixing.

## What you need to start
Basic programming, comfort reading error messages, curiosity about why something failed, and the habit of measuring. Math helps for understanding but is not required to build. This path covers the math in a gentle way so you can follow the research when you want to.

## Common mistake
Waiting to feel "ready". The field changes every few months, so nobody is. Build something small this week.

```resources
tool | roadmap.sh AI Engineer | https://roadmap.sh/ai-engineer | roadmap.sh | A community roadmap of the skills, to compare with this path.
article | The Rise of the AI Engineer | https://www.latent.space/p/ai-engineer | swyx | The essay that named the role.
article | Start AI Engineering in 2026 | https://github.com/louisfb01/start-ai-engineering | Louis-François Bouchard | A learning guide organized by how you like to learn.
```

```quiz
What is the main difference between an AI engineer and an ML engineer? | AI engineers build on pretrained models, ML engineers train custom models ; AI engineers do not code ; No difference | 0 | The first builds systems around existing models, the second trains models.
Why not design around AGI? | It is illegal ; It has no agreed definition or test ; It is too cheap | 1 | Design around measured behavior on your task.
```

```story
Two friends learn about AI. One spends two years studying how to train models and joins a research lab. The other learns to call models well, add the company's documents and tests, and ships a support assistant in six weeks. Both are valuable, and the second one is what most companies are hiring for.
```

