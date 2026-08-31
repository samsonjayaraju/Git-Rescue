import type { GuideSearchItem, GuideSearchResult } from '@/types/guides';

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function editDistance(left: string, right: string): number {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

function tokenScore(queryToken: string, fieldTokens: readonly string[], exact: number): number {
  let best = 0;
  for (const token of fieldTokens) {
    if (token === queryToken) best = Math.max(best, exact);
    else if (token.startsWith(queryToken) || queryToken.startsWith(token)) best = Math.max(best, Math.round(exact * 0.7));
    else {
      const threshold = queryToken.length >= 7 ? 2 : queryToken.length >= 4 ? 1 : 0;
      if (threshold > 0 && editDistance(queryToken, token) <= threshold) best = Math.max(best, Math.round(exact * 0.42));
    }
  }
  return best;
}

function scoreItem(item: GuideSearchItem, rawQuery: string): number {
  const query = normalizeSearchText(rawQuery);
  if (!query) return 0;
  const title = normalizeSearchText(item.title);
  const aliases = item.aliases.map(normalizeSearchText);
  const commands = item.commands.map(normalizeSearchText);
  const keywords = item.keywords.map(normalizeSearchText);
  const category = normalizeSearchText(`${item.domain} ${item.category} ${item.categoryLabel}`);
  const description = normalizeSearchText(item.description);

  if (title === query) return 21_000 + (item.popular ? 5 : 0);
  if (aliases.includes(query)) return 20_000 + (item.popular ? 5 : 0);

  let score = 0;
  if (title.startsWith(query)) score = Math.max(score, 8_800);
  if (aliases.some((alias) => alias.startsWith(query))) score = Math.max(score, 8_500);
  if (title.includes(query)) score = Math.max(score, 8_100);
  if (aliases.some((alias) => alias.includes(query))) score = Math.max(score, 7_800);
  if (commands.some((command) => command === query)) score = Math.max(score, 7_600);
  if (commands.some((command) => command.includes(query))) score = Math.max(score, 7_100);
  if (keywords.some((keyword) => keyword === query)) score = Math.max(score, 6_700);
  if (category === query || category.includes(query)) score = Math.max(score, 5_800);

  const queryTokens = query.split(' ');
  const titleTokens = title.split(' ');
  const aliasTokens = aliases.flatMap((value) => value.split(' '));
  const commandTokens = commands.flatMap((value) => value.split(' '));
  const keywordTokens = keywords.flatMap((value) => value.split(' '));
  const categoryTokens = category.split(' ');
  const descriptionTokens = description.split(' ');
  let matched = 0;

  for (const token of queryTokens) {
    const best = Math.max(
      tokenScore(token, titleTokens, 110),
      tokenScore(token, aliasTokens, 100),
      tokenScore(token, commandTokens, 88),
      tokenScore(token, keywordTokens, 72),
      tokenScore(token, categoryTokens, 55),
      tokenScore(token, descriptionTokens, 34),
    );
    if (best > 0) matched += 1;
    score += best;
  }

  if (matched === queryTokens.length) score += 1_200;
  else if (matched / queryTokens.length >= 0.7) score += 450;
  else if (matched / queryTokens.length < 0.5) score -= 500;
  if (item.popular) score += 5;
  return Math.max(0, score);
}

export function searchGuides(
  items: readonly GuideSearchItem[],
  query: string,
  limit = 12,
): GuideSearchResult[] {
  if (!normalizeSearchText(query)) return [];
  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((result) => result.score >= 80)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
    .slice(0, limit);
}
