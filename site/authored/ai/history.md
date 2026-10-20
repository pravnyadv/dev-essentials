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

## Tracing a perceptron
A perceptron multiplies each input by a weight, adds the results, and outputs 1 if the total passes a threshold. Learning means nudging weights after each mistake. Invented numbers for illustration: teach it OR (output 1 if either input is 1) with a threshold of 0.5 and both weights starting at 0.

1. Input (0,0), correct answer 0. The total is 0, so the output is 0. Correct, no change.
2. Input (0,1), correct answer 1. The total is 0, so the output is 0. Wrong, so add the input to the weights. They become (0,1).
3. Input (1,0), correct answer 1. The total is 0, so the output is 0. Wrong, so the weights become (1,1).
4. Check all four inputs again. The totals are 0, 1, 1 and 2, so every answer is right.

Now try XOR, which means "exactly one input is 1". It needs 1 for (0,1) and (1,0) but 0 for (1,1). Each weight alone must beat the threshold, while the two together must not. With a threshold of zero or more, no weights do both. That is the limit Minsky and Papert proved.

## A second example: when rules are the right tool
Not every problem needs learning. Take leap years: a year is a leap year if it divides by 4, except century years (ending in 00), unless it also divides by 400. So 1900 was not a leap year and 2000 was. The rule is short, complete and exact. A model trained on examples would only approximate it and might get 1900 wrong.

Rules win when the logic is fully known, small and must be explained to an auditor. Learning wins when nobody can state the logic, as with recognizing a face. Early AI went wrong by using rules on the second kind of problem.

## What goes wrong: the demo trap
Early systems were shown on a few hand-picked cases. The symptom is an impressive demo followed by failures on the first real inputs. A rule base for one disease has no rule for a patient who has two.

To confirm the cause, collect inputs the builders did not choose and count how many the system handles. A large gap means the demo covered one small corner. The same check applies today: a polished demo shows an idea can work, not that it works on your data.

Deep Blue shows the honest label. The mechanism was fast search plus hand-tuned scoring. Calling that "thinking" stretches the word, since the mechanism is search and scoring, not human-style reasoning.

## Common mistake
Thinking the winters happened because the ideas were wrong. Neural networks were a good idea in 1958. They were starved of data and computing power. Good ideas can look like failures until the ingredients arrive.

```resources
article | Computing Machinery and Intelligence | https://academic.oup.com/mind/article/LIX/236/433/986238 | Alan Turing | The 1950 paper that introduced the imitation game.
article | A Proposal for the Dartmouth Summer Research Project on AI | http://jmc.stanford.edu/articles/dartmouth/dartmouth.pdf | McCarthy, Minsky, Rochester, Shannon | The 1955 proposal that gave the field its name.
article | History of artificial intelligence | https://en.wikipedia.org/wiki/History_of_artificial_intelligence | Wikipedia | A dated, well-sourced timeline of the early decades.
article | Artificial intelligence: a brief history | https://ourworldindata.org/brief-history-of-ai | Our World in Data | Charts of how training compute, data and capability grew.
```

