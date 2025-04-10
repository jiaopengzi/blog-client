/**
 * @FilePath     : \blog-client\src\components\common\icons\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

// 图标字典
export interface IconMap {
    [key: string]: string
}

// 图标 json 数据 格式
export interface IconJSON {
    id: string
    name: string
    font_family: string
    css_prefix_text: string
    description: string
    glyphs: [
        {
            icon_id: string
            name: string
            font_class: string
            unicode: string
            unicode_decimal: number
        },
    ]
}

// 枚举值使用小横线命名法 例如: 'wechat-official-account'
export enum IconKeys {
    Announcement = "announcement",
    Archive = "archive",
    Article = "article",
    Backup = "backup",
    Bill = "bill",
    Bold = "bold",
    Chart = "chart",
    Clear = "clear",
    Close = "close",
    CodeBlock = "code-block",
    CodeInline = "code-inline",
    Collapse = "collapse",
    Comment = "comment",
    Copy = "copy",
    Dashboard = "dashboard",
    Data = "data",
    DataAnalysis = "data-analysis",
    Demo = "demo",
    Desktop = "desktop",
    Divider = "divider",
    Doc = "doc",
    Edit = "edit",
    Editor = "editor",
    Emoji = "emoji",
    Excel = "excel",
    // ExitFullscreen = "exit-fullscreen",
    Favorite = "favorite",
    Follow = "follow",
    Footnote = "footnote",
    Fullscreen = "fullscreen",
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    Help = "help",
    Home = "home",
    Hot = "hot",
    Hr = "hr",
    Html = "html",
    Image = "image",
    Info = "info",
    Italic = "italic",
    Label = "label",
    Link = "link",
    Login = "login",
    Mark = "mark",
    Markdown = "markdown",
    MathBlock = "math-block",
    MathInline = "math-inline",
    Media = "media",
    Menu = "menu",
    Mobile = "mobile",
    Model = "model",
    Money = "money",
    New = "new",
    Notification = "notification",
    Ol = "ol",
    Overview = "overview",
    Page = "page",
    PayContent = "pay-content",
    Pdf = "pdf",
    Permission = "permission",
    Post = "post",
    Preview = "preview",
    Publish = "publish",
    Qq = "qq",
    Quote = "quote",
    Random = "random",
    Recommended = "recommended",
    Redo = "redo",
    Register = "register",
    Save = "save",
    Scroll = "scroll",
    Search = "search",
    Shop = "shop",
    ShortLink = "short-link",
    Strikethrough = "strikethrough",
    Subscript = "subscript",
    Superscript = "superscript",
    Table = "table",
    TaskList = "task-list",
    Test = "test",
    Toc = "toc",
    Tool = "tool",
    Ul = "ul",
    Undo = "undo",
    User = "user",
    Video = "video",
    Vim = "vim",
    Vip = "vip",
    VipRed = "vip-red",
    Wechat = "wechat",
    WechatOfficialAccount = "wechat-official-account",
    Welfare = "welfare",
    Zip = "zip",
    WebFullscreen = "web-fullscreen",
    PictureInPicture = "picture-in-picture",
    Play = "play",
    Mute = "mute",
    Loading = "loading",
    Unmute = "unmute",
    Pause = "pause",
    Setting = "setting",
    ThemeDark = "theme-dark",
    ThemeLight = "theme-light",
    Social = "social",
    Upload = "upload",
    Like = "like",
    Collect = "collect",
    Words = "words",
    Share = "share",
    View = "view",
    Time = "time",
    Hourglass = "hourglass",
}
