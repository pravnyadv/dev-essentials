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
What do embeddings of similar sentences have in common? | They contain the same words ; Their vectors point in similar directions ; They have the same length in characters | 1 | The model is trained to place similar meanings close together.
Which is a common use of embeddings? | Compiling a program into machine code ; Encrypting a message before sending ; Searching documents by meaning | 2 | Searching by meaning is the most common use.
"I forgot my login" and "How do I reset my password?" share no keyword. How can search still match them? | Their embeddings are close in meaning ; A keyword filter links them ; The words forgot and reset are synonyms in a dictionary | 0 | Embedding similarity captures meaning, not just shared words.
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
Can you mix vectors from two different embedding models in one index? | Yes, if both are normalized ; No, they live in different spaces ; Yes, if both have the same length | 1 | Each model defines its own space, so distances across models are meaningless.
How should you pick a model? | Choose the one with the most dimensions ; Choose the newest release ; Measure retrieval quality on your own queries | 2 | Leaderboards shortlist. Your data decides.
You switch embedding models and keep the old vectors. What happens? | Results become unreliable, so re-embed it all ; Nothing, the old vectors still match fine ; Only the new documents are affected | 0 | Old and new vectors cannot be compared, so the whole index must be rebuilt.
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

## Common mistake
Mixing metrics between indexing and querying.

```resources
video | Dot products and duality | https://www.youtube.com/watch?v=LyGKycYT2v0 | 3Blue1Brown | Why the dot product measures alignment.
article | Vector similarity explained | https://www.pinecone.io/learn/vector-similarity/ | Pinecone | Compares the three metrics with diagrams.
docs | NumPy linalg.norm | https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html | NumPy | Compute vector lengths for normalizing.
```

```quiz
a = [3, 4] and b = [6, 8]. What is their cosine similarity? | 0 ; 1 ; 0.5 | 1 | They point the same way, so cosine is 1 even though b is longer.
After normalizing all vectors to length 1, how do cosine and dot product rank results? | Differently, with dot product favoring long vectors ; Randomly ; Identically | 2 | With unit lengths the dot product equals cosine.
You index with cosine but query with Euclidean distance. What is the problem? | The scores are not comparable, so results may be off ; Nothing, since all metrics rank the same ; Euclidean distance cannot be used on vectors | 0 | Use the same metric for indexing and querying, as the model recommends.
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

## Common mistake
Treating "I extracted the text" as the end of ingestion. A scanned file that quietly returns an empty string will never be retrieved, and nobody notices until a user asks about it.

```resources
repo | Docling | https://github.com/docling-project/docling | IBM Research | Converts PDFs and Office files into clean structured text and tables.
repo | Unstructured | https://github.com/Unstructured-IO/unstructured | Unstructured | Parses many document types into labelled elements ready for chunking.
repo | PyMuPDF | https://github.com/pymupdf/PyMuPDF | Artifex | Fast text and image extraction for PDFs that contain real text.
docs | PDF support | https://docs.anthropic.com/en/docs/build-with-claude/pdf-support | Anthropic | Sending a PDF straight to a model that reads both the text and the page images.
```

```quiz
Why can plain text extraction from a two-column PDF hurt retrieval? | The file is encrypted so the text comes out scrambled ; Lines from both columns get mixed, so chunks stop making sense ; Columns are too wide to fit in the model's context window | 1 | Reading straight across the page interleaves the columns, so each chunk mixes unrelated sentences and its embedding becomes a blur.
A scanned PDF returns empty text from your parser. What is the most likely cause? | The document is too long for the parser to open ; The embedding model rejected the file format ; The pages are pictures, so you need OCR or a vision model | 2 | A scan has no text layer. OCR or a vision model has to read the page image.
You will index 5,000 pages. What is the most useful quick check first? | Compare ten parsed pages with the originals ; Run the embedding model twice on each page ; Raise the chunk size to 2,000 tokens | 0 | Looking at real parsed pages catches broken tables, wrong order and empty pages while they are cheap to fix.
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

## Common mistake
Choosing the size by guesswork and never measuring. Try two sizes and compare recall on your test questions.

