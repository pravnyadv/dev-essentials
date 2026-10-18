# vectors-and-similarity | Vectors and similarity | 1 | 12
A vector is a list of numbers. The dot product measures how much two vectors point the same way. Nearly everything in modern AI is this operation repeated.

## Before you start
This chapter is the math underneath everything you have used so far: prompts, embeddings, retrieval and agents. You have already seen what these things do. Here you see why they work, using small numbers you can do by hand. Take it one lesson at a time. If a formula gets heavy, read the worked example and the picture first, and come back to the formula later.

## The idea
Represent a thing as numbers. A word, an image or a sentence becomes a vector such as [0.2, 0.9, -0.1]. The dot product multiplies matching entries and adds them: a · b = a₁b₁ + a₂b₂ + … Large and positive means similar direction, near zero means unrelated, negative means opposite.

$$a \cdot b = a_1 b_1 + a_2 b_2 + \dots + a_n b_n$$

Cosine similarity divides out the lengths so only direction counts: cos(a, b) = (a · b) / (|a| |b|), where |a| is the square root of the sum of squares. It always falls between -1 and 1.

$$\cos(a,b) = \frac{a \cdot b}{\lVert a \rVert \, \lVert b \rVert}$$

## Example
Take a = [1, 2] and b = [2, 1]. The dot product is 1×2 + 2×1 = 4. The lengths are both √5 ≈ 2.236. So cosine is 4 / 5 = 0.8, quite similar. For a = [1, 0] and c = [0, 1], the dot product is 0, so cosine is 0: unrelated.

## Where you will see it
Embedding search ranks documents by cosine similarity to the query. Attention scores are dot products between a query vector and key vectors. A neuron computes a dot product between its weights and its inputs. Learn this one operation well.

## Try it
Drag the two arrows in the demo above and watch the dot product and cosine change.

## Worked example: recommending a song
You: [fast 0.9, acoustic 0.1, sad 0.2]. Song A: [0.8, 0.0, 0.1]. Song B: [0.1, 0.9, 0.9]. Dot with A: 0.9×0.8 + 0.1×0 + 0.2×0.1 = 0.74. Dot with B: 0.9×0.1 + 0.1×0.9 + 0.2×0.9 = 0.36. Song A fits you better. Search engines, recommendations and chatbots all use this idea at much bigger scale, with hundreds of numbers instead of three.

## Common mistake
Comparing raw dot products when vectors have different lengths. A long vector gets a big dot product just for being long. Cosine similarity removes length so only direction counts.

```resources
video | Vectors (Essence of linear algebra, chapter 1) | https://www.youtube.com/watch?v=fNk_zzaMoSs | 3Blue1Brown | Essence of linear algebra, chapter 1.
video | Dot products and duality | https://www.youtube.com/watch?v=LyGKycYT2v0 | 3Blue1Brown | Why multiplying and summing measures alignment.
article | The Illustrated Word2vec | https://jalammar.github.io/illustrated-word2vec/ | Jay Alammar | How words become vectors you can do math on.
```

```quiz
a = [1, 2] and b = [3, 0]. What is the dot product a · b? | 6 ; 3 ; 5 | 1 | Multiply matching entries and add: 1 × 3 + 2 × 0 = 3.
Two embeddings have a cosine similarity near 0. What does that mean? | They are almost the same text ; They point in opposite directions ; They point in unrelated directions | 2 | Cosine 1 means the same direction, 0 means unrelated and -1 means opposite.
You compare a short note and a very long article by raw dot product, and the long one always wins. What is going on? | Long vectors get big dot products just for being long ; The longer article is always more relevant ; Dot products ignore vector length completely | 0 | Length inflates the dot product. Cosine similarity divides the lengths out so only direction counts.
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

## Common mistakes
Shape errors. If the matrix is 2 by 3, the vector must have 3 numbers, and the result has 2. Most beginner bugs in model code are shapes that do not line up. Print the shape of everything while you debug.

```resources
video | Matrix multiplication as composition | https://www.youtube.com/watch?v=XkY2DOUCWMU | 3Blue1Brown | Why the rows-by-columns rule is what it is.
course | PyTorch tensors tutorial | https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html | PyTorch | Create, reshape and multiply tensors.
article | Broadcasting semantics | https://numpy.org/doc/stable/user/basics.broadcasting.html | NumPy | The precise rules, with pictures.
```

```quiz
M is a 2 by 3 matrix and x has 3 numbers. How many numbers does M x have? | 3 ; 2 ; 6 | 1 | Each of the 2 rows gives one output number.
What does broadcasting do? | Sends data from the CPU over to the GPU ; Deletes any extra axes from an array ; Stretches a smaller array to fit a bigger one | 2 | It lets you add a bias vector to a whole batch without copying it.
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

