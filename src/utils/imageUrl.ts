/**
 * Utility for resolving and falling back package image URLs
 * Ensures all parcel photos and mini thumbnails display flawlessly
 * in both development, Google Cloud, and production Vercel environments.
 */

export function resolvePackageImage(url?: string, category?: string): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    if (category === 'anak') return '/assets/images/parcel_anak_snack.jpg';
    if (category === 'pilihan') return '/assets/images/parcel_sultan_sembako.jpg';
    return '/assets/images/parcel_bunda_sembako.jpg';
  }

  let clean = url.trim();

  // Convert legacy /src/assets/images/ to public /assets/images/
  if (clean.startsWith('/src/assets/images/')) {
    clean = clean.replace('/src/assets/images/', '/assets/images/');
  } else if (clean.startsWith('src/assets/images/')) {
    clean = '/' + clean.replace('src/assets/images/', 'assets/images/');
  }

  return clean;
}

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string
) {
  const target = e.currentTarget;
  if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';
    if (category === 'anak') {
      target.src = '/assets/images/parcel_anak_snack.jpg';
    } else if (category === 'pilihan') {
      target.src = '/assets/images/parcel_sultan_sembako.jpg';
    } else {
      target.src = '/assets/images/parcel_bunda_sembako.jpg';
    }
  }
}
