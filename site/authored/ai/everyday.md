# everyday-uses | Using AI for study, writing and work | 1 | 12
AI is most useful as a patient helper that explains, drafts and critiques. It is least useful when you hand it the thinking you were supposed to do.

## What it is
You do not need to code to get value from a model. The strongest everyday uses fall into a few groups. Explaining: ask for a concept in three ways, with an analogy, or at a younger reading level. Practising: ask it to quiz you, wait for your answers, then grade them and explain what you missed. Drafting and critiquing: write your own draft, then ask "what is the weakest part of this and why?" Planning: turn a messy goal into a weekly schedule. Rewriting: change the tone of an email without changing what it says. Working with data: ask for a spreadsheet formula and an explanation of how it works.

A good habit is to say what you want it to do for your thinking, not instead of it. "Explain, then test me" builds skill. "Write it for me" builds nothing.

## A worked example: learning fractions
Version one: "Give me the answers to my fractions homework." You get answers and learn nothing. Version two: "Explain adding fractions with a pizza example. Then give me five practice questions, one at a time. After each of my answers, tell me if I am right and why." In ten minutes you have practised five problems, found the step you get wrong, and can try a fresh set tomorrow. The same tool, used differently, is a tutor or a shortcut.

```mermaid Version two turns the model into a tutor: explain, quiz one question at a time, then re-explain only what you got wrong.
flowchart TD
  E[Model explains with an example] --> Q[Model asks one question]
  Q --> Y[You answer]
  Y --> C[Model says if you are right]
  C --> W{Got it wrong?}
  W -->|Yes| R[New explanation of only that part]
  R --> Q
  W -->|No| N[Next question]
  N --> Q
  class R focus
```

## Why the way you ask matters
A model has no idea what you already know. It sees only the words in the conversation, so the quality of its help depends on what you put in them. Tell it your level, your goal and the format you want. "I am 16, I understand whole numbers, explain fractions" gets a different answer from a bare "explain fractions".

The model also keeps track of the conversation only inside its context window, the amount of text it can see at once. In a very long chat, early instructions can fade. If the helper starts ignoring your rules, restate them or open a fresh chat.

## A second example: when AI is the wrong tool
Suppose you want to know whether a bus leaves at 7:40 tomorrow. A chatbot may give a confident time, but it has no live timetable and may be guessing. Open the transport site instead. The same goes for today's weather, a score from last night, or the current rules of your school. Use a model for explaining, drafting and practising. Use the real source for facts that change or that you will act on.

## What goes wrong
The most common failure is agreement. A model often praises a weak draft or accepts your wrong answer, because it was tuned on human ratings, and people tend to rate agreeable answers higher. You will see this as feedback that is always positive. To test it, paste in a paragraph you know is flawed and ask for problems. If it finds none, ask again with "list three specific weaknesses".

Another failure is a plausible but wrong explanation. If a step does not make sense to you, say so and ask for a different example. Do not nod along.

## Try it yourself
Spend ten minutes on a topic from your next test.
1. Ask the model to explain one idea with an analogy.
2. Ask for four questions, one at a time, and answer each before it replies.
3. Note which answer you got wrong, and ask for a new explanation of only that part.
4. Check one fact it gave you in your textbook.

Expect to find at least one gap you did not know about. That gap is the useful result.

## Common mistakes
Copying the output without reading it. Asking for facts you cannot check. Treating a first answer as final: ask for a second version, ask what it is unsure about, and tell it what to change.

```resources
course | Elements of AI | https://www.elementsofai.com/ | University of Helsinki | A free beginner course on what AI is and what it can and cannot do.
article | One Useful Thing | https://www.oneusefulthing.org/ | Ethan Mollick | Practical, evidence-based advice on using AI for work and study.
docs | Prompt engineering overview | https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview | Anthropic | Techniques that also make everyday prompts better.
```

