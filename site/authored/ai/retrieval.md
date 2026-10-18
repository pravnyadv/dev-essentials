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
What do embeddings of similar sentences have in common? | The same length ; Vectors that point in similar directions ; The same words | 1 | The model is trained to place similar meanings close together.
Which is a use of embeddings? | Semantic search ; Compiling code ; Encrypting data | 0 | Searching by meaning is the most common use.
```

```story
Ask a librarian for "books about getting over a breakup" and they will not search for those exact words. They know that books about heartbreak, moving on and healing belong nearby. Embeddings give a computer the same sense of nearness: texts about similar things get similar numbers, even when they share no words.
```

# embedding-models | Choosing an embedding model | 2 | 12
Embedding models differ in quality, size, languages, input length and price. Pick by testing on your own data.

## What differs
Dimensions: the vector length. More dimensions can carry more detail and cost more to store and search. Some models support Matryoshka embeddings, which let you truncate a vector to a shorter length with small quality loss. Context length: the longest text the model accepts per input. Languages: some models are English-only, others multilingual. Domain: code, legal and medical text often benefit from specialized models. Hosting: a paid API, or an open model such as a sentence-transformer you run yourself.

## How to choose
Start from a benchmark leaderboard to shortlist three models. Build a small test set of real queries with the document that should answer each. For each model, embed documents and queries and measure how often the right document is in the top five results. Pick the cheapest model that is good enough. Re-run the test when you change models, because vectors from different models cannot be mixed in one index.

## A worked example: a 20-minute bake-off
Collect 30 real questions and note which document answers each. Embed all documents with three candidate models. For each question, check whether the right document is in the top five. Results: model X 24 out of 30, model Y 27, model Z 21. Pick Y unless X is much cheaper or faster. Repeat when your documents change character.

## Size and cost
Higher dimensions (3,072 instead of 384) cost more to store and search. Some models let you cut the vector shorter with little loss. For a few thousand documents, use the best quality. For hundreds of millions, size matters.

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
Can you mix vectors from two different embedding models in one index? | Yes ; No, they live in different spaces ; Only if the length matches | 1 | Each model defines its own space, so distances across models are meaningless.
How do you pick a model? | The biggest ; Measure retrieval quality on your own queries ; The newest | 1 | Leaderboards shortlist. Your data decides.
```

```story
A team picks an embedding model that scored best on a leaderboard, then finds it does badly on their legal contracts because it was trained mostly on web text. A cheaper model fine for general English wins on their data after a 20-minute test. Leaderboards shortlist. Your data decides.
```

# similarity-metrics | Measuring similarity: cosine, dot product, distance | 2 | 12
Search ranks vectors by a score. The three common scores are cosine similarity, dot product and Euclidean distance.

## The scores
Dot product multiplies matching entries and adds them. It grows with both direction match and vector length. Cosine similarity divides out the lengths, so only direction counts, from -1 to 1. Euclidean distance is the straight-line distance between the two points: the square root of the sum of squared differences. Smaller means closer.

## Example
a = [3, 4], b = [6, 8], c = [4, -3]. Dot a·b = 18 + 32 = 50. Cosine a,b = 50 / (5 × 10) = 1: same direction. Euclidean a,b = √(9 + 16) = 5: they differ in length. Dot a·c = 12 - 12 = 0, cosine 0: unrelated.

## Which to use
Most text embedding models are trained for cosine similarity or produce vectors of length 1, in which case dot product and cosine give the same ranking. Use the metric the model's documentation recommends. If you normalize vectors to length 1, all three metrics give the same ordering.

## A worked example: why cosine ignores length
a = [1, 2] and b = [10, 20]. They point the same way, b is just ten times longer. Dot product: 1×10 + 2×20 = 50, large. Cosine: 50 / (√5 × √500) = 50 / 50 = 1, a perfect match. Euclidean distance: √(81 + 324) = 20.1, far apart. For comparing meaning you usually want cosine, so a long document is not penalized or favored for its length.

## What to use
Read the model's documentation. If vectors are normalized to length 1, all three rank the same way and you can pick the fastest, usually dot product.

## Common mistake
Mixing metrics between indexing and querying.

```resources
video | Dot products and duality | https://www.youtube.com/watch?v=LyGKycYT2v0 | 3Blue1Brown | Why the dot product measures alignment.
article | Vector similarity explained | https://www.pinecone.io/learn/vector-similarity/ | Pinecone | Compares the three metrics with diagrams.
docs | NumPy linalg.norm | https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html | NumPy | Compute vector lengths for normalizing.
```

```quiz
a = [3, 4] and b = [6, 8]. What is their cosine similarity? | 0 ; 1 ; 0.5 | 1 | They point the same way, so cosine is 1 even though b is longer.
After normalizing all vectors to length 1, how do cosine and dot product rank results? | Differently ; Identically ; Randomly | 1 | With unit lengths the dot product equals cosine.
```

