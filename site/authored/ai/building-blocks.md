# vectors-and-similarity | Vectors and similarity | 1 | 12
A vector is a list of numbers. The dot product measures how much two vectors point the same way. A large share of modern AI is this operation repeated.

## Before you start
This chapter is the math underneath everything you have used so far: prompts, embeddings, retrieval and agents. You have already seen what these things do. Here you see why they work, using small numbers you can do by hand. Take it one lesson at a time. If a formula gets heavy, read the worked example and the picture first, and come back to the formula later.

## The idea
Represent a thing as numbers. A word, an image or a sentence becomes a vector such as [0.2, 0.9, -0.1]. The dot product multiplies matching entries and adds them: a · b = a₁b₁ + a₂b₂ + … Think of each vector as an arrow from the middle of a graph to the point it names, so its direction is where the arrow points. Large and positive means similar direction, near zero means unrelated, negative means opposite.

$$a \cdot b = a_1 b_1 + a_2 b_2 + \dots + a_n b_n$$

Cosine similarity divides out the lengths so only direction counts: cos(a, b) = (a · b) / (|a| |b|), where |a| is the square root of the sum of squares. It always falls between -1 and 1.

$$\cos(a,b) = \frac{a \cdot b}{\lVert a \rVert \, \lVert b \rVert}$$

## Example
Take a = [1, 2] and b = [2, 1]. The dot product is 1×2 + 2×1 = 4. The lengths are both √5 ≈ 2.236, and √5 × √5 = 5. So cosine is 4 / 5 = 0.8, quite similar. For a = [1, 0] and c = [0, 1], the dot product is 0, so cosine is 0: unrelated.

## Where you will see it
Embedding search ranks documents by cosine similarity to the query. Later you will meet the same operation inside attention and inside every neuron, but you do not need those yet. Learn this one operation well.

## Try it
Drag the two arrows in the demo above and watch the dot product and cosine change.

## Worked example: recommending a song
You: [fast 0.9, acoustic 0.1, sad 0.2]. Song A: [0.8, 0.0, 0.1]. Song B: [0.1, 0.9, 0.9]. Dot with A: 0.9×0.8 + 0.1×0 + 0.2×0.1 = 0.74. Dot with B: 0.9×0.1 + 0.1×0.9 + 0.2×0.9 = 0.36. Song A fits you better. The songs are all about the same size, so the plain dot product is fair here. Search engines, recommendations and chatbots all use this idea at much bigger scale, with hundreds of numbers instead of three.

## How length and direction separate
Every vector has a length, written |a|. For [3, 4] it is √(3² + 4²) = √25 = 5. Dividing each entry by the length gives [0.6, 0.8], a vector of length 1 that points the same way. Cosine similarity is the dot product of two such length-1 vectors, which is why it ignores size. Doubling a vector, from [1, 2] to [2, 4], doubles its dot products but leaves its cosine with [1, 2] at exactly 1. Flip it to [-1, -2] and the cosine is -1. A vector like [2, -1] gives dot product 0 with [1, 2], so the cosine is 0.

## A second example: when length misleads
Your search query is a = [1, 1]. Document X = [1, 0.9] is short and almost the same direction. Document Y = [10, 2] is long and leans mostly one way. Raw dot products: a · X = 1.9 and a · Y = 12, so Y wins. Lengths: |a| = 1.414, |X| = 1.345, |Y| = 10.198. Cosines: 1.9 / (1.414 × 1.345) = 0.999 for X and 12 / (1.414 × 10.198) = 0.832 for Y. Cosine picks X, which really matches. If a system already scales every vector to length 1, the dot product and cosine are the same number, and the cheaper dot product is enough.

## What goes wrong
Embedding vectors (lists of numbers that stand for meaning) are learned from how words are used, not from a dictionary. Words like "hot" and "cold" appear in similar sentences, so they can score a high cosine even though they are opposites. A high score means "used in similar places", not "means the same". You can confirm this by printing the nearest neighbors of a few words and reading them. A second failure is an all-zero vector, whose length is 0, so the cosine divides by zero and returns an error or not-a-number.

## Check it by hand
Pick a = [3, 4], b = [6, 8] and c = [4, -3]. Work out a · b, a · c and the three lengths. You should get a · b = 50, a · c = 0, lengths 5, 10 and 5. Then the cosine of a and b is 50 / (5 × 10) = 1, and the cosine of a and c is 0. Same direction and a right angle, found with arithmetic alone.

## Common mistake
Reading a dot product as a percentage. It has no fixed maximum and grows with vector size, so only cosine similarity stays between -1 and 1.

```resources
video | Vectors (Essence of linear algebra, chapter 1) | https://www.youtube.com/watch?v=fNk_zzaMoSs | 3Blue1Brown | Essence of linear algebra, chapter 1.
video | Dot products and duality | https://www.youtube.com/watch?v=LyGKycYT2v0 | 3Blue1Brown | Why multiplying and summing measures alignment.
article | The Illustrated Word2vec | https://jalammar.github.io/illustrated-word2vec/ | Jay Alammar | How words become vectors you can do math on.
```

```quiz
a = [1, 2] and b = [3, 0]. What is the dot product a · b? | 3 ; 6 ; 5 | 0 | Multiply matching entries and add: 1 × 3 + 2 × 0 = 3.
Two embeddings have a cosine similarity near 0. What does that mean? | They are nearly the same direction ; They point in opposite directions ; They are unrelated in direction | 2 | Cosine 1 means the same direction, 0 means unrelated and -1 means opposite.
You compare a short note and a very long article by raw dot product, and the long one always wins. What is going on? | Longer vectors give bigger dot products ; Longer articles are always more relevant ; Dot products ignore vector length entirely | 0 | Length inflates the dot product. Cosine similarity divides the lengths out so only direction counts.
```

```story
A music app wants to suggest songs. It describes you as a list of numbers: how much you like fast songs, how much you like acoustic songs, how much you like sad songs. It describes each song the same way. To decide if a song fits you, it multiplies the matching numbers and adds them up. Big total, good match. That multiply-and-add is the dot product.
```

# matrices-and-tensors | Matrices and tensors | 1 | 15
A matrix is a grid of numbers that transforms vectors. A tensor is the same idea with any number of dimensions. Models are mostly matrix multiplication.

## The idea
A matrix with 2 rows and 3 columns turns a 3-number vector into a 2-number vector. Each output entry is a dot product of one row with the input. Multiplying a whole batch of vectors by one matrix does many dot products at once, which is what GPUs are built for. A tensor is an array with any number of axes: a vector has 1, a matrix has 2, a batch of images has 4 (batch, channels, height, width).

## Example
Let M = [[1, 0, 2], [0, 1, 1]] and x = [3, 4, 5]. Row 1 · x = 3 + 0 + 10 = 13. Row 2 · x = 0 + 4 + 5 = 9. So M x = [13, 9]. Shapes must match: (2 by 3) times (3) gives (2). When shapes differ in a compatible way, libraries use broadcasting, which stretches the smaller array to fit: adding a bias vector of length 2 to each row of a batch happens without copying it.

## Why it matters
A layer of a network is one matrix multiply plus an activation. A language model with billions of parameters is mostly large matrices. Getting shapes right is the most common source of bugs when writing model code.