## Common mistake
Thinking a logarithm makes numbers bigger. It compresses them: log₂ of a million is only about 20. Also check the base. log₂ gives bits, ln gives nats, and the idea is the same.

```resources
course | Probability library | https://www.khanacademy.org/math/statistics-probability/probability-library | Khan Academy | Free lessons on basic probability with practice.
course | Logarithms | https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:logs | Khan Academy | What a logarithm means, and its rules.
video | Triangle of Power | https://www.youtube.com/watch?v=sULa9Lc4pck | 3Blue1Brown | Exponents, logarithms and roots shown as three views of one relationship.
```

```quiz
You flip a fair coin three times. What is the probability of three heads? | 0.5 ; 0.125 ; 0.375 | 1 | Independent events multiply: 0.5 × 0.5 × 0.5 = 0.125.
Why do training programs add logs of probabilities instead of multiplying the probabilities? | Logs turn every probability into exactly 1 ; Neural networks cannot multiply two numbers ; A product of tiny numbers is too small to store | 2 | The product underflows. The log of a product is the sum of logs, so the answer is kept safely.
What is log base 2 of 32? | 5 ; 16 ; 6 | 0 | 2 to the power 5 is 32.
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

## Common mistake
Thinking temperature 0 gives the "correct" answer. It gives the most likely answer, which can still be wrong. Low temperature gives consistency, not truth.

```resources
video | ArgMax and SoftMax | https://www.youtube.com/watch?v=KpKog-L9veg | StatQuest | Step-by-step with numbers.
article | Softmax function | https://en.wikipedia.org/wiki/Softmax_function | Wikipedia | Definition and properties, including the temperature form.
```

```quiz
What does lowering the temperature do to the output distribution? | It flattens it so tokens look alike ; It sharpens it toward the top token ; It removes unlikely tokens completely | 1 | Dividing the scores by a small T makes the differences bigger, so the leader dominates.
Softmax outputs always do which of these? | Equal whole numbers ; Fall between -1 and 1 ; Add up to 1 | 2 | That is what lets them be read as probabilities.
Scores are [2, 1, 0.1] at T = 1 and give 66 percent for the first token. At T = 2, what happens to that 66 percent? | It falls toward 50 percent as the choice flattens ; It rises to about 86 percent as it sharpens ; It stays at exactly 66 percent | 0 | Higher temperature flattens the distribution. The worked example gives about 50, 30 and 19 percent.
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

## Common mistake
Mixing up direction. The gradient points uphill. To reduce error you move against it.

```resources
video | The paradox of the derivative | https://www.youtube.com/watch?v=9vKqVkMQHKk | 3Blue1Brown | The intuition for what a derivative is.
video | Gradients and Partial Derivatives | https://www.youtube.com/watch?v=GkB4vW16QHI | Eugene Khutoryansky | Animated partial derivatives and the gradient vector.
course | Essence of calculus | https://www.3blue1brown.com/topics/calculus | 3Blue1Brown | The full visual series.
```

