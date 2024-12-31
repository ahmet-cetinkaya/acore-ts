export default class StringExtensions {
  static slugify(title: string): string {
    return title
      .toLowerCase()
      // Normalize Turkish characters and other diacritics
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace specific Turkish characters
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove all non-word chars (keeping hyphens)
      .replace(/[^\w\-]+/g, '')
      // Replace multiple hyphens with single one
      .replace(/\-\-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