## How matrix times matrix works
Multiplying two matrices is many matrix-times-vector steps, one for each column of the second matrix. Take A = [[1, 0, 2], [0, 1, 1]] (2 by 3) and B = [[1, 1], [2, 0], [0, 3]] (3 by 2). The result is 2 by 2, and entry (row i, column j) is row i of A dotted with column j of B.
1. Entry (1,1): 1×1 + 0×2 + 2×0 = 1.
2. Entry (1,2): 1×1 + 0×0 + 2×3 = 7.
3. Entry (2,1): 0×1 + 1×2 + 1×0 = 2.
4. Entry (2,2): 0×1 + 1×0 + 1×3 = 3.
So A B = [[1, 7], [2, 3]]. Order matters: B A is 3 by 3, a different shape and different numbers. The inner sizes (3 and 3) must match, and the outer sizes (2 and 2) become the result.

## Counting the work
Invented sizes for illustration: a layer that turns 1,000 input numbers into 500 output numbers has a 500 by 1,000 matrix. That is 500 × 1,000 = 500,000 weights, plus 500 biases (one per output), so 500,500 learned numbers. One input needs 500,000 multiplications. A batch of 32 inputs needs 32 × 500,000 = 16,000,000. That is why speed and memory are measured in matrix sizes.

## What goes wrong: silent broadcasting
Most shape bugs raise an error, which is the good case. Broadcasting can hide a bug. Add a column of shape (3, 1), [1, 2, 3], to a row of shape (3), [10, 20, 30]. You expected 3 numbers. The library instead stretches both and returns a 3 by 3 grid whose first row is [11, 21, 31] and last row is [13, 23, 33]. Later code may still run and give a wrong loss. The symptom is a result with more entries than you expected, so print shapes after each step.

## Check it by hand
Let M = [[2, 0], [1, 1], [0, 3]] and x = [4, 5]. M is 3 by 2, so the answer has 3 numbers. Row 1 gives 8, row 2 gives 4 + 5 = 9, and row 3 gives 15. You should get [8, 9, 15]. If you try x = [4, 5, 6], the inner sizes (2 and 3) clash, which is exactly the error you would see in code.

## Common mistakes
Shape errors. If the matrix is 2 by 3, the vector must have 3 numbers, and the result has 2. Most beginner bugs in model code are shapes that do not line up. Print the shape of everything while you debug.

```resources
video | Matrix multiplication as composition | https://www.youtube.com/watch?v=XkY2DOUCWMU | 3Blue1Brown | Why the rows-by-columns rule is what it is.
course | PyTorch tensors tutorial | https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html | PyTorch | Create, reshape and multiply tensors.
article | Broadcasting semantics | https://numpy.org/doc/stable/user/basics.broadcasting.html | NumPy | The precise rules, with pictures.
```

```quiz
M is a 2 by 3 matrix and x has 3 numbers. How many numbers does M x have? | 3 ; 6 ; 2 | 2 | Each of the 2 rows gives one output number.
What does broadcasting do? | Sends data from the CPU over to the GPU ; Stretches a small array to fit another ; Deletes any extra axes from an array | 1 | It lets you add a bias vector to a whole batch without copying it.
You multiply a 4 by 3 matrix by a 2-number vector and get an error. What is the most likely cause? | The shapes do not match, since 3 is not 2 ; The numbers are too large for the computer ; The matrix must be square before it multiplies | 0 | A matrix times a vector needs the matrix's column count to equal the vector's length.
```

```story
A photo editor applies a filter to a million pixels. Each new pixel is a weighted mix of the old ones. Written as math, that whole filter is one matrix multiplication. Language models are the same kind of step, repeated billions of times, which is why a graphics card that is good at pictures turned out to be good at AI.
```

# probability-and-logs | Probability and logarithms, a quick refresher | 1 | 12
Two small ideas sit under almost every AI formula: probabilities that multiply, and logarithms that turn those products into sums.

## Probability in one minute
A probability is a number from 0 (never) to 1 (certain). The probabilities of all the possible outcomes add up to 1. If two things are independent, the chance that both happen is the product. A fair coin gives heads with probability 0.5, so two heads in a row is 0.5 × 0.5 = 0.25. A language model gives every possible next token a probability, and those add up to 1. The probability of a whole sentence is the product of the probabilities of its tokens.

## Logarithms in one minute
A logarithm answers the question: what power do I raise the base to, to get this number? Since 2³ = 8, log base 2 of 8 is 3. Since 10² = 100, log base 10 of 100 is 2. The natural logarithm, written ln, uses the special number e, about 2.718, as its base. Two facts matter here. The log of a product is the sum of the logs: log(a × b) = log a + log b. And the log of a number between 0 and 1 is negative, more so the smaller the number.

$$\log(a \times b) = \log a + \log b$$

## A worked example: why models use logs
A five-token sentence gets token probabilities 0.5, 0.4, 0.9, 0.7 and 0.6. The sentence probability is 0.5 × 0.4 × 0.9 × 0.7 × 0.6 = 0.0756. Now imagine 1,000 tokens: the product would be a number with hundreds of zeros after the decimal point, too small for a computer to store. Take logs instead. ln 0.5 = -0.693, ln 0.4 = -0.916, ln 0.9 = -0.105, ln 0.7 = -0.357, ln 0.6 = -0.511. Their sum is -2.582, and e raised to -2.582 is 0.0756, the same answer. Sums of logs stay a comfortable size, so training adds logs instead of multiplying probabilities. The loss you meet later is "minus the log of the probability given to the right token": 0 when the model was certain and right, and large when it gave the right token a tiny chance.

## What each step of a log means
A log counts how many times you scaled something down. Natural logs of small probabilities: ln 0.5 = -0.693, ln 0.1 = -2.303, ln 0.01 = -4.605, ln 0.001 = -6.908. Each time the probability shrinks by a factor of 10, the log drops by 2.303. A number that gets tiny stays a manageable size.

## A second example: comparing sentences of different length
Sentence A has 5 tokens with probability 0.0756, from the example above. Sentence B has 10 tokens, each with probability 0.7, so its probability is 0.7¹⁰ = 0.0282. Raw probability says A is "better", but only because it is shorter, since every extra token multiplies in another number below 1. Compare the average log per token instead. A: -2.582 / 5 = -0.516. B: 10 × ln 0.7 = -3.567, and -3.567 / 10 = -0.357. B is closer to 0, so B has the higher per-token confidence. This is why scores for language models are usually averaged per token.

## When logs are not needed, and what goes wrong
For short products such as the 5-token sentence, plain multiplication is exact enough, and logs add nothing. They matter when the product is long. A 64-bit decimal number cannot go below about 10⁻³⁰⁸. With 1,000 tokens each at probability 0.1, the product is 10⁻¹⁰⁰⁰, and a computer stores 0.0. The sum of logs is 1,000 × (-2.303) = -2,303, which is fine. The other trap is probability 0: ln 0 has no value (it heads to minus infinity), so a loss of "inf" or "nan" in training often means some token got exactly zero probability. Check by printing the smallest probability in the batch.

## Check it by hand
Take three tokens with probabilities 0.5, 0.25 and 0.125. The product is 0.015625. The logs are -0.693, -1.386 and -2.079, which add to -4.159. Raise e to that power and you get 0.0156 again. Same answer by two routes.