```quiz
Which prompt helps you learn the most? | Write my full homework answers in my own style ; Summarize the chapter in one line so I can skip reading ; Give me only the final results of each problem ; Explain it, then quiz me and grade my answers | 3 | Explaining, then testing and grading you, makes you do the thinking. The others skip it.
You wrote an essay draft. What is a strong thing to ask a model? | What is the weakest argument here, and why? ; Please make this essay sound smarter overall ; Rewrite the whole thing in a different voice ; Tell me it is great so I can hand it in | 0 | Asking for the weakest part uses the model as a critic and keeps the writing yours.
A model gives a confident answer you cannot check. What is the sensible next step? | Trust it, since confident answers are usually right ; Check the key facts against another source first ; Ask again and keep whichever reply is longer ; Add the word please to the question next time | 1 | Confidence is not evidence. Check anything that matters against something independent.
```

```story
Two students prepare for the same biology test. One asks a chatbot for a summary of the chapter and reads it once. The other asks it to quiz her on the chapter, finds she keeps missing the difference between two processes, and asks for a clearer explanation of exactly that. On test day the second student remembers more, because she did the retrieval herself.
```

# checking-ai-answers | How to check an AI answer | 1 | 12
A fluent answer is not a verified one. A few quick habits catch most errors, and the amount of checking should match what is at stake.

## What it is
Models write confident text whether they are right or wrong, so you need your own checks. Ask for sources and open them, because a made-up link looks just like a real one. Ask for a short quote from the source and search for that quote. Cross-check the key fact in a second, independent place. Recompute numbers yourself or with a calculator. Ask the model to list what it assumed and what it is unsure about. Try it first on something you already know, to learn how reliable it is for that kind of question.

The table shows what each check catches.

| Check | What it catches |
|---|---|
| Open the cited source | An invented citation, which looks just like a real one |
| Search for a quote from the source | A source that exists but does not say that |
| Cross-check in a second, independent place | A claim that has only one origin |
| Recompute the numbers | A close but wrong sum, such as 65 where the answer is 68 |
| Ask what it assumed | Hidden guesses behind a confident answer |
| Try it first on something you know | A kind of question the model handles badly |

A well-known fact-checking routine called SIFT fits here: stop and think before sharing, investigate who is behind a source, find better coverage, and trace claims back to where they started.

## A worked example
You ask for "three studies showing that sleep improves memory", and the answer lists three titles with authors and years. You search for each title. Two exist. The third does not, and it was a plausible invention. In 2023 a lawyer submitted a legal brief that cited six court cases a chatbot had invented, and none of them existed. A search takes a minute. The cost of skipping it can be very large.

## How much to check
Low stakes, such as a joke or a recipe idea: a quick glance. Medium, such as a homework fact or a work email: confirm the key claims. High, such as health, money, law or safety: use an authoritative source or a professional, and treat the model as a starting point only.

```mermaid The more that depends on the answer, the more outside checking it needs.
flowchart TD
  A{What is at stake?} -->|Low: joke, recipe idea| L[Quick glance]
  A -->|Medium: homework, work email| M[Confirm the key claims]
  A -->|High: health, money, law, safety| H[Authoritative source or professional]
  class H bad
  class L good
```

## Why models get things wrong
A language model writes the most likely next words given your question. It does not look facts up unless it is connected to a search tool. When it has little reliable pattern to draw on, such as a rare name or a recent event, it still produces fluent text. That is called a hallucination. The sentence sounds the same whether it is true or invented, so tone tells you nothing.

## A second example: a wrong calculation
You ask: "A jacket costs $80 with 15% off. What do I pay?" A model might answer $65. Check it yourself: 15% of 80 is 12, and 80 minus 12 is 68. The model was close, which makes the slip easy to miss. Models do arithmetic by predicting text, not by calculating, so numbers deserve a calculator. If a model can run code or a calculator tool, results improve, but still look at what it did.

## What goes wrong when you check
Checking can fail too. A search that only repeats the same claim is not independent. Ten websites copying one source count as one source. Also beware asking the model to confirm itself: "Is this accurate?" tends to produce agreement. Instead, search for the specific name, number or quote in a place the model did not write.

