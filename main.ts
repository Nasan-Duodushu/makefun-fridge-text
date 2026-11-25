// The 3AM Fridge Text — one line a smart fridge would text its owner at 3am.
// Writes exactly one line to /output/entry.txt (UTF-8, 1-140 chars).
import { mkdir, writeFile, chmod } from "node:fs/promises";
import { join } from "node:path";

const LIMIT = 140;

class FridgeText {
  readonly hour = 3;
  private readonly parts: string[];

  constructor() {
    // Fridge voice: awake all night, keeping inventory, passing judgement.
    this.parts = [
      `It's ${this.hour}am.`,
      "I counted the leftovers twice.",
      "The cheese has seen things,",
      "and it would like a word with you.",
    ];
  }

  line(): string {
    return this.parts.join(" ");
  }
}

async function main(): Promise<void> {
  const entry = new FridgeText().line();
  if (entry.length === 0 || entry.length > LIMIT) {
    throw new Error(`entry must be 1-${LIMIT} chars, got ${entry.length}`);
  }
  if (entry.includes("\n") || entry.trim() !== entry) {
    throw new Error("entry must be a single unpadded line");
  }
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  await mkdir(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  await writeFile(target, entry, { encoding: "utf8", mode: 0o644 });
  await chmod(target, 0o644);
  console.log(`${entry.length} chars -> ${target}`);
}

await main();