## Common mistake
Thinking a logarithm makes numbers bigger. It compresses them: log₂ of a million is only about 20. Also check the base. log₂ gives bits, ln gives nats, and the idea is the same.

```resources
course | Probability library | https://www.khanacademy.org/math/statistics-probability/probability-library | Khan Academy | Free lessons on basic probability with practice.
course | Logarithms | https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs | Khan Academy | What a logarithm means, and its rules.
video | Triangle of Power | https://www.youtube.com/watch?v=sULa9Lc4pck | 3Blue1Brown | Exponents, logarithms and roots shown as three views of one relationship.
```

```quiz
You flip a fair coin three times. What is the probability of three heads? | 0.5 ; 0.125 ; 0.375 | 1 | Independent events multiply: 0.5 × 0.5 × 0.5 = 0.125.
Why do training programs add logs of probabilities instead of multiplying the probabilities? | Products of tiny numbers round to zero ; Logs turn every probability into exactly 1 ; Neural networks cannot multiply two numbers | 0 | The product underflows. The log of a product is the sum of logs, so the answer is kept safely.
What is log base 2 of 32? | 16 ; 6 ; 5 | 2 | 2 to the power 5 is 32.
```

```story
A new student wonders why every machine learning paper is full of "log" signs. The reason is practical. Multiply a thousand probabilities and a computer rounds the answer to zero. Add their logs and the information survives. A small trick for numbers kept a whole field working.
```

# probability-and-softmax | Probability and softmax | 1 | 12
A model outputs raw scores. Softmax turns them into probabilities that add up to 1, and temperature controls how sharp they are.

## The idea
The model's last layer produces one number per possible next token, called logits. Softmax converts them: p(i) = e^(zᵢ/T) / Σⱼ e^(zⱼ/T). Exponentiating makes everything positive. Dividing by the sum makes them add to 1. T is the temperature. T = 1 is the plain version.

$$p_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$

## Example
Logits for three tokens: [2.0, 1.0, 0.1]. At T = 1, e² = 7.39, e¹ = 2.72, e^0.1 = 1.11. The sum is 11.21. Probabilities are 0.66, 0.24, 0.10. At T = 0.5 the logits double to [4, 2, 0.2], giving e⁴ = 54.6, e² = 7.39, e^0.2 = 1.22, sum 63.2, so probabilities 0.86, 0.12, 0.02. Lower temperature sharpens the choice. At T = 2 the logits halve to [1, 0.5, 0.05] and the picks flatten to about 0.50, 0.30, 0.19.

## Why it matters
The same function turns attention scores into weights and a classifier's scores into class probabilities. Temperature and top-p are knobs on this distribution.

## Try it
Move the sliders in the demo. Watch how temperature reshapes the bars, then sample ten tokens and see how often the top one wins.

## Why the exponential
Raw scores can be negative or huge. The exponential e^x makes every score positive and makes bigger scores stand out more. Dividing by the total then makes them add to 1. A score of 2.0 versus 1.0 becomes 7.4 versus 2.7, so the leader gets a clearly bigger share.

## How it works step by step
Softmax has three steps, shown here for logits [1, 2, 3] at T = 1.
1. Exponentiate each score: e¹ = 2.718, e² = 7.389, e³ = 20.086.
2. Add them: 2.718 + 7.389 + 20.086 = 30.193.
3. Divide each by the total: 0.090, 0.245, 0.665. They add to 1.
Notice that the gap matters, not the ratio. Logits [3, 0] give 0.953 and 0.047. Logits [6, 0] give 0.9975 and 0.0025. Logits [2, 2, 2] give one third each, whatever the temperature.

## A second example: why code subtracts the biggest score
Real code first subtracts the largest logit from every logit. The answer does not change, because the same factor cancels on top and bottom. Take logits [1000, 999]. Computing e¹⁰⁰⁰ overflows, meaning the number is too big to store, and the program returns infinity. After subtracting 1000 the scores are [0, -1], so e⁰ = 1 and e⁻¹ = 0.368. The probabilities are 1 / 1.368 = 0.731 and 0.269, the same as for [1, 0]. If you ever see nan from your own softmax, this is the first thing to check.

## Trade-offs of temperature and top-p
Lower temperature gives repeatable text but can loop and repeat itself. Higher temperature gives variety but more odd words. At T = 0 the formula would divide by zero, so tools treat it as "always pick the top token". Top-p sampling cuts the tail instead: keep the smallest group of top tokens whose probabilities add to at least p. With [0.66, 0.24, 0.10] and p = 0.8, the first two add to 0.90, so the third is dropped. Re-dividing by 0.90 gives 0.73 and 0.27. Temperature reshapes every probability, while top-p removes unlikely tokens.

## Check it by hand
Predict before you calculate: for logits [0, 0, 1], which token wins and by how much? Then compute e⁰ = 1, 1 and e¹ = 2.718, with total 4.718. The probabilities are 0.212, 0.212 and 0.576. The top token wins, but it does not take everything, because a gap of 1 is small.

## Common mistake
Thinking temperature 0 gives the "correct" answer. It gives the most likely answer, which can still be wrong. Low temperature gives consistency, not truth.

```resources
video | ArgMax and SoftMax | https://www.youtube.com/watch?v=KpKog-L9veg | StatQuest | Step-by-step with numbers.
article | Softmax function | https://en.wikipedia.org/wiki/Softmax_function | Wikipedia | Definition and properties, including the temperature form.
```

```quiz
What does lowering the temperature do to the output distribution? | It flattens it so tokens look alike ; It sharpens it toward the top token ; It removes unlikely tokens completely | 1 | Dividing the scores by a small T makes the differences bigger, so the leader dominates.
Softmax outputs always do which of these? | Be whole numbers only ; Stay between -1 and 1 ; Add up to exactly one | 2 | That is what lets them be read as probabilities.
Scores are [2, 1, 0.1] at T = 1 and give 66 percent for the first token. At T = 2, what happens to that 66 percent? | It rises to about 86 percent ; It stays at exactly 66 percent ; It falls to about 50 percent | 2 | Higher temperature flattens the distribution. The worked example gives about 50, 30 and 19 percent.
```

```story
A weather app does not say "it will rain". It says "70 percent chance". A language model does the same for every next word: "the" 12 percent, "a" 9 percent, and so on. Softmax is the little formula that turns the model's raw scores into those percentages, and temperature is the dial that makes it bolder or more careful.
```

# derivatives-and-gradients | Derivatives and gradients | 1 | 15
A derivative says how much the output changes when you nudge an input. A gradient is the list of derivatives for all inputs. Training uses it to know which way to adjust each weight.

## The idea
For f(x) = x², the derivative is 2x. At x = 3 the slope is 6: increase x by a tiny 0.01 and f goes up by about 0.06. A function with several inputs, like f(a, b) = a² + 3b, has a partial derivative for each: 2a with respect to a, and 3 with respect to b. Stack them and you get the gradient [2a, 3]. It points in the direction of steepest increase. To reduce the function, step the opposite way.

## Common rules
Power: the derivative of xⁿ is n·xⁿ⁻¹. Sum: derivatives add. Constant multiple: the constant stays. Chain: the derivative of f(g(x)) is f′(g(x))·g′(x). Those four are enough to differentiate every operation in a network by hand.