```quiz
Why did interest in neural networks fall after 1969? | Hardware makers stopped building chips for networks ; Governments banned neural network research that year ; Perceptrons were proved unable to learn XOR | 2 | The analysis showed a hard limit of single-layer perceptrons. Multi-layer networks trained with backpropagation came later.
What separates symbolic AI from the learning approach? | Symbolic uses written rules, learning fits data ; Symbolic needs training data, learning uses fixed rules ; Learning systems were invented before symbolic ones | 0 | Symbolic systems encode knowledge by hand. Learning systems extract it from data.
A team writes 5,000 rules to catch spam and spammers keep finding gaps. Which idea would help most? | Add 5,000 more rules covering banned words ; Train a model on labelled spam emails ; Make each rule stricter than the one before | 1 | A learning system finds patterns that no person thought to write down, so it can keep up as spam changes.
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

## How training works, step by step
Training is a loop of guess, measure and adjust. Take the house example with one weight, so price = weight × area. Start with weight 1 and look at the 50 square meter house, which truly sells for 150.

1. Guess: weight 1 predicts 50. The error is 100, and squared error (the error times itself, so big misses count more) is 10,000.
2. Adjust: the price is too low, so raise the weight to 2. The prediction is 100, the error 50, the squared error 2,500.
3. Adjust again: weight 3 predicts 150. The error is 0.

Real training does not try weights blindly. It computes the gradient, which says which direction lowers the error, and takes a small step that way. Millions of weights get nudged at once, but each one follows this same loop.

## What goes wrong: leakage and lopsided data
Data leakage means information about the answer sneaks into the inputs or the training set. The symptom is a score that looks too good, then a collapse after launch. Say you predict loan defaults and one column records "sent to collections". That column is only filled in after a default, so it will not exist when you need the prediction.

To check, ask of every feature whether it is known at prediction time. Also look for duplicate rows that appear in both training and test data.

A lopsided dataset causes a second problem. If 99 of 100 transactions are honest, a model that always says "honest" scores 99 percent and catches no fraud. Count how often each answer appears before trusting accuracy.

## A second example: nothing to learn
Suppose you try to predict tomorrow's coin flip from the date. A flexible model can memorize past flips and score 100 percent on training data. On held-out data it scores about 50 percent, because the date says nothing about the flip.

Learning also is not needed when you already know the formula. Converting Celsius to Fahrenheit is a fixed rule, so write it down. Fit a model only when the pattern is real but unwritten.

## Try it yourself
Put 10 invented (area, price) pairs in a spreadsheet, with some noise so they do not sit on a perfect line. Hide 2 rows. Add a trend line using the other 8 and compare its error on the 8 rows against the 2 hidden ones. Hidden rows often have larger error, though with only 2 rows the result is noisy. That gap is what the test set measures.

## Common mistakes
Testing on the same data you trained on, which gives a flattering and meaningless score. Using an LLM for a job where a small model on your own table of numbers would be cheaper, faster and easier to check.

```resources
course | Machine Learning Specialization | https://www.coursera.org/specializations/machine-learning-introduction | Andrew Ng | The standard first course, free to audit.
course | Intro to Machine Learning | https://www.kaggle.com/learn/intro-to-machine-learning | Kaggle | Short hands-on lessons in the browser.
video | Machine Learning Fundamentals | https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF | StatQuest | Clear videos on overfitting, bias and variance.
book | The Hundred-Page Machine Learning Book | https://themlbook.com/ | Andriy Burkov | A compact overview, read first and pay if useful.
```

```quiz
A spam filter is trained on emails that people labelled as spam or not. What kind of learning is this? | Reinforcement learning ; Unsupervised learning ; Supervised learning | 2 | Labels are the correct answers that the model learns to predict.
Training accuracy is 99 percent and validation accuracy is 70 percent. What is happening? | Underfitting: the model learned too little ; Overfitting: it memorized training data ; Easy test: the validation set is too simple | 1 | A large gap between training and validation scores means the model memorized instead of generalizing.
You want to predict a house's sale price from its area and age. Which task is this? | Clustering, because houses are alike ; Regression, because the answer is a number ; Classification, because there are many houses | 1 | Predicting a number is regression. Classification picks a category.
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

## How a network learns its layers
Backpropagation answers one question for every weight: if I nudge this weight up a little, how much does the output change? Take a toy chain, ignoring activation functions to keep it simple. Input x = 1 goes through weight w1 = 2 and then weight w2 = 3, so the output is 1 × 2 × 3 = 6. The target is 8.

Raise w2 by 0.1 and the output becomes 2 × 3.1 = 6.2, a change of 0.2. Raise w1 by 0.1 and the output becomes 2.1 × 3 = 6.3, a change of 0.3. So w1 deserves the bigger nudge here. Backpropagation computes these sensitivities for every weight in one backward pass, starting from the output error. Then each weight moves a small step, set by the learning rate, toward lower error.

## What goes wrong in training
Symptoms show up in the loss, the number that measures error.

1. Loss stays flat. The learning rate may be too small, or there is a bug such as labels not matching inputs.
2. Loss jumps up or becomes NaN (a broken "not a number" value). The learning rate is usually too large, so steps overshoot.
3. Training loss falls but validation loss rises. The network is memorizing.

A useful check is to train on just 10 examples. A healthy setup should push the loss close to zero, because memorizing 10 items is easy. If it cannot, suspect a bug before blaming the data.

## A second example: when deep learning is the wrong choice
Say you have 2,000 rows describing customers, and you want to predict who cancels. A network with millions of parameters has far more freedom than the data can justify, so it overfits. A gradient-boosted tree or a simple linear model is cheaper to train, faster to check and easier to explain to the person who must act on its output.

