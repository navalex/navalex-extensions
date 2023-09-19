import { Chapter, PartialSourceManga, SourceManga, Tag, TagSection } from "@paperback/types";

export const DOMAIN = "https://scanmanga-vf.me";

export function getTags($: CheerioStatic): Tag[] {
    const arrayTags: Tag[] = [];

    for (let item of $(".list-category a").toArray()) {
        let id = ($(item).attr("href") ?? "").split("/").pop() ?? "";
        let label = capitalizeFirstLetter(decodeHTMLEntity($(item).text()));

        arrayTags.push(App.createTag({ id, label }));
    }

    return arrayTags;
}

export function getHomePagePopular($: CheerioStatic): PartialSourceManga[] {
    const items: PartialSourceManga[] = [];
    const list = $(".hot-thumbnails li").toArray();

    console.log("Looking for Popular", list);

    for (const item of list) {
        let url = $("a", item).first().attr("href")?.split("/")[4];
        let image = $("img", item).attr("src");
        let title = decodeHTMLEntity($(".manga-name a", item).first().text());
        let subtitle = decodeHTMLEntity($("p", item).text().trim());

        if (typeof url === "undefined" || typeof image === "undefined") continue;

        items.push(
            App.createPartialSourceManga({
                mangaId: url,
                image: image,
                title: title,
                subtitle: subtitle,
            })
        );
    }
    return items;
}

export function getHomePageLatest($: CheerioStatic): PartialSourceManga[] {
    const items: PartialSourceManga[] = [];
    const list = $(".mangalist .manga-item").toArray();

    for (const item of list) {
        let url = $("a", item).first().attr("href")?.split("/").pop();
        let image = getMangaThumbnail(url);
        let title = decodeHTMLEntity($("a", item).first().text());
        let subtitle =
            "Chapitre " +
            decodeHTMLEntity(
                ($("a", item)
                    .eq(1)
                    .text()
                    .trim()
                    .match(/(\d)+[.]?(\d)*/gm) ?? "")[0]
            );

        if (typeof url === "undefined" || typeof image === "undefined") continue;

        items.push(
            App.createPartialSourceManga({
                mangaId: url,
                image: image,
                title: title,
                subtitle: subtitle,
            })
        );
    }
    return items;
}

export function getMangaDetails($: CheerioStatic, mangaId: string): SourceManga {
    let titles = [decodeHTMLEntity($(".widget-title").eq(0).text().trim())];
    const image = $(".img-responsive").attr("src") || "";
    let status = "Unknown",
        author = "",
        artist = "";
    // Details container
    const panel = $(".dl-horizontal");
    // Status
    switch ($('dt:contains("Statut")', panel).next().text().trim()) {
        case "En cours":
            status = "Ongoing";
            break;
        case "Terminé":
            status = "Completed";
            break;
    }
    // Other titles
    let othersTitles = $('dt:contains("Appel\u00E9 aussi")', panel).next().text().trim().split(",");
    for (let title of othersTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    // Author & Artist
    const arrayTags: Tag[] = [];
    author =
        $('dt:contains("Auteur(s)")', panel).next().text().trim() != ""
            ? $('dt:contains("Auteur(s)")', panel).next().text().trim()
            : "";
    artist =
        $('dt:contains("Artist(s)")', panel).next().text().trim() != ""
            ? $('dt:contains("Artist(s)")', panel).next().text().trim()
            : "";
    // Set tags
    if ($('dt:contains("Catégories")', panel).length > 0) {
        const categories = $('dt:contains("Catgories")', panel).next().text().trim().split(",") ?? "";
        for (const category of categories) {
            const label = capitalizeFirstLetter(decodeHTMLEntity(category.trim()));
            const id = category.replace(" ", "-").toLowerCase().trim() ?? label;
            arrayTags.push({ id: id, label: label });
        }
    }
    // Tags
    if ($('dt:contains("Genres")', panel).length > 0) {
        const tags = $('dt:contains("Genres")', panel).next().text().trim().split(",");
        for (const tag of tags) {
            const label = tag.replace(/(\r\n|\n|\r)/gm, "").trim();
            const id =
                tag
                    .replace(/(\r\n|\n|\r)/gm, "")
                    .trim()
                    .replace(" ", "-")
                    .toLowerCase() ?? label;
            if (!arrayTags.includes({ id: id, label: label })) {
                arrayTags.push({ id: id, label: label });
            }
        }
    }
    const tagSections: TagSection[] = [
        App.createTagSection({ id: "0", label: "Genres", tags: arrayTags.map((x) => App.createTag(x)) }),
    ];
    const desc = decodeHTMLEntity($(".well").children("p").text().trim());
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles,
            image,
            status,
            artist,
            author,
            tags: tagSections,
            desc: desc,
        }),
    });
}

export function getChapters($: CheerioStatic): Chapter[] {
    const chapters: Chapter[] = [];
    const arrChapters = $(".chapters li:not(.volume)").toArray();
    for (const chapter of arrChapters) {
        const id = $("a", chapter).attr("href") ?? "";
        const name = "Chapitre " + decodeHTMLEntity($("a", chapter).text().split(" ").pop() ?? "");
        const chapNum = Number(id.split("/").pop());
        const time = new Date($(".date-chapter-title-rtl", chapter).text() ?? "");
        chapters.push(
            App.createChapter({
                id,
                name,
                langCode: "French",
                chapNum,
                time,
            })
        );
    }
    return chapters;
}

export function getChapterPages($: CheerioStatic): string[] {
    const pages: string[] = [];
    const chapterList = $("#all img").toArray();

    for (const obj of chapterList) {
        const imageUrl = $(obj).attr("data-src");
        if (!imageUrl) continue;
        pages.push(imageUrl.trim());
    }
    return pages;
}

export function getSearchResults($: CheerioStatic): PartialSourceManga[] {
    const results: PartialSourceManga[] = [];
    for (const item of $(".media").toArray()) {
        const url = $("h5 a", item).attr("href")?.split("/")[4];
        const image = $("img", item).attr("src");
        const title = decodeHTMLEntity($("h5", item).text());
        const subtitle = "Chapitre " + decodeHTMLEntity($("a", item).eq(2).text().trim().replace(/#/g, ""));
        if (typeof url === "undefined" || typeof image === "undefined") continue;
        results.push(
            App.createPartialSourceManga({
                mangaId: url,
                image: image,
                title: title,
                subtitle: subtitle,
            })
        );
    }
    return results;
}

function decodeHTMLEntity(str: string) {
    return str.replace(/&#(\d+);/g, function (_match, dec) {
        return String.fromCharCode(dec);
    });
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getMangaThumbnail(mangaID: string | undefined) {
    return `${DOMAIN}/uploads/manga/${mangaID}.jpg`;
}