```resources
article | Chunking strategies for LLM applications | https://www.pinecone.io/learn/chunking-strategies/ | Pinecone | Fixed, structural and semantic approaches compared.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Prepending chunk context, with measured retrieval gains.
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for chunking and many other methods.
tool | ChunkViz | https://chunkviz.up.railway.app/ | Greg Kamradt | Visualize how different splitters cut the same text.
```

```quiz
Why use overlap between chunks? | It makes the embeddings take up less space ; A cut sentence still appears whole in one chunk ; It speeds up the vector search a lot | 1 | Overlap protects against a split landing in the middle of an important sentence.
What is wrong with chunks that are too small? | They cannot be embedded at all ; They make the index too large to store ; They lose the context needed to make sense | 2 | A fragment may not say which product or date it describes.
Your answers are wrong and you see a key fact split between two chunks. What is the quick fix to try? | Overlap the chunks or split on headings ; Raise the temperature of the model ; Use a larger embedding model | 0 | Better chunk boundaries keep facts together. Then measure recall.
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
Why use approximate nearest neighbor search? | Exact search returns wrong results ; Exact search checks every vector, too slow at scale ; It stores vectors more cheaply on disk | 1 | ANN indexes skip most comparisons while almost always finding the true nearest.
Under a million vectors, how should you choose a database? | By the longest benchmark chart you can find ; By the price per vector alone ; By what you already run and can operate | 2 | Most options perform fine at that size, so operational simplicity wins.
You already run Postgres and have 80,000 chunks. What is a reasonable choice? | pgvector in your existing database ; A new managed cluster for vectors ; A custom index you write yourself | 0 | One system to run is simpler, and the size is small.
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

## Common mistake
Adding hybrid search without a test set, so you cannot tell if it helped.

```resources
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Measured gains from BM25 plus embeddings plus reranking.
article | Hybrid Search Explained | https://weaviate.io/blog/hybrid-search-explained | Weaviate | Keyword and vector fusion with examples.
paper | Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods | https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf | Cormack et al. | The original RRF paper.
```

```quiz
Which search is better at finding the exact string ERR_4021? | Semantic search ; Keyword search (BM25) ; Both are equally good | 1 | Exact rare tokens are where keyword matching is strongest.
A document ranks 1st in keyword and 3rd in semantic results. What does reciprocal rank fusion with k = 60 give it? | About 0.5 ; About 1 ; About 0.032 | 2 | 1/61 + 1/63 is about 0.0323.
Users type "my screen is frozen" but the page says "Application not responding". Which search helps? | Semantic search, which matches meaning ; Keyword search used on its own ; An exact-match filter on the text | 0 | Semantic search connects different wording with the same meaning.
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

## Common mistake
Reranking only the 5 results you already planned to use. There is nothing to reorder. The point is to search wide, then narrow.

```resources
docs | Rerank overview | https://docs.cohere.com/docs/rerank-overview | Cohere | A hosted reranking API and how to use it after a first search.
docs | Cross-encoders | https://sbert.net/docs/cross_encoder/usage/usage.html | Sentence Transformers | Run an open cross-encoder yourself in a few lines.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Measures how much reranking adds on top of embeddings and BM25.
tool | bge-reranker-v2-m3 | https://huggingface.co/BAAI/bge-reranker-v2-m3 | BAAI | A widely used open multilingual reranker.
```

