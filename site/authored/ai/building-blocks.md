# vectors-and-similarity | Vectors and similarity | 1 | 12
A vector is a list of numbers. The dot product measures how much two vectors point the same way. Nearly everything in modern AI is this operation repeated.

## Before you start
This chapter is the math underneath everything you have used so far: prompts, embeddings, retrieval and agents. You have already seen what these things do. Here you see why they work, using small numbers you can do by hand. Take it one lesson at a time. If a formula gets heavy, read the worked example and the picture first, and come back to the formula later.

## The idea
Represent a thing as numbers. A word, an image or a sentence becomes a vector such as [0.2, 0.9, -0.1]. The dot product multiplies matching entries and adds them: a · b = a₁b₁ + a₂b₂ + … Large and positive means similar direction, near zero means unrelated, negative means opposite.

Cosine similarity divides out the lengths so only direction counts: cos(a, b) = (a · b) / (|a| |b|), where |a| is the square root of the sum of squares. It always falls between -1 and 1.

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
a = [1, 2], b = [3, 0]. What is a · b? | 3 ; 6 ; 5 | 0 | 1×3 + 2×0 = 3.
Two embeddings have cosine similarity near 0. They are | Nearly identical ; Unrelated ; Opposite | 1 | Cosine 1 means same direction, 0 means unrelated, -1 means opposite.
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

## In plain words
A matrix is a table of numbers. Multiplying a vector by a matrix means: for each row of the table, do a dot product with the vector. A table with 2 rows turns a 3-number input into a 2-number output. Stack many such steps and you have a neural network layer.

## Common mistakes
Shape errors. If the matrix is 2 by 3, the vector must have 3 numbers, and the result has 2. Most beginner bugs in model code are shapes that do not line up. Print the shape of everything while you debug.

```resources
video | Matrix multiplication as composition | https://www.youtube.com/watch?v=XkY2DOUCWMU | 3Blue1Brown | Why the rows-by-columns rule is what it is.
course | PyTorch tensors tutorial | https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html | PyTorch | Create, reshape and multiply tensors.
article | Broadcasting semantics | https://numpy.org/doc/stable/user/basics.broadcasting.html | NumPy | The precise rules, with pictures.
```

```quiz
M is 2 by 3 and x has length 3. What is the shape of M x? | 2 ; 3 ; 2 by 3 | 0 | Each of the 2 rows gives one number.
What does broadcasting do? | Sends data to GPUs ; Stretches a smaller array to match a larger one in an operation ; Deletes axes | 1 | It lets you add a bias vector to a batch without copying it.
```

```story
A photo editor applies a filter to a million pixels. Each new pixel is a weighted mix of the old ones. Written as math, that whole filter is one matrix multiplication. Language models are the same kind of step, repeated billions of times, which is why a graphics card that is good at pictures turned out to be good at AI.
```

# probability-and-softmax | Probability and softmax | 1 | 12
A model outputs raw scores. Softmax turns them into probabilities that add up to 1, and temperature controls how sharp they are.