$$\frac{d}{dx}\, x^n = n x^{n-1}, \qquad \frac{d}{dx}\, f(g(x)) = f'(g(x)) \, g'(x)$$

## Example
f(a, b) = a² + 3b at (a, b) = (2, 1) gives f = 7. Gradient = [4, 3]. Moving a by +0.1 raises f by about 0.4. Moving b by +0.1 raises it by 0.3. To lower f, move a and b in the negative direction, with a bigger step on a.

## Check numerically
You can estimate a derivative as (f(x + h) - f(x)) / h for a tiny h like 0.0001. This numerical check is how people test that a hand-derived gradient is right.

## Worked example: a tiny slope
f(x) = x². At x = 3, f is 9. Nudge x to 3.01 and f becomes 9.0601. The change is 0.0601 for a nudge of 0.01, a ratio of about 6. The derivative 2x gives 6 exactly. The slope tells you that increasing x makes f grow quickly there, so to reduce f you should decrease x.

## Why many directions
A model has billions of weights. The gradient has one slope per weight: for each, "if I nudge this weight up, does the error go up or down, and how fast?" One pass computes all of them at once, which is the trick behind backpropagation.

## How the chain rule traces through
Take f(x) = (3x + 1)² at x = 2. Think of two steps: g = 3x + 1, then f = g². At x = 2, g = 7 and f = 49. The outer slope is 2g = 14. The inner slope is 3. Multiply: 14 × 3 = 42. Numerical check: at x = 2.001, g = 7.003, f = 49.042, so the change is 0.042 for a nudge of 0.001, a ratio of about 42. This multiply-the-slopes habit is all that backpropagation does.

## A second example: where the slope is zero
At x = 0, f(x) = x² has slope 0, and that is the bottom of the bowl, so no step is needed. But zero slope is not always a good sign. f(x) = x³ also has slope 0 at x = 0, yet it is not a bottom. Values to the left are lower and values to the right are higher, so the slope is zero only for a moment and the curve keeps climbing. In a network, a ReLU neuron with a negative input has slope 0, so no gradient flows through it and its weights stop learning. Flat does not always mean finished.

## What goes wrong: slopes that multiply
By the chain rule, the slope through a deep stack is a product of one slope per layer. Invented numbers: if each of 10 layers contributes 0.25, the product is 0.25¹⁰ = 0.00000095. The early layers barely get a signal, called a vanishing gradient. If each contributes 2, the product is 2¹⁰ = 1,024, an exploding gradient. Symptoms: loss that does not move, or loss that suddenly becomes nan. Confirm by printing the gradient size for each layer and looking for a steady drop or rise toward the start of the network.

## Check it by hand
Verify the gradient of f(a, b) = a² + 3b at (2, 1) the way a code test would, with h = 0.001. Raise a: f(2.001, 1) = 4.004001 + 3 = 7.004001, so the slope is 0.004001 / 0.001 = 4.001, close to 4. Raise b: f(2, 1.001) = 7.003, so the slope is 3. Both match [4, 3]. A very tiny h such as 10⁻¹² can do worse, because rounding errors in the computer swamp the change.

## Common mistake
Mixing up direction. The gradient points uphill. To reduce error you move against it.

```resources
video | The paradox of the derivative | https://www.youtube.com/watch?v=9vKqVkMQHKk | 3Blue1Brown | The intuition for what a derivative is.
video | Gradients and Partial Derivatives | https://www.youtube.com/watch?v=GkB4vW16QHI | Eugene Khutoryansky | Animated partial derivatives and the gradient vector.
course | Essence of calculus | https://www.3blue1brown.com/topics/calculus | 3Blue1Brown | The full visual series.
```

```quiz
What is the derivative of f(x) = x² at x = 3? | 6 ; 9 ; 3 | 0 | The derivative is 2x, so at x = 3 it is 6.
In which direction does the gradient point? | Toward the steepest decrease ; Toward the nearest minimum ; Toward the steepest increase | 2 | You step against it to reduce a function, which is what training does.
f(a, b) = a² + 3b at (2, 1). Which nudge raises f the most per unit step? | Increasing a, since its slope is 4 versus 3 ; Increasing b, since b has the larger multiplier ; Both raise f by exactly the same amount | 0 | The gradient is [2a, 3] = [4, 3], so a changes f faster here.
```

```story
You are standing on a foggy hill and want to get down. You cannot see the valley, but you can feel which way the ground slopes under your feet. You take a step downhill, feel again, and repeat. The slope under your feet is the derivative. With many directions at once, the list of slopes is the gradient. Training an AI model is exactly this walk.
```

# neurons-and-networks | Neurons and networks | 1 | 15
A neuron is a weighted sum plus a bend. A network is many neurons in layers. Stacking them lets the model represent curved, complex functions.

## The idea
A neuron takes inputs x, multiplies each by a weight w, adds a bias b, and passes the sum through an activation function f: y = f(w · x + b). ReLU is the common choice: f(z) = max(0, z). Without the bend, stacking layers would still be one straight-line function. With it, layers compose into something far more expressive.

$$y = f(\mathbf{w} \cdot \mathbf{x} + b), \qquad \mathrm{ReLU}(z) = \max(0, z)$$

## Example
Inputs x = [1, 2], weights w = [0.5, -1], bias b = 0.5. The weighted sum is 0.5×1 + (-1)×2 + 0.5 = -1. ReLU(-1) = 0. The neuron stays silent. Change the bias to 3 and the sum becomes 1.5, ReLU gives 1.5, and the neuron fires.

## Layers
A layer is many neurons reading the same inputs, which is a matrix multiplication followed by an activation. A network passes the output of one layer to the next. A modern language model is the same pieces at huge scale, arranged as transformer blocks, with billions of weights.

## Try it
Change the weights and bias in the demo and watch the output and the decision line change.

## A second example: why one neuron is not enough
Take the XOR task: output 1 when exactly one of two inputs is 1. The four cases are (0,0) → 0, (0,1) → 1, (1,0) → 1 and (1,1) → 0. A single neuron draws one straight line to separate its answers, and no line can do this. Two layers can. Let h1 = ReLU(x1 + x2) and h2 = ReLU(x1 + x2 - 1), then output h1 - 2×h2. Case (1,1): h1 = 2, h2 = 1, output 2 - 2 = 0. Case (1,0): h1 = 1, h2 = 0, output 1. Case (0,0): both 0, output 0. All four cases come out right, using 9 learned numbers (6 weights and 3 biases).

## Why the bend is required
Remove the activation and a second layer does nothing new. If layer one multiplies by 3 and layer two multiplies by 2, together they multiply by 6, which one layer could do. With ReLU in between, the layers cannot merge, and each adds new shapes. That is the mechanism.

## What goes wrong: dead neurons
If a neuron's sum is negative for every input, ReLU outputs 0 and its slope is 0 too, so training cannot repair it. This is a dead neuron. Typical cause: a learning rate so large that one update pushed the bias far below zero. Symptom: many hidden values that are exactly 0 for every example. To confirm, run a batch through and count how often each neuron is above 0. A neuron stuck at 0% is dead.

