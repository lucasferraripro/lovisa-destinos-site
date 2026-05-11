# Graph Report - .  (2026-04-17)

## Corpus Check
- 5 files · ~168,624 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 13 nodes · 9 edges · 5 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `applyContent()` - 2 edges
2. `loadAndApply()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.5
Nodes (2): applyContent(), loadAndApply()

### Community 1 - "Community 1"
Cohesion: 1.0
Nodes (0): 

### Community 2 - "Community 2"
Cohesion: 1.0
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 1.0
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 1`** (2 nodes): `auth.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (2 nodes): `content.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (2 nodes): `publish.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (2 nodes): `upload.js`, `handler()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._