```quiz
What is the derivative of f(x) = x² at x = 3? | 9 ; 6 ; 3 | 1 | The derivative is 2x, so at x = 3 it is 6.
In which direction does the gradient point? | Toward the steepest decrease ; Toward the nearest minimum ; Toward the steepest increase | 2 | You step against it to reduce a function, which is what training does.
f(a, b) = a² + 3b at (2, 1). Which nudge raises f the most per unit step? | Increasing a, since its slope is 4 and b's is 3 ; Increasing b, since b has the larger multiplier ; Both raise f by exactly the same amount | 0 | The gradient is [2a, 3] = [4, 3], so a changes f faster here.
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

## Common mistake
Imagining that each neuron has a clear human meaning. In big networks most neurons mean nothing on their own. The meaning is spread across many.

```resources
video | But what is a neural network? | https://www.youtube.com/watch?v=aircAruvnKk | 3Blue1Brown | The standard visual explanation.
tool | TensorFlow Playground | https://playground.tensorflow.org/ | Google | Train a small network in the browser and watch each neuron.
course | Neural Networks and Deep Learning | http://neuralnetworksanddeeplearning.com/ | Michael Nielsen | A free online book that builds the idea from scratch.
```

```quiz
Why does a network need an activation function? | It lets training use less memory overall ; Stacked layers would collapse into one linear function ; It converts words into numbers for the model | 1 | The bend is what lets deep networks represent complex functions.
x = [1, 2], w = [1, 1], b = -4 and a ReLU. What is the output? | -1 ; 3 ; 0 | 2 | The sum is 1 + 2 - 4 = -1, and ReLU clips negatives to 0.
A neuron fires for cats using whiskers (+2), ears (+1) and barking (-3), with bias -1. A barking animal with whiskers and ears gives what? | Silent: the sum is -1, so ReLU outputs 0 ; Fires strongly with an output of 3 ; Fires weakly with an output of 1 | 0 | 2 + 1 - 3 - 1 = -1, and ReLU turns a negative sum into 0.
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

## Common mistake
Watching only the training loss. Always watch loss on held-out data too, because that shows whether the model is learning or memorizing.

```resources
video | Gradient descent, how neural networks learn | https://www.youtube.com/watch?v=IHZwWFHWa-w | 3Blue1Brown | Visual explanation of loss and descent.
video | The spelled-out intro to neural networks and backpropagation: building micrograd | https://www.youtube.com/watch?v=VMj-3S1tku0 | Andrej Karpathy | Builds autodiff from scratch in about two hours.
repo | micrograd | https://github.com/karpathy/micrograd | Andrej Karpathy | A tiny autograd engine in about 100 lines.
```

```quiz
Minimize (w - 3)² starting at w = 0 with learning rate 0.1. What is w after one step? | 3 ; 0.6 ; -0.6 | 1 | The gradient is 2(0 - 3) = -6, so w = 0 - 0.1 × (-6) = 0.6.
What happens if the learning rate is far too large? | Training finishes faster with a better result ; Nothing changes, only the speed differs ; The steps overshoot and the loss may grow | 2 | Big steps jump past the minimum and can get bigger each time.
Training loss keeps falling but loss on held-out data starts rising. What should you suspect? | The model is memorizing its training data ; The learning rate is too small to matter ; The held-out data is bigger than the training data | 0 | Rising held-out loss with falling training loss is the sign of overfitting.
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

## Common mistakes
Believing backprop is a learning algorithm by itself. It only computes the gradients. Gradient descent (or Adam) uses them to change the weights.

```resources
video | Backpropagation, intuitively | https://www.youtube.com/watch?v=Ilg3gGewQ5U | 3Blue1Brown | The intuition for how gradients flow backward.
video | Backpropagation calculus | https://www.youtube.com/watch?v=tIeHLnjs5U8 | 3Blue1Brown | The chain rule with actual derivatives.
repo | micrograd | https://github.com/karpathy/micrograd | Andrej Karpathy | The smallest working implementation to read.
```

```quiz
dL/da = -6 and da/dw = 2. What is dL/dw? | -3 ; -12 ; 12 | 1 | By the chain rule you multiply the local derivatives along the path.
Why is backpropagation efficient? | It skips the layers that matter the least ; It needs far less data than gradient descent ; It reuses partial results, so one pass is enough | 2 | The cost is about one extra pass, however many weights there are.
After one update, the loss goes from 9 to 0.36. What does that tell you about the step? | The gradients pointed the right way and the step was sensible ; The learning rate must have been far too small ; The model has already finished all of its training | 0 | A large drop in loss from one step means the direction and size were good.
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
A model gives the real next word 90 percent in one run and 5 percent in another. Which run has the larger loss? | The 5 percent run, since the surprise is larger ; The 90 percent run, since it was more certain ; Both are the same, since the word is right | 0 | Loss is minus the log of the probability given to the right word, so a small probability means a big loss.
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
Daily gradients for one weight: 1.0, -0.8, 1.2, 0.9. A raw update would zigzag. With beta 0.9, momentum builds as 0.1×1.0 = 0.10, then 0.9×0.10 + 0.1×(-0.8) = 0.01, then 0.9×0.01 + 0.1×1.2 = 0.129, then 0.9×0.129 + 0.1×0.9 = 0.206. The smoothed value changes gently and follows the overall trend.

