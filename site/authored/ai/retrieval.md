# what-are-embeddings | What are embeddings? | 1 | 15
An embedding turns a piece of text, an image or a sound into a list of numbers so that similar meanings end up close together.

## The idea
Computers cannot compare meaning directly, but they can compare numbers. An embedding model reads a sentence and outputs a vector, which is a list of numbers, often 384 to 3,072 of them. The model is trained so that sentences with similar meaning get vectors that point in similar directions. "How do I reset my password?" and "I forgot my login" end up near each other. "Best pizza in Rome" ends up far away.

## A tiny example
Imagine a 2-number embedding where the first number means "about animals" and the second "about vehicles". "cat" might be [0.9, 0.0], "dog" [0.8, 0.1], "truck" [0.0, 0.9]. The cat and dog vectors are close. Cat and truck are far apart. Real embeddings have hundreds of dimensions that are not human-readable like this, but the geometry works the same way.

## Where embeddings are used
Semantic search (find documents by meaning), retrieval for RAG, clustering similar items, recommendations, duplicate detection and classification with few labels. Inside a language model, each token also has an embedding, which is the first layer the text passes through.

## Try it
Use the demo above to drag two arrows and see how the angle between them sets the similarity score.

## A worked example: three sentences
A: "How do I reset my password?" B: "I forgot my login details." C: "What is the weather in Rome?" Their embeddings might have cosine similarity A to B of 0.82 and A to C of 0.08. No shared keyword between A and B, yet the model knows they are about the same thing. That is why a help center search can answer "can't sign in" with the password-reset article.

## What the numbers are
Hundreds or thousands of values per text. Individually they mean nothing you could name. Together, the pattern places the text in a space where distance means difference in meaning.

## How a model learns where to put text
Embedding models are usually trained on pairs of texts that belong together, such as a question and the passage that answers it. Each round nudges the model's weights so the pair moves closer. The same round pushes the pair away from unrelated texts in the same batch (a batch is a group of examples handled together). After millions of rounds, topics form clusters.

Here is one round with invented numbers:
1. The pair is "reset password" and "forgot login". The model scores them 0.20.
2. It scores "reset password" against "pizza in Rome" at 0.35, which is wrong.
3. Training shifts the weights so the first score rises and the second falls, say to 0.25 and 0.30.
4. Millions more rounds repeat this until the related pair clearly wins.

## A second example: where embeddings blur
Take "The hotel was clean" and "The hotel was not clean". The words are almost identical and the meanings are opposite. Embeddings often rate such a pair as very close, because both are about a hotel and its cleanliness. The same happens with "refund within 30 days" and "refund within 3 days": the number changes and the vector barely moves.

Embeddings capture topic well and fine detail poorly. Negations, numbers, rare names and error codes are the weak spots. Later lessons cover the fixes: keyword search catches exact strings, and a reranker reads question and passage together.

## How to tell it is working
Write 10 pairs of sentences: five that should match and five that should not. Embed all of them and compute the cosine similarity for each pair. Every matching pair should score above every non-matching pair. If one does not, note what kind of pair failed (negation, number, name) so you know the model's blind spot.

Compare scores only within one model. A score of 0.82 from one model has no fixed meaning in another, because each model spreads its scores differently.

## Try it yourself
Use any free sentence-embedding tool or a small open model. Embed these four sentences: "I love this phone", "I hate this phone", "This phone is great", "The train leaves at noon". Expect the three phone sentences to score well above the train sentence. Then look at how close "I hate this phone" sits to "I love this phone". Opposites that score as similar show what embeddings cannot do.

## Common mistake
Using an embedding as if it were an answer. It only helps you find related text. A model still has to read it and respond.

## The math, when you are ready
Closeness between two embeddings is measured with a dot product or cosine similarity. [Vectors and similarity](/ai/docs/building-blocks/vectors-and-similarity) works through both with small numbers. The next lessons here explain what you need, so you can skip it for now.

```resources
article | What are embeddings? | https://vickiboykis.com/what_are_embeddings/ | Vicki Boykis | A free book-length explainer from word counts to modern embeddings.
article | The Illustrated Word2vec | https://jalammar.github.io/illustrated-word2vec/ | Jay Alammar | Visual intuition for why vectors capture meaning.
tool | Embedding Projector | https://projector.tensorflow.org/ | Google | Explore real embeddings in 3D in your browser.
docs | Embeddings guide | https://docs.anthropic.com/en/docs/build-with-claude/embeddings | Anthropic | How to use embeddings, with provider recommendations.
course | LLM University | https://cohere.com/llmu | Cohere | Free lessons on embeddings, search and RAG.
docs | Introduction to embeddings | https://docs.cohere.com/docs/embeddings | Cohere | Using embeddings for search and classification.
```

```quiz
What do embeddings of similar sentences have in common? | They share most of their exact words ; Their vectors lie close together ; They have the same character count | 1 | The model is trained to place similar meanings close together.
Which is a common use of embeddings? | Compiling code to machine code ; Encrypting messages before sending ; Searching documents by meaning | 2 | Searching by meaning is the most common use.
"I forgot my login" and "How do I reset my password?" share no keyword. How can search still match them? | A keyword filter links the two phrases ; Their embeddings are close in meaning ; A dictionary marks them as exact synonyms | 1 | Embedding similarity captures meaning, not just shared words.
```

```story
Ask a librarian for "books about getting over a breakup" and they will not search for those exact words. They know that books about heartbreak, moving on and healing belong nearby. Embeddings give a computer the same sense of nearness: texts about similar things get similar numbers, even when they share no words.
```

# embedding-models | Choosing an embedding model | 2 | 12
Embedding models differ in quality, size, languages, input length and price. Pick by testing on your own data.

## What differs
Dimensions: the vector length. More dimensions can carry more detail and cost more to store and search. Some models support Matryoshka embeddings, which let you truncate a vector to a shorter length with small quality loss. Context length: the longest text the model accepts per input. Languages: some models are English-only, others multilingual. Domain: code, legal and medical text often benefit from specialized models. Hosting: a paid API, or an open model such as a sentence-transformer you run yourself.

## A worked example: a 20-minute bake-off
Collect 30 real questions and note which document answers each. Embed all documents with three candidate models. For each question, check whether the right document is in the top five. Example results (invented for illustration): model X 24 out of 30, model Y 27, model Z 21. Pick Y unless X is much cheaper or faster. Repeat when your documents change character.

## What you pay for each choice
Dimensions cost storage. With invented numbers: 1,000,000 vectors of 1,024 numbers at 4 bytes each is 4,096,000,000 bytes, about 4.1 GB. The same vectors cut to 256 numbers take about 1 GB. Search also gets faster, but each vector holds less detail.

A hosted API means no servers to run, but your text leaves your machine and the provider may retire a model, which forces a re-embed. An open model you host keeps data in-house and the model fixed, but you run the hardware.

Input length matters too. Text longer than the model's limit is cut off by some providers and rejected by others, so check the docs and chunk below the limit.

## What goes wrong
The most common failure is a language or domain mismatch. Your documents are in Spanish, the model was trained mostly on English, and results look nearly random. Confirm it by running 10 questions in Spanish and counting how often the right document appears in the top five.

Another quiet failure is a missing instruction. Some models expect a short label telling them whether the text is a question or a document. Leaving it out lowers quality without any error message. The model's documentation says whether it is needed.

