import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) ?? [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function SEO({ title, description, canonicalPath }: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const safeTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
    const safeDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;

    document.title = safeTitle;
    setMeta('meta[name="description"]', "content", safeDesc);
    setMeta('meta[property="og:title"]', "content", safeTitle);
    setMeta('meta[property="og:description"]', "content", safeDesc);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", safeTitle);
    setMeta('meta[name="twitter:description"]', "content", safeDesc);

    const url = `${window.location.origin}${canonicalPath ?? location.pathname}`;
    setMeta('meta[property="og:url"]', "content", url);

    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }, [title, description, canonicalPath, location.pathname]);

  return null;
}
