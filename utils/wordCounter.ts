/**
 * A class for counting words in various text formats
 * Supports HTML, Markdown, raw text, and formatted text
 */
export class WordCounter {
  /**
   * Counts words in a string, regardless of format
   * @param text The input text to count words in
   * @param options Optional configuration
   * @returns The number of words in the text
   */
  public countWords(text: string, options: WordCountOptions = {}): number {
    if (!text || text.trim() === "") {
      return 0;
    }

    // Process the text based on its format
    const processedText = this.preprocessText(text, options);

    // Count words in the processed text
    return this.countWordsInCleanText(processedText);
  }

  /**
   * Preprocesses text based on its format
   * @param text The input text
   * @param options Configuration options
   * @returns Cleaned text with formatting removed
   */
  private preprocessText(text: string, options: WordCountOptions): string {
    let processedText = text;

    // Remove HTML tags if enabled
    if (options.stripHtml !== false) {
      processedText = this.stripHtmlTags(processedText, options);
    }

    // Remove Markdown formatting if enabled
    if (options.stripMarkdown !== false) {
      processedText = this.stripMarkdownFormatting(processedText, options);
    }

    // Handle code blocks specially
    if (options.countCodeBlocks === false) {
      processedText = this.removeCodeBlocks(processedText);
    }

    return processedText;
  }

  /**
   * Strips HTML tags from text
   * @param text Text with potential HTML tags
   * @param options Configuration options
   * @returns Text with HTML tags removed
   */
  private stripHtmlTags(text: string, options: WordCountOptions): string {
    // Special handling for image alt text
    if (options.countImageAlt !== false) {
      text = text.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, " $1 ");
    } else {
      text = text.replace(/<img[^>]*>/gi, " ");
    }

    // Handle links specially
    if (options.countLinkUrls) {
      // Replace <a> tags with both text and href
      text = text.replace(
        /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi,
        "$2 $1",
      );
    } else {
      // Keep only the link text
      text = text.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");
    }

    // Handle other media elements
    text = text.replace(
      /<(video|audio|iframe|canvas|svg)[^>]*>(.*?)<\/\1>/gi,
      options.countMediaElements ? " media element " : " ",
    );

    // Remove remaining HTML tags
    text = text.replace(/<[^>]*>/g, " ");

    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[a-zA-Z0-9]+;/g, " "); // Handle other entities

    return text;
  }

  /**
   * Strips Markdown formatting from text
   * @param text Text with potential Markdown formatting
   * @param options Configuration options
   * @returns Text with Markdown formatting removed
   */
  private stripMarkdownFormatting(
    text: string,
    options: WordCountOptions,
  ): string {
    // Remove headers
    text = text.replace(/#{1,6}\s+/g, "");

    // Remove bold and italic formatting
    text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
    text = text.replace(/(\*|_)(.*?)\1/g, "$2");

    // Handle links based on options
    if (options.countLinkUrls) {
      // Keep both link text and URL
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 $2");
    } else {
      // Keep only link text
      text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    }

    // Handle images based on options
    if (options.countImageAlt !== false) {
      // Keep alt text from images
      text = text.replace(/!\[([^\]]+)\]\([^)]+\)/g, "$1");
    } else {
      // Remove images completely
      text = text.replace(/!\[([^\]]+)\]\([^)]+\)/g, "");
    }

    // Remove blockquotes
    text = text.replace(/^\s*>\s+/gm, "");

    // Remove horizontal rules
    text = text.replace(/^(\s*[*-]\s*){3,}$/gm, "");

    // Handle HTML embedded in Markdown
    if (options.stripHtml !== false) {
      text = this.stripHtmlTags(text, options);
    }

    return text;
  }

  /**
   * Removes code blocks from text
   * @param text Text with potential code blocks
   * @returns Text with code blocks removed
   */
  private removeCodeBlocks(text: string): string {
    // Remove code blocks with backticks (```)
    text = text.replace(/```[\s\S]*?```/g, "");

    // Remove inline code blocks with single backticks
    text = text.replace(/`[^`]*`/g, "");

    // Remove HTML code blocks
    text = text.replace(/<code>[\s\S]*?<\/code>/gi, "");
    text = text.replace(/<pre>[\s\S]*?<\/pre>/gi, "");

    return text;
  }

  /**
   * Counts words in cleaned text
   * @param text Text that has been preprocessed
   * @returns The number of words in the text
   */
  private countWordsInCleanText(text: string): number {
    // Handle special cases like URLs
    text = text.replace(/https?:\/\/\S+/g, " url ");

    // Split by whitespace and filter out empty strings
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }

  /**
   * Analyzes text and returns detailed statistics
   * @param text The input text
   * @param options Configuration options
   * @returns Detailed word count statistics
   */
  public analyzeText(
    text: string,
    options: WordCountOptions = {},
  ): WordCountStats {
    if (!text || text.trim() === "") {
      return {
        totalWords: 0,
        uniqueWords: 0,
        sentences: 0,
        averageWordLength: 0,
        wordFrequency: {},
      };
    }

    const processedText = this.preprocessText(text, options);
    const words = processedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Count unique words
    const wordMap: Record<string, number> = {};
    let totalCharacters = 0;

    words.forEach((word) => {
      const normalizedWord = word.toLowerCase().replace(/[.,!?;:'"()]/g, "");
      if (normalizedWord.length > 0) {
        totalCharacters += normalizedWord.length;
        wordMap[normalizedWord] = (wordMap[normalizedWord] || 0) + 1;
      }
    });

    // Count sentences (roughly)
    const sentenceCount = processedText.split(/[.!?]+\s+/).length;

    return {
      totalWords: words.length,
      uniqueWords: Object.keys(wordMap).length,
      sentences: sentenceCount,
      averageWordLength: words.length > 0 ? totalCharacters / words.length : 0,
      wordFrequency: wordMap,
    };
  }
}

/**
 * Configuration options for word counting
 */
export interface WordCountOptions {
  /** Whether to strip HTML tags (default: true) */
  stripHtml?: boolean;
  /** Whether to strip Markdown formatting (default: true) */
  stripMarkdown?: boolean;
  /** Whether to count words in code blocks (default: true) */
  countCodeBlocks?: boolean;
  /** Whether to count alt text in images (default: true) */
  countImageAlt?: boolean;
  /** Whether to count URLs in links (default: false) */
  countLinkUrls?: boolean;
  /** Whether to count media elements as words (default: false) */
  countMediaElements?: boolean;
}

/**
 * Detailed statistics about word counts
 */
export interface WordCountStats {
  /** Total number of words */
  totalWords: number;
  /** Number of unique words */
  uniqueWords: number;
  /** Number of sentences */
  sentences: number;
  /** Average word length */
  averageWordLength: number;
  /** Frequency of each word */
  wordFrequency: Record<string, number>;
}