A leaderboard score is an average over many tasks. It says little about your contracts, your slang or your product names.

## A second example: when a small model is enough
A team has 200 short FAQ entries and users who copy wording from the page. A small, cheap model gets 28 of 30 test questions right (invented numbers). A large model gets 29. The extra point does not justify a higher bill and slower calls, so they keep the small one. Paying for a bigger model only makes sense when your own test shows it helps.

## Try it yourself
Take 15 questions from real users and the documents that answer them. Test two models, one small and one large, and count how often the right document lands in the top five. Time both. Expect the gap to be small for easy, well-worded questions and larger for vague ones. Write the result down with the date, so you can rerun it when a new model appears.

## Common mistake
Changing the embedding model later without re-embedding everything. Old and new vectors cannot be compared.

```resources
tool | MTEB Leaderboard | https://huggingface.co/spaces/mteb/leaderboard | Hugging Face | Compares embedding models across retrieval, clustering and more.
repo | Sentence Transformers | https://github.com/UKPLab/sentence-transformers | UKP Lab | The standard library for running open embedding models.
paper | Matryoshka Representation Learning | https://arxiv.org/abs/2205.13147 | Kusupati et al. | Embeddings that stay useful when truncated.
docs | OpenAI embeddings guide | https://platform.openai.com/docs/guides/embeddings | OpenAI | Models, dimensions and use cases.
docs | Gemini embeddings | https://ai.google.dev/gemini-api/docs/embeddings | Google | Task types and truncating dimensions.
docs | Jina embeddings | https://jina.ai/embeddings | Jina AI | Multilingual and long-context embedding models.
tool | Embedding models on Hugging Face | https://huggingface.co/models?pipeline_tag=feature-extraction | Hugging Face | Browse open embedding models by size and downloads.
```

```quiz
Can you mix vectors from two different embedding models in one index? | Yes, once both are normalized ; No, each lives in its own space ; Yes, if both have equal dimensions | 1 | Each model defines its own space, so distances across models are meaningless.
How should you pick a model? | Pick the one with the most dimensions ; Pick whichever model came out last ; Test retrieval on your own queries | 2 | Leaderboards shortlist. Your data decides.
You switch embedding models and keep the old vectors. What happens? | Results get unreliable, so re-embed it all ; Nothing, the old vectors still match fine ; Only the new documents get odd results | 0 | Old and new vectors cannot be compared, so the whole index must be rebuilt.
```

```story
A team picks an embedding model that scored best on a leaderboard, then finds it does badly on their legal contracts because it was trained mostly on web text. A cheaper model fine for general English wins on their data after a 20-minute test. Leaderboards shortlist. Your data decides.
```

# similarity-metrics | Measuring similarity: cosine, dot product, distance | 2 | 12
Search ranks vectors by a score. The three common scores are cosine similarity, dot product and Euclidean distance.

## The scores
Dot product multiplies matching entries and adds them. It grows with both direction match and vector length. Cosine similarity divides out the lengths, so only direction counts, from -1 to 1. Euclidean distance is the straight-line distance between the two points: the square root of the sum of squared differences. Smaller means closer.

$$d(a,b) = \sqrt{\sum_i (a_i - b_i)^2}$$

## Example
a = [3, 4], b = [6, 8], c = [4, -3]. Dot a·b = 18 + 32 = 50. Cosine a,b = 50 / (5 × 10) = 1: same direction. Euclidean a,b = √(9 + 16) = 5: they differ in length. Dot a·c = 12 - 12 = 0, cosine 0: unrelated.

## Which to use
Most text embedding models are trained for cosine similarity or produce vectors of length 1, in which case dot product and cosine give the same ranking. Use the metric the model's documentation recommends. If you normalize vectors to length 1, all three metrics give the same ordering.

## A worked example: why cosine ignores length
a = [1, 2] and b = [10, 20]. They point the same way, b is just ten times longer. Dot product: 1×10 + 2×20 = 50, large. Cosine: 50 / (√5 × √500) = 50 / 50 = 1, a perfect match. Euclidean distance: √(81 + 324) = 20.1, far apart. For comparing meaning you usually want cosine, so a long document is not penalized or favored for its length.

## A third example: when length is a feature
Some recommender systems learn vectors where a longer vector means a more popular item. Take a user u = [1, 1] and two items p = [2, 2] and q = [1, 1]. Dot product: u·p = 2 + 2 = 4 and u·q = 1 + 1 = 2, so p ranks first. Cosine is 1 for both, a tie. Here the dot product is what you want, because the model deliberately stored popularity in the length. The metric must match how the vectors were trained.

## What goes wrong
Suppose your vectors are not normalized and you rank with the dot product. Use query [1, 1], item x = [10, 0] and item y = [1, 1.2]. Dot product: x scores 10 and y scores 2.2, so x wins. Cosine: x is 10 / (10 × 1.414) = 0.71 and y is 2.2 / (1.414 × 1.562) = 0.996. Item y points almost exactly where the query points, yet x wins on length alone.

The symptom is results that feel off-topic but oddly confident, often the same long documents showing up for many queries. To confirm, compute the length of 100 stored vectors. If the lengths vary a lot and you use the dot product, length is steering the ranking.

## Reading the scores
A cosine score has no universal meaning. 0.8 can be a strong match with one model and a weak one with another. Do not copy a cutoff such as "keep results above 0.75" from a blog post. Look at the scores for 20 of your own queries, mark which results were right, and pick a cutoff from that.

## Try it yourself
In a spreadsheet, enter the vectors a = [1, 2], b = [10, 20] and c = [2, 1]. Compute dot product, cosine and Euclidean distance for a against b and a against c. You should find that cosine says b is a perfect match for a (1.0) and c is 0.8, while Euclidean distance says c is closer. Check: a·c = 2 + 2 = 4, and 4 / (√5 × √5) = 0.8. Seeing the two metrics disagree on the same data explains why the choice matters.

## Common mistake
Mixing metrics between indexing and querying.

```resources
video | Dot products and duality | https://www.youtube.com/watch?v=LyGKycYT2v0 | 3Blue1Brown | Why the dot product measures alignment.
article | Vector similarity explained | https://www.pinecone.io/learn/vector-similarity/ | Pinecone | Compares the three metrics with diagrams.
docs | NumPy linalg.norm | https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html | NumPy | Compute vector lengths for normalizing.
```

```quiz
a = [3, 4] and b = [6, 8]. What is their cosine similarity? | 0 ; 1 ; 0.5 | 1 | They point the same way, so cosine is 1 even though b is longer.
After normalizing all vectors to length 1, how do cosine and dot product rank results? | Differently, since dot product favors length ; Randomly, since the order is arbitrary ; Identically, as the lengths are all 1 | 2 | With unit lengths the dot product equals cosine.
You index with cosine but query with Euclidean distance. What is the problem? | Scores differ, so the ranking may be off ; Nothing, since all metrics rank the same ; Euclidean distance cannot be used on vectors | 0 | Use the same metric for indexing and querying, as the model recommends.
```

```story
A map app can measure "as the crow flies" or "by road". Both are distances, but they answer different questions. Vector search also has more than one way to say two things are close: by angle (cosine), by multiply-and-add (dot product), or by straight-line distance (Euclidean).
```

# document-parsing | Parsing PDFs and messy documents | 2 | 12
Retrieval can only find what parsing got right. A PDF stores where to draw letters, not paragraphs, so structure has to be recovered on purpose.

