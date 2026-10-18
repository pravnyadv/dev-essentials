# vision-and-image-generation | Vision and image generation | 1 | 15
Computers learned to see around 2012. A decade later they learned to draw.

## Seeing
Before 2012, image recognition used hand-designed features. AlexNet, a convolutional neural network (a network that slides small filters across an image to detect edges, then shapes, then objects), cut the ImageNet error rate sharply. Later models like ResNet passed human-level accuracy on that benchmark. Vision models now power photo search, medical imaging support, self-driving perception and document reading.

## Drawing
Generative adversarial networks (GANs, 2014) pitted a generator against a critic to produce realistic images. Diffusion models took over from 2020. A diffusion model is trained by adding noise to images step by step and learning to reverse it. To generate, it starts from pure noise and removes it step by step, guided by a text prompt. DALL-E, Midjourney and Stable Diffusion (open weights, 2022) made this mainstream. Video models such as Sora extended the idea to moving images.

## Why it matters
The same pattern of a scalable architecture, lots of data and lots of compute drove both. It also raised real questions about training data rights, deepfakes and provenance, which the field is still working out.

## A worked example: how a filter finds a face
A small filter, say 3 by 3 pixels, slides across the image. Where the pixels look like a vertical edge the filter produces a high number. Many filters produce many maps: edges, then corners, then eyes and noses. Stack layers and the last one says "face". The network learns the filters from examples. This sliding filter is called a convolution.

## A worked example: diffusion in four steps
Start with a clean photo of a dog. Add a little random noise, then more, until it is pure static. Train a network to guess the noise that was added at each step. To generate, start from static and repeatedly subtract the guessed noise, steered by your text prompt "a dog wearing a hat". After about 20 to 50 steps an image appears.

## Common mistake
Believing the image model understands what it draws. It captures how things usually look. That is why hands, text and counting objects were hard for early versions.

```resources
paper | Denoising Diffusion Probabilistic Models | https://arxiv.org/abs/2006.11239 | Ho, Jain, Abbeel | The paper that made diffusion practical.
article | The Illustrated Stable Diffusion | https://jalammar.github.io/illustrated-stable-diffusion/ | Jay Alammar | A visual walkthrough of how text becomes an image.
article | Convolutional Neural Networks for Visual Recognition | https://cs231n.github.io/convolutional-networks/ | Stanford CS231n | Notes that explain convolutions clearly.
video | But how do AI images and videos actually work? | https://www.youtube.com/watch?v=iv-5mZ_9CPY | 3Blue1Brown | Diffusion and CLIP explained visually.
```

```quiz
How does a diffusion model generate an image? | Copies a stored image ; Starts from noise and removes it step by step, guided by a prompt ; Draws pixel by pixel left to right | 1 | It is trained to reverse a noising process and applies that reversal at generation time.
What did AlexNet show? | Hand features were best ; Learned features at scale beat hand-designed ones ; GPUs are useless | 1 | It started the deep learning era in vision.
```

```story
A radiologist reviews hundreds of scans a day. A vision model flags the ten that look suspicious, so the radiologist looks at those first. It does not replace the doctor. It decides where their attention goes. That pattern, AI as a very fast first look, shows up across medicine, farming and manufacturing.
```

# games-and-reinforcement | Games and reinforcement learning | 1 | 15
Games are clean test beds: clear rules, a score, endless practice. They showed that learning from trial and error can beat human experts.

## What happened
Deep Blue (1997) beat the chess champion with brute-force search. AlphaGo (2016) beat Lee Sedol at Go using neural networks to guess good moves and positions, trained first on human games and then by playing itself. In game two, its move 37 surprised experts as something no human would play. AlphaZero (2017) learned chess, shogi and Go from scratch with only the rules, by playing itself, and beat the best programs.

## The idea: reinforcement learning
An agent takes actions in an environment and receives rewards. It learns a policy, a rule for choosing actions, that maximizes total reward. There are no labels, only a score that arrives late. The same idea later trained language models: with a reward for correct math or passing code tests, models learned to reason in longer chains of thought.

## Why it matters
Self-play and reward signals let a system exceed its teachers. The limit is that you need a reward you can compute. That is why reinforcement learning works best on games, math and code, where answers can be checked.