## The idea
The model's last layer produces one number per possible next token, called logits. Softmax converts them: p(i) = e^(zᵢ/T) / Σⱼ e^(zⱼ/T). Exponentiating makes everything positive. Dividing by the sum makes them add to 1. T is the temperature. T = 1 is the plain version.

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
What does lowering the temperature do to the output distribution? | Flattens it ; Sharpens it toward the top token ; Removes tokens | 1 | Dividing logits by a small T makes differences larger, so the top token dominates.
Softmax outputs always | Add up to 1 ; Are integers ; Are negative | 0 | That is what makes them usable as probabilities.
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
What is the derivative of f(x) = x² at x = 3? | 6 ; 9 ; 3 | 0 | The derivative is 2x, so 6.
Which direction does the gradient point? | Steepest increase ; Steepest decrease ; Sideways | 0 | You step opposite to it to reduce a function.
```

```story
You are standing on a foggy hill and want to get down. You cannot see the valley, but you can feel which way the ground slopes under your feet. You take a step downhill, feel again, and repeat. The slope under your feet is the derivative. With many directions at once, the list of slopes is the gradient. Training an AI model is exactly this walk.
```

# neurons-and-networks | Neurons and networks | 1 | 15
A neuron is a weighted sum plus a bend. A network is many neurons in layers. Stacking them lets the model represent curved, complex functions.

## The idea
A neuron takes inputs x, multiplies each by a weight w, adds a bias b, and passes the sum through an activation function f: y = f(w · x + b). ReLU is the common choice: f(z) = max(0, z). Without the bend, stacking layers would still be one straight-line function. With it, layers compose into something far more expressive.

## Example
Inputs x = [1, 2], weights w = [0.5, -1], bias b = 0.5. The weighted sum is 0.5×1 + (-1)×2 + 0.5 = -1. ReLU(-1) = 0. The neuron stays silent. Change the bias to 3 and the sum becomes 1.5, ReLU gives 1.5, and the neuron fires.

## Layers
A layer is many neurons reading the same inputs, which is a matrix multiplication followed by an activation. A network passes the output of one layer to the next. A modern language model is the same pieces at huge scale, arranged as transformer blocks, with billions of weights.

## Try it
Change the weights and bias in the demo and watch the output and the decision line change.

## Worked example: spotting a cat from three clues
Inputs: has whiskers (1), has pointy ears (1), barks (0). Weights: whiskers +2, ears +1, barks -3. Bias -1. Sum = 2 + 1 + 0 - 1 = 2. ReLU keeps 2, so the neuron fires: probably a cat. Change barks to 1 and the sum drops to -1, ReLU makes it 0, the neuron stays quiet. Training is the process of finding good weights automatically.

## Common mistake
Imagining that each neuron has a clear human meaning. In big networks most neurons mean nothing on their own. The meaning is spread across many.

```resources
video | But what is a neural network? | https://www.youtube.com/watch?v=aircAruvnKk | 3Blue1Brown | The standard visual explanation.
tool | TensorFlow Playground | https://playground.tensorflow.org/ | Google | Train a small network in the browser and watch each neuron.
course | Neural Networks and Deep Learning | http://neuralnetworksanddeeplearning.com/ | Michael Nielsen | A free online book that builds the idea from scratch.
```

```quiz
Why is an activation function needed? | To make training faster ; Without it, stacked layers collapse into one linear function ; To add noise | 1 | The nonlinearity is what lets deep networks represent complex functions.
x = [1, 2], w = [1, 1], b = -4, ReLU. Output? | 0 ; -1 ; 3 | 0 | The sum is 1 + 2 - 4 = -1, and ReLU clips negatives to 0.
```

```story
Think of a neuron as a bouncer at a club with a checklist. Each fact about a guest is multiplied by how much the bouncer cares about it, the total is added up, and if the total clears a bar the guest gets in. A network is thousands of such bouncers in rows, each row deciding based on what the previous row let through.
```

# loss-and-gradient-descent | Loss and gradient descent | 1 | 15
Training means measuring how wrong the model is, then nudging every weight in the direction that reduces the error. Repeat a few trillion times.

## The idea
Loss is a number that says how far the output is from the target. For one example with prediction p and target t, squared error is L = (p - t)². Training adjusts the weights w to make L small. The gradient dL/dw says how L changes if w increases. Gradient descent moves against it: w ← w - η · dL/dw, where η is the learning rate.

For language models the loss is cross-entropy: minus the log of the probability the model gave the correct next token. If it gave the right token probability 0.9, loss is 0.11. At probability 0.1, loss is 2.3.

## Example
Minimize L(w) = (w - 3)². The gradient is 2(w - 3). Start at w = 0 with η = 0.1: gradient is -6, so w becomes 0 + 0.6 = 0.6. Next, gradient -4.8, w = 1.08. Then 1.46, 1.77, and so on toward 3. With η = 1.1 it overshoots and diverges. With η = 0.001 it barely moves. The learning rate is a core hyperparameter.

## At scale
The same loop runs on billions of weights using mini-batches of data. Optimizers like Adam adapt each step. Backpropagation is how the gradients for all layers are computed efficiently.

## Try it
Use the demo: pick a learning rate and click step. Try a rate that is too large.

## What the loss number means
Loss is the score of how wrong the model is. Zero would be perfect. If the model gave the right next word a probability of 0.9, the loss is small (0.11). If it gave 0.01, the loss is large (4.6). Training pushes the loss down, which means the model gives more probability to what really came next.

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
Minimize (w - 3)² from w = 0 with learning rate 0.1. What is w after one step? | 0.6 ; 3 ; -0.6 | 0 | Gradient is 2(0 - 3) = -6, so w = 0 - 0.1 × (-6) = 0.6.
A learning rate that is far too large will | Converge faster ; Overshoot and may diverge ; Do nothing | 1 | Steps jump past the minimum and can grow each time.
```