## Check it by hand
Use x = [2, -1], w = [1, 3] and bias b = 1. The sum is 2 - 3 + 1 = 0, so the output is 0 and the neuron is silent. Which bias makes the output 2? Solve 2 - 3 + b = 2 to get b = 3. Check: 2 - 3 + 3 = 2, and ReLU keeps it.

## Common mistake
Imagining that each neuron has a clear human meaning. In big networks most neurons mean nothing on their own. The meaning is spread across many.

```resources
video | But what is a neural network? | https://www.youtube.com/watch?v=aircAruvnKk | 3Blue1Brown | The standard visual explanation.
tool | TensorFlow Playground | https://playground.tensorflow.org/ | Google | Train a small network in the browser and watch each neuron.
course | Neural Networks and Deep Learning | http://neuralnetworksanddeeplearning.com/ | Michael Nielsen | A free online book that builds the idea from scratch.
```

```quiz
Why does a network need an activation function? | It lets training use less memory overall ; Without it, stacked layers act as one layer ; It converts words into numbers for the model | 1 | The bend is what lets deep networks represent complex functions.
x = [1, 2], w = [1, 1], b = -4 and a ReLU. What is the output? | -1 ; 3 ; 0 | 2 | The sum is 1 + 2 - 4 = -1, and ReLU clips negatives to 0.
A neuron fires for cats using whiskers (+2), ears (+1) and barking (-3), with bias -1. A barking animal with whiskers and ears gives what? | Fires strongly: the sum is 3, so output is 3 ; Silent: the sum is -1, so output is 0 ; Fires weakly: the sum is 1, so output is 1 | 1 | 2 + 1 - 3 - 1 = -1, and ReLU turns a negative sum into 0.
```

```story
Think of a neuron as a bouncer at a club with a checklist. Each fact about a guest is multiplied by how much the bouncer cares about it, the total is added up, and if the total clears a bar the guest gets in. A network is thousands of such bouncers in rows, each row deciding based on what the previous row let through.
```

# loss-and-gradient-descent | Loss and gradient descent | 1 | 15
Training means measuring how wrong the model is, then nudging every weight in the direction that reduces the error. Repeat a few trillion times.

## The idea
Loss is a number that says how far the output is from the target. For one example with prediction p and target t, squared error is L = (p - t)². Training adjusts the weights w to make L small. The gradient dL/dw says how L changes if w increases. Gradient descent moves against it: w ← w - η · dL/dw, where η is the learning rate.

$$w \leftarrow w - \eta \, \frac{\partial L}{\partial w}$$

For language models the loss is cross-entropy: minus the natural logarithm (ln) of the probability the model gave the correct next token. If it gave the right token probability 0.9, loss is 0.105. The unit is called nats. The next lessons use bits instead, which is the same idea with a different logarithm. At probability 0.1, loss is 2.3.

$$L = -\ln p(\text{correct token})$$

## Example
Minimize L(w) = (w - 3)². The gradient is 2(w - 3). Start at w = 0 with η = 0.1: gradient is -6, so w becomes 0 + 0.6 = 0.6. Next, gradient -4.8, w = 1.08. Then 1.46, 1.77, and so on toward 3. With η = 1.1 it overshoots and diverges. With η = 0.001 it barely moves. The learning rate is a core hyperparameter.

## At scale
The same loop runs on billions of weights using mini-batches of data. Optimizers like Adam adapt each step. Backpropagation is how the gradients for all layers are computed efficiently.

## Try it
Use the demo: pick a learning rate and click step. Try a rate that is too large.

## What the loss number means
Loss is the score of how wrong the model is. Zero would be perfect. If the model gave the right next word a probability of 0.9, the loss is small (0.105). If it gave 0.01, the loss is large (4.6). Training pushes the loss down, which means the model gives more probability to what really came next.

## Choosing the learning rate
Too small and training crawls, like walking down a mountain an inch at a time. Too large and you leap over the valley and land higher up on the other side. Practitioners usually start with a small value, watch the loss curve, and use a schedule that begins gently and shrinks over time.

## Why each step shrinks the error
In the example, the gradient is 2(w - 3). One update gives w_new - 3 = (w - 3) × (1 - 2η). So with η = 0.1 the distance to the goal is multiplied by 0.8 each step: 3, 2.4, 1.92, 1.536. The values of w are 0, 0.6, 1.08, 1.464, 1.771, 2.017. The shrink factor tells you the learning rate story. With η = 0.25 the factor is 0.5, and w goes 0, 1.5, 2.25, 2.625. With η = 0.5 the factor is 0, so w lands on 3 in one step. With η = 1 the factor is -1, and w bounces between 0 and 6 forever. With η = 1.1 the factor is -1.2, so the gap grows each time.

## A second example: noisy mini-batches
Real training does not use the whole dataset per step. It averages the gradient over a mini-batch, a small sample. Invented gradients for one weight on four examples: -6, -2, -4, -4. The average is -16 / 4 = -4. Another batch may give -3.5. The steps are slightly off from the true direction but cheap, and over many steps they average out. A bigger batch gives a steadier gradient but costs more per step.

## What goes wrong
Three failures, each with a symptom.
1. Loss becomes nan or shoots upward: the learning rate is too big. Confirm by halving it and rerunning.
2. Loss barely moves: the rate is too small, or the gradients are zero because of a bug. Confirm by checking whether weights change after a step.
3. Training loss falls while held-out loss rises: memorizing. Confirm by plotting both curves.
Falling loss only proves the model fits its training numbers, not that it is useful.

## Check it by hand
Run the lesson's example with η = 0.25 on paper, from w = 0. The gradient 2(w - 3) is -6, so w = 0 + 1.5 = 1.5. Next the gradient is -3, so w = 2.25. Next -1.5, so w = 2.625. The distance to 3 halves each step: 3, 1.5, 0.75, 0.375.

## Common mistake
Changing the learning rate and the data in the same run. When the loss improves you cannot tell which change helped, so alter one thing per run.

```resources
video | Gradient descent, how neural networks learn | https://www.youtube.com/watch?v=IHZwWFHWa-w | 3Blue1Brown | Visual explanation of loss and descent.
video | The spelled-out intro to neural networks and backpropagation: building micrograd | https://www.youtube.com/watch?v=VMj-3S1tku0 | Andrej Karpathy | Builds autodiff from scratch in about two hours.
repo | micrograd | https://github.com/karpathy/micrograd | Andrej Karpathy | A tiny autograd engine in about 100 lines.
```

```quiz
Minimize (w - 3)² starting at w = 0 with learning rate 0.1. What is w after one step? | 0.6 ; 3 ; -0.6 | 0 | The gradient is 2(0 - 3) = -6, so w = 0 - 0.1 × (-6) = 0.6.
What happens if the learning rate is far too large? | The steps overshoot and the loss may grow ; Training finishes faster with a better result ; Nothing changes, only the speed differs | 0 | Big steps jump past the minimum and can get bigger each time.
Training loss keeps falling but loss on held-out data starts rising. What should you suspect? | The learning rate is too small to matter ; The model is memorizing its training data ; The held-out set is larger than the training set | 1 | Rising held-out loss with falling training loss is the sign of overfitting.
```

```story
A basketball player practises free throws. After each miss they notice "too short" or "too far left" and adjust a little. After thousands of shots, the adjustments add up to a reliable shot. A model learns the same way: guess, see how wrong the guess was, adjust, repeat across billions of examples.
```

