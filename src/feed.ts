import { XMLParser } from "fast-xml-parser";


export async function fetchFeed(feedURL: string) {
    const headers = new Headers({ "User-Agent": "gator" });

    const resp = await fetch(feedURL, { method: "GET", headers: headers });
    const res = await resp.text();

    //console.log(`Feed request result: ${res}`);
    const xmlParser = new XMLParser({ processEntities: false });

    const doc = xmlParser.parse(res);
    let rss;
    if (doc.rss) {
        rss = doc.rss as RSSFeed;
    }
    if (!rss?.channel) {
        throw Error("Document channel is missing!");
    } else if (!rss.channel.title || !rss.channel.link || !rss.channel.description) {
        throw Error("Document metadata is missing!");
    }

    //console.log(rss.channel.item);
    let items: RSSItem[] = [];
    if (rss.channel.item !== null) {
        if (Array.isArray(rss.channel.item)) {
            items = rss.channel.item;
        } else {
            items = [rss.channel.item];
        }
    }
    //console.log(items);

    return items;
}

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};