```story
A map app can measure "as the crow flies" or "by road". Both are distances, but they answer different questions. Vector search also has more than one way to say two things are close: by angle (cosine), by multiply-and-add (dot product), or by straight-line distance (Euclidean).
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

## A practical recipe
Split on headings and paragraphs first. Merge small pieces up to about 300 to 500 tokens. Keep the title and section name with each chunk. Read twenty actual chunks. Bad splits are easy to spot.

## Common mistake
Choosing the size by guesswork and never measuring. Try two sizes and compare recall on your test questions.

```resources
article | Chunking strategies for LLM applications | https://www.pinecone.io/learn/chunking-strategies/ | Pinecone | Fixed, structural and semantic approaches compared.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Prepending chunk context, with measured retrieval gains.
repo | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for chunking and many other methods.
tool | ChunkViz | https://chunkviz.up.railway.app/ | Greg Kamradt | Visualize how different splitters cut the same text.
```

```quiz
Why use overlap between chunks? | To save space ; So ideas cut at a boundary still appear whole in one chunk ; To speed up search | 1 | Overlap protects against a split landing in the middle of a key sentence.
What is wrong with chunks that are too small? | They cost more to embed only ; They lose the context needed to make sense ; They are not searchable | 1 | A fragment may not say which product or date it describes.
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

## Picking one
If you already run Postgres, start with pgvector. If you want something simple for a prototype, use Chroma or LanceDB. If you need very large scale, filtering and cloud hosting, look at Qdrant, Weaviate or a managed service. Run your test set, then decide.

## Common mistake
Choosing by benchmark charts rather than by what your team can operate. Operations cost more than a few milliseconds.

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
Why use approximate nearest neighbor search? | Exact search is wrong ; Exact search compares every vector and is too slow at scale ; It is cheaper to store | 1 | ANN indexes skip most comparisons while almost always finding the true nearest.
Under a million vectors, how should you choose a database? | By benchmark alone ; By what you already run and operate ; By price per vector only | 1 | Most options perform fine at that size, so operational simplicity wins.
```

```story
Finding the closest book among ten is easy. Finding the closest among ten million, in a tenth of a second, needs an index. A vector database is the search system that keeps millions of embeddings organized so that nearest neighbors can be found quickly instead of by checking everything.
```

# semantic-and-hybrid-search | Semantic, keyword and hybrid search | 2 | 12
Keyword search finds exact terms. Semantic search finds meaning. Combining them catches what either alone misses.

## How each works
Keyword search with BM25 scores a document higher when it contains the query's rare words many times. It nails error codes, names and identifiers and misses synonyms. Semantic search embeds the query and finds the nearest chunk vectors, so "car won't start" matches "engine fails to turn over". It can miss exact strings like "ERR_4021".

## Combining them
Run both, then merge the ranked lists. Reciprocal rank fusion gives each document a score of 1 / (k + rank) in each list, with k often 60, and adds them up. Example: a document ranked 1st by keyword and 3rd by semantic scores 1/61 + 1/63 = 0.0323. A document ranked 2nd in only one list scores 1/62 = 0.0161. Documents that appear in both lists rise to the top. Add a reranker over the merged top 50 for further gains.

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
Which search is better at finding the exact string ERR_4021? | Semantic ; Keyword (BM25) ; Neither | 1 | Exact rare tokens are where keyword matching is strongest.
A document ranks 1st in keyword and 3rd in semantic results. Reciprocal rank fusion with k = 60 gives it about | 0.032 ; 0.5 ; 1 | 0 | 1/61 + 1/63 is about 0.0323.
```

```story
A user searches for "ERR_4021". Semantic search returns articles about errors in general, because the code means nothing to an embedding. Keyword search finds the one page that mentions it. Another user searches "my screen is frozen" and keyword search misses the page titled "Application not responding". You want both.
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

## How to debug
Always display the retrieved chunks next to the answer in your test tool. If the answer is wrong and the right chunk is missing, fix retrieval (chunking, search, filters). If the right chunk is present and the answer is still wrong, fix the prompt or the model.

## Common mistakes
Skipping the "say you do not know" instruction. Letting retrieval pull documents a user is not allowed to see.

```resources
course | RAG Techniques | https://github.com/NirDiamant/RAG_Techniques | Nir Diamant | Notebooks for dozens of RAG methods with explanations.
article | Introducing Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Prepending chunk context and combining BM25 with embeddings.
paper | Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks | https://arxiv.org/abs/2005.11401 | Lewis et al. | The paper that named RAG.
article | Patterns for Building LLM-based Systems and Products | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | RAG, evals, guardrails and feedback as design patterns.
repo | RAGFlow | https://github.com/infiniflow/ragflow | InfiniFlow | An open-source RAG engine with document parsing.
```

```quiz
A RAG answer is wrong. What do you check first? | The model temperature ; Whether the right chunk was retrieved ; The font | 1 | Retrieval quality is the most common root cause and can be tested without the model.
What should the prompt tell the model to do when the sources lack the answer? | Guess ; Say it cannot find it ; Search the web | 1 | Allowing "I do not know" cuts confident wrong answers.
```

```story
A new hire asks the company bot: "How many vacation days do I get after one year?" A plain model guesses a typical number. A RAG bot first searches the HR handbook, finds "Employees receive 25 days after 12 months", pastes that paragraph into the prompt and replies "25 days, per the Time Off policy, section 3." The model did not become smarter. It was given the right page.
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