## What it is
A PDF file says "draw this character at this spot". It does not say "this is a paragraph" or "this is a table". Plain text extraction often gives broken lines, repeated page headers, tables flattened into one long row and two-column pages read straight across. A scanned PDF is only a picture, so a normal parser returns nothing.

A parser tries to recover the structure: headings, paragraphs, tables and the reading order. Simple libraries such as PyMuPDF and pdfplumber work on PDFs that contain real text. Tools such as Docling and Unstructured also detect the layout. OCR (optical character recognition) reads text out of scanned images, and some vision models can read a page image directly.

## A worked example
A report page has two columns and a small table. Plain extraction reads across the page, so the first column's sentence "Net revenue rose 4 percent" is interleaved with the second column's text about shipping. The chunk makes no sense, and its embedding is a blur of both topics. A layout-aware parser returns column one in full, then column two, and turns the table into rows such as "| Year | Revenue |". Now a question about revenue finds the table row.

## How to check it
Before you index thousands of pages, parse ten and put them beside the originals. Look for tables that fell apart, text in the wrong order, footers repeated on every page and pages that came back empty. Strip repeated headers and footers. Keep the page number and the section title with each chunk, so answers can cite where they came from.

## How a parser rebuilds structure
A PDF with a text layer stores each character with an x and y position on the page. A parser works in steps:
1. Group characters into words and lines by their positions.
2. Group lines into blocks, using the gaps between them.
3. Decide the reading order, for example all of column one before column two.
4. Detect tables from aligned columns or ruled lines, and write them out as rows.
5. Drop or tag repeated headers and footers.

Simple libraries do the first steps. Layout-aware tools add a model that looks at the page shape and labels each region as heading, paragraph, table or figure.

## A second example: a scanned page
A scanned contract has no characters at all, only pixels. OCR finds regions that look like text, then guesses each character. It makes typical mistakes: a zero read as the letter O, or "rn" read as "m". A clause number or an amount can change without any warning. Some vision models read the page image directly, but they can also misread digits or tidy up wording, so check amounts against the original.

## Trade-offs
Simple libraries are fast and free but ignore layout. Layout-aware tools are slower and need more computing power. Vision models handle messy pages best and cost the most per page. Choose by document type: clean exported PDFs rarely need more than a simple library, while scans and multi-column reports do.

## What goes wrong
The failures are quiet. A table becomes one long line, so no chunk holds a clean row. Page numbers appear in the middle of sentences. A page returns almost nothing because it was an image.

To confirm, count characters per page. Any page with fewer than about 20 characters deserves a look. Then pick one known phrase from the original and search the parsed text for it. If you cannot find it, the parser lost it.

## Common mistake
Treating "I extracted the text" as the end of ingestion. A scanned file that quietly returns an empty string will never be retrieved, and nobody notices until a user asks about it.

```resources
repo | Docling | https://github.com/docling-project/docling | IBM Research | Converts PDFs and Office files into clean structured text and tables.
repo | Unstructured | https://github.com/Unstructured-IO/unstructured | Unstructured | Parses many document types into labelled elements ready for chunking.
repo | PyMuPDF | https://github.com/pymupdf/PyMuPDF | Artifex | Fast text and image extraction for PDFs that contain real text.
docs | PDF support | https://docs.anthropic.com/en/docs/build-with-claude/pdf-support | Anthropic | Sending a PDF straight to a model that reads both the text and the page images.
```

```quiz
Why can plain text extraction from a two-column PDF hurt retrieval? | The file is encrypted, so the text comes out garbled ; Lines from both columns mix, ruining the chunks ; Columns are too wide to fit in the context window | 1 | Reading straight across the page interleaves the columns, so each chunk mixes unrelated sentences and its embedding becomes a blur.
A scanned PDF returns empty text from your parser. What is the most likely cause? | The file is too long for the parser to open ; The embedding model rejected the file format ; The pages are pictures, so you need OCR | 2 | A scan has no text layer. OCR or a vision model has to read the page image.
You will index 5,000 pages. What is the most useful quick check first? | Compare ten parsed pages to the originals ; Run the embedding model twice on each page ; Raise the chunk size to 2,000 tokens at once | 0 | Looking at real parsed pages catches broken tables, wrong order and empty pages while they are cheap to fix.
```

```story
A team indexes their company handbook and the bot cannot answer a question about holiday pay. The answer is in a table on page 14. The parser had flattened the table into one run-on line, so no chunk ever contained a clean "holiday pay" row. Fixing the parser fixed the bot, and the model never changed.
```

# chunking | Chunking documents | 2 | 15
Models and indexes work on small pieces. How you cut documents into chunks decides whether retrieval finds the right answer.

## Why chunk
An embedding of a whole book blurs everything into one point. A chunk that covers one idea matches a question about that idea. Chunks must also fit in the prompt next to others, so they cannot be huge. Too small, and a chunk loses the context needed to make sense of it, such as which product or date it refers to.

## Common strategies
Fixed size: every 500 tokens with a 50-token overlap so ideas cut at a boundary appear in two chunks. Structural: split on headings, paragraphs or code functions so chunks follow the author's own units. Semantic: split where the topic changes, detected by embedding sentences and cutting at large jumps. Hierarchical: index small chunks for matching but return the larger parent section for reading. Contextual: prepend a one-sentence note to each chunk saying where it came from.

## Practical tips
Start with structural splitting at 200 to 500 tokens and tune on your evals. Keep metadata with every chunk: source, title, section, date and permissions. Inspect actual chunks, since bad splits are easy to see and common.

## A worked example: overlap
Text: "... demand rose. Prices increased by 4 percent because supply was limited. The central bank ..." Chunk 1 ends after "Prices increased by" and chunk 2 starts at "4 percent because". Neither holds the whole fact. With a 50-token overlap, chunk 2 starts a few sentences earlier and contains it whole.

## How a fixed-size splitter works
Take a document of 1,000 tokens, a chunk size of 400 and an overlap of 50. Each chunk starts 350 tokens after the previous one (400 minus 50). The chunks are:
1. Tokens 1 to 400.
2. Tokens 351 to 750.
3. Tokens 701 to 1,000, which is shorter because the document ends.

The overlap means the index stores about 14 percent more text than the document holds (400 divided by 350). That is the price of keeping boundary sentences whole.

## Trade-offs in size
Bigger chunks keep more context but match less precisely, and each one uses more of the prompt. Five chunks of 500 tokens put 2,500 tokens in the prompt. Five chunks of 200 tokens put 1,000. Smaller chunks are cheaper to send and sharper to match, but they lose the surrounding facts. Hierarchical chunking tries to get both.

## A second example: when not to chunk much
A help center has 300 FAQ entries, each 80 tokens, one question and one answer. Each entry is already one idea, so splitting further would only cut answers in half. A 2-page memo fits in a prompt whole, so it needs no retrieval at all. Chunking earns its place on long documents with many topics.

## What goes wrong
Symptoms you can see by reading real chunks:
1. A chunk that starts mid-sentence, so the split ignored the text's structure.
2. A chunk that says "it" or "the product" with no hint of which one.
3. A table row separated from its column headers.
4. A chunk that mixes two topics, so it matches both questions badly.

To confirm, print ten random chunks and read them as if you were the model. If a chunk makes no sense alone, it will not retrieve well either.