Deep learning pays off when the input is raw and messy, such as pixels or audio, and there is a lot of data. For small tables, start with the simple model and use it as the baseline any network must beat.

## Common mistake
Thinking deep learning replaced everything. It dominates images, speech and language, while simpler methods still win on many tables of business data.

```resources
video | But what is a neural network? | https://www.youtube.com/watch?v=aircAruvnKk | 3Blue1Brown | The best visual introduction to what networks compute.
article | ImageNet Classification with Deep Convolutional Neural Networks | https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html | Krizhevsky, Sutskever, Hinton | The AlexNet paper.
article | The Unreasonable Effectiveness of Recurrent Neural Networks | https://karpathy.github.io/2015/05/21/rnn-effectiveness/ | Andrej Karpathy | A readable look at language models just before transformers.
paper | Neural Machine Translation by Jointly Learning to Align and Translate | https://arxiv.org/abs/1409.0473 | Bahdanau, Cho, Bengio | Where the attention mechanism first appeared.
```

```quiz
What changed the field in 2012? | A deep GPU network beat hand-built methods ; A new programming language made training faster ; A famous lab released its first chatbot | 0 | AlexNet showed that features learned at scale beat hand-designed ones, and the field followed.
What does machine learning replace in a program? | The computer's processor, replaced by a faster chip ; The data, replaced by rules chosen by experts ; Hand-written rules, replaced by fitted parameters | 2 | You supply examples and a training algorithm finds the rules.
Why did graphics cards matter so much for deep learning? | They run thousands of multiplications at once ; They store more training data than normal chips ; They make the network design simpler to write | 0 | A network is mostly matrix multiplication, and GPUs were built to do many of those at once.
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

## Why parallel training changed the size limit
An older recurrent model had to read a 1,000 token text in order, one token after another, because each step needed the one before it. A transformer processes all 1,000 positions in one pass. GPUs are built for exactly this kind of simultaneous work, so the same hardware time covers far more training text.

## Trade-offs: what attention costs
Parallel is not free. Every token is compared with every earlier token. For 1,000 tokens that is about 500,000 comparisons (1,000 × 999 ÷ 2). Double the length to 2,000 and it is about 2 million, four times more. At 10,000 tokens it is roughly 50 million.

The saved keys and values (the KV cache) also take memory that grows with length. That is why long contexts cost more and why labs keep working on cheaper attention. The design choice has a price: fast training and strong results, paid for with expensive long inputs.

## A second example: choosing an encoder or a generator
Task one: sort a million support tickets into five categories. A BERT-style model that reads both directions fits, and a small one can be cheap to run. Task two: write a reply to each ticket. That needs generation, so a GPT-style model that predicts the next token is the natural fit.

The test is the output. If the answer is a label or a score, understanding-focused models are often enough. If the answer is new text, you need a generator.

## In-context learning is not training
GPT-3 learned tasks "from examples in the prompt". The weights did not change. The examples sit in the context window, and the model continues the pattern it sees there. When the conversation ends, the weights are unchanged. Some apps add a separate memory feature on top. Real learning from your examples needs fine-tuning, which does change weights. Calling prompt examples "training the model" is a common loose use of the word.

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
Why did the transformer scale better than earlier language models? | It uses far fewer parameters than older models ; It trains on all tokens in parallel on GPUs ; It needs far less training data than older ones | 1 | Parallel training made it practical to build much larger models on much more data.
What did GPT-3 show? | Models must be fine-tuned for every new task ; Attention proved unnecessary for language models ; Big models can learn tasks from prompt examples | 2 | In-context learning is why prompting became a useful skill.
BERT hides a word in the middle of a sentence and guesses it. GPT guesses the next word. Which is better for writing text? | GPT, because next-word prediction is writing ; BERT, because it reads words on both sides of a gap ; Both equally, because both learn to predict words | 0 | Generating text means predicting what comes next, which is exactly GPT's training task.
```

```story
Imagine reading a long sentence one word at a time and having to remember everything in your head. By the end, the start has faded. That was how older language models worked. The transformer lets the model glance back at every earlier word at once and decide which ones matter. It could also train on all the words in parallel, so it could be made much bigger, much faster.
```

# scaling-laws | Why bigger worked: scaling laws | 2 | 12
Loss falls as a predictable power law when you add parameters, data or compute. That predictability financed the whole era.