# backpropagation | Backpropagation | 2 | 15
Backprop is the chain rule applied efficiently, so one backward pass gives the gradient for every weight.

## The idea
A network is a chain of simple operations. The chain rule says the derivative of a composition is the product of the derivatives of its parts. For y = f(g(x)), dy/dx = f′(g(x)) · g′(x). Backpropagation runs the network forward to get the loss, then walks backward through the operations, multiplying local derivatives and reusing each partial result.

$$\frac{dL}{dw} = \frac{dL}{dp} \cdot \frac{dp}{da} \cdot \frac{da}{dw}$$

## Example
Let a = w · x, then p = a + b, and L = (p - t)². With x = 2, w = 1, b = 0, t = 5: a = 2, p = 2, L = 9. Going backward: dL/dp = 2(p - t) = -6. dp/da = 1, so dL/da = -6. da/dw = x = 2, so dL/dw = -12. Update with η = 0.1: w = 1 + 1.2 = 2.2. Now a = 4.4 and L = 0.36. One step cut the loss from 9 to 0.36.

## Why it matters
The cost of the backward pass is about the same as the forward pass, no matter how many weights there are. That is what makes training billions of parameters feasible. Frameworks like PyTorch compute it automatically, so you rarely write it, but knowing what it does explains memory use and why training is far more expensive than inference.

## Why it is fast
Computing each weight's blame separately would take billions of passes. Backprop reuses work: the blame at a later layer is passed backward and combined with each earlier layer's local slope. One forward pass and one backward pass give every gradient. That is why training a huge model is possible at all.

## A second step of the same example
Continue from the example: after the first update w = 2.2. Forward: a = 2.2 × 2 = 4.4, p = 4.4, L = (4.4 - 5)² = 0.36. Backward: dL/dp = 2(4.4 - 5) = -1.2, and dL/dw = -1.2 × 2 = -2.4. Update: w = 2.2 + 0.1 × 2.4 = 2.44. Forward again: a = 4.88 and L = 0.0144. The same backward pass also gives the bias its gradient: dL/db = dL/dp × dp/db, and dp/db = 1, so it is -6 on the first step. The numbers above update only w and keep b = 0. If you updated b as well (b = 0.6), the next prediction would be 5.0 and the loss 0. One backward walk serves every parameter.

## When one weight is used twice
If a weight appears in two places, its gradient is the sum of the gradients along each path. Take p = w×x1 + w×x2 with x1 = 2, x2 = 3, target t = 10 and w = 1. Then p = 5 and L = 25. dL/dp = 2(5 - 10) = -10. The path through x1 contributes -10 × 2 = -20, and the path through x2 contributes -10 × 3 = -30. So dL/dw = -50. With η = 0.01, w = 1.5, p = 7.5 and L = 6.25. This summing is how one filter reused across a whole image, or one weight matrix reused across a whole sentence, gets a single gradient.

## Trade-offs: memory and cost
The backward pass needs numbers from the forward pass. In the example, da/dw = x, so x must be kept. A real network keeps these stored values for every layer until the backward pass reaches them. That is a large part of why training needs much more memory than running the model. A common trick is to throw some away and recompute them later, trading extra compute for less memory.

## How to tell it is working
Test your gradient numerically. For L(w) = (2w - 5)², nudge w from 1 to 1.001. L goes from 9 to 8.988004, a change of -0.011996, and dividing by 0.001 gives -11.996. Backprop said -12. If a hand-written backward step disagrees by more than a rounding error, it has a bug. In PyTorch, one more thing to know: gradients add up across backward calls unless you reset them each step, a common cause of training that looks wrong.

## Common mistakes
Believing backprop is a learning algorithm by itself. It only computes the gradients. Gradient descent (or Adam) uses them to change the weights.

```resources
video | Backpropagation, intuitively | https://www.youtube.com/watch?v=Ilg3gGewQ5U | 3Blue1Brown | The intuition for how gradients flow backward.
video | Backpropagation calculus | https://www.youtube.com/watch?v=tIeHLnjs5U8 | 3Blue1Brown | The chain rule with actual derivatives.
repo | micrograd | https://github.com/karpathy/micrograd | Andrej Karpathy | The smallest working implementation to read.
```

```quiz
dL/da = -6 and da/dw = 2. What is dL/dw? | -3 ; -12 ; -18 | 1 | By the chain rule you multiply the local derivatives along the path.
Why is backpropagation efficient? | It skips the layers that matter the least ; It needs far less data than gradient descent ; It reuses partial results in one pass | 2 | The cost is about one extra pass, however many weights there are.
After one update, the loss goes from 9 to 0.36. What does that tell you about the step? | The direction and step size were about right ; The learning rate must have been far too small ; The model has already finished all of its training | 0 | A large drop in loss from one step means the direction and size were good.
```

```story
A restaurant gets a bad review: the soup was cold. Who is to blame? The chef, the waiter who waited, the oven? You trace backward through the chain to see how much each step contributed. Backpropagation does this for a network: when the answer is wrong, it walks backward through the layers and tells every weight how much it contributed to the mistake.
```

# entropy-and-kl | Entropy and KL divergence | 2 | 15
Entropy measures surprise. Cross-entropy is the loss language models train on. KL divergence measures how far one distribution is from another.

## The ideas
A logarithm answers the question: what power must I raise the base to, to get this number? Since 2³ = 8, log₂(8) = 3. Log base 2 gives bits, and the natural log (base e) gives nats. Training code usually uses the natural log, so the loss lesson's 0.9 gives 0.105 nats, which is 0.152 bits. Same quantity, different unit. Now: an event with probability p carries surprise of -log₂(p) bits. A fair coin flip has surprise 1 bit. An event with probability 1/8 has 3 bits. Entropy is the average surprise of a distribution: H(p) = -Σ p·log₂ p. A fair coin has entropy 1 bit, a coin that always lands heads has 0.

$$H(p) = -\sum_i p_i \log_2 p_i$$

Cross-entropy H(p, q) = -Σ p·log q is the average surprise when the truth is p but you use model q. For next-token prediction the truth puts probability 1 on the actual token, so cross-entropy reduces to minus the log of the probability the model gave it. That is the training loss.

KL divergence is the gap: KL(p ‖ q) = H(p, q) - H(p). It is 0 only when q equals p, and always at least 0. It shows up when you want to keep a fine-tuned model close to its base, as in the penalty used in RLHF.

$$H(p,q) = -\sum_i p_i \log q_i, \qquad \mathrm{KL}(p \,\|\, q) = H(p,q) - H(p)$$

## Example
True distribution p = [0.5, 0.5]. Model q = [0.9, 0.1]. H(p) = 1 bit. H(p, q) = -(0.5·log₂0.9 + 0.5·log₂0.1) = 0.5×0.152 + 0.5×3.322 = 1.737 bits. KL = 1.737 - 1 = 0.737 bits. Perplexity, a common language model score, is 2 raised to the cross-entropy, so lower is better.

## In plain words
Cross-entropy asks: if reality follows distribution p but I use my model q to predict it, how surprised will I be on average? The better q matches p, the smaller the number. KL divergence is just the extra surprise caused by using q instead of the truth.