## Try it yourself
Take one long document and 15 questions with known answers. Split it at 200 tokens and again at 600. For each question, check whether the right text appears in the top five chunks. Expect the small size to win on precise facts and the large size to win on questions needing context. Pick by your numbers.

## Common mistake
Choosing the size by guesswork and never measuring. Try two sizes and compare recall on your test questions.

```resources
article | Chunking strategies for LLM applications | https://www.pinecone.io/learn/chunking-strategies/ | Pinecone | Fixed, structural and semantic approaches compared.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Prepending chunk context, with measured retrieval gains.
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for chunking and many other methods.
tool | ChunkViz | https://chunkviz.up.railway.app/ | Greg Kamradt | Visualize how different splitters cut the same text.
```

```quiz
Why use overlap between chunks? | It makes the embeddings take up less space ; A cut sentence still sits whole in a chunk ; It speeds up the vector search a great deal | 1 | Overlap protects against a split landing in the middle of an important sentence.
What is wrong with chunks that are too small? | They are rejected by the embedding model ; They make the index too large to store ; They lose the context around each fact | 2 | A fragment may not say which product or date it describes.
Your answers are wrong and you see a key fact split between two chunks. What is the quick fix to try? | Add overlap or split on the headings ; Raise the temperature of the model a bit ; Switch to a much larger embedding model | 0 | Better chunk boundaries keep facts together. Then measure recall.
```

```story
A student uses a search tool on a 300-page textbook and asks "what causes inflation?" If the whole book is one embedding, the search is useless. If every sentence is its own embedding, results are fragments like "This is why prices rose." The right size, a paragraph or section, returns a complete idea.
```

# vector-databases | Vector databases and indexes | 2 | 15
A vector database stores embeddings and finds the nearest ones to a query fast. The trick is approximate search.

## The problem
Exact nearest-neighbor search compares the query with every vector. With a million vectors of 1,536 numbers that is over a billion operations per query. Approximate nearest neighbor (ANN) indexes skip most of the comparisons and return results that are almost always the true nearest.

## Index types
HNSW builds layers of graphs: start at a sparse top layer, jump toward the query, then refine in denser layers. It is fast and accurate and the common default, but uses memory. IVF clusters the vectors and searches only the few closest clusters. Product quantization compresses vectors into short codes to save memory at some accuracy cost. Flat indexes do exact search and are fine up to roughly 100 thousand vectors.

## Choosing one
Under a million vectors, almost anything works, so choose by what you already run. pgvector adds vector columns to Postgres. Chroma and LanceDB are simple embedded options. Qdrant, Weaviate and Milvus are dedicated open-source servers. Pinecone is a managed service. Supabase (Postgres with pgvector) and MongoDB Atlas add vector search to databases many teams already use. Jina and Cohere sell embedding and reranking models. Look for metadata filtering, hybrid search and how deletes and updates behave.

## A worked example: why indexes exist
One million vectors of 1,536 numbers: comparing a query with all of them is about 1.5 billion multiplications per search. An HNSW index jumps through a graph of neighbors and checks maybe a few thousand vectors, finding the nearest almost every time. You trade a tiny chance of missing the very best match for a hundred-fold speedup.

## How a graph search finds a neighbor
An HNSW index links each vector to a few nearby vectors, and keeps sparser copies of the graph on top. A search runs like this:
1. Start at a fixed entry point in the top layer.
2. Move to whichever linked vector is closest to the query, and repeat until no neighbor is closer.
3. Drop to the next, denser layer and continue from that spot.
4. At the bottom layer, keep a short list of the best candidates and return the closest ones.

It is like finding a street by first picking the right city, then the district, then the block. Implementations usually have a setting for how wide that final candidate list is. A wider list is slower and more likely to find the true nearest vector.

## A second example: when you do not need one
Say you have 5,000 chunks of 1,536 numbers. Comparing a query with all of them is 5,000 × 1,536 = 7,680,000 multiplications, which a laptop does in a blink. A plain array and a loop are enough, with no database to install. An index starts to pay off when scanning everything becomes the slow part, so measure before you add one.

## What goes wrong
Filtering is the common trap. Some systems find the 10 nearest vectors first and apply the filter afterwards. Ask for 10 results in country = Canada, and if only 2 of the overall top 10 are Canadian, you get 2 results. The symptom is fewer results than you asked for. Confirm it by running the same query without the filter and counting how many of the top 10 pass it.

Other quiet problems: deleted documents that still appear until the index is rebuilt, and an index too big for memory, which slows every query. Check how your database handles both before you depend on it.

## Measuring the trade-off
Approximate search can miss the true best match. Measure recall: for 100 test queries, compare the index's top 10 with the exact top 10 from a plain scan. If 9.5 of 10 match on average, recall is 95 percent. Then ask whether a lost 5 percent matters for your product. For a help center it usually does not, because the 11th-best passage is rarely needed.

## Common mistake
Choosing by benchmark charts rather than by what your team can operate. Operations cost more than a few milliseconds.

## A worked example: sizing
50,000 chunks of 1,536 numbers each, at 4 bytes per number, is about 300 MB of vectors. That fits in memory on a laptop, so no special cluster is needed. At 50 million chunks the same math gives 300 GB, and now index choice, sharding and cost start to matter. Plan for the size you have, not the size you hope for.

```resources
repo | pgvector | https://github.com/pgvector/pgvector | pgvector | Vector search inside Postgres.
repo | Qdrant | https://github.com/qdrant/qdrant | Qdrant | Open-source vector database with strong filtering.
repo | Chroma | https://github.com/chroma-core/chroma | Chroma | Simple, embedded vector database for getting started.
repo | FAISS | https://github.com/facebookresearch/faiss | Meta | The reference library for similarity search indexes.
paper | Efficient and robust approximate nearest neighbor search using HNSW | https://arxiv.org/abs/1603.09320 | Malkov and Yashunin | The HNSW paper.
repo | LanceDB | https://github.com/lancedb/lancedb | LanceDB | Embedded, serverless vector database built on a columnar format.
docs | Supabase AI and vectors | https://supabase.com/docs/guides/ai | Supabase | pgvector in a hosted Postgres.
docs | MongoDB Atlas Vector Search | https://www.mongodb.com/products/platform/atlas-vector-search | MongoDB | Vector search next to your documents.
tool | FAISS | https://ai.meta.com/tools/faiss | Meta | Library for efficient similarity search and clustering.
```

```quiz
Why use approximate nearest neighbor search? | Exact search often returns wrong results ; Checking every vector is slow at scale ; It stores vectors more cheaply on disk | 1 | ANN indexes skip most comparisons while almost always finding the true nearest.
Under a million vectors, how should you choose a database? | By the most impressive benchmark chart ; By the lowest price per stored vector ; By what you already run and can operate | 2 | Most options perform fine at that size, so operational simplicity wins.
You already run Postgres and have 80,000 chunks. What is a reasonable choice? | pgvector in your current database ; A new managed cluster just for vectors ; A custom index that you write yourself | 0 | One system to run is simpler, and the size is small.
```

```story
Finding the closest book among ten is easy. Finding the closest among ten million, in a tenth of a second, needs an index. A vector database is the search system that keeps millions of embeddings organized so that nearest neighbors can be found quickly instead of by checking everything.
```