```quiz
What does a cross-encoder reranker do that the first search cannot? | It stores every passage as a longer vector ; It reads the question and the passage together before scoring ; It runs on the full database instead of candidates | 1 | Reading both texts together lets it notice negations, numbers and conditions that a single stored vector blurs.
A team passes the top 5 search results to a reranker and keeps all 5. What is wrong? | Rerankers only accept exactly 5 passages at a time ; The reranker will delete two of the five results ; Nothing is left to reorder, so fetch more candidates first | 2 | Reranking helps when you fetch many candidates, such as 50, and then keep the best few.
How should you decide whether to keep a reranker? | Compare recall at 5 before and after, weigh delay ; Keep it because most search systems use one ; Remove it if answers feel slower in a demo | 0 | A measured gain in recall that outweighs the added latency and cost is the reason to keep it.
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
A RAG answer is wrong. What do you check first? | The temperature of the model ; Whether the right chunk was retrieved ; The font used in the interface | 1 | Retrieval quality is the most common root cause, and it can be tested without the model.
What should the prompt tell the model to do when the sources lack the answer? | Guess the most likely answer ; Search the web instead ; Say that it cannot find it | 2 | Allowing "I do not know" cuts confident wrong answers.
The right chunk was retrieved but the answer ignores it. What should you adjust? | The prompt telling it to use the chunks ; The vector database settings ; The size of each chunk | 0 | Retrieval did its job, so the instruction or the model is the weak link.
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
A user asks "And for gift cards?" mid-chat and search returns junk. What fixes it? | Raise the number of results to 100 ; Rewrite it as a standalone question from history ; Switch to a larger embedding model | 1 | The follow-up depends on earlier turns. A standalone rewrite makes it searchable.
What is the idea behind HyDE? | Hide the question from the retriever to avoid bias ; Replace the vector database with a language model ; Search with a made-up answer that reads like a document | 2 | A short invented answer shares more words and meaning with the real document than the question does.
What must a good rewrite keep? | Every name, date, number and place ; Only the main noun of the question ; As few words as it possibly can | 0 | Dropping a constraint such as a region or an amount changes what is searched for and returns the wrong passages.
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

## Common mistake
Relying on "do not reveal confidential data" in the prompt. A prompt is not a lock.

```resources
article | Metadata filtering | https://docs.pinecone.io/guides/search/filter-by-metadata | Pinecone | Filter syntax and performance notes.
docs | Qdrant filtering | https://qdrant.tech/documentation/concepts/filtering/ | Qdrant | Payload filters combined with vector search.
article | Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Related technique for giving chunks context.
```

```quiz
Where should access permissions be enforced in RAG? | In the prompt text sent to the model ; In metadata filters applied by your own code ; In the embedding model itself | 1 | Chunks the user cannot see must never reach the prompt at all.
What can a model extract from a question for filtering? | Raw SQL that you then run directly ; The user's saved password ; Filter values as validated structured output | 2 | Validate the structure before using it.
A Canadian customer gets a policy from another country. What is the likely cause? | No region filter was applied to the search ; The embedding model ignores countries ; The prompt was too short | 0 | Metadata filters narrow the candidates to the right region before searching.
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

## Common mistake
Reaching for fine-tuning first because it sounds advanced. It is usually the more expensive, slower, harder-to-update option.

```resources
article | RAG vs fine-tuning | https://www.ibm.com/think/topics/rag-vs-fine-tuning | IBM | A balanced comparison with trade-offs.
article | Patterns for Building LLM-based Systems and Products | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | When to retrieve and when to fine-tune.
paper | Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs | https://arxiv.org/abs/2312.05934 | Ovadia et al. | Finds retrieval beats fine-tuning for new knowledge.
```

```quiz
Your product docs change weekly and the model must answer from them. Best choice? | Fine-tuning every week ; RAG over the documents ; A longer system prompt | 1 | Re-indexing is cheap and keeps answers citable.
When does fine-tuning make sense? | To teach the model brand new facts ; To avoid having to write evals ; To lock in a style, format or narrow skill | 2 | Fine-tuning is for behavior, not for facts.
Your assistant needs both a formal tone and up-to-date prices. What fits? | Prompt or tune for tone, RAG for prices ; Fine-tuning for both tone and prices ; RAG for both tone and prices | 0 | They solve different problems and are often combined.
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
The right answer ranks 1st, 4th and 2nd for three questions. What is the MRR? | About 2.33 ; About 0.58 ; About 0.25 | 1 | (1 + 0.25 + 0.5) / 3 is about 0.58.
Why evaluate retrieval separately from generation? | It is required by the vector database ; It makes the model answer faster ; To know which stage to fix | 2 | A wrong answer can come from either, and the fix differs.
You change the chunk size and the reranker at once and recall rises. What is the problem? | You cannot tell which change helped ; Recall cannot be measured twice ; Rerankers hide the chunk size effect | 0 | Change one thing at a time so you know what to keep.
```

```story
A team improves their prompt and the demo answers look better. Two weeks later support complains of more wrong answers. They had been judging by a handful of examples. A set of fifty questions with known sources would have shown that retrieval got worse while the wording got nicer.
```