## How to tell your checking is working
Run a small test. Ask a model five questions where you already know the answers, including one trick question about something that does not exist, such as a made-up book title. Count how many it gets right and whether it admits it does not know the made-up one. That gives you a rough feel for how far to trust it on that kind of question. The sample is tiny, so treat it as a hint, not a measurement.

## Common mistake
Asking the model "are you sure?" and accepting the reply. It will often agree or reverse itself without checking anything. Check against the world, not against the model.

```resources
article | SIFT: The Four Moves | https://hapgood.us/2019/06/19/sift-the-four-moves/ | Mike Caulfield | A short, practical method for checking any claim online.
article | Why language models hallucinate | https://openai.com/index/why-language-models-hallucinate/ | OpenAI | Explains why models state falsehoods confidently.
course | Calling Bullshit | https://www.callingbullshit.org/ | Bergstrom and West | A free course on spotting misleading data and claims.
```

```quiz
A model gives you a citation. What is the best first check? | Assume it is real because it includes a year ; Ask the model whether the source is real ; Find the source and confirm it says that ; Count how many authors the citation lists | 2 | Invented citations look real. Only finding the actual source proves it exists.
How much checking does a question about medicine or law deserve? | A quick glance, since models train on expert text ; None, if the model sounds completely sure ; Only a spelling check on the names involved ; A lot, with expert sources or a professional | 3 | The higher the stakes, the more independent verification you need.
You ask a model "are you sure?" and it says yes. What have you learned? | Very little, it never looked outside itself ; That the answer has now been double-checked ; That it looked up a second source to confirm ; That its confidence level is well calibrated | 0 | Models often agree or flip when asked. Verification has to come from an outside source.
```

```story
A student writes a history essay with help from a chatbot, which cites a book that sounds perfect. The librarian cannot find it. The title was invented from the author's real name and a plausible subject. The student rewrites a page the night before it is due, and now checks every source before it goes in.
```

# privacy-and-your-data | What you share with an AI service | 1 | 12
Anything you type is data you hand to a company. Know what happens to it, and keep sensitive details out.

## What it is
When you use a chat app, your messages go to the provider's servers. What happens next depends on the service, your plan and your settings. Many consumer apps keep your conversations for some time and may use them to improve their models unless you switch that off. Business and developer plans usually have stricter terms, such as not training on your data. Policies change, so check the current settings and privacy page of the service you use. Some apps have a temporary or incognito chat, and most let you delete history.

## What to keep out
Passwords and security codes. Government ID, bank or card numbers. Medical records. Private details about other people, such as a friend's problem or a customer's address. Your employer's secrets, unreleased plans, source code or customer data, unless your workplace has approved the tool for it.

## A worked example: redacting
Before: "Dear Maria Lopez, your account 4421-8830 is overdue by $240. Please call 555-0142." You want help making it politer. After redacting: "Dear [customer], your account [number] is overdue by [amount]. Please call [phone]." The model improves the wording just as well. You paste the real details back in yourself.

## What happens to your message
Your text travels over the internet to the provider's computers, where the model reads it and writes a reply. The provider may store the conversation, let staff review some of it for safety, or use it to improve future models. Which of these applies depends on the service and plan. That is why the settings page matters more than the logo on the app.

```mermaid Your message passes through the provider, which may do several things with it depending on the service and settings.
flowchart LR
  Y[You type a message] --> S[Provider servers]
  S --> M[Model writes the reply]
  S -.-> St[May store the conversation]
  S -.-> Rv[May be reviewed for safety]
  S -.-> Tr[May train future models]
  class Tr warn
```

## A second example: when redacting is not enough
Redacting works when the details are separate from the question. Imagine you paste a story about a classmate's family problem with the name removed. People who know your school could still guess who it is from the events. Details such as a rare job, a small town or a date can identify someone without a name. The safer move is to describe the situation in general terms or not share it at all.

## Trade-offs
Strict privacy has a cost. The more context you give a model, the better its help, so withholding everything makes answers vague. Pick the level by risk. A recipe or a poem needs no care. Health, money and other people's secrets need a lot. Some tools can run on your own computer, so the text never leaves it. Those models are usually smaller and less capable, which is the trade.

