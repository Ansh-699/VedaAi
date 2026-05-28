/**
 * Deterministic avatar URLs powered by DiceBear's HTTP API.
 * No login, no domain whitelisting, instant SVGs.
 */
const dicebear = (style: string, seed: string) =>
  `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

export const avatars = {
  user: (seed = "John Doe") => dicebear("avataaars", seed),
  school: (seed = "Delhi Public School") => dicebear("shapes", seed),
  // NFT-ish playful look for the school card
  nft: (seed = "Bokaro Steel City") => dicebear("bottts-neutral", seed),
};
