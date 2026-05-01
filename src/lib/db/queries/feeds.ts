import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { and, eq, sql } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByUrl(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function createFeedFollow(userId: string, feedId: string) {
    await db.insert(feed_follows).values({ user_id: userId, feed_id: feedId });

    const [result] = await db.select().from(feed_follows).innerJoin(feeds, eq(feed_follows.feed_id, feeds.id)).innerJoin(users, eq(feed_follows.user_id, users.id)).where(eq(feed_follows.user_id, userId));
    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select().from(feed_follows).innerJoin(feeds, eq(feed_follows.feed_id, feeds.id)).innerJoin(users, eq(feed_follows.user_id, users.id)).where(eq(feed_follows.user_id, userId));
    return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    const [result] = await db.delete(feed_follows).where(and(eq(feed_follows.user_id, userId), eq(feed_follows.feed_id, feedId))).returning();

    return result;
}

export async function markFeedFetched(feedId: string) {
    const [result] = await db.update(feeds).set({ updatedAt: sql`NOW()`, last_fetched_at: sql`NOW()` }).where(eq(feeds.id, feedId)).returning();

    return result;
}

export async function getNextFeedToFetch() {
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`);

    return result;
}