## What goes wrong
Data leaks mostly through habit, not hacking. You paste a whole document when two paragraphs would do. You upload a screenshot with notifications visible. You use a work account on a personal device. You will not see any symptom, which is the problem. Prevention is the only fix, because you cannot take text back once it is sent.

## Try it yourself
Open the privacy or data settings of one AI tool you use.
1. Find whether your chats can be used to train models.
2. Find how to delete history or start a temporary chat.
3. Write down what you found in one line.

Expect the answers to be in different places than you guessed. Repeat the check every few months, because policies change.

## Common mistakes
Using a personal account for work documents. Assuming deleted chats vanish everywhere at once. Pasting a screenshot that contains tabs, names or messages you did not mean to share. When in doubt, ask yourself whether you would be comfortable if this text appeared in a stranger's inbox.

```resources
docs | Anthropic Privacy Center | https://privacy.anthropic.com/ | Anthropic | How conversations are handled and how to control your data.
docs | Data controls FAQ | https://help.openai.com/en/articles/7730893-data-controls-faq | OpenAI | Chat history, training opt-outs and temporary chats.
article | AI Risk Management Framework | https://www.nist.gov/itl/ai-risk-management-framework | NIST | A reference for how organizations think about data and AI risk.
```

```quiz
Which of these should you keep out of a chat with an AI service? | A request for a simple chicken recipe with rice ; Passwords, ID numbers, private data of others ; A question about how volcanoes actually form ; A draft of a short poem you wrote yourself | 1 | Credentials, identity numbers and private information about others are risky to share, whatever the provider promises.
You want help rewording a customer email. What is a safe way to do it? | Paste the real email and hope for the best ; Post it in a public forum and ask for edits ; Replace names and numbers with placeholders ; Send it through a free translation app first | 2 | Redacting the details loses nothing the model needs and keeps the sensitive parts with you.
Where do you find out whether a service uses your chats to train its models? | The name of the app you happen to be using ; The color of the logo on the home screen ; The number of users the service has signed up ; The current privacy policy and your settings | 3 | Policies differ by service and plan and they change, so the current policy and your settings are the source of truth.
```

```story
A new employee pastes a customer complaint, with the customer's full name and order history, into a free chatbot to help write a reply. A week later the privacy team asks about it. The fix would have taken ten seconds: replace the name and numbers with placeholders. The same reply, and no data left the company.
```

# school-and-honesty | AI, school and honesty | 1 | 12
Rules about AI differ by school and by assignment. The safe approach is to know the rule, say when you used it, and use it to learn.

## What it is
Some teachers allow AI for brainstorming and checking, some ban it for graded work, and some require you to show how you used it. Read your school's policy and ask when it is unclear. A simple test: after using it, could you explain every part of the work in your own words, without the chat open? If not, you have borrowed the result, not learned it.

```mermaid Check the rule first, use AI only as the rule allows, and finish with the test of whether you can explain the work.
flowchart TD
  P[Read the school policy] --> Q{What does it say?}
  Q -->|Unclear| T[Ask your teacher]
  T --> P
  Q -->|AI banned| D[Do the work without AI]
  Q -->|AI allowed| U[Use it and say how]
  U --> E{Can you explain every part?}
  E -->|Yes| OK[Fine to submit]
  E -->|No| B[Not your work yet]
  class OK good
  class B bad
```

## Why detectors are not the answer
Tools that claim to detect AI writing are unreliable. OpenAI launched its own text classifier in early 2023 and withdrew it a few months later because of its low accuracy. A 2023 Stanford study found that detectors wrongly flagged writing by non-native English speakers much more often. A flag is not proof, and false accusations can hurt real students. If you wrote it yourself, keep your notes and drafts, because they show your work.

## A worked example
Two students write on the causes of the French Revolution. Student A pastes the prompt and submits the reply. Student B writes an outline, asks the model "what is missing from my argument?", rewrites two paragraphs herself, checks the dates, and adds a note: "I used an AI assistant to critique my outline." Student B can answer any follow-up question. Student A cannot answer the first one.

