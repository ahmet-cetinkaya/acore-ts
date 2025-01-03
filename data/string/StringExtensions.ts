export default class StringExtensions {
  private static readonly specialChars: Record<string, string> = {
    "?": "",
    "!": "",
    ".": "",
    ",": "",
    ";": "",
    ":": "",
    "(": "",
    ")": "",
    "[": "",
    "]": "",
    "{": "",
    "}": "",
    "<": "",
    ">": "",
    "+": "",
    "=": "",
    "*": "",
    "&": "",
    "%": "",
    "#": "",
    "@": "",
    $: "",
    "^": "",
    "|": "",
    "~": "",
    "`": "",
    "\\": "",
    "/": "",
    _: "-",
    '"': "",
    "'": "",
    à: "a",
    á: "a",
    â: "a",
    ã: "a",
    ä: "a",
    å: "a",
    æ: "ae",
    ç: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ğ: "g",
    ı: "i",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ð: "d",
    ñ: "n",
    ò: "o",
    ó: "o",
    ô: "o",
    õ: "o",
    ö: "o",
    ø: "o",
    ù: "u",
    ú: "u",
    û: "u",
    ü: "u",
    ş: "s",
    ý: "y",
    þ: "th",
    ÿ: "y",
  };

  static slugify(title: string): string {
    let slug = title.toLowerCase();

    // Replace special characters
    for (const [key, value] of Object.entries(this.specialChars)) slug = slug.replaceAll(key, value);

    // Remove whitespaces
    slug = slug.replace(/\s+/g, "-");

    // Replace multiple hyphens with single one
    slug = slug.replace(/\-\-+/g, "-");

    // Remove leading/trailing hyphens
    slug = slug.replace(/^-+/, "").replace(/-+$/, "");

    return slug;
  }
}
