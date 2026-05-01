import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feed_follows, posts } from "../schema";

export async function createPost(title: string, url: string, description: string, publishedAt: Date, feedId: string) {
    const [result] = await db.insert(posts)
        .values({ title: title, url: url, description: description, publishedAt: publishedAt, feed_id: feedId }).returning();

    return result;
}

export async function getPostsForUser(userId: string, postsNr: number) {
    console.log(`Posts nr: ${postsNr}`);
    const result = await db.select().from(posts).innerJoin(feed_follows, eq(feed_follows.user_id, userId)).where(and(eq(feed_follows.user_id, userId), eq(posts.feed_id, feed_follows.feed_id))).orderBy(sql`${posts.createdAt} DESC`).limit(postsNr);

    return result;
}