## Where the line sits
Think of three levels. Allowed help is like asking a classmate to explain a topic or check your spelling. Gray help is like having someone restructure your essay. Not allowed is submitting work you cannot explain as yours. Your teacher decides where each task falls, so the same use can be fine in one class and cheating in another.

## A second example: a coding assignment
You must write a function that sorts a list. A student asks a model for the code, pastes it in and passes the tests. In the next lesson the class builds on that function and the student is lost. Another student writes her own attempt, gets stuck, and asks the model to explain the error message. She fixes it herself. Both finished the task. Only one can now write the next one. The test is the same as before: could you redo it alone?

## Trade-offs
Using AI heavily saves time now and costs skill later. Avoiding it entirely keeps the skill but means you do not learn a tool that employers expect. A middle path works for most courses: use it for explanations, practice questions and feedback on your own draft, and do the graded thinking yourself.

## What goes wrong
The common failure is a gap between your marks and your ability. You score well on homework and badly on a closed-book exam. That pattern, which teachers and students both notice, suggests the homework was done by the tool, not by you. A second failure is invented sources in an essay, which a teacher can check in a minute.

## How to tell you are using it well
After a session, close the chat and write three sentences about what you learned. If you cannot, you borrowed rather than learned. Keep dated drafts and a short note on how you used the tool, so you can show your process if asked.

## Common mistakes
Assuming that because no one can see it, it is allowed. Using AI to skip the exact skill the course is trying to build. Citing nothing: where the rules allow AI, say what you used it for.

```resources
article | GPT detectors are biased against non-native English writers | https://arxiv.org/abs/2304.02819 | Liang et al. | The study showing that detectors misjudge non-native writing.
article | New AI classifier for indicating AI-written text | https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/ | OpenAI | OpenAI's announcement, with its note that it later retired the tool for low accuracy.
article | One Useful Thing | https://www.oneusefulthing.org/ | Ethan Mollick | Practical writing on how teachers and students are adapting to AI.
```

```quiz
What is a good test of whether you used AI to learn or to skip learning? | You can explain it all with the chat closed ; The assignment was handed in before the deadline ; The answer scored well on an AI-text detector ; The reply was much longer than your question | 0 | If you can explain and redo the work yourself, you learned it. If not, you only borrowed it.
Why is it risky to accuse someone based on an AI detector? | Detectors are always right but take hours to run ; Detectors often err and can flag honest work ; The law forbids schools from using such tools ; They only work properly on very short texts | 1 | Evidence shows high error rates, so a flag alone is not proof.
Your school has no clear rule for an assignment. What should you do? | Use it quietly and say nothing to anyone ; Skip the policy and assume it is fine ; Ask your teacher before you use it ; Ask the AI itself whether it is allowed | 2 | The person who set the assignment decides what is fair. Asking first protects you.
```

```story
A student's essay is flagged by a detector and she is called in. She opens her notes app and shows the outline, the three drafts and the sources she read, all with dates. The teacher reads the draft history and drops the matter. Keeping your own trail is the best defense, and a good learning habit anyway.
```

# copyright-and-deepfakes | Copyright, deepfakes and what is real | 1 | 14
Two questions come up the moment you make or see AI content: who owns it, and is it real. Rules vary by country and are changing, so treat this as the basics.

## Who owns what an AI makes
In the United States, the Copyright Office has said that copyright needs human authorship. Material produced purely by an AI is not protected, but your own writing, your selection and arrangement, and your edits can be. Other countries differ. Whether training models on copyrighted work is lawful is being decided in courts right now, with several large cases still open. For you, the practical rules are simple: do not claim AI output as hand-made work where it matters, do not present an AI image as a real photograph, and check the terms of the tool for commercial use.

