export function getUploadUrl(path: string | undefined | null): string {
  if (!path || path.trim() === '' || path === '#') {
    return '/uploads/gallery/pesantren1.png';
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (path.startsWith('/uploads/')) {
    return path;
  }
  if (path.startsWith('/images/galery/')) {
    return `/uploads/gallery/${path.slice('/images/galery/'.length)}`;
  }
  if (path.startsWith('/images/gallery/')) {
    return `/uploads/gallery/${path.slice('/images/gallery/'.length)}`;
  }
  if (path.startsWith('/images/')) {
    return `/uploads/${path.slice('/images/'.length)}`;
  }
  if (path.startsWith('/logo/')) {
    return `/uploads/logo/${path.slice('/logo/'.length)}`;
  }
  return `/uploads/${path.replace(/^\//, '')}`;
}

export const imgUrl = getUploadUrl;