## A worked example: learning a tiny game by reward
A robot in a 3-cell corridor starts in cell 1. Cell 3 holds a reward of +10. Moving costs -1. At first it moves randomly. After a few hundred tries, it notices that moving right from cell 2 usually leads to +10 and records a high value for that action. Soon the value spreads backward: moving right from cell 1 is good too, because it leads to cell 2. This is the core idea of Q-learning.

## Why games came first
A game has clear rules, a clear score and can be played millions of times quickly and for free. Real life has none of those. That is why reinforcement learning worked first on Go and chess, and later on math and code, where answers can be checked automatically.

## Common mistake
Expecting the same method to work where there is no clear score. Defining the reward is the hard part. A badly chosen reward gets exploited: a cleaning robot rewarded for "no visible mess" may learn to hide the mess.

```resources
article | AlphaGo | https://deepmind.google/research/breakthroughs/alphago/ | Google DeepMind | The story and results of the match.
video | AlphaGo - The Movie | https://www.youtube.com/watch?v=WXuK6gekU1Y | Google DeepMind | A full documentary of the Lee Sedol match.
course | Spinning Up in Deep RL | https://spinningup.openai.com/ | OpenAI | A clear introduction to reinforcement learning concepts and code.
paper | Mastering Chess and Shogi by Self-Play with a General Reinforcement Learning Algorithm | https://arxiv.org/abs/1712.01815 | Silver et al. | The AlphaZero paper.
```

```quiz
What does a reinforcement learning agent optimize? | Labels ; Total reward over time ; Data size | 1 | It learns actions that maximize reward, not copies of labeled answers.
Why does RL work well on math and code? | They are popular ; Answers can be checked automatically to give a reward ; They are short | 1 | A computable reward is what the method needs.
```

```story
In March 2016 an AI called AlphaGo played a move in game two against champion Lee Sedol that commentators first thought was a mistake: a stone placed on the fifth line, far from the action. Professionals later called it beautiful and creative. The program had played millions of games against itself and found something people had missed for centuries.
```

# science-breakthroughs | AI in science: proteins, weather and more | 1 | 12
Pattern-finding models turned out to be useful for hard science problems with lots of data.

## Proteins
A protein is a chain of amino acids that folds into a 3D shape, and the shape determines what it does. Predicting the shape from the chain was a 50-year problem. AlphaFold 2 (DeepMind, 2020 to 2021) reached near-experimental accuracy at the CASP14 competition. DeepMind released predicted structures for hundreds of millions of proteins in a free database. In 2024 Demis Hassabis and John Jumper shared the Nobel Prize in Chemistry with David Baker for protein structure prediction and design.

## Other areas
Weather forecasting models trained on decades of data now match or beat traditional physics simulations on many measures at a fraction of the compute. Models help search for new materials and drug candidates, and they help read medical images. In math, systems solved olympiad-level problems, with some reaching gold-medal level at the International Mathematical Olympiad in 2025.

## Caveat
These systems are tools in a pipeline. Predictions need lab or expert verification, and models can be confidently wrong outside the data they were trained on.

## A worked example: why folding is hard
A short protein of 100 building blocks has an astronomical number of possible shapes. Trying them all is impossible. AlphaFold learned from about 170,000 known structures which blocks tend to sit near each other, and predicts the shape directly. The result is not magic. It is pattern knowledge from known proteins, applied to a new one.

## Beyond proteins
Weather models trained on decades of data now forecast many measures as well as traditional physics simulations, using far less computing. Models help sort millions of candidate materials and drug molecules into a short list worth testing. In each case AI narrows the search. People and labs still confirm.

## Common mistake
Treating a predicted structure as a measured one. It is a strong hypothesis. Check with experiments before relying on it for a drug.

```resources
article | AlphaFold | https://deepmind.google/science/alphafold/ | Google DeepMind | Overview and access to the structure database.
tool | AlphaFold Protein Structure Database | https://alphafold.ebi.ac.uk/ | EMBL-EBI | Look up predicted structures for proteins.
paper | Highly accurate protein structure prediction with AlphaFold | https://www.nature.com/articles/s41586-021-03819-2 | Jumper et al. | The Nature paper.
article | The Nobel Prize in Chemistry 2024 | https://www.nobelprize.org/prizes/chemistry/2024/press-release/ | Nobel Prize | The official announcement.
```