## Deepfakes
A deepfake is fake audio, video or imagery that looks real. A few seconds of a person's voice can be cloned well enough to fool relatives. Common scams use a cloned voice to say "I'm in trouble, send money now". Defenses: hang up and call back on a number you already know, agree a family code word, and be slow when someone creates urgency. For images and video, look at the source before the picture. Some platforms and cameras attach Content Credentials, a standard (C2PA) that records where a file came from and how it was edited. It helps when present, but it can be stripped, so a missing label does not mean fake.

## A worked example
You receive a voicemail in your cousin's voice: "I lost my wallet abroad, please wire $800." The voice is perfect. You hang up and call your cousin's saved number. She is at home and answers right away. The voicemail was a clone. The check cost one minute.

```mermaid Do not act on the message itself: hang up and call a number you already trust.
flowchart TD
  V[Voicemail asks for money fast] --> H[Hang up]
  H --> C[Call their saved number]
  C --> R{Did they send it?}
  R -->|Yes| Ok[Real request]
  R -->|No| Cl[Likely a voice clone]
  class Cl bad
  class Ok good
```

## How a voice or face gets cloned
Voice-cloning software learns the pattern of a person's voice from a recording, then produces new speech in that voice from typed text. Image and video fakes work in a similar way: a model learns what a face looks like and generates new frames. The quality depends on the tool and on how much material it has. Public videos and voice notes are the usual source, which is why scams often target people who post a lot.

## A second example: a fake that is not malicious
A classmate posts a photo of a shark in a flooded street, made by an image tool and shared as a joke. Many people believe it for a day. No one meant harm, but it spreads as news. Look for signs: a source you cannot trace, no other photos of the same event, odd details such as warped text or extra fingers. These signs are fading as tools improve, so the source check matters more than the pixel check. Search for the event in news outlets you trust.

## Trade-offs
Detection is not a solution. Tools that claim to spot fakes make mistakes in both directions, and a real photo can be wrongly called fake. People also use the doubt as an excuse, saying a real recording is "just AI". So judge claims by evidence around the media: who posted it first, whether others confirm it, and whether it fits what else is known.

## What goes wrong
Two failures are common. One is believing a fake because it matches what you expected. Another is sharing before checking, which spreads it further. Both come from speed. If something makes you angry or afraid, that is the moment to wait.

## Try it yourself
Agree on a code word with your family. Then pick a viral image from this week and trace it.
1. Run a reverse image search with a search engine.
2. Find the earliest post you can.
3. Note whether a trusted outlet reports it.

Expect to find some images are older photos with a new caption, not AI at all.

## Never do this
Do not make or share fake sexual images or videos of real people. It does serious harm, and it is a crime in many places.

```resources
article | Copyright and Artificial Intelligence | https://www.copyright.gov/ai/ | US Copyright Office | The official reports on authorship and training data.
tool | Content Credentials (C2PA) | https://c2pa.org/ | C2PA | The standard for recording where media came from.
article | Scammers use AI to enhance their family emergency schemes | https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes | FTC | How voice cloning scams work and how to respond.
```

```quiz
You get an urgent voice message from a relative asking for money. What do you do? | Send the money fast because the voice sounds right ; Reply to that same message and ask for proof ; Wait a day to see if a second message comes ; Call back on a number you already know first | 3 | A cloned voice can sound perfect, so verify through a separate channel you already trust.
In the US, who can hold copyright in an image made entirely by an AI? | Generally no one, as it lacks a human author ; The company that built the model, in every case ; The first person who posts it on the internet ; Whoever wrote the most detailed prompt for it | 0 | The US Copyright Office requires human authorship, so purely AI output is not protected, though human contributions can be.
A video has no Content Credentials label. What does that tell you? | That it is definitely fake, with no doubt ; Very little, labels are often missing ; That it is definitely real, with no doubt ; That it was recorded by a physical camera | 1 | The standard helps when present, but most media do not have it, and it can be removed.
```

```story
A parent gets a call from what sounds like her daughter, crying, saying she has been in an accident and needs money right away. The parent remembers a talk about voice cloning, hangs up, and calls her daughter's real number. The daughter picks up in the middle of a lecture. A code word agreed at breakfast would have settled it in ten seconds.
```
