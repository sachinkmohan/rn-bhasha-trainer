import { ConfusablePair } from "@/types/pronunciation";

export const confusablePairs: ConfusablePair[] = [
  {
    id: "pair-1",
    wordId: "f7ec48ae-43cc-4258-904a-a69c85705f19", // aaNu (is/am/are)
    confusableWordId: "7c4a8f3e-9b2d-4e1a-8c5f-6d3e2a1b9c8d", // aana (Elephant)
    reason: "Retroflex 'N' vs regular 'n' sound",
  },
  {
    id: "pair-2",
    wordId: "595ae022-4413-4371-92a4-a8df5773203b", // ithu (this)
    confusableWordId: "43847693-3593-46c3-9a02-25a5363c22bf", // athu (that)
    reason: "Minimal vowel difference - 'i' vs 'a' at the start",
  },
  {
    id: "pair-3",
    wordId: "c93b83c4-da8b-431b-93ef-af20ec1e83a3", // ente (my/mine)
    confusableWordId: "f63ca11a-3259-4aab-bad7-d3b349201512", // enthu (what)
    reason: "Both start with 'en-' sound, easy to confuse",
  },
  {
    id: "pair-4",
    wordId: "2675be2b-8553-4e25-ad38-371ac0b6abd3", // Enikku (I)
    confusableWordId: "9d5b7e2c-4a3f-4d6b-9e8a-5f4c3d2e1a0b", // ENeekku (wake up)
    reason: "Both start with 'E' and have similar vowel patterns",
  },
  {
    id: "pair-5",
    wordId: "aa03b3e9-71f8-468d-b832-b3fc0bfb2b3b", // Peru (Name)
    confusableWordId: "9f8e7d6f-5e4d-4a3f-2b1c-0d9e8f7d6e5f", // PeRu (Delivering baby)
    reason: "Identical except for retroflex 'R' vs regular 'r' sound",
  },
  {
    id: "pair-6",
    wordId: "c7a81809-ec64-4548-8549-c99bc488a3af", // padikkuka (to study)
    confusableWordId: "2a1b0c9d-8e7f-4d6c-5e4d-3f2e1a0b9c8d", // pattikkuka (To deceive)
    reason: "Very similar - 'd' vs geminated 'tt' sound in the middle",
  },
  {
    id: "pair-7",
    wordId: "0d98e3a5-08a3-4651-9e71-cddfec8f0da8", // Ethu (which)
    confusableWordId: "f63ca11a-3259-4aab-bad7-d3b349201512", // Enthu (what)
    reason: "Similar consonant pattern, different initial vowel sound",
  },
  {
    id: "pair-8",
    wordId: "4e3f2a1b-0c9d-4e8f-7d6e-5f4d3e2a1b0c", // Ura (Scrub/Rub)
    confusableWordId: "6e5f4d3e-2a1b-4c0d-9e8f-7d6e5f4d3e2a", // URa (Case/Sheath)
    reason: "Identical except for retroflex 'R' vs regular 'r' sound",
  },
  {
    id: "pair-9",
    wordId: "c575b8f7-1d2a-46bb-8aaf-d67a5999a614", // kazhikkuka (to eat)
    confusableWordId: "3e8a6f4d-2c5b-4e9a-8d7f-6e5c4d3a2b1c", // Karikkuka (to char)
    reason: "Similar 'k' sounds with different middle consonants - 'zh' vs 'r'",
  },
  {
    id: "pair-10",
    wordId: "38b5ad6e-2a6b-4889-9521-0a9ff77ae743", // kaaraNam (Reason)
    confusableWordId: "8e7f6d5e-4f3a-4b2c-1d0e-9f8e7d6f5e4d", // karaNam (cheek)
    reason: "Long 'aa' vowel vs short 'a' vowel at the start",
  },
  {
    id: "pair-11",
    wordId: "5c4d3e2f-1a9b-4c8d-7e6f-5d4e3f2a1b0c", // pani (fever)
    confusableWordId: "0c9d8e7f-6d5e-4f4a-3b2c-1d0e9f8e7d6f", // paNi (work)
    reason: "Identical except for retroflex 'N' vs regular 'n' sound",
  },
  {
    id: "pair-12",
    wordId: "8d7e6f5c-4b3a-4e2d-9c1f-8d7e6f5c4d3e", // palli (lizard)
    confusableWordId: "5d4e3f2a-1b0c-4d9e-8f7d-6e5f4d3e2a1b", // paLLi (church)
    reason:
      "Identical except for geminated retroflex 'LL' vs regular 'll' sound",
  },
  {
    id: "pair-13",
    wordId: "9c8d7e6f-5d4e-4f3a-2b1c-0a9b8c7d6e5f", // thuNi (cloth)
    confusableWordId: "7d6e5f4c-3d2e-4a1b-0c9d-8e7f6d5e4f3a", // thunni (sew past)
    reason: "Similar sounds - retroflex 'N' vs geminated 'nn'",
  },
  {
    id: "pair-14",
    wordId: "6f9d8e7c-5b4a-4d3e-8c2f-7d6e5a4b3c2d", // palam (bridge)
    confusableWordId: "3f2e1a0b-9c8d-4e7f-6d5e-4f3a2b1c0d9e", // paLam (Track/Rail)
    reason: "Identical except for retroflex 'L' vs regular 'l' sound",
  },
  // Flipped pairs (same pairs with wordId and confusableWordId swapped)
  {
    id: "pair-15",
    wordId: "7c4a8f3e-9b2d-4e1a-8c5f-6d3e2a1b9c8d", // aana (Elephant)
    confusableWordId: "f7ec48ae-43cc-4258-904a-a69c85705f19", // aaNu (is/am/are)
    reason: "Retroflex 'N' vs regular 'n' sound",
  },
  {
    id: "pair-16",
    wordId: "43847693-3593-46c3-9a02-25a5363c22bf", // athu (that)
    confusableWordId: "595ae022-4413-4371-92a4-a8df5773203b", // ithu (this)
    reason: "Minimal vowel difference - 'i' vs 'a' at the start",
  },
  {
    id: "pair-17",
    wordId: "f63ca11a-3259-4aab-bad7-d3b349201512", // enthu (what)
    confusableWordId: "c93b83c4-da8b-431b-93ef-af20ec1e83a3", // ente (my/mine)
    reason: "Both start with 'en-' sound, easy to confuse",
  },
  {
    id: "pair-18",
    wordId: "9d5b7e2c-4a3f-4d6b-9e8a-5f4c3d2e1a0b", // ENeekku (wake up)
    confusableWordId: "2675be2b-8553-4e25-ad38-371ac0b6abd3", // Enikku (I)
    reason: "Both start with 'E' and have similar vowel patterns",
  },
  {
    id: "pair-19",
    wordId: "9f8e7d6f-5e4d-4a3f-2b1c-0d9e8f7d6e5f", // PeRu (Delivering baby)
    confusableWordId: "aa03b3e9-71f8-468d-b832-b3fc0bfb2b3b", // Peru (Name)
    reason: "Identical except for retroflex 'R' vs regular 'r' sound",
  },
  {
    id: "pair-20",
    wordId: "2a1b0c9d-8e7f-4d6c-5e4d-3f2e1a0b9c8d", // pattikkuka (To deceive)
    confusableWordId: "c7a81809-ec64-4548-8549-c99bc488a3af", // padikkuka (to study)
    reason: "Very similar - 'd' vs geminated 'tt' sound in the middle",
  },
  {
    id: "pair-21",
    wordId: "f63ca11a-3259-4aab-bad7-d3b349201512", // Enthu (what)
    confusableWordId: "0d98e3a5-08a3-4651-9e71-cddfec8f0da8", // Ethu (which)
    reason: "Minimal difference in the sound",
  },
  {
    id: "pair-22",
    wordId: "6e5f4d3e-2a1b-4c0d-9e8f-7d6e5f4d3e2a", // URa (Case/Sheath)
    confusableWordId: "4e3f2a1b-0c9d-4e8f-7d6e-5f4d3e2a1b0c", // Ura (Scrub/Rub)
    reason: "Identical except for retroflex 'R' vs regular 'r' sound",
  },
  {
    id: "pair-23",
    wordId: "3e8a6f4d-2c5b-4e9a-8d7f-6e5c4d3a2b1c", // Karikkuka (to char)
    confusableWordId: "c575b8f7-1d2a-46bb-8aaf-d67a5999a614", // kazhikkuka (to eat)
    reason: "Similar 'k' sounds with different middle consonants - 'zh' vs 'r'",
  },
  {
    id: "pair-24",
    wordId: "8e7f6d5e-4f3a-4b2c-1d0e-9f8e7d6f5e4d", // karaNam (cheek)
    confusableWordId: "38b5ad6e-2a6b-4889-9521-0a9ff77ae743", // kaaraNam (Reason)
    reason: "Long 'aa' vowel vs short 'a' vowel at the start",
  },
  {
    id: "pair-25",
    wordId: "0c9d8e7f-6d5e-4f4a-3b2c-1d0e9f8e7d6f", // paNi (work)
    confusableWordId: "5c4d3e2f-1a9b-4c8d-7e6f-5d4e3f2a1b0c", // pani (fever)
    reason: "Identical except for retroflex 'N' vs regular 'n' sound",
  },
  {
    id: "pair-26",
    wordId: "5d4e3f2a-1b0c-4d9e-8f7d-6e5f4d3e2a1b", // paLLi (church)
    confusableWordId: "8d7e6f5c-4b3a-4e2d-9c1f-8d7e6f5c4d3e", // palli (lizard)
    reason:
      "Identical except for geminated retroflex 'LL' vs regular 'll' sound",
  },
  {
    id: "pair-27",
    wordId: "7d6e5f4c-3d2e-4a1b-0c9d-8e7f6d5e4f3a", // thunni (sew past)
    confusableWordId: "9c8d7e6f-5d4e-4f3a-2b1c-0a9b8c7d6e5f", // thuNi (cloth)
    reason: "Similar sounds - retroflex 'N' vs geminated 'nn'",
  },
  {
    id: "pair-28",
    wordId: "3f2e1a0b-9c8d-4e7f-6d5e-4f3a2b1c0d9e", // paLam (Track/Rail)
    confusableWordId: "6f9d8e7c-5b4a-4d3e-8c2f-7d6e5a4b3c2d", // palam (bridge)
    reason: "Identical except for retroflex 'L' vs regular 'l' sound",
  },
];