# semantic-and-hybrid-search | Semantic, keyword and hybrid search | 2 | 12
Keyword search finds exact terms. Semantic search finds meaning. Combining them catches what either alone misses.

## How each works
Keyword search with BM25 scores a document higher when it contains the query's rare words many times. It nails error codes, names and identifiers and misses synonyms. Semantic search embeds the query and finds the nearest chunk vectors, so "car won't start" matches "engine fails to turn over". It can miss exact strings like "ERR_4021".

## Combining them
Run both, then merge the ranked lists. Reciprocal rank fusion gives each document a score of 1 / (k + rank) in each list, with k often 60, and adds them up. Add a reranker over the merged top 50 for further gains.

$$\mathrm{score}(d) = \sum_{\text{lists}} \frac{1}{k + \mathrm{rank}(d)}$$

## A worked example: merging two lists
Keyword results: page A (1st), B (2nd), C (3rd). Semantic results: D (1st), A (2nd), E (3rd). With reciprocal rank fusion (k = 60): A scores 1/61 + 1/62 = 0.0325, D scores 1/61 = 0.0164, B scores 1/62 = 0.0161. A rises to the top because both methods liked it. A reranker can then reorder the top 50.

## When to use which
Product codes, names, error messages, legal citations: keyword helps most. Vague questions in natural language: semantic helps most. Do both and let fusion decide.

## How BM25 gives a score
BM25 rests on three ideas. A rare word is worth more than a common one. A word repeated many times helps, but each repeat adds less. A very long page is slightly discounted, so it does not win just by containing more words.

Here is the rarity idea in simplified form, with invented numbers. Among 1,000 pages, "ERR_4021" appears in 2 and "the" appears in 990. Using a natural logarithm, a rarity weight is about ln(1000 / 2) = 6.2 for the code and ln(1000 / 990) = 0.01 for "the". The code is worth about 600 times more. Real BM25 uses a slightly different formula, but the effect is the same.

## A second example: fusion going wrong
Reciprocal rank fusion uses only ranks, not scores. Suppose the semantic list puts a junk page 1st, and the keyword list does not contain it. Junk scores 1/61 = 0.0164. A good page ranked 3rd in both lists scores 1/63 + 1/63 = 0.0317, so it beats the junk. Agreement between lists protects you. But if one list is poor for a query type, its top results still get a boost, so a weak list can add noise.

## What goes wrong
Keyword search fails on small spelling differences: "e-mail" against "email", or "colour" against "color". The symptom is a page you know exists that never appears for one phrasing. Semantic search fails on exact identifiers and on negations. Test both lists separately with the same query before you blame the fusion step.

## Trade-offs
Hybrid search means two indexes to build and keep in sync, and two searches per question, so it adds time and upkeep. It pays off when your users mix exact terms and vague questions. If your corpus is all long natural prose and your users ask conversational questions, semantic search alone may be enough.

## Try it yourself
Write 15 queries: five with exact codes or names, five vague, five mixed. Run keyword only, semantic only, then fusion. For each, note whether the right page is in the top five. Expect keyword to win the first group, semantic the second, and fusion to be rarely worst. If fusion adds nothing for your data, skip it.

## Common mistake
Adding hybrid search without a test set, so you cannot tell if it helped.

```resources
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Measured gains from BM25 plus embeddings plus reranking.
article | Hybrid Search Explained | https://weaviate.io/blog/hybrid-search-explained | Weaviate | Keyword and vector fusion with examples.
paper | Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods | https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf | Cormack et al. | The original RRF paper.
```

```quiz
Which search is better at finding the exact string ERR_4021? | Semantic search by meaning ; Keyword search with BM25 ; Both are equally good here | 1 | Exact rare tokens are where keyword matching is strongest.
A document ranks 1st in keyword and 3rd in semantic results. What does reciprocal rank fusion with k = 60 give it? | About 0.5 ; About 0.03 ; About 0.33 | 1 | 1/61 + 1/63 is about 0.0323.
Users type "my screen is frozen" but the page says "Application not responding". Which search helps? | Semantic search, matching by meaning ; Keyword search used entirely on its own ; An exact-match filter on the page text | 0 | Semantic search connects different wording with the same meaning.
```

```story
A user searches for "ERR_4021". Semantic search returns articles about errors in general, because the code means nothing to an embedding. Keyword search finds the one page that mentions it. Another user searches "my screen is frozen" and keyword search misses the page titled "Application not responding". You want both.
```

# reranking | Reranking search results | 2 | 12
A first search finds candidates quickly. A reranker reads each one next to the question and puts the best on top.

## What it is
Retrieval is usually two stages. Stage one embeds the question and each passage separately and compares the vectors. It is very fast, so it can scan millions of passages, but a single vector cannot hold every detail. Negations, numbers and conditions often get lost. Stage two takes the top 50 or so candidates and scores each one with a cross-encoder, a model that reads the question and the passage together. It is slower and much sharper. You keep the best 5 and pass those to the model.

## A worked example
Question: "Can I return a gift card?" Stage one finds three passages with embedding similarity scores: B "Returns are accepted within 30 days" (0.78), C "Gift card balances never expire" (0.74) and A "Gift cards cannot be refunded" (0.71). Embeddings put B first because it matches "return". The reranker reads each with the question and scores A 0.93, B 0.41 and C 0.20. The right passage is now first. The model answers "No, gift cards cannot be refunded", which stage one alone would likely have missed.

## Using one
Fetch 30 to 100 candidates, rerank them, keep 3 to 10. The reranker adds time, often tens to a few hundred milliseconds depending on the model and the number of passages, and some cost. Measure it: run your test questions and compare recall at 5 before and after, as in the evaluating RAG lesson. Keep the reranker only if the gain is worth the delay.

## Why it cannot be the first stage
In stage one, every passage was turned into a vector in advance. At query time you embed only the question and compare. A cross-encoder cannot do this, because its score depends on the question and the passage together. It must run once per pair, at query time.

Invented numbers: if one run takes 4 ms, reranking 50 candidates costs 50 × 4 = 200 ms. Reranking a million passages would take 4,000,000 ms, over an hour. So stage one narrows the field and the reranker only sees the shortlist.

## What goes wrong
A reranker can only reorder what it is given. If the right passage is not among the 50 candidates, no reranker can find it. The symptom is a top result that looks plausible but is wrong. To confirm, check whether the correct passage was in the candidate list at all. If it was missing, fix stage one (chunking, hybrid search, query rewriting), not the reranker.

Long passages are another trap. Rerankers have a maximum input length, and text past it is usually cut off, so a key sentence at the end of a long chunk may never be read.

## A second example: when it adds nothing
Question: "Where is the Paris office?" Stage one already ranks the passage "Our Paris office is at 12 Rue Example" first, and the second place is far behind. A reranker would confirm the order and add 200 ms. Reranking helps on questions where several passages look alike, such as the gift card case above. Test on your own question mix to see how many are that hard.

## Trade-offs
You gain accuracy on the final few results. You pay in delay, in hosting or per-call cost, and in one more moving part. Fetch more candidates for better recall, but each extra candidate adds time. A common starting point is 50 candidates in, a handful out.

## Common mistake
Reranking only the 5 results you already planned to use. There is nothing to reorder. The point is to search wide, then narrow.

