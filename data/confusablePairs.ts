import { ConfusablePair } from '@/types/pronunciation';

export const confusablePairs: ConfusablePair[] = [
  {
    id: 'pair-1',
    wordId: '595ae022-4413-4371-92a4-a8df5773203b', // ithu (this)
    confusableWordId: '43847693-3593-46c3-9a02-25a5363c22bf', // athu (that)
    reason: "Minimal vowel difference - 'i' vs 'a' at the start",
  },
  {
    id: 'pair-2',
    wordId: '595ae022-4413-4371-92a4-a8df5773203b', // ithu (this)
    confusableWordId: '0d98e3a5-08a3-4651-9e71-cddfec8f0da8', // ethu (which)
    reason: "Similar consonant pattern, different initial vowel sound",
  },
  {
    id: 'pair-3',
    wordId: 'f63ca11a-3259-4aab-bad7-d3b349201512', // enthu (what)
    confusableWordId: 'c93b83c4-da8b-431b-93ef-af20ec1e83a3', // ente (my)
    reason: "Both start with 'en-' sound, easy to confuse",
  },
  {
    id: 'pair-4',
    wordId: '575cfad1-5a59-40da-96f1-2a04c1c9ea5d', // pinneyum (again)
    confusableWordId: '8065bc6f-b0e9-4d00-8207-6cf0270ed242', // pinne (and)
    reason: "Same root word 'pinne', different suffix",
  },
  {
    id: 'pair-5',
    wordId: '6eef5470-5e0a-4b0d-9e73-6e79cfa5d657', // munbu (before)
    confusableWordId: 'feb7843c-a1eb-4212-bb7f-0743cad7a50f', // sheSham (after)
    reason: "Opposite temporal meanings - tests comprehension",
  },
  {
    id: 'pair-6',
    wordId: 'c7a81809-ec64-4548-8549-c99bc488a3af', // padikkuka (to study)
    confusableWordId: '3981b8e7-3aba-4beb-9656-ad64dcbde00e', // uranguka (to sleep)
    reason: "Both are -uka suffix verbs with similar rhythm",
  },
  {
    id: 'pair-7',
    wordId: 'c575b8f7-1d2a-46bb-8aaf-d67a5999a614', // kazhikkuka (to eat)
    confusableWordId: '3981b8e7-3aba-4beb-9656-ad64dcbde00e', // uranguka (to sleep)
    reason: "Common daily activity verbs with -uka ending",
  },
  {
    id: 'pair-8',
    wordId: '5800b05e-4740-4be3-afa3-71c195258576', // eppozhum (always)
    confusableWordId: '575cfad1-5a59-40da-96f1-2a04c1c9ea5d', // pinneyum (again)
    reason: "Both are adverbs ending in -um sound",
  },
  {
    id: 'pair-9',
    wordId: 'f097f48e-a772-448e-9d07-d9dca4e78ce0', // uccha (afternoon)
    confusableWordId: 'c830b034-0d40-4629-b06b-3b6714309732', // kalatthu/ravile (morning)
    reason: "Time-of-day words - tests temporal vocabulary",
  },
  {
    id: 'pair-10',
    wordId: '2675be2b-8553-4e25-ad38-371ac0b6abd3', // Enikku (I)
    confusableWordId: 'c93b83c4-da8b-431b-93ef-af20ec1e83a3', // ente (my)
    reason: "Both are first-person pronouns starting with 'E'",
  },
];