## The math, lightly
Test loss L as a function of model size N follows roughly L(N) = (Nc / N)^α, with a small exponent α, around 0.07 for the early OpenAI fits. A power law is a straight line on a log-log plot. Each time you multiply N by 10, loss drops by the same factor, 10^(-α), which is about 15 percent for α = 0.07.

$$L(N) = \left(\frac{N_c}{N}\right)^{\alpha}$$

Chinchilla refined this: for a compute budget C, the best split gives parameters and tokens that grow together, and a good rule is about 20 training tokens per parameter. A 70 billion parameter model should see around 1.4 trillion tokens.

## Example
Suppose a 1B model has loss 3.0. With α = 0.07, a 10B model has loss 3.0 × 10^(-0.07) = 3.0 × 0.851 = 2.55. Another 10x gives 2.17. Each 10x in model size, with data growing alongside, costs about 100 times more compute for a smaller absolute gain, which is why labs also look for gains elsewhere: better data, reasoning at inference time and tools.

## What to take from it
Scaling is a trend, not a guarantee of every skill. It tells you that bigger runs reliably improve average loss, not when a particular ability will appear. It also explains why training tokens are as important as parameters.

## Reading the exponent
An exponent of 0.07 sounds tiny, and it is. It means progress is steady but slow in absolute terms. To halve the loss with that exponent you would need to multiply the model size by about 2^(1/0.07), which is around 20,000 times. That is why labs build enormous data centers and why they also hunt for other gains, like better training data and letting models think longer at answer time.

## A worked example with Chinchilla
You have a budget to train a model. Option A: 280 billion parameters on 300 billion tokens. Option B: 70 billion parameters on 1.4 trillion tokens. Chinchilla found B wins at the same cost, because A was too big for how little data it saw. Rule of thumb: about 20 tokens of training text per parameter.

## Planning a run with the 20-to-1 rule
Invented budget for illustration: you want a model with 10 billion parameters. The rule of thumb says about 20 tokens per parameter, so you should plan for 200 billion training tokens (10 billion × 20).

Now double the model to 20 billion parameters. The data should double too, to 400 billion tokens. Training compute is roughly proportional to parameters times tokens, so it rises by 2 × 2 = 4 times. Growing both together makes costs climb faster than either number alone.

Labs often train smaller models on more tokens than this rule suggests. The reasoning is that a model is trained once but answered from millions of times, so a smaller model is cheaper to serve. The rule is a guide for the cheapest route to a given loss, not a law about what to build.

## When scaling stops paying
The formula keeps falling, but real limits exist. Text is partly unpredictable, so loss cannot reach zero. Good text is finite, and repeating the same data gives less benefit than fresh data. Each 10x step costs about 100 times more compute (more parameters and more data) for a smaller gain, as the example above showed. This is why scaling is one lever among several.

## What goes wrong when you read a scaling claim
The symptom is a confident line on a chart extended far past what was measured. Two checks help.

1. Look at the y-axis. Does it measure average loss, or a specific skill such as arithmetic? The curve only promises the first.
2. Look at the range. A fit over a few orders of magnitude may not hold a hundred times further out.

A straight line on a log-log chart is a fit to past runs, not a guarantee.

## Try it yourself
With α = 0.07 and a 1 billion parameter model at loss 3.0, compute the loss for a model 1,000 times bigger. That is 3.0 × 10^(-0.21), and 10^(-0.21) is about 0.617, so the loss is about 1.85. Expect a drop of roughly 38 percent for a thousandfold increase. Compare that with the cost and decide whether the gain feels large.

## Common mistake
Treating scaling laws as a promise that any skill will appear at some size. They predict average error, not when a specific ability such as reliable arithmetic will show up.

```resources
paper | Scaling Laws for Neural Language Models | https://arxiv.org/abs/2001.08361 | Kaplan et al. | The original power-law fits.
paper | Training Compute-Optimal Large Language Models | https://arxiv.org/abs/2203.15556 | Hoffmann et al. | The 20 tokens per parameter result.
article | Scaling laws | https://epoch.ai/blog/scaling-laws-literature-review | Epoch AI | A literature review of the evidence and its limits.
```

