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
    id: 'pair-10',
    wordId: '2675be2b-8553-4e25-ad38-371ac0b6abd3', // enikku (I)
    confusableWordId: 'c93b83c4-da8b-431b-93ef-af20ec1e83a3', // ente (my)
    reason: "Both are first-person pronouns starting with 'e'",
  },
];
