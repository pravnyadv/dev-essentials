# everyday-uses | Using AI for study, writing and work | 1 | 12
AI is most useful as a patient helper that explains, drafts and critiques. It is least useful when you hand it the thinking you were supposed to do.

## What it is
You do not need to code to get value from a model. The strongest everyday uses fall into a few groups. Explaining: ask for a concept in three ways, with an analogy, or at a younger reading level. Practising: ask it to quiz you, wait for your answers, then grade them and explain what you missed. Drafting and critiquing: write your own draft, then ask "what is the weakest part of this and why?" Planning: turn a messy goal into a weekly schedule. Rewriting: change the tone of an email without changing what it says. Working with data: ask for a spreadsheet formula and an explanation of how it works.

A good habit is to say what you want it to do for your thinking, not instead of it. "Explain, then test me" builds skill. "Write it for me" builds nothing.

## A worked example: learning fractions
Version one: "Give me the answers to my fractions homework." You get answers and learn nothing. Version two: "Explain adding fractions with a pizza example. Then give me five practice questions, one at a time. After each of my answers, tell me if I am right and why." In ten minutes you have practised five problems, found the step you get wrong, and can try a fresh set tomorrow. The same tool, used differently, is a tutor or a shortcut.

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

A well-known fact-checking routine called SIFT fits here: stop and think before sharing, investigate who is behind a source, find better coverage, and trace claims back to where they started.

## A worked example
You ask for "three studies showing that sleep improves memory", and the answer lists three titles with authors and years. You search for each title. Two exist. The third does not, and it was a plausible invention. In 2023 a lawyer submitted a legal brief that cited six court cases a chatbot had invented, and none of them existed. A search takes a minute. The cost of skipping it can be very large.

## How much to check
Low stakes, such as a joke or a recipe idea: a quick glance. Medium, such as a homework fact or a work email: confirm the key claims. High, such as health, money, law or safety: use an authoritative source or a professional, and treat the model as a starting point only.

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

## Why detectors are not the answer
Tools that claim to detect AI writing are unreliable. OpenAI launched its own text classifier in early 2023 and withdrew it a few months later because of its low accuracy. A 2023 Stanford study found that detectors wrongly flagged writing by non-native English speakers much more often. A flag is not proof, and false accusations can hurt real students. If you wrote it yourself, keep your notes and drafts, because they show your work.

## A worked example
Two students write on the causes of the French Revolution. Student A pastes the prompt and submits the reply. Student B writes an outline, asks the model "what is missing from my argument?", rewrites two paragraphs herself, checks the dates, and adds a note: "I used an AI assistant to critique my outline." Student B can answer any follow-up question. Student A cannot answer the first one.

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