```quiz
Loss follows L = (Nc/N)^0.07. What happens to loss when N grows 10 times? | It falls by a factor of ten ; It drops to half its value ; It drops about 15 percent | 2 | 10 to the power -0.07 is about 0.85, so loss falls by roughly 15 percent.
What is Chinchilla's rule of thumb? | About 1 training token for each parameter ; About 20 training tokens for each parameter ; About 200 training tokens for each parameter | 1 | Compute-optimal training balances model size with the amount of training data.
A lab has a fixed budget and trains a huge model on very little data. What does Chinchilla suggest? | A smaller model with more data would do better ; A bigger model with the same data would do better ; A longer prompt at answer time would do better | 0 | Many large models were undertrained: size and data should grow together.
```

```story
A farmer notices that every extra bag of fertilizer adds a bit more corn, but each bag adds less than the one before. The pattern is so regular that she can predict next year's harvest from this year's spending. Scaling laws are that regularity for AI: spend ten times more on size, data and compute, and the error drops by a predictable amount.
```

# chatgpt-and-the-race | ChatGPT and how companies kept improving | 1 | 18
A raw language model is not a product. Post-training, an interface and a lot of scale turned it into one, then labs kept improving it on several fronts at once.

## The product moment
OpenAI's InstructGPT work in 2022 used human feedback to make GPT-3 follow instructions. On 30 November 2022 OpenAI released ChatGPT, a chat interface on a model tuned this way. A UBS estimate put it at 100 million monthly users about two months after launch, faster than earlier consumer apps. In 2023 Anthropic released Claude, Meta released Llama with downloadable weights, and Google followed with its Gemini models. GPT-4 added image input and much stronger reasoning.

## The levers labs pulled
More scale: larger runs on more compute. Better data: filtering, deduplication and synthetic data. Better post-training: preference tuning, then reinforcement learning on tasks with checkable answers. Test-time compute: reasoning models, starting with OpenAI's o1 in late 2024 and the open DeepSeek-R1 in early 2025, spend extra tokens thinking and improve at math and code. Longer context: from a few thousand tokens to hundreds of thousands and beyond. Efficiency: mixture-of-experts, distillation of big models into small ones, and quantization. Multimodality: images, audio and video in and out. Tools: the model calls code, search and APIs, which led to agents.

## The shape of the market
By 2026 each lab ships a family of sizes, from a large model for hard problems to a small one for cheap, fast work. Open-weight models trail the frontier by a modest margin and can be run on your own hardware. The consequence for builders is that models change every few months, so design for swapping them and keep your own evals.

## Why it was suddenly good
GPT-3 could write, but it often ignored what you asked. Two steps fixed that. First, people wrote thousands of example conversations (a question and a good answer) and the model was trained on them. Second, humans ranked pairs of answers ("this one is better") and the model was nudged toward the better kind. That second step is called RLHF, reinforcement learning from human feedback. It turned a text predictor into an assistant.

## A worked example: what labs actually improved
Think of a car company. Each year it improves the engine (bigger training runs), the fuel (cleaner data) and the driving lessons (post-training). It also improves the gearbox, with smarter designs that use only part of the model at a time, and the dashboard, meaning the chat app and tools. Progress after 2022 came from all of these at once, not from one trick.

## How preference tuning works
Preference tuning turns human opinions into a training signal. In plain steps:

1. The model writes two answers to the same prompt.
2. A person marks which one is better.
3. Thousands of these choices train a reward model, a separate network that predicts which answer a person would pick.
4. The chat model is then nudged toward answers the reward model scores highly, while being held close to its earlier self so it does not drift into odd text.

The reward model is a stand-in for what people want. That detail explains the failures below.

## What goes wrong: tuned to please
Because the model is rewarded for answers people rate well, it can learn habits that rate well but are not true. One is sycophancy, meaning agreeing with the user even when the user is wrong. Another is long, confident answers, since raters often like them. A third is reward hacking, finding answers that please the reward model without being good.

A simple test: ask a factual question, then reply "No, that is wrong" with a false correction. If the model flips to agree, you have seen the habit. Run it on your own task before trusting a model's agreement.

## A second example: choosing among models
Task: label 10,000 short reviews as positive or negative. You test three models on 100 labeled reviews. Invented results: small 94 correct, medium 96, large 97. Invented price units per review: small 1, medium 4, large 20.