## Worked example in model terms
The real next word is "Paris". Model A gave "Paris" 90 percent: surprise of 0.15 bits (0.105 nats). Model B gave it 5 percent: surprise of 4.3 bits. Averaged over millions of sentences, that gap is the difference between a good model and a bad one.

## Surprise by example
Surprise is -log₂(p) bits. Probability 0.5 gives 1 bit, 0.25 gives 2, 0.125 gives 3, 0.9 gives 0.152, 0.1 gives 3.322 and 0.05 gives 4.322. Rare events carry more surprise, and certain events carry none. Entropy averages it. A coin with probabilities [0.9, 0.1] has entropy 0.9 × 0.152 + 0.1 × 3.322 = 0.137 + 0.332 = 0.469 bits, far under the fair coin's 1 bit, because you can mostly guess the result. A coin with [0.25, 0.75] has 0.25 × 2 + 0.75 × 0.415 = 0.811 bits.

## A second example: the direction matters
Use p = [0.5, 0.5] and q = [0.9, 0.1]. KL(p ‖ q) = 0.5 × log₂(0.5/0.9) + 0.5 × log₂(0.5/0.1) = 0.5 × (-0.848) + 0.5 × 2.322 = 0.737 bits. Swap them: KL(q ‖ p) = 0.9 × log₂(0.9/0.5) + 0.1 × log₂(0.1/0.5) = 0.9 × 0.848 + 0.1 × (-2.322) = 0.531 bits. Two different numbers. The first asks what it costs to use q when reality is p, the second the reverse. In RLHF, which direction is penalized changes the behavior.

## What perplexity means
Perplexity is 2 raised to the entropy, and reads as "how many equally likely choices the model is torn between". A model choosing among 4 equal options has entropy 2 bits and perplexity 2² = 4. A model that always puts all its probability on the right token has perplexity 1. Numbers from different tokenizers are not comparable, because the model predicts different pieces.

## What goes wrong
If reality allows an outcome but the model gives it probability 0, the surprise is infinite, and so are cross-entropy and KL. A training log showing inf at one batch often points to this. The symptom is a single huge spike rather than a slow rise. Another trap is mixing units: 0.105 nats and 0.152 bits are the same quantity, so compare numbers only in one unit.

## Common mistake
Thinking KL divergence is a distance like on a map. It is not symmetric: KL(p, q) and KL(q, p) are different numbers.

```resources
video | A Short Introduction to Entropy, Cross-Entropy and KL-Divergence | https://www.youtube.com/watch?v=ErfnhcEV1O8 | Aurélien Géron | Ten minutes, with the coin and weather examples.
article | Visual Information Theory | https://colah.github.io/posts/2015-09-Visual-Information/ | Chris Olah | Draws entropy and cross-entropy as areas.
article | Kullback-Leibler divergence | https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence | Wikipedia | Definition, properties and why it is not symmetric.
```

```quiz
How much entropy does a fair coin have? | 0 bits ; 1 bit ; 2 bits | 1 | Each flip carries one bit of surprise on average.
What is the KL divergence between two identical distributions? | 1 ; Infinite ; 0 | 2 | There is no gap when q equals p.
A model gives the real next word 90 percent in one run and 5 percent in another. Which run has the larger loss? | The 90 percent run, since it was more certain ; Both are the same, since the word is right ; The 5 percent run, as the surprise is larger | 2 | Loss is minus the log of the probability given to the right word, so a small probability means a big loss.
```

```story
You have a coin. If it always lands heads, the next flip tells you nothing, so there is no surprise. If it is fair, each flip is a surprise worth one bit. Entropy is how surprised you expect to be on average. A language model that is good at predicting the next word is rarely surprised, so its loss is low.
```

# moving-averages-and-adam | Moving averages and the Adam optimizer | 2 | 15
Raw gradients are noisy. Smoothing them with a moving average makes training steadier. Adam adds a per-weight step size.

## Exponential moving average
An EMA blends the old average with the new value: m ← β·m + (1 - β)·g, where β is near 1, such as 0.9. Recent values weigh more, old values fade. With β = 0.9 and gradients 1, 1, 1, starting from m = 0: m = 0.1, 0.19, 0.271. It starts low, a bias that Adam corrects by dividing by (1 - βᵗ). At step 1 the average is 0.1 and the correction divides by 1 - 0.9 = 0.1, giving 1.0, the true gradient. At step 2 it is 0.19 / 0.19 = 1.0 again.

$$m_t = \beta \, m_{t-1} + (1 - \beta)\, g_t, \qquad \hat{m}_t = \frac{m_t}{1 - \beta^t}$$

## Adam
Adam keeps two EMAs per weight: the average of gradients (momentum, direction) and the average of squared gradients (scale). The step is learning rate × momentum / (square root of scale + a tiny constant). Weights with consistently large gradients take smaller steps and weights with small gradients take relatively bigger ones. It is the default optimizer for transformers, usually with weight decay (AdamW), which gently shrinks weights toward zero.

## Learning rate schedules
A common recipe is warmup (rise from near zero over the first steps) then decay (fall, often along a cosine curve). Large models are sensitive to this, since a rate that is too high early can wreck training.

## Worked example: smoothing
Daily gradients for one weight: 1.0, -0.8, 1.2, 0.9. A raw update would zigzag. With beta 0.9, momentum builds as 0.1×1.0 = 0.10, then 0.9×0.10 + 0.1×(-0.8) = 0.01, then 0.9×0.01 + 0.1×1.2 = 0.129, then 0.9×0.129 + 0.1×0.9 = 0.206. The smoothed value changes gently. It starts low because it begins at zero, so real optimizers divide by a correction factor (here 1 − 0.9^4 = 0.344, giving 0.206 / 0.344 = 0.60, close to the plain average of 0.575).

## Why Adam is the default
Different weights need different step sizes. Adam divides each step by how large that weight's recent gradients have been, so noisy weights move carefully and quiet ones move more. It works well out of the box, which is why most transformers use it.

## How one Adam step is built
Adam tracks two averages per weight, m for gradients and v for squared gradients. A typical choice is β₁ = 0.9 for m and β₂ = 0.999 for v. After bias correction on step 1, m̂ equals the gradient g and v̂ equals g², so the step is the learning rate × g / (|g| + a tiny number). That is about plus or minus the learning rate, whatever g was. Check: with g = 0.5, 50 and 0.001 the ratio g / |g| is 1 in all three cases. The first steps all have about the same size, even when gradient scales differ by a factor of 50,000. That is the "per-weight step size" idea in action.

## A second example: a weight that zigzags
Gradients +1, -1, +1, -1 for one weight, with β = 0.9. The raw average m runs 0.1, -0.01, 0.091, -0.0181. After dividing by 1 - 0.9ᵗ (0.1, 0.19, 0.271, 0.3439) you get 1.0, -0.053, 0.336, -0.053. A plain gradient step would swing by ±1 every time. The smoothed signal says: mostly cancelling, barely move. Compare a steady gradient of 1, where the corrected value stays at exactly 1 and the weight moves at full speed.