## Why Adam is the default
Different weights need different step sizes. Adam divides each step by how large that weight's recent gradients have been, so noisy weights move carefully and quiet ones move more. It works well out of the box, which is why most transformers use it.

## Common mistake
Using a high learning rate from step one on a large model. Warmup, starting low and rising, prevents early blow-ups.

```resources
article | Why Momentum Really Works | https://distill.pub/2017/momentum/ | Gabriel Goh | An interactive explanation of momentum.
paper | Adam: A Method for Stochastic Optimization | https://arxiv.org/abs/1412.6980 | Kingma and Ba | The original Adam paper.
video | Optimization for Deep Learning (Momentum, RMSprop, AdaGrad, Adam) | https://www.youtube.com/watch?v=NE88eqLngkg | DeepBean | Each optimizer explained with animations.
```

```quiz
In an exponential moving average with beta 0.9, which values count the most? | The oldest ones ; The most recent ones ; All of them equally | 1 | Older values fade geometrically, so recent values weigh more.
Why do large models use learning-rate warmup? | It saves memory in the first steps ; It makes the loss start at zero ; A high rate early on can wreck training | 2 | The rate rises slowly until training is stable.
Gradients for one weight bounce between +1 and -1 every step. What does Adam's moving average do with this? | Smooths them so the weight barely swings back and forth ; Doubles the step size in each direction ; Stops training that weight completely and forever | 0 | Averaging noisy gradients cancels the swings, so the update follows the overall trend.
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

## Common mistake
Thinking attention is how the model "focuses like a person". It is a weighted average computed with dot products. Useful, but mechanical.

```resources
video | Attention in transformers, step-by-step | https://www.youtube.com/watch?v=eMlx5fFNoYc | 3Blue1Brown | The full computation, animated.
video | Let's build GPT: from scratch, in code, spelled out | https://www.youtube.com/watch?v=kCc8FmEb1nY | Andrej Karpathy | Implements self-attention in code from a toy example.
article | The Illustrated Transformer | https://jalammar.github.io/illustrated-transformer/ | Jay Alammar | Diagram of queries, keys and values.
```

```quiz
What produces the attention weights? | The value vectors, simply added together ; A softmax over scaled query and key dot products ; The bias term from the final layer | 1 | The weights come from how well the query matches each key.
Why divide by the square root of d? | To save memory on the GPU during training ; To turn the output into a probability ; To stop dot products from saturating the softmax | 2 | Large unscaled scores push softmax toward one-hot with tiny gradients.
A query matches key 1 much better than key 2. Which description of the output is right? | A blend leaning heavily toward value 1 ; Exactly value 1 and nothing from value 2 ; An even average of both values | 0 | Softmax gives a high but not total weight to the better match, so the output is a weighted blend.
```

```story
Read this: "The trophy did not fit in the suitcase because it was too big." What does "it" refer to? You instantly know it is the trophy. Attention is how a model does this: the word "it" scores every earlier word for relevance, finds that "trophy" matches best, and pulls in its meaning.
```