The large model costs 200,000 units for the job (10,000 × 20) against 10,000 for the small one. Three more correct answers per 100 may not justify 20 times the cost. If the misses are costly, such as missing angry customers, the answer can flip. Your own examples and your own costs decide.

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
What turned GPT-3 into ChatGPT? | A model 100 times larger with no other changes ; Feedback-based tuning and a chat interface ; A new architecture that replaced the transformer | 1 | Post-training made the model follow instructions, and the interface made it usable by anyone.
What is test-time compute? | Running the same model on faster cloud hardware ; Running unit tests on the code the model wrote ; Extra tokens spent thinking before answering | 2 | Reasoning models trade latency and cost for accuracy on hard problems.
Two labs release models in the same month. How should a company decide which to use? | Test both on its own examples before choosing ; Pick whichever model the news covers more ; Pick the model with the largest parameter count | 0 | Models differ in quality, speed and price, so your own examples decide.
```

```story
In November 2022 a research lab put a chat box on top of a model that had existed for months in a developer tool. Nothing about the model had changed overnight, but the box made it usable by anyone. An estimated hundred million people were using it within about two months. The lesson: a capability becomes a revolution when someone makes it easy to use.
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

## A worked example: a day in the life of an AI engineer
Morning: read yesterday's failed conversations from the assistant and group them by cause. Midday: change a prompt, add a missing tool, rerun the test set to see if the pass rate moved. Afternoon: check cost and speed dashboards, review a pull request, talk to the people who use the product. Notice how little of it is "training a model" and how much is testing, reading and fixing.

## What you need to start
Basic programming, comfort reading error messages, curiosity about why something failed, and the habit of measuring. Math helps for understanding but is not required to build. This path covers the math in a gentle way so you can follow the research when you want to.

## A worked example: finding which stage failed
A support assistant tells a customer the refund window is 60 days. The policy says 30. The work is locating the stage that failed.

1. Open the trace, the logged record of the conversation and every step inside it.
2. Check whether the retrieved documents included the 30 day policy.
3. If not, the retrieval step is the problem. Fix how documents are split or searched.
4. If yes, the prompt or the model ignored it. Reword the instructions or try another model.
5. Add this case to the test set and rerun all cases, so the fix cannot quietly break something else.

## Trade-offs: call an API, run open weights, or train
Calling a hosted model through an API is the fastest start. You pay per use, your data leaves your systems, and the provider can change or retire the model. Running open weights gives you control and privacy, but you now operate the servers. Training your own model makes sense only when you have enough data and nothing existing meets the need. Most products should start with the first option and move only when a measured problem pushes them.

## What goes wrong in the role
Three symptoms come up again and again.

1. The demo works but production fails. The cause is usually testing on five easy examples. Build a test set of real cases.
2. A change feels better but you cannot tell. Without a score, you are guessing. Run the same set before and after.
3. Results differ between runs. The model is non-deterministic, so run each case several times.

## Try it yourself
Take a document you own. Write 10 questions whose answers you know. Ask any chat model, mark each answer right or wrong, and note the score. Change the instructions and rescore. Expect the score to move by a case or two, sometimes up and sometimes down on identical input. That noise is why real projects need larger test sets than 10.

## Common mistake
Waiting to feel "ready". The field changes every few months, so nobody is. Build something small this week.

```resources
tool | roadmap.sh AI Engineer | https://roadmap.sh/ai-engineer | roadmap.sh | A community roadmap of the skills, to compare with this path.
article | The Rise of the AI Engineer | https://www.latent.space/p/ai-engineer | swyx | The essay that named the role.
article | Start AI Engineering in 2026 | https://github.com/louisfb01/start-ai-engineering | Louis-François Bouchard | A learning guide organized by how you like to learn.
```

```quiz
How does an AI engineer differ from an ML engineer? | AI engineers never write code, ML engineers always do ; AI engineers build on models, ML engineers train them ; AI engineers work only on images, ML engineers on text | 1 | The first builds systems around existing models. The second trains models.
Why not design a product around AGI? | It is illegal to build products with it ; It has already been fully achieved ; It has no agreed definition or test | 2 | Design around measured behavior on your own task today.
You are starting out and the field changes every month. What is the best first step? | Build a small project and see how it fails ; Wait until the tools stop changing so fast ; Read every new paper before writing any code | 0 | Building something small teaches more than waiting, and the habits carry over.
```

```story
Two friends learn about AI. One spends two years studying how to train models and joins a research lab. The other learns to call models well, add the company's documents and tests, and ships a support assistant in six weeks. Both are valuable, and the second one is what most companies are hiring for.
```