```resources
docs | Rerank overview | https://docs.cohere.com/docs/rerank-overview | Cohere | A hosted reranking API and how to use it after a first search.
docs | Cross-encoders | https://sbert.net/docs/cross_encoder/usage/usage.html | Sentence Transformers | Run an open cross-encoder yourself in a few lines.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Measures how much reranking adds on top of embeddings and BM25.
tool | bge-reranker-v2-m3 | https://huggingface.co/BAAI/bge-reranker-v2-m3 | BAAI | A widely used open multilingual reranker.
```

```quiz
What does a cross-encoder reranker do that the first search cannot? | It stores each passage as a longer vector ; It reads question and passage together ; It scans the whole database, not candidates | 1 | Reading both texts together lets it notice negations, numbers and conditions that a single stored vector blurs.
A team passes the top 5 search results to a reranker and keeps all 5. What is wrong? | Rerankers only accept five passages at once ; The reranker will delete two of the results ; Nothing to reorder, so fetch more candidates | 2 | Reranking helps when you fetch many candidates, such as 50, and then keep the best few.
How should you decide whether to keep a reranker? | Compare recall before and after, weigh delay ; Keep it because most search systems use one ; Remove it if answers feel slower in a demo | 0 | A measured gain in recall that outweighs the added latency and cost is the reason to keep it.
```

```story
A support search returns "Returns accepted within 30 days" as its top result for the question "Can I return a gift card?" Everyone assumes the answer is yes. Adding a reranker moves "Gift cards cannot be refunded" to first place. One extra step turned a confident wrong answer into a right one.
```

# rag | Retrieval-augmented generation | 2 | 20
Retrieve relevant text first, then ask the model to answer using it. It is how you give a model knowledge it was not trained on.

## The three parts
Indexing: split documents into chunks, embed each one and store it with metadata. Retrieval: embed the question, fetch the closest chunks, optionally filter and rerank them. Generation: put the chunks in the prompt with instructions to answer only from them and to cite which chunk each claim came from.

## Why use it
It adds private or fresh knowledge without retraining, lets you cite sources, lets you update by re-indexing, and keeps access control possible because you decide which chunks a user can see. It does not make a model reason better. It gives it better material.

## Where RAG fails
Most bad answers are retrieval failures, not generation failures. The right chunk was not retrieved, was split badly or was ranked below noise. Debug retrieval separately: for a set of test questions, check whether the right chunk appears in the top results. Common fixes are better chunking, contextual notes on chunks, hybrid search and a reranker. Tell the model to say when the sources do not contain the answer.

## Try it
Step through the pipeline in the demo above.

## A worked example: one question end to end
Index time: the handbook is split into 400 chunks, each embedded and stored with its title. Query time: the question is embedded, the five nearest chunks are fetched, a short prompt says "Answer only from these excerpts and cite them. If they do not contain the answer, say so." The model replies with the answer and a citation. A person can click the citation and verify.

## What the model actually receives
The model never sees your database. It sees one long prompt that your code assembled. In order, it holds the rules (answer only from the excerpts, cite them, admit gaps), then each retrieved chunk with a label such as its title and section, then the user's question. The model reads it like any other text. Because of this, a RAG answer can only be as good as what your code pasted in.

## A second example: when RAG is the wrong tool
"Summarize this 3-page contract" needs no retrieval, because the whole text fits in the prompt. Retrieval would only risk leaving out a clause. A question like "How many of our policies mention data retention?" is also a poor fit. Retrieval returns the five best-matching chunks, not every match, so the count would be wrong. Questions that need the whole collection need a different tool, such as a database query.

## What goes wrong
Failures you will see:
1. A confident wrong answer, because the right chunk was missing and the prompt did not allow "I do not know".
2. A blended answer, because two chunks disagree (a 2019 policy and a 2024 one) and the model mixed them.
3. A citation that does not support the claim. The model attached a real source to a sentence it made up.
4. An outdated answer, because the index was not rebuilt after the document changed.

For each, print the retrieved chunks first. Then ask two questions in order: was the right chunk there, and did the answer use it? The first decides whether to fix retrieval. The second decides whether to fix the prompt.

## Try it yourself
Paste five short paragraphs from any handbook into a chat with a model. Ask three questions the paragraphs answer and two they do not. Add the instruction to answer only from the excerpts and admit gaps. Expect correct, cited answers to the first three and "the excerpts do not say" to the last two. Remove the instruction and ask the two unanswerable questions again. Compare how often the model guesses instead.

## Common mistakes
Skipping the "say you do not know" instruction. Letting retrieval pull documents a user is not allowed to see.

## Where this connects
You will need a way to tell whether answers are getting better. [Evaluating RAG](/ai/docs/retrieval/rag-evaluation) is the next lessons here, and [Why evals come first](/ai/docs/evals-and-safety/why-evals) explains the habit. Retrieved text can also contain instructions: see [Prompt injection and the lethal trifecta](/ai/docs/evals-and-safety/prompt-injection).

```resources
course | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for dozens of RAG methods with explanations.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Prepending chunk context and combining BM25 with embeddings.
paper | Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks | https://arxiv.org/abs/2005.11401 | Lewis et al. | The paper that named RAG.
article | Patterns for Building LLM-based Systems and Products | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | RAG, evals, guardrails and feedback as design patterns.
repo | RAGFlow | https://github.com/infiniflow/ragflow | InfiniFlow | An open-source RAG engine with document parsing.
```

```quiz
A RAG answer is wrong. What do you check first? | The temperature setting of the model ; Whether the right chunk came back ; The font used in the chat interface | 1 | Retrieval quality is the most common root cause, and it can be tested without the model.
What should the prompt tell the model to do when the sources lack the answer? | Give its best guess at the answer ; Search the web for the answer instead ; Say that the sources do not cover it | 2 | Allowing "I do not know" cuts confident wrong answers.
The right chunk was retrieved but the answer ignores it. What should you adjust? | The prompt that tells it to use them ; The vector database index settings ; The size and overlap of each chunk | 0 | Retrieval did its job, so the instruction or the model is the weak link.
```

```story
A new hire asks the company bot: "How many vacation days do I get after one year?" A plain model guesses a typical number. A RAG bot first searches the HR handbook, finds "Employees receive 25 days after 12 months", pastes that paragraph into the prompt and replies "25 days, per the Time Off policy, section 3." The model did not become smarter. It was given the right page.
```

# query-rewriting | Rewriting the question before searching | 2 | 12
Users type short, vague or half-finished questions. Rewriting them into good search queries often helps more than a better database.

## What it is
People do not write search queries. They write "and for gift cards?" in the middle of a chat, "it's not working" with no detail, or two questions in one. A rewrite step uses a small model call to turn the raw text into something retrieval can use. Common techniques:

Standalone rewrite: use the chat history to remove pronouns and fill in the gaps.
Multi-query: write three different phrasings, search each, and merge the results.
Decomposition: split a two-part question into two searches.
Step-back: ask the broader question behind the specific one.
HyDE: have the model write a short hypothetical answer, then search with that text, because an answer looks more like a document than a question does.

## A worked example
Chat: "What is the refund window?" The bot says 30 days. The user asks: "And for gift cards?" Searching that text returns random gift card pages. The rewrite step, given the history, produces: "What is the refund policy for gift cards?" and now the right chunk is found. For "How do I recover my account?", a multi-query rewrite searches "reset password", "locked out of account" and "forgot username", then merges the three lists with reciprocal rank fusion.