## Permissions are filters
Each chunk carries who may read it, such as team = finance. The filter is applied by your code using the signed-in user's rights. The prompt never sees chunks the user cannot see.

## Common mistake
Relying on "do not reveal confidential data" in the prompt. A prompt is not a lock.

```resources
article | Metadata filtering | https://docs.pinecone.io/guides/search/filter-by-metadata | Pinecone | Filter syntax and performance notes.
docs | Qdrant filtering | https://qdrant.tech/documentation/concepts/filtering/ | Qdrant | Payload filters combined with vector search.
article | Contextual Retrieval | https://www.anthropic.com/news/contextual-retrieval | Anthropic | Related technique for giving chunks context.
```

```quiz
Where should access permissions be enforced in RAG? | In the prompt ; In metadata filters applied by your code ; In the embedding model | 1 | Chunks the user cannot see must never reach the prompt at all.
What can a model extract from a question for filtering? | Filter values as structured output you validate ; Raw SQL to run directly ; Nothing | 0 | Validate the structure before using it.
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

## A worked example: a decision table
Need facts that change often: RAG. Need citations: RAG. Need a rigid output format used millions of times: try structured output first, then fine-tune if needed. Need a small model to imitate a big one on one narrow job: fine-tune using the big model's answers. Need new behavior in tone or style: prompt, then fine-tune.

## Combining them
Many systems fine-tune for format and style and use RAG for facts. They are not rivals. They solve different problems.

## Common mistake
Reaching for fine-tuning first because it sounds advanced. It is usually the more expensive, slower, harder-to-update option.

```resources
article | RAG vs fine-tuning | https://www.ibm.com/think/topics/rag-vs-fine-tuning | IBM | A balanced comparison with trade-offs.
article | Patterns for Building LLM-based Systems and Products | https://eugeneyan.com/writing/llm-patterns/ | Eugene Yan | When to retrieve and when to fine-tune.
paper | Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs | https://arxiv.org/abs/2312.05934 | Ovadia et al. | Finds retrieval beats fine-tuning for new knowledge.
```

```quiz
Your product docs change weekly and the model must answer from them. Best choice? | Fine-tune weekly ; RAG over the docs ; A longer system prompt | 1 | Re-indexing is cheap and keeps answers citable.
When does fine-tuning make sense? | To teach new facts ; To lock in a style, format or narrow skill ; To avoid evals | 1 | Fine-tuning is for behavior, not for facts.
```

```story
A company wants its assistant to know the new product catalog and to always answer in a formal tone. For the catalog, which changes weekly, retrieval is ideal: update the documents and the answers update. For the formal tone, fine-tuning or a good system prompt fits. The mistake would be fine-tuning on the catalog every week.
```

# rag-evaluation | Evaluating RAG | 3 | 15
Measure retrieval and generation separately, so you know which one to fix.

## Retrieval metrics
Build a set of questions, each with the chunk or document that answers it. Recall at k: how often the right chunk is in the top k results. Precision at k: what fraction of the top k are relevant. MRR (mean reciprocal rank): the average of 1 / rank of the first right result, so rank 1 scores 1 and rank 4 scores 0.25. Example: ranks of 1, 4 and 2 across three questions give (1 + 0.25 + 0.5) / 3 = 0.58.

## Generation metrics
Faithfulness: is every claim in the answer supported by the retrieved chunks? Answer relevance: does it address the question? Context relevance: were the retrieved chunks needed? These are usually scored by a model judge with a rubric, calibrated against a sample you labeled yourself. RAGAS and DeepEval implement these metrics.

## The loop
Change one thing, such as chunk size, embedding model or reranker, and rerun both sets of metrics. Keep the change only if it helps enough to justify the added cost or latency.

## A worked example: scoring retrieval
Five test questions. The right chunk is ranked 1st, 3rd, not found in the top five, 1st and 2nd. Recall at 5 is 4 out of 5 = 0.8. Reciprocal ranks: 1, 0.33, 0, 1, 0.5, so MRR = 2.83 / 5 = 0.57. Change the chunk size and rerun. If recall rises to 0.9, keep it.

## Scoring answers
For each answer check: is every claim in the answer supported by the retrieved text (faithfulness)? Does it answer the question? A model judge can score these, but first compare its scores with your own on a sample of twenty to make sure it agrees with you.

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
Ranks of the right answer for three questions are 1, 4 and 2. What is MRR? | 0.58 ; 2.33 ; 0.25 | 0 | (1 + 0.25 + 0.5) / 3 = 0.58.
Why evaluate retrieval separately from generation? | It is cheaper ; To know which stage to fix ; It is required | 1 | A wrong answer can come from either, and the fix differs.
```

```story
A team improves their prompt and the demo answers look better. Two weeks later support complains of more wrong answers. They had been judging by a handful of examples. A set of fifty questions with known sources would have shown that retrieval got worse while the wording got nicer.
```