```story
A basketball player practises free throws. After each miss they notice "too short" or "too far left" and adjust a little. After thousands of shots, the adjustments add up to a reliable shot. A model learns the same way: guess, see how wrong the guess was, adjust, repeat across billions of examples.
```

# backpropagation | Backpropagation | 2 | 15
Backprop is the chain rule applied efficiently, so one backward pass gives the gradient for every weight.

## The idea
A network is a chain of simple operations. The chain rule says the derivative of a composition is the product of the derivatives of its parts. For y = f(g(x)), dy/dx = f′(g(x)) · g′(x). Backpropagation runs the network forward to get the loss, then walks backward through the operations, multiplying local derivatives and reusing each partial result.

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
In the worked example, what is dL/dw if dL/da = -6 and da/dw = 2? | -12 ; -3 ; 12 | 0 | Chain rule: multiply the local derivatives along the path.
Why is backprop efficient? | It skips layers ; It reuses partial results so one backward pass gives all gradients ; It uses less data | 1 | Cost is on the order of one extra forward pass, not one per weight.
```

```story
A restaurant gets a bad review: the soup was cold. Who is to blame? The chef, the waiter who waited, the oven? You trace backward through the chain to see how much each step contributed. Backpropagation does this for a network: when the answer is wrong, it walks backward through the layers and tells every weight how much it contributed to the mistake.
```

# entropy-and-kl | Entropy and KL divergence | 2 | 15
Entropy measures surprise. Cross-entropy is the loss language models train on. KL divergence measures how far one distribution is from another.

## The ideas
An event with probability p carries surprise of -log₂(p) bits. A fair coin flip has surprise 1 bit. An event with probability 1/8 has 3 bits. Entropy is the average surprise of a distribution: H(p) = -Σ p·log₂ p. A fair coin has entropy 1 bit, a coin that always lands heads has 0.

Cross-entropy H(p, q) = -Σ p·log q is the average surprise when the truth is p but you use model q. For next-token prediction the truth puts probability 1 on the actual token, so cross-entropy reduces to minus the log of the probability the model gave it. That is the training loss.

KL divergence is the gap: KL(p ‖ q) = H(p, q) - H(p). It is 0 only when q equals p, and always at least 0. It shows up when you want to keep a fine-tuned model close to its base, as in the penalty used in RLHF.

## Example
True distribution p = [0.5, 0.5]. Model q = [0.9, 0.1]. H(p) = 1 bit. H(p, q) = -(0.5·log₂0.9 + 0.5·log₂0.1) = 0.5×0.152 + 0.5×3.322 = 1.737 bits. KL = 1.737 - 1 = 0.737 bits. Perplexity, a common language model score, is 2 raised to the cross-entropy, so lower is better.

## In plain words
Cross-entropy asks: if reality follows distribution p but I use my model q to predict it, how surprised will I be on average? The better q matches p, the smaller the number. KL divergence is just the extra surprise caused by using q instead of the truth.

## Worked example in model terms
The real next word is "Paris". Model A gave "Paris" 90 percent: surprise of 0.15 bits. Model B gave it 5 percent: surprise of 4.3 bits. Averaged over millions of sentences, that gap is the difference between a good model and a bad one.

## Common mistake
Thinking KL divergence is a distance like on a map. It is not symmetric: KL(p, q) and KL(q, p) are different numbers.

```resources
video | A Short Introduction to Entropy, Cross-Entropy and KL-Divergence | https://www.youtube.com/watch?v=ErfnhcEV1O8 | Aurélien Géron | Ten minutes, with the coin and weather examples.
article | Visual Information Theory | https://colah.github.io/posts/2015-09-Visual-Information/ | Chris Olah | Draws entropy and cross-entropy as areas.
article | Kullback-Leibler divergence | https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence | Wikipedia | Definition, properties and why it is not symmetric.
```

```quiz
A fair coin has entropy of | 1 bit ; 0 bits ; 2 bits | 0 | Each flip carries one bit of surprise on average.
KL divergence between identical distributions is | 0 ; 1 ; Infinite | 0 | There is no gap when q equals p.
```

```story
You have a coin. If it always lands heads, the next flip tells you nothing, so there is no surprise. If it is fair, each flip is a surprise worth one bit. Entropy is how surprised you expect to be on average. A language model that is good at predicting the next word is rarely surprised, so its loss is low.
```

# moving-averages-and-adam | Moving averages and the Adam optimizer | 2 | 15
Raw gradients are noisy. Smoothing them with a moving average makes training steadier. Adam adds a per-weight step size.

## Exponential moving average
An EMA blends the old average with the new value: m ← β·m + (1 - β)·g, where β is near 1, such as 0.9. Recent values weigh more, old values fade. With β = 0.9 and gradients 1, 1, 1, starting from m = 0: m = 0.1, 0.19, 0.271. It starts low, a bias that Adam corrects by dividing by (1 - βᵗ).

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
In an EMA with β = 0.9, which values count most? | The oldest ; The most recent ; All equally | 1 | Older values fade geometrically.
Why do large models use warmup? | A high rate early can destabilize training ; It saves memory ; It adds data | 0 | The rate rises slowly until training is stable.
```

