import {
    SourceManga,
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    TagSection,
    SearchRequest,
    PagedResults,
    SourceInfo,
    ContentRating,
    BadgeColor,
    Request,
    Response,
    SourceIntents,
    ChapterProviding,
    MangaProviding,
    SearchResultsProviding,
    HomePageSectionsProviding,
} from "@paperback/types";

import {
    DOMAIN,
    getChapterPages,
    getChapters,
    getHomePageLatest,
    getHomePagePopular,
    getMangaDetails,
    getSearchResults,
    getTags,
} from "./ScanMangaVFParser";

export const ScanMangaVFInfo: SourceInfo = {
    version: "1.0.0",
    name: "ScanMangaVF",
    icon: "navalex.png",
    author: "Navalex",
    authorWebsite: "https://github.com/navalex",
    description: "Extension to use scanmanga-vf french website",
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: DOMAIN,
    sourceTags: [
        {
            text: "Fench",
            type: BadgeColor.BLUE,
        },
    ],
    intents: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};

export class ScanMangaVF
    implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding
{
    constructor(private cheerio: CheerioAPI) {}

    readonly requestManager = App.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 300000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        "user-agent": await this.requestManager.getDefaultUserAgent(),
                        referer: `${DOMAIN}/`,
                    },
                };
                return request;
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response;
            },
        },
    });

    getMangaShareUrl(mangaId: string): string {
        return `${DOMAIN}/manga/${mangaId}`;
    }

    async getSearchTags(): Promise<TagSection[]> {
        const request = App.createRequest({
            url: `${DOMAIN}/manga-list`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        const tags = getTags($);

        return [
            App.createTagSection({
                id: "genres",
                label: "Genres",
                tags: tags ?? [],
            }),
        ];
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const section1 = App.createHomeSection({
            id: "latest_popular_manga",
            title: "Dernier Manga Populaire",
            containsMoreItems: false,
            type: HomeSectionType.featured,
        });
        const section2 = App.createHomeSection({
            id: "latest_updates",
            title: "Derniers Manga Ajoutés",
            containsMoreItems: false,
            type: HomeSectionType.singleRowLarge,
        });

        const request = App.createRequest({
            url: `${DOMAIN}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        section1.items = getHomePagePopular($);
        section2.items = getHomePageLatest($);

        sectionCallback(section1);
        sectionCallback(section2);
    }

    async getViewMoreItems(_homepageSectionId: string, _metadata: any): Promise<PagedResults> {
        throw new Error("Requested to getViewMoreItems for a section ID which doesn't exist");
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        const request = App.createRequest({
            url: `${DOMAIN}/manga/${mangaId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        return getMangaDetails($, mangaId);
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = App.createRequest({
            url: `${DOMAIN}/manga/${mangaId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        return getChapters($);
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = App.createRequest({
            url: `${chapterId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        const pages = getChapterPages($);

        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const searchPage: number = metadata?.page ?? 1;

        const search = query.title?.replace(/ /g, "+").replace(/[’'´]/g, "%27") ?? "";
        const param = `filterList?page=${searchPage}&tag=&alpha=${search}&sortBy=name&asc=true`;
        const request = App.createRequest({
            url: `${DOMAIN}/${param}`,
            method: "GET",
        });

        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data as string);

        const albums = getSearchResults($);

        return App.createPagedResults({
            results: albums,
            metadata,
        });
    }

    CloudFlareError(status: number): void {
        if (status == 503 || status == 403) {
            throw new Error(
                `CLOUDFLARE BYPASS ERROR:\nPlease go to the homepage of <${ScanMangaVFInfo.name}> and press the cloud icon.`
            );
        }
    }

    async getCloudflareBypassRequestAsync(): Promise<Request> {
        return App.createRequest({
            url: DOMAIN,
            method: "GET",
            headers: {
                referer: `${DOMAIN}/`,
                "user-agent": await this.requestManager.getDefaultUserAgent(),
            },
        });
    }
}