## How to write the rewrite step
The rewriter is a small prompt with clear rules:
1. Give it the last few chat turns and the new message.
2. Ask for one standalone question with no pronouns.
3. Tell it to keep every name, number, date and place exactly.
4. Tell it to return the question unchanged if it is already clear.

Keep the original question too. If the rewrite goes wrong, you can fall back to searching the user's own words.

## A second example: when a rewrite hurts
A user types "ERR_4021 refund". A helpful rewriter might turn it into "problems with payment errors". The exact code is gone, so keyword search can no longer find the one page that mentions it. Short, precise queries with identifiers are best left alone. HyDE has a related risk: the invented answer may contain wrong facts, and those wrong facts then steer the search toward the wrong documents.

## What goes wrong
The symptom is recall that drops for questions that used to work. Another sign is a rewrite that answers instead of asking, such as returning "30 days" in place of a question. A third is cost: multi-query runs three searches instead of one, so latency and spend rise.

## How to tell it is working
Log the original question and the rewrite side by side for 20 real conversations and read them. Then compute recall at 5 on your test set with and without the rewrite step, split by question type: follow-ups, vague questions and clear questions. Keep the step where it helps and skip it where it does not.

## When to use it
Add it when your test set shows misses on follow-ups, vague questions or vocabulary mismatches between users and documents. It costs one extra model call, so use a small fast model and skip it for clear, self-contained questions. Measure recall before and after.

## Common mistake
A rewrite that drops a constraint. "Refund policy for orders over $100 in Canada" must not become "refund policy". Tell the rewriter to keep every name, date, number and place.

```resources
paper | Precise Zero-Shot Dense Retrieval without Relevance Labels | https://arxiv.org/abs/2212.10496 | Gao et al. | The HyDE paper: search with a hypothetical answer.
paper | Query Rewriting for Retrieval-Augmented Large Language Models | https://arxiv.org/abs/2305.14283 | Ma et al. | Shows that learning to rewrite queries improves answers.
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for query transformation and other retrieval improvements.
```

```quiz
A user asks "And for gift cards?" mid-chat and search returns junk. What fixes it? | Raise the number of results returned to 100 ; Rewrite it as a standalone question ; Switch to a larger embedding model overall | 1 | The follow-up depends on earlier turns. A standalone rewrite makes it searchable.
What is the idea behind HyDE? | Hide the question from the retriever to cut bias ; Replace the vector database with a language model ; Search with an invented answer, not the query | 2 | A short invented answer shares more words and meaning with the real document than the question does.
What must a good rewrite keep? | Every name, date, number, place ; Only the main noun of the question ; As few words as it possibly can | 0 | Dropping a constraint such as a region or an amount changes what is searched for and returns the wrong passages.
```

```story
Someone asks the company bot about parental leave, then follows up with "what about adoption?" The bot, searching that follow-up on its own, returns a page about the adoption of a new software tool. A rewrite step that adds "parental leave" would have found the right policy in one try.
```

# metadata-filtering | Metadata and dynamic filters | 2 | 10
Store facts about each chunk next to its vector, and filter on them before or during search.

## The idea
Every chunk carries metadata: source document, author, date, product, language and who is allowed to see it. A query like "what changed in version 3?" should only search chunks tagged version 3. Filtering before the vector search narrows the candidates and removes whole classes of wrong answers.

## Dynamic filters
Let the model extract filters from the question. "Show me refund policy for EU customers last year" becomes a semantic query "refund policy" plus filters region = EU and date within the last year. The model returns the filter as structured output that your code validates and passes to the database. Never let the model write raw database queries without validation.

## Why it matters for safety
Permissions belong in metadata filters applied by your code, not in the prompt. If a user may not read a document, its chunks must never reach the prompt. A line like "do not reveal confidential data" is not access control.

## A worked example: extracting filters
Question: "What was the warranty on the 2023 Model X in Spain?" The system asks a model to return a small JSON: {query: "warranty terms", year: 2023, product: "Model X", country: "ES"}. Your code checks the values against allowed lists, applies them as filters, and then runs the semantic search on the query text.

## How a filtered search runs
A filtered query has two parts: the meaning ("warranty terms") and the conditions (year = 2023, country = ES). The database can apply the conditions before the vector search, so only matching chunks compete. It can also apply them after, trimming the nearest results. Filtering first is safer because the shortlist cannot be emptied by the filter. Check how your database does it.

## A second example: a filter that hurts
A user asks "What is the warranty on Model X?" and says nothing about a year. If the model guesses year = 2024, every chunk from other years is excluded, including the one with the answer. Filters should come only from what the user actually said or what your app knows, such as their country on file. When a value is missing, leave that filter out or search broadly and show the year in the answer.

## What goes wrong
Messy metadata causes silent misses. One document is tagged "US", another "USA", a third "United States". A filter for "US" skips the other two. A document with no date tag fails every date filter. The symptom is "I cannot find that" for a document you know exists. Confirm by repeating the search without the filter. If it appears, the tags are the problem.

Also watch for filters that are too strict. Three filters at once may leave no chunk to match.

## Try it yourself
Tag 20 short chunks with a country and a year, using a few spellings on purpose. Run one query with no filter and one with country = Canada. Count the results. Expect the filtered search to remove the wrong-country chunks, and expect it to also drop any chunk tagged "CA" or "Canada " (with a stray space). Fix the tags to one allowed list and rerun.

## Common mistake
Relying on "do not reveal confidential data" in the prompt. A prompt is not a lock.

```resources
article | Metadata filtering | https://docs.pinecone.io/guides/search/filter-by-metadata | Pinecone | Filter syntax and performance notes.
docs | Qdrant filtering | https://qdrant.tech/documentation/concepts/filtering/ | Qdrant | Payload filters combined with vector search.
article | Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Related technique for giving chunks context.
```

```quiz
Where should access permissions be enforced in RAG? | In the system prompt sent to the model ; In metadata filters in your own code ; In the embedding model's own settings | 1 | Chunks the user cannot see must never reach the prompt at all.
What can a model extract from a question for filtering? | Raw SQL to run directly on the database ; The user's saved account password ; Filter values as structured output | 2 | Validate the structure before using it.
A Canadian customer gets a policy from another country. What is the likely cause? | No region filter was used in search ; The embedding model ignores all countries ; The prompt was too short to name a country | 0 | Metadata filters narrow the candidates to the right region before searching.
```

```story
A user asks "What is our refund policy?" The index holds policies for ten countries and five years. Without filters, retrieval may return Germany's 2019 policy for a customer in Canada. With metadata, the search first narrows to country = Canada and the latest year, then looks for the best passage.
```

# rag-vs-fine-tuning | RAG or fine-tuning? | 2 | 10
RAG gives a model knowledge. Fine-tuning changes its behavior. Most projects need RAG first.

## The difference
RAG puts the right facts in the prompt at question time. The model is unchanged. Fine-tuning updates the model's weights on examples so it adopts a style, format or narrow skill. Fine-tuning is weak at adding facts, hard to update and hard to audit. RAG is easy to update and to cite.

## A decision guide
Does the model need facts that change or are private? Use RAG. Does it need a consistent tone, a fixed output format or to follow a complicated procedure reliably? Try prompts and examples, then consider fine-tuning. Do you need a small cheap model to match a big one on a narrow task? Fine-tune it, using the big model's outputs as training data. Many production systems use both: a fine-tuned model for style and format, and RAG for facts.