```quiz
What problem did AlphaFold address? | Drawing pictures ; Predicting a protein's 3D shape from its amino acid chain ; Weather ; Playing Go | 1 | Protein structure prediction was a long-standing open problem.
Why verify AI predictions in science? | They are usually wrong ; Models can be confidently wrong outside their training data ; It is required by law | 1 | Treat outputs as strong hypotheses.
```

```story
Proteins are tiny machines that run every cell, and each one folds from a string of building blocks into a specific 3D shape. For fifty years, finding one shape could take a lab a year of expensive work. After AlphaFold, a researcher studying a disease protein can look up its predicted shape in a free database in a few seconds and decide where to spend lab time.
```

# speech-and-multimodal | Speech and multimodal models | 1 | 12
Modern models take in and produce text, images, audio and video in one system.

## Speech
Speech recognition used to need separate acoustic and language models. Whisper (OpenAI, 2022) trained a transformer on about 680,000 hours of audio from the web and became a robust open speech-to-text model across many languages. Text-to-speech now sounds natural, and real-time voice conversation is a product feature.

## Multimodal
A multimodal model maps different kinds of input into a shared representation. Images are cut into patches and turned into vectors the same way tokens are, then processed by the same transformer. This lets a model read a chart, a screenshot or a handwritten note, and describe or reason about it. CLIP (2021) trained image and text encoders so matching pairs land close together, which powers image search and guides image generation.

## Why it matters for builders
Screenshots and documents can go straight in without a separate OCR step, and voice becomes an interface. Cost and latency go up with image and audio input, so check token usage for each type.

## A worked example: image as tokens
A 224 by 224 pixel image cut into 16 by 16 pixel patches gives 14 × 14 = 196 patches. Each patch becomes a vector, like a word. A transformer then reads those 196 vectors with attention, just like words in a sentence. Add the text "What color is the car?" and the model can look at the relevant patches while it answers.

## Costs to plan for
Images and audio use many more tokens than the text that describes them. A single high-resolution photo can cost as much as a few thousand words. Downscale before sending, and send audio in short segments.

## Common mistake
Trusting speech recognition on names, jargon and noisy audio. Always check those parts.

```resources
paper | Robust Speech Recognition via Large-Scale Weak Supervision | https://arxiv.org/abs/2212.04356 | OpenAI | The Whisper paper.
repo | Whisper | https://github.com/openai/whisper | OpenAI | Open-source speech recognition you can run locally.
paper | Learning Transferable Visual Models From Natural Language Supervision | https://arxiv.org/abs/2103.00020 | OpenAI | The CLIP paper.
```

```quiz
How does a transformer read an image? | Converts it to text first ; Cuts it into patches turned into vectors, like tokens ; Cannot read images | 1 | Vision transformers treat patches like tokens.
What does CLIP do? | Compresses video ; Places matching images and text near each other in vector space ; Writes code | 1 | That shared space powers image search and guidance.
```

```story
A video platform used to rely on volunteers to add subtitles. Now a speech model transcribes a one-hour lecture in minutes in dozens of languages, and a person only fixes the mistakes. Deaf viewers, people watching with the sound off and anyone searching for a quote all benefit from the same step.
```

# code-and-math | Code and math | 1 | 12
Code and math are where models improved fastest, because answers can be checked.

## Code
GitHub Copilot (2021) brought autocomplete from large models into editors. Chat assistants followed, then agents that read a repository, edit files and run tests. SWE-bench measures this on real GitHub issues: the model gets the repository and the issue and must make the tests pass. Scores climbed from low single digits in 2023 to a majority of tasks solved on its verified subset in 2025.

## Math
Reasoning models trained with reinforcement learning on problems with checkable answers improved quickly on competition math. In 2024 DeepMind's AlphaProof and AlphaGeometry reached silver-medal level on International Mathematical Olympiad problems. In 2025 several systems reached gold-medal level.

## Why it matters
When you can verify a result automatically, you can train on it and you can trust it more. That is why coding agents lead the agent field, and why building verification into your own tasks pays off.

## A worked example: why checkable work improves fastest
Suppose a model attempts 1,000 coding problems with hidden tests. Each attempt either passes or fails, with no argument. That pass/fail signal can be used to train the model: reinforce the attempts that passed. For an essay there is no such signal, only opinions. Domains with automatic checks, like code, math and games, therefore improve first.

