/**
 * Fetches images from Unsplash API based on keywords
 * @param keywords - Combined activity name + tags
 * @returns Array of image URLs (cover photo + gallery)
 */
export async function fetchUnsplashImages(keywords: string): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.error("UNSPLASH_ACCESS_KEY is not set");
    // Return fallback placeholder
    return [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    ];
  }

  // Make search flexible - use first few words if keywords too long
  const searchQuery = keywords.split(" ").slice(0, 5).join(" ");

  try {
    // Fetch more photos to ensure we have enough for cover + gallery (Previous Sessions)
    // Mock data shows 2-3 photos per activity, so we'll fetch 15 to have plenty
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=15`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      results: {
        urls: {
          regular: string;
          small: string;
        };
      }[];
    };

    if (!data.results || data.results.length === 0) {
      // Fallback to default placeholder
      return [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
      ];
    }

    // Return array of image URLs (regular size for cover, small for gallery)
    return data.results.map((photo) => photo.urls.regular);
  } catch (error) {
    console.error("Unsplash API error:", error);
    // Fallback to default placeholder
    return [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    ];
  }
}