## What each one costs you
RAG adds work on every call: a search, extra prompt text and sometimes a reranker. Its setup is light, and updating knowledge means re-indexing a document. Fine-tuning has the opposite shape. It needs a set of good example inputs and outputs that you write or collect, a training run and a test that the model did not get worse elsewhere. Once trained, calls are not slower, and the prompt can be shorter.

Changing a fact is the clearest difference. With RAG you edit the document. With fine-tuning you must prepare new examples and train again, and you cannot easily point to where a fact lives in the weights.

## A second example: neither is needed
A team wants replies in a fixed three-line format. They try a clear instruction plus three example replies in the prompt, and the format comes out right in 19 of 20 tests (invented numbers). That costs nothing to maintain. Fine-tuning would add training and testing for a gain they do not need. Always try the prompt first.

## What goes wrong
A fine-tuned model states old facts with full confidence, because they are baked into its weights. To check, ask it a question whose answer changed after training. A RAG system fails differently: the right chunk is not found, so the model guesses or declines. Look at the retrieved chunks to tell which one you have.

Fine-tuning on a small, uneven set can also narrow the model. It copies the style of the examples and gets worse on other tasks, which is why you test on questions outside the training set.

## Try it yourself
Pick one task, such as answering questions about a small policy document. Try three setups on the same 10 questions: the prompt alone, the prompt with the document pasted in, and (if the document is too long to paste) the prompt with retrieved excerpts. Score each by counting correct answers. Expect the first to guess, and the others to improve sharply. That gap is what RAG buys, with no training at all.

## Common mistake
Reaching for fine-tuning first because it sounds advanced. It is usually the more expensive, slower, harder-to-update option.

```resources
article | RAG vs fine-tuning | https://www.ibm.com/think/topics/rag-vs-fine-tuning | IBM | A balanced comparison with trade-offs.
article | Patterns for Building LLM-based Systems and Products | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | When to retrieve and when to fine-tune.
paper | Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs | https://arxiv.org/abs/2312.05934 | Ovadia et al. | Finds retrieval beats fine-tuning for new knowledge.
```

```quiz
Your product docs change weekly and the model must answer from them. Best choice? | Fine-tuning the model every week ; RAG over the current documents ; A far longer system prompt | 1 | Re-indexing is cheap and keeps answers citable.
When does fine-tuning make sense? | To teach the model brand new facts ; To avoid having to write any evals ; To lock in a style or a format | 2 | Fine-tuning is for behavior, not for facts.
Your assistant needs both a formal tone and up-to-date prices. What fits? | Tune for tone, use RAG for prices ; Fine-tuning for both tone and prices ; RAG for both tone and for prices | 0 | They solve different problems and are often combined.
```

```story
A company wants its assistant to know the new product catalog and to always answer in a formal tone. For the catalog, which changes weekly, retrieval is ideal: update the documents and the answers update. For the formal tone, fine-tuning or a good system prompt fits. The mistake would be fine-tuning on the catalog every week.
```

# rag-evaluation | Evaluating RAG | 3 | 15
Measure retrieval and generation separately, so you know which one to fix.

## Retrieval metrics
Build a set of questions, each with the chunk or document that answers it. Recall at k: how often the right chunk is in the top k results. Precision at k: what fraction of the top k are relevant. MRR (mean reciprocal rank): the average of 1 / rank of the first right result, so rank 1 scores 1 and rank 4 scores 0.25. Example: ranks of 1, 4 and 2 across three questions give (1 + 0.25 + 0.5) / 3 = 0.58.

$$\mathrm{MRR} = \frac{1}{N} \sum_{i=1}^{N} \frac{1}{\mathrm{rank}_i}$$

## Generation metrics
Faithfulness: is every claim in the answer supported by the retrieved chunks? Answer relevance: does it address the question? Context relevance: were the retrieved chunks needed? These are usually scored by a model judge with a rubric, calibrated against a sample you labeled yourself. RAGAS and DeepEval implement these metrics.

## The loop
Change one thing, such as chunk size, embedding model or reranker, and rerun both sets of metrics. Keep the change only if it helps enough to justify the added cost or latency.

## A worked example: scoring retrieval
Five test questions. The right chunk is ranked 1st, 3rd, not found in the top five, 1st and 2nd. Recall at 5 is 4 out of 5 = 0.8. Reciprocal ranks: 1, 0.33, 0, 1, 0.5, so MRR = 2.83 / 5 = 0.57. Change the chunk size and rerun. If recall rises to 0.9, keep it.

## Building the test set
Start with 30 to 50 questions. Take them from real user logs if you have them, and write the rest by hand. For each, record the chunk or page that answers it. Include some questions the documents cannot answer, with the expected result "I do not know". Cover the types your users ask: exact lookups, vague questions and follow-ups.

## A second example: scoring faithfulness
Faithfulness checks each claim in an answer against the retrieved chunks. The chunk says "Employees receive 25 days after 12 months." The answer "25 days" has one claim, and it is supported: 1 out of 1. The answer "25 days, plus 5 sick days" has two claims, and only the first is supported: 1 out of 2, a faithfulness of 0.5. The retrieval was fine here. The generation step added something unsupported, so the fix is in the prompt, not the index.

## What goes wrong
Small test sets are noisy. With 10 questions, one question is 10 percentage points, so 0.8 against 0.9 may be a single flip. With 50 questions, one is 2 points. Do not celebrate a small gain on a small set.

Tuning on the same questions you score on overfits: you pick settings that suit those questions and nothing else. Keep some questions aside as a final check. A model judge can also be wrong or favor longer answers, so read a sample of its verdicts yourself.

## Trade-offs
More questions mean more reliable numbers but more labeling work. Model judges are cheap and fast, but need calibration. Human review is slow and trustworthy. A practical split is a model judge on every change and human review on a small sample.

## Common mistake
Changing three things at once. You will not know which one helped.

```resources
repo | RAGAS | https://github.com/explodinggradients/ragas | Exploding Gradients | Metrics for retrieval and generation quality.
repo | DeepEval | https://github.com/confident-ai/deepeval | Confident AI | Unit-test style evals for LLM apps, including RAG metrics.
article | Your AI product needs evals | https://hamel.dev/blog/posts/evals/ | Hamel Husain | The look-at-your-data loop that applies to RAG.
docs | Ragas docs | https://docs.ragas.io/en/stable | Ragas | Metrics for faithfulness, context precision and recall.
docs | DeepEval docs | https://deepeval.com/docs/introduction | Confident AI | Test-case style evaluation for RAG and agents.
```

```quiz
The right answer ranks 1st, 4th and 2nd for three questions. What is the MRR? | About 2.33 ; About 0.6 ; About 0.25 | 1 | (1 + 0.25 + 0.5) / 3 is about 0.58.
Why evaluate retrieval separately from generation? | Because the vector database requires it ; Because it makes the model answer faster ; Because it shows which stage to fix | 2 | A wrong answer can come from either, and the fix differs.
You change the chunk size and the reranker at once and recall rises. What is the problem? | You cannot tell which change did it ; Recall cannot be measured after two changes ; Rerankers always hide the chunk size effect | 0 | Change one thing at a time so you know what to keep.
```

```story
A team improves their prompt and the demo answers look better. Two weeks later support complains of more wrong answers. They had been judging by a handful of examples. A set of fifty questions with known sources would have shown that retrieval got worse while the wording got nicer.
```