```story
When you check your weight every morning, the number jumps around by a pound or two from water and meals. A smarter reading is the average of the last week, which shows the real trend. Training does the same with its noisy gradient signals: Adam keeps a moving average so one odd batch does not send the model off course.
```

# attention-math | Attention in numbers | 2 | 15
Attention is dot products, a softmax and a weighted average. Here it is with a two-token example.

## The formula
Each token has a query q, a key k and a value v, all vectors. For one query, the score against each key is a dot product scaled by the square root of the key size d: score = q · k / √d. Softmax turns the scores into weights. The output is the weighted sum of the values: out = Σ weight × v. In matrix form: softmax(Q Kᵀ / √d) V.

## Example
Let d = 2, with q = [1, 0]. Two keys: k₁ = [1, 0] and k₂ = [0, 1]. Values: v₁ = [10, 0], v₂ = [0, 10]. Scores: q·k₁ = 1, q·k₂ = 0. Scaled by √2 = 1.414: 0.71 and 0. Softmax: e^0.71 = 2.03, e⁰ = 1, sum 3.03, so weights 0.67 and 0.33. Output = 0.67 × [10, 0] + 0.33 × [0, 10] = [6.7, 3.3]. The query matched the first key more, so the output leans toward v₁.

## Why divide by √d
Dot products grow with vector size, which would push softmax into near one-hot outputs with tiny gradients. Scaling keeps the scores in a useful range.

## In a real model
A causal mask blocks each token from seeing later tokens. Many attention heads run in parallel, each learning a different pattern, and their outputs are concatenated. The key and value vectors of earlier tokens are cached during generation, which is the KV cache behind fast decoding and prompt caching.

## In plain words
Each word makes three vectors. The query says "what am I looking for?". The key says "what do I contain?". The value says "what do I give if you pick me?". A word compares its query with everyone's keys, turns the scores into percentages with softmax, and takes a weighted mix of the values.

## Worked example, read aloud
In the earlier numbers the query matched key 1 more, so the weights were 67 percent and 33 percent. The output was 67 percent of value 1 plus 33 percent of value 2. The model did not choose one word. It blended, leaning toward the best match.

## Common mistake
Thinking attention is how the model "focuses like a person". It is a weighted average computed with dot products. Useful, but mechanical.

```resources
video | Attention in transformers, step-by-step | https://www.youtube.com/watch?v=eMlx5fFNoYc | 3Blue1Brown | The full computation, animated.
video | Let's build GPT: from scratch, in code, spelled out | https://www.youtube.com/watch?v=kCc8FmEb1nY | Andrej Karpathy | Implements self-attention in code from a toy example.
article | The Illustrated Transformer | https://jalammar.github.io/illustrated-transformer/ | Jay Alammar | Diagram of queries, keys and values.
```

```quiz
In attention, what produces the weights? | A softmax over scaled query-key dot products ; The values ; The bias | 0 | The weights come from how well the query matches each key.
Why scale by √d? | To keep dot products from saturating the softmax ; To speed up training ; To save memory | 0 | Large unscaled scores make the softmax nearly one-hot with tiny gradients.
```

```story
Read this: "The trophy did not fit in the suitcase because it was too big." What does "it" refer to? You instantly know it is the trophy. Attention is how a model does this: the word "it" scores every earlier word for relevance, finds that "trophy" matches best, and pulls in its meaning.
```