## What benchmarks tell you
SWE-bench uses real issues from open-source projects. A model is scored on how many it resolves with all tests passing. The number rose quickly from 2023 to 2025, which tells you the trend, but your own codebase is different. Always try a candidate tool on your own code.

## Common mistake
Accepting generated code because it compiles. Read it, run the tests and look for unrequested changes.

```resources
tool | SWE-bench | https://www.swebench.com/ | Princeton NLP | Leaderboard of agents fixing real GitHub issues.
article | AI achieves silver-medal standard solving International Mathematical Olympiad problems | https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/ | Google DeepMind | AlphaProof and AlphaGeometry 2.
paper | Evaluating Large Language Models Trained on Code | https://arxiv.org/abs/2107.03374 | Chen et al. | The Codex paper that introduced HumanEval.
```

```quiz
Why did code and math improve fastest? | More data ; Results can be verified automatically ; They are easy | 1 | Checkable answers enable reward signals and trustworthy evaluation.
What does SWE-bench test? | Typing speed ; Fixing real GitHub issues so the tests pass ; Translation | 1 | It scores agents on real repository tasks.
```

```story
A developer opens a repository they have never seen and asks an agent to find where passwords are validated and add a length check. The agent searches, reads three files, makes the change and runs the tests. Doing it by hand would take an hour of orientation. Code is where AI gave the earliest daily value, because the result can be checked by running it.
```

# open-models | Open-weight models | 1 | 12
Some labs publish the trained weights, so anyone can download and run the model.

## What it means
Open-weight means the numbers that define the trained model are available. It is not always open source: licenses vary, and the training data and code are often not released. You can run an open-weight model on your own machine or server, fine-tune it and inspect it. Llama (Meta), Mistral, Qwen (Alibaba) and DeepSeek are well-known families. Hugging Face hosts close to a million models and the tools to use them.

## Trade-offs
Open weights give privacy, control, predictable cost at scale and the ability to customize. You take on serving, updates and safety. Frontier closed models are usually somewhat ahead on the hardest tasks, and the gap has varied over time. Smaller open models run on a laptop and are good enough for many tasks like classification and extraction.

## Open weights versus open source
"Open weights" means you can download the trained numbers. "Open source" in the strict sense would also include the training data and code. Most releases are the first kind. Always read the license: some forbid commercial use or have size limits.

## A worked example: choosing
You need to classify 5 million support tickets a month. A closed API at $0.50 per million tokens with 300 tokens per ticket costs about 1.5 billion tokens × $0.50/million = $750 a month. A small open model on one rented GPU may cost around $400 a month and keep data in-house, but you must run it and keep it updated. If volume is small, the API is easier. If volume is large or privacy matters, hosting can pay off.

## Common mistake
Assuming open means free. You pay in hardware, time and maintenance.

```resources
tool | Hugging Face Hub | https://huggingface.co/models | Hugging Face | The main place to find, compare and download open models.
repo | Ollama | https://github.com/ollama/ollama | Ollama | Run open models locally with one command.
repo | llama.cpp | https://github.com/ggml-org/llama.cpp | ggml | Efficient local inference in C and C++.
article | Open-source AI is the path forward | https://about.fb.com/news/2024/07/open-source-ai-is-the-path-forward/ | Mark Zuckerberg | Meta's argument for open weights.
tool | Gemma | https://deepmind.google/models/gemma | Google DeepMind | Google's lightweight open models.
course | Building with Llama 4 | https://www.deeplearning.ai/short-courses/building-with-llama-4 | DeepLearning.AI and Meta | Short course on using Llama models.
```

```quiz
Open-weight models usually let you | Download and run them yourself ; See all training data ; Skip licenses | 0 | The weights are published. Licenses and data availability vary.
Good reason to choose an open model? | Privacy and control ; It always beats closed models ; Zero setup | 0 | Running it yourself keeps data in-house, at the cost of operating it.
```

```story
A hospital cannot send patient notes to an outside service. It downloads an open-weight model and runs it on its own servers. The notes never leave the building. The model is a bit weaker than the best closed one, but for summarizing notes it is good enough, and the privacy problem disappears.
```

