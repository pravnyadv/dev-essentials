# what-is-applied-ai | What applied AI is and how to pick a problem | 1 | 12
Applied AI means using models that already exist to solve a real problem for real people. The hard part is rarely the model. It is choosing a problem where a model helps and measuring whether it did.

## What it is
Research AI builds new models and methods. Applied AI takes a model, connects it to data and tools, tests it and fits it into a job someone already does. Most of the AI work in the world is applied.

Most applied problems fall into a few kinds of task. Predict a number (next month's sales). Sort things into groups (fraud or not fraud). Rank things (which video to show next). Read or write language. Understand images or sound. Choose actions in the physical world (a robot arm). Each kind has its own tools, covered in the lessons that follow.

## Picking a problem
Ask four questions. How often does the task happen? A task done once a year is not worth automating. What does a mistake cost? A wrong movie suggestion costs nothing, a wrong drug dose costs a lot. Do you have data, or can you get it? Can you tell if the answer was right? If you cannot measure success, you cannot improve it.

## A worked example: start with a baseline
A shop wants to predict which customers will cancel. Before any model, write the simplest rule: "customers who have not logged in for 30 days will cancel". Say it catches 40 of the 100 who cancel. That rule is your baseline. A model is only worth its cost if it beats the baseline by enough to matter. Many projects find that the rule gets most of the value.

## Common mistake
Starting with "we should use AI" instead of "this task costs us 200 hours a month". A tool searching for a problem usually finds a demo, not a result.

```resources
article | Rules of Machine Learning | https://developers.google.com/machine-learning/guides/rules-of-ml | Google | Practical advice, starting with "do not be afraid to launch without machine learning".
article | People + AI Guidebook | https://pair.withgoogle.com/guidebook/ | Google PAIR | How to decide whether and how AI fits a product.
article | Stanford AI Index | https://hai.stanford.edu/ai-index | Stanford HAI | Yearly data on how AI is used across industries.
course | Kaggle Learn | https://www.kaggle.com/learn | Kaggle | Short free lessons with code on applied machine learning.
```

```quiz
Which task is the best first candidate for AI? | A rare task where mistakes are very costly ; A one-time task with no way to measure it ; A frequent task with data and a clear success test | 2 | Frequent, measurable tasks with data are where a model can be tested and improved.
Why write a simple rule before building a model? | It gives a baseline the model must beat ; It makes the model train faster overall ; It removes the need to collect any data | 0 | Without a baseline you cannot tell whether the model adds value.
A team says "let us add AI" with no problem named. What is the risk? | They will pay too little for the models ; They build a demo that solves nothing real ; They will run out of training data soon | 1 | A solution without a problem has no way to measure success.
```

```story
A regional bakery chain hears that AI can forecast demand and hires a consultant. Before buying anything, the manager writes down last week's sales for each shop and guesses "same as the same day last week". That guess is wrong by about 8 percent. Any model now has a clear number to beat, and the manager can tell whether it was worth the cost.
```

# recommenders-and-ranking | Recommendation and ranking systems | 2 | 14
A recommender decides what to show you next. It works by turning people and items into lists of numbers and finding the pairs that fit.

## What it is
A recommender (or recommendation system) suggests items: videos, songs, products, posts. The classic idea is collaborative filtering: people who liked the same things in the past will probably like the same things in the future. You do not need to know anything about the items, only who interacted with what.

Modern systems learn an embedding (a list of numbers) for each user and each item, so a good match is a high dot product, the same operation you meet in the Building Blocks chapter. Large services work in two steps. First a fast stage picks a few hundred candidates from millions. Then a slower, more careful model ranks those few hundred.

## A worked example
A user is the vector [0.9, 0.1]: loves action, barely cares about romance. Movie A is [0.8, 0.2], mostly action. Movie B is [0.1, 0.9], mostly romance. Dot product with A: 0.9 × 0.8 + 0.1 × 0.2 = 0.74. With B: 0.9 × 0.1 + 0.1 × 0.9 = 0.18. A ranks first. In real systems the vectors have hundreds of numbers and the model learns them from clicks and watch time.

## What goes wrong
The cold start problem: a new user or a new item has no history, so there is nothing to match. Systems fall back to popular items or ask a few questions. A feedback loop: if you only show what people already click, you never learn what else they would like. The target matters too: optimizing clicks can promote sensational items, while optimizing "watched to the end" rewards something different.

## Common mistake
Measuring only accuracy on past data. What counts is what happens when real users see the new ranking, so teams run A/B tests that compare two versions on live traffic.

```resources
course | Recommendation Systems | https://developers.google.com/machine-learning/recommendation | Google | A short course on candidate generation, scoring and ranking.
article | Netflix Prize | https://en.wikipedia.org/wiki/Netflix_Prize | Wikipedia | The contest that made collaborative filtering famous, and why the winning model was not shipped.
article | Patterns for Building LLM-based Systems | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | Includes recommendation and ranking patterns beside language models.
```

```quiz
What does collaborative filtering rely on? | The text description of every item ; Overlap in what different people liked ; A hand-written list of rules for taste | 1 | It only needs the record of who interacted with which items.
A brand new user opens the app. Which problem appears? | Cold start, since there is no history to match ; Overfitting, since there is too much data ; Latency, since the model is too large | 0 | With no past behavior, the system has nothing to compare.
Why do big systems use a candidate stage first? | It lets them skip ranking altogether ; It is cheaper than using a vector database ; Ranking every item with a heavy model is too slow | 2 | A fast filter narrows millions to hundreds so a careful model can rank them.
```

```story
In 2006 Netflix offered one million dollars to anyone who could improve its movie predictions by 10 percent. A team won in 2009 with a blend of more than a hundred models. Netflix later said it never ran the full winner, because the engineering cost was too high for the gain. Simple and good enough often beats best on paper.
```

# forecasting-and-fraud | Forecasting, fraud and anomaly detection | 2 | 15
Many valuable AI systems predict a number or flag the odd one out. They use classical machine learning on tables, not chatbots.

## What it is
Forecasting predicts a future value from past values: sales, energy use, traffic. A good forecast starts with a naive guess such as "same as last week" and then adds patterns like trend and season. Classification sorts cases into labels, such as fraud or not. Anomaly detection finds cases that look unlike normal ones when you have few or no labeled examples of the bad kind.

For tables of numbers, simple models (linear models, decision trees, boosted trees) often match or beat large neural networks, train in seconds and are easier to explain.

## A worked example: forecast error
Actual sales over three days: 100, 120, 110. Forecast: 105, 115, 120. Errors: 5, 5, 10. The mean absolute error is (5 + 5 + 10) / 3 = 6.7 units a day. The naive "same as yesterday" forecast would be off by 20, 10, 10, so it has a mean error of 13.3 and the model has to beat that to be useful.

## A worked example: rare events
Out of 100,000 card payments, 100 are fraud. A model that always says "not fraud" is 99.9 percent accurate and catches nothing. This is class imbalance. Use precision (of the cases flagged, how many were right) and recall (of the real cases, how many were found). Say a model flags 200 payments and 80 are truly fraud. Precision is 80 / 200 = 40 percent. Recall is 80 / 100 = 80 percent. Which matters more depends on what a miss costs against what a false alarm costs.

## Common mistake
Using accuracy on rare events, or testing on data from before the model's training period. Test on later data than you trained on, since the model will always be used on the future.

```resources
book | Forecasting: Principles and Practice | https://otexts.com/fpp3/ | Hyndman and Athanasopoulos | Free, practical book on forecasting methods.
docs | scikit-learn: outlier detection | https://scikit-learn.org/stable/modules/outlier_detection.html | scikit-learn | Methods for flagging unusual cases, with code.
course | Kaggle Learn: Intro to Machine Learning | https://www.kaggle.com/learn/intro-to-machine-learning | Kaggle | Build a first model on a table in an hour.
```

```quiz
A model says "not fraud" every time and is 99.9 percent accurate. What does this show? | The model is nearly perfect ; Accuracy is misleading on rare events ; The data set is too large to use | 1 | With rare positives, always guessing the common label looks accurate while finding nothing.
Why compare a forecast against "same as last week"? | It is the fastest method to compute ; It proves the data is correct ; It sets a baseline any model must beat | 2 | A forecast is only worth its cost if it beats the simple guess.
When is anomaly detection a good fit? | You have few or no labeled examples of the bad cases ; You have thousands of labeled examples of every case ; You need to write long text for customers | 0 | It finds cases that differ from normal without needing labels for the rare kind.
```

```story
In 2021 the real estate company Zillow shut down its house-buying business after its pricing models paid more for homes than it could resell them for, losing hundreds of millions of dollars. The model was good on past data. The market moved faster than the forecast, which is the risk of every prediction about the future.
```

# computer-vision-in-practice | Computer vision in practice | 2 | 14
Computer vision means models that work with images and video. In practice, the hard parts are the data, the cost of mistakes and the camera.

## What it is
The main jobs are classification (what is in this image), detection (where are the objects, drawn as boxes), segmentation (which pixels belong to which object) and reading text (OCR). Modern systems start from a model pretrained on millions of images and fine-tune it on a few hundred of your own, which makes small projects possible. Vision-language models can also answer questions about an image in plain words, which is often enough for simple cases.

## Where it is used
Factories check parts for defects on a conveyor belt. Farms spot diseased plants from drone photos. Hospitals use models that flag suspicious areas on scans for a doctor to review. Banks read cheques and invoices. Phones unlock with a face. In each case a human usually reviews the uncertain cases.

## A worked example: a screening test
A hospital screens 1,000 scans. Ten show disease. The model finds 9 of the 10 (recall 90 percent) and raises 50 false alarms. It flagged 59 scans, of which 9 are real, so precision is 9 / 59, about 15 percent. That can still be a good screening tool, because a doctor reviews 59 scans instead of 1,000 and only 1 case was missed. The numbers decide whether it helps, not the headline accuracy.

## What goes wrong
Models learn shortcuts. A classifier trained on photos from one hospital may be reading the scanner's label, not the disease. A model trained in good light fails at night. Always test on images from a different place and time than the training set, and keep checking after launch because cameras and conditions change.

## Common mistake
Training and testing on images from the same camera session. The score looks great and falls apart in the real world.

```resources
course | Hugging Face Computer Vision Course | https://huggingface.co/learn/computer-vision-course | Hugging Face | Free course from basics to modern models.
paper | Dermatologist-level classification of skin cancer | https://www.nature.com/articles/nature21056 | Esteva et al. | A well-known study of a vision model on medical images.
repo | Tesseract OCR | https://github.com/tesseract-ocr/tesseract | Tesseract | A widely used open-source tool for reading text in images.
course | Practical Deep Learning for Coders | https://course.fast.ai/ | fast.ai | Hands-on course that builds image classifiers early on.
```

```quiz
What does object detection return? | One label for the whole image ; Boxes around each object found ; The text written inside the image | 1 | Detection says what is in the image and where it is.
Why can a model with low precision still help in screening? | A human reviews far fewer cases than before ; It removes all false alarms in the end ; It never misses a real case | 0 | A human checks the flagged few, which saves time if recall stays high.
A model works in the lab but fails on the factory floor. A likely cause? | The factory has fewer images in total ; The model is using the wrong programming language ; Lighting and cameras differ from the training data | 2 | A change in conditions between training and use breaks learned shortcuts.
```

```story
A car parts maker photographs every brake disc on a conveyor belt. The first model rejects good discs when a shadow falls across them, because most defect photos in the training set were taken on a darker shift. Adding photos from every shift and a lamp over the belt fixes more than a bigger model would have.
```

# speech-and-voice | Speech recognition and voice assistants | 2 | 13
Voice systems turn sound into text, think about it, and turn text back into sound. Each step adds delay, and delay decides whether it feels like a conversation.

## What it is
Speech recognition (ASR, or speech-to-text) converts audio to words. Text-to-speech (TTS) does the reverse. A voice assistant chains the two around a language model: listen, transcribe, think, write a reply, speak it. Some newer models take audio in and give audio out directly, which cuts steps and keeps tone.

Open models such as Whisper made good transcription cheap for many languages. Accuracy is measured with word error rate (WER): the number of substitutions, deletions and insertions divided by the number of words in the true transcript.

## A worked example: word error rate
The speaker says "turn the lights off in the kitchen" (7 words). The system writes "turn the light off in kitchen". One word is changed (lights to light), one is missing (the). That is 1 substitution + 1 deletion = 2 errors over 7 words, a WER of 2 / 7, about 29 percent.

## A worked example: the delay budget
Transcribing takes 0.3 seconds, the model 0.6 and speech 0.3. Total 1.2 seconds before the user hears anything. People notice gaps in talk quickly, so teams stream everything: start speaking the first sentence while the model writes the second, and stop the voice at once if the user interrupts.

## Where it is used
Meeting notes and captions, call-centre assistants, voice control in cars, language practice, and tools that read text aloud for people with low vision. Accents, background noise, and names are the usual failures, so test with the speakers you will actually serve.

## Common mistake
Testing with clean studio audio. Real users talk in cars and kitchens, and the error rate there can be several times higher.

```resources
repo | Whisper | https://github.com/openai/whisper | OpenAI | Open speech recognition model for many languages.
course | Hugging Face Audio Course | https://huggingface.co/learn/audio-course | Hugging Face | Free course on speech and audio models.
article | Patterns for Building LLM-based Systems | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | Design patterns that also apply to voice pipelines.
```

```quiz
What does word error rate measure? | How fast the system answers a question ; How many words in the audio are wrong ; How natural the voice sounds to people | 1 | WER counts substitutions, deletions and insertions against the true words.
Why do voice assistants stream their output? | Streaming makes the transcript more accurate in noise ; It lets them store the audio for later use ; It starts speaking before the whole answer exists | 2 | Streaming overlaps the steps, which cuts the wait the user feels.
A demo works in a quiet room. What should you do next? | Test with noise, accents and real names ; Launch it, since the demo proves it works ; Switch to a bigger language model first | 0 | Real conditions raise error rates, so test in them before launch.
```

```story
A clinic records doctor visits so notes write themselves. In the quiet demo the transcripts are nearly perfect. In real rooms, with a printer humming and a patient mumbling a drug name, it confuses two medicines that sound alike. The clinic adds a drug-name list and makes the doctor confirm each medication before the note is saved.
```

# robotics-and-automation | Robotics and process automation | 2 | 13
AI in the physical world is harder than AI on a screen, because the world pushes back. Process automation, which only moves data, is far easier and far more common.

## What it is
A robot works in a loop: sense (cameras, touch), decide, act (move motors), and repeat many times a second. Older robots followed fixed programs and needed a controlled setting, like a car factory line. Newer approaches learn from demonstrations or from trial and error in simulation, and some models take camera images and an instruction in words and output motor actions.

Process automation is software doing office work: reading an invoice, filling a form, routing a ticket. Language models made it flexible, since they can read messy inputs that rules could not handle.

## Why physical AI is hard
Every step can fail, and errors add up. Training in simulation is cheap and safe, but a model trained there can fail on a real robot because friction, lighting and wear differ. This is the sim-to-real gap. Real-world data is slow and costly to collect, since a robot can only do so many attempts per hour.

## A worked example: errors multiply
A robot completes each of 10 steps in a task with 95 percent success. All ten succeed with probability 0.95 to the power 10, about 0.60. A task that looks 95 percent reliable per step fails four times in ten. Reaching 99 percent per step lifts the whole task to about 0.90.

## Where it is used
Warehouse picking, vacuum robots, surgical assistance under a surgeon's control, crop harvesting, and automated invoice handling in finance teams. Start with the cases where the environment is controlled and a person can step in.

## Common mistake
Treating a smooth demo video as proof. Ask how many attempts it took and how often the robot failed.

```resources
repo | LeRobot | https://github.com/huggingface/lerobot | Hugging Face | Open models, data and tools for real-world robotics.
article | RT-2: vision-language-action models | https://robotics-transformer2.github.io/ | Google DeepMind | A model that turns images and instructions into robot actions.
article | People + AI Guidebook | https://pair.withgoogle.com/guidebook/ | Google PAIR | How to keep a person in control of automated systems.
```

```quiz
What is the sim-to-real gap? | Simulated training differs from real conditions ; Robots cost more than simulations do ; Robots move slower than their software does | 0 | Friction, light and wear in the real world are not captured in simulation.
A task has 10 steps, each 95 percent reliable. About how often does it fully succeed? | About 95 percent of the time ; About 60 percent of the time ; About 10 percent of the time | 1 | 0.95 multiplied ten times is about 0.60, because errors compound.
Why is invoice automation easier than a warehouse robot? | The invoices contain fewer words overall ; Robots cannot read any printed text ; It needs no motors and mistakes are easy to undo | 2 | Software tasks are reversible and cheap to retry, unlike physical movement.
```

```story
A warehouse robot picks items from bins with 98 percent success on the test shelf. On the live floor, shiny packaging confuses the cameras and the success rate drops to 90 percent. Each failed pick needs a worker to step in. The company counts the cost of those interventions before deciding how many robots to buy.
```

# ai-across-industries | AI in healthcare, finance, law, education and retail | 2 | 15
The same tools show up in every industry. What differs is the cost of a mistake, the rules, and who must stay responsible.

## What it is
Each field picks the tasks that are frequent, data-rich and checkable, and keeps people in charge of decisions that carry risk.

Healthcare: reading scans, writing visit notes, finding patients at risk. Regulators treat many of these as medical devices and expect evidence. Finance: fraud detection, credit scoring, document reading, customer chat. Decisions about credit must be explainable to the customer, and rules limit unfair bias. Law: searching cases and drafting. Lawyers remain responsible for every filing. Education: tutoring, feedback on drafts, lesson planning. The aim is learning, not finished homework. Retail: demand forecasts, recommendations, price tests, support chat.

## A worked example: choosing the control
Rate each task on two lines: cost of a mistake, and how easily a person can check it. Summarizing a meeting: low cost, easy to check, so automate and sample. Drafting a contract clause: medium cost, checkable by a lawyer, so AI drafts and a lawyer approves. Approving a loan: high cost, affects a person's life, so a model may assist but rules, explanations and a human appeal must exist. The more a mistake costs, the more control stays with a person.

## What goes wrong
Bias in data becomes bias in decisions. In 2018 Reuters reported that Amazon dropped a hiring tool trained on past resumes, because it had learned to mark down resumes that mentioned women's groups. In 2023 two New York lawyers were fined after submitting a brief with court cases a chatbot had invented. Neither failure was about intelligence. Both skipped checking.

## Common mistake
Copying a success from another industry without its safeguards. A tool that is fine for retail support is not automatically fine for medicine.

```resources
article | AI-enabled medical devices | https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices | US FDA | The official list of AI devices cleared in the United States.
article | Stanford AI Index | https://hai.stanford.edu/ai-index | Stanford HAI | Data on adoption by industry.
article | People + AI Guidebook | https://pair.withgoogle.com/guidebook/ | Google PAIR | Design guidance for explaining and correcting AI decisions.
```

```quiz
Which factor should set how much human control a task needs? | How impressive the model looks in demos ; How expensive the model is per call ; The cost of a mistake and how checkable it is | 2 | High-cost, hard-to-check decisions need a person in charge.
Why did Amazon drop its resume screening tool? | It reproduced bias from past hiring data ; It was too slow for large applicant pools ; It could not read the resume formats | 0 | Learning from biased history teaches the model the same bias.
What went wrong in the court brief case? | The model's answer was in the wrong format ; Nobody checked the cited cases were real ; The court did not allow any typed filings | 1 | The tool made up cases and no person verified them before filing.
```

```story
A small law firm uses an assistant to draft a research memo. The draft cites six cases. A junior associate looks up each one and finds that two do not exist. The partner adds a rule: every citation gets opened and read by a person before anything leaves the firm. The tool still saves hours, and the rule keeps the firm out of the news.
```

# roi-and-rollout | Estimating value and rolling AI out | 2 | 14
A project succeeds when it saves more than it costs and people actually use it. Both can be estimated before you build.

## What it is
ROI (return on investment) compares what a project gains with what it costs. For AI the costs include model calls, building time, review time by people, monitoring and upkeep. The gains are time saved, errors avoided or revenue added. Teams that skip the cost side often find the gain disappears.

A rollout goes in stages: test on past cases, run beside the people doing the job (shadow mode), release to a small group, then widen. At each stage you compare against the baseline.

## A worked example (invented numbers)
A support team gets 10,000 tickets a month. Each takes 4 minutes at a cost of $30 an hour, so $2 a ticket, or $20,000 a month. An assistant drafts replies. It handles 30 percent of tickets with no edits, which saves $6,000. Model calls cost $0.05 a ticket, so $500 for all 10,000. A person spot-checks 5 percent of drafts, about $1,000 of time. Net saving: 6,000 − 500 − 1,000 = $4,500 a month. If building cost $30,000, payback is about seven months. If it handled only 10 percent, the saving would be $2,000 − 500 − 1,000 = $500 and payback would take five years.

## After launch
Watch quality, cost and usage. Data drift means real inputs slowly change from what the system was tested on, so scores slide without any code change. Keep a test set, rerun it monthly, and keep an easy way for users to report a bad answer. A company answers for what its tools say: in 2024 a Canadian tribunal ruled that Air Canada had to honor a refund policy its website chatbot invented.

## Common mistake
Declaring victory after a demo. Adoption, review time and drift decide the real return.

```resources
article | Rules of Machine Learning | https://developers.google.com/machine-learning/guides/rules-of-ml | Google | Launch, monitor and iterate advice from experience.
article | People + AI Guidebook | https://pair.withgoogle.com/guidebook/ | Google PAIR | Guidance on trust, feedback and error handling.
article | Patterns for Building LLM-based Systems | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | Evals, guardrails and feedback loops in production.
```

```quiz
Which cost is most often forgotten in an AI project estimate? | The name of the model vendor ; The color scheme of the interface ; The people time spent reviewing outputs | 2 | Review and monitoring time can outweigh model call costs.
What is shadow mode? | Hiding the system from all of the users ; Running the system beside people without acting on it ; Training the model without using real data | 1 | It lets you compare AI output to real decisions with no risk.
Scores drop six months after launch with no code change. What is a likely cause? | Data drift, since real inputs changed ; The model weights shrank on their own ; The users typed faster than before | 0 | Real inputs move away from the data the system was tested on.
```

```story
A mid-sized insurer pilots a claims assistant and the demo is a hit. In shadow mode, though, its suggestions match the human decision on only 70 percent of claims, and the claims staff spend more time correcting drafts than writing them. The insurer narrows the tool to one claim type where it matches 95 percent, and that is where it pays off.
```