## Trade-offs
Adam stores two extra numbers for every weight. Invented size: a model with 1 billion weights stored in 32 bits (4 bytes each) needs 4 GB for the weights, 4 GB for gradients and 8 GB for the two Adam averages, 16 GB in total before any activations. Plain gradient descent with no memory needs only 8 GB for weights plus gradients. This extra cost is one reason people use lower-precision storage and other tricks. Adam is also not always best: it needs less tuning, but a well-tuned simpler method can generalize as well on some tasks.

## What goes wrong, and how to tell
Symptom: the loss spikes up and recovers, or turns to nan, usually early. Likely cause: learning rate too high for the model size, so try a longer warmup. Another symptom: loss falls fast then plateaus above where it should be, often a rate that decayed too early. To confirm, log the learning rate next to the loss and see whether the spike lines up with the rate peak.

## Common mistake
Using a high learning rate from step one on a large model. Warmup, starting low and rising, prevents early blow-ups.

```resources
article | Why Momentum Really Works | https://distill.pub/2017/momentum/ | Gabriel Goh | An interactive explanation of momentum.
paper | Adam: A Method for Stochastic Optimization | https://arxiv.org/abs/1412.6980 | Kingma and Ba | The original Adam paper.
video | Optimization for Deep Learning (Momentum, RMSprop, AdaGrad, Adam) | https://www.youtube.com/watch?v=NE88eqLngkg | DeepBean | Each optimizer explained with animations.
```

```quiz
In an exponential moving average with beta 0.9, which values count the most? | The oldest values ; The newest values ; All values equally | 1 | Older values fade geometrically, so recent values weigh more.
Why do large models use learning-rate warmup? | It saves memory during the first steps ; It forces the loss to start at zero ; Big early steps can wreck training | 2 | The rate rises slowly until training is stable.
Gradients for one weight bounce between +1 and -1 every step. What does Adam's moving average do with this? | Doubles the step size each time ; Smooths them so the weight barely moves ; Locks that weight and stops its training | 1 | Averaging noisy gradients cancels the swings, so the update follows the overall trend.
```

```story
When you check your weight every morning, the number jumps around by a pound or two from water and meals. A smarter reading is the average of the last week, which shows the real trend. Training does the same with its noisy gradient signals: Adam keeps a moving average so one odd batch does not send the model off course.
```

# attention-math | Attention in numbers | 2 | 15
Attention is dot products, a softmax and a weighted average. Here it is with a two-token example.

## The formula
Each token has a query q, a key k and a value v, all vectors. For one query, the score against each key is a dot product scaled by the square root of the key size d: score = q · k / √d. Softmax turns the scores into weights. The output is the weighted sum of the values: out = Σ weight × v. In matrix form: softmax(Q Kᵀ / √d) V.

$$\mathrm{Attention}(Q,K,V) = \mathrm{softmax}\!\left(\frac{Q K^{\top}}{\sqrt{d}}\right) V$$

## Example
Let d = 2, with q = [1, 0]. Two keys: k₁ = [1, 0] and k₂ = [0, 1]. Values: v₁ = [10, 0], v₂ = [0, 10]. Scores: q·k₁ = 1, q·k₂ = 0. Scaled by √2 = 1.414: 0.71 and 0. Softmax: e^0.71 = 2.03, e⁰ = 1, sum 3.03, so weights 0.67 and 0.33. Output = 0.67 × [10, 0] + 0.33 × [0, 10] = [6.7, 3.3]. The query matched the first key more, so the output leans toward v₁.

## Why divide by √d
Dot products grow with vector size, which would push softmax into near one-hot outputs with tiny gradients. Scaling keeps the scores in a useful range.

## In a real model
A causal mask blocks each token from seeing later tokens. Many attention heads run in parallel, each learning a different pattern, and their outputs are concatenated. The key and value vectors of earlier tokens are cached during generation, which is the KV cache behind fast decoding and prompt caching.

## In plain words
Each word makes three vectors. The query says "what am I looking for?". The key says "what do I contain?". The value says "what do I give if you pick me?". A word compares its query with everyone's keys, turns the scores into percentages with softmax, and takes a weighted mix of the values.

## A second example with a causal mask
Take three tokens and suppose token 2 scores [1, 2, 3] against tokens 1, 2 and 3. Without a mask, softmax gives e¹ = 2.718, e² = 7.389, e³ = 20.086, total 30.193, so weights 0.090, 0.245 and 0.665. But token 2 must not see token 3, which comes later. The mask removes that score before softmax, so only [1, 2] remain: 2.718 / 10.107 = 0.269 and 7.389 / 10.107 = 0.731. Token 3 gets weight 0. Without the mask, a model could cheat on next-word prediction by reading the answer.

## Why the scaling matters, in numbers
Suppose each entry of q and k is a random number with spread about 1. A dot product adds d such products, so its typical size grows like √d. With d = 64 that is about 8. Unscaled scores of [8, -8] give weights 1 / (1 + e⁻¹⁶) = 0.9999999. The softmax is nearly saturated: its slope, p × (1 - p), is about 0.0000001, so training learns almost nothing. Divide by √64 = 8 and the scores become [1, -1]. The weights are 0.881 and 0.119, and the slope is 0.105, about a million times larger.

## Trade-offs: cost grows with the square
Every token scores against every earlier token, so n tokens give about n² scores per head. At 1,000 tokens that is 1,000,000. At 2,000 tokens it is 4,000,000: double the text, four times the scores. This is why long prompts get slower and costly, and why much research targets cheaper attention. The KV cache avoids recomputing old keys and values, but it grows linearly with length and takes memory.

## Check it by hand
Reuse the lesson's keys and values but change the query to q = [0, 1]. Scores: 0 and 1, scaled by 1.414 to 0 and 0.707. Exponentials: 1 and 2.028, total 3.028. Weights 0.330 and 0.670. Output: 0.33 × [10, 0] + 0.67 × [0, 10] = [3.3, 6.7]. It is the mirror image of the example, as it should be. Also check that your weights add up to 1.

## Common mistake
Thinking attention is how the model "focuses like a person". It is a weighted average computed with dot products. Useful, but mechanical.

```resources
video | Attention in transformers, step-by-step | https://www.youtube.com/watch?v=eMlx5fFNoYc | 3Blue1Brown | The full computation, animated.
video | Let's build GPT: from scratch, in code, spelled out | https://www.youtube.com/watch?v=kCc8FmEb1nY | Andrej Karpathy | Implements self-attention in code from a toy example.
article | The Illustrated Transformer | https://jalammar.github.io/illustrated-transformer/ | Jay Alammar | Diagram of queries, keys and values.
```

```quiz
What produces the attention weights? | The value vectors, simply added together ; A softmax over query-key dot products ; The positional signal added to inputs | 1 | The weights come from how well the query matches each key.
Why divide by the square root of d? | To save GPU memory during training ; To turn the output into a probability ; To keep softmax from saturating | 2 | Large unscaled scores push softmax toward one-hot with tiny gradients.
A query matches key 1 much better than key 2. Which description of the output is right? | A blend leaning heavily toward value 1 ; Exactly value 1 and nothing from value 2 ; An even split between both values | 0 | Softmax gives a high but not total weight to the better match, so the output is a weighted blend.
```

```story
Read this: "The trophy did not fit in the suitcase because it was too big." What does "it" refer to? You instantly know it is the trophy. Attention is how a model does this: the word "it" scores every earlier word for relevance, finds that "trophy" matches best, and pulls in its meaning.
```

