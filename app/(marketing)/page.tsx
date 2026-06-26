"use client";

import { useEffect, useState } from "react";

const SPECS: Record<"tr" | "en", object> = {
  tr: {
    theme: "light",
    lang: "tr",
    brand: "Dropcart",
    tagline: "dijital ürünleri keşfet, anında indir",
    outro: "Binlerce dijital ürün. Sıfır bekleme.",
    loaderSub: "dijital ürün marketi",
    ctaPrimary: "Ürünleri Keşfet",
    ctaSecondary: "Nasıl çalışır?",
    accent: "#EC9B78",
    particle: "shard",
    particleTint: "#C8603A",
    particleRoughness: 0.48,
    particleMetalness: 0.08,
    envColor: "#1B2D3A",
    fontLink:
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap",
    displayFamily: "'Fraunces', serif",
    layout: "left",
    heroAlign: "left",
    heroVAlign: "center",
    titleGradient: ["#F5C5A3", "#EC9B78", "#C8603A"],
    palette: ["#FBF7F2", "#F5C5A3", "#EC9B78", "#1B2D3A"],
    formChain: ["sphere", "bloom", "leaf", "vortex", "product", "disperse"],
    backgrounds: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190909_0efdb7a0-94f2-47f8-a78b-e791bbc9715e.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190911_3dffac10-515d-4ea3-8467-ef77d3bdfc9f.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_0f63abec-caab-478b-a494-bd0a04d6d56d.png",
    ],
    aboutHeading: "Yaratıcılar için <em>dijital market</em>.",
    about: [
      "E-kitabını, Notion şablonunu, Lightroom preset'ini veya online kursunu Dropcart'ta sat. Güvenli ödeme, anında otomatik teslimat — hiçbir teknik bilgi gerekmez.",
      "Komisyon yok, stok yok, karmaşıklık yok. Sadece sen ve alıcıların.",
    ],
    aboutBig: "Uyurken bile teslim eder.",
    shopHeading: "<em>Ürünleri</em> keşfet.",
    shopSub: "E-kitap · Şablon · Preset · Kurs",
    productMeta: "Dijital ürün · Anında teslimat",
    email: "info@dropcart.digital",
    footerFine: "Dropcart — dijital ürün marketi.",
    year: 2026,
    legal: "Dropcart tüm hakları saklıdır.",
    products: [
      {
        n: "E-Kitap",
        t: "Dijital kitap · PDF",
        form: "book",
        hex: "#EC9B78",
        price: "$29",
        img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190913_84f1f5c7-4663-47a7-b622-5f7b2b985e4c.png",
        world: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png",
        line: "Bilgini sayfalara dök, dünyaya ulaş.",
        d: "PDF formatında dijital kitaplarını sat. Alıcı ödeme yapar yapmaz indirme linki otomatik olarak e-postasına düşer.",
      },
      {
        n: "Şablon",
        t: "Notion · Figma · Excel",
        form: "slab",
        hex: "#C8603A",
        price: "$19",
        img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190913_29eb8a85-4995-4b8e-b8ae-05e08b946218.png",
        world: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190909_0efdb7a0-94f2-47f8-a78b-e791bbc9715e.png",
        line: "Bir kez yap, binlerce kez sat.",
        d: "Notion, Figma veya Excel şablonlarını yükle. Her satışta aynı kalitede dijital ürün, anında teslim.",
      },
      {
        n: "Online Kurs",
        t: "Video · Sertifika",
        form: "crystal",
        hex: "#A84330",
        price: "$99",
        img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190914_594d8983-9abb-45ad-be45-06159f7299ac.png",
        world: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190911_3dffac10-515d-4ea3-8467-ef77d3bdfc9f.png",
        line: "Uzmanlığını kurs olarak paketle.",
        d: "Video derslerini, PDF notlarını ve sertifikalarını tek bir kurs olarak sat. Dropcart erişimi otomatik yönetir.",
      },
    ],
  },
  en: {
    theme: "light",
    lang: "en",
    brand: "Dropcart",
    tagline: "discover digital products, download instantly",
    outro: "Thousands of digital products. Zero wait.",
    loaderSub: "digital product marketplace",
    ctaPrimary: "Explore Products",
    ctaSecondary: "How it works",
    accent: "#EC9B78",
    particle: "shard",
    particleTint: "#C8603A",
    particleRoughness: 0.48,
    particleMetalness: 0.08,
    envColor: "#1B2D3A",
    fontLink:
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap",
    displayFamily: "'Fraunces', serif",
    layout: "left",
    heroAlign: "left",
    heroVAlign: "center",
    titleGradient: ["#F5C5A3", "#EC9B78", "#C8603A"],
    palette: ["#FBF7F2", "#F5C5A3", "#EC9B78", "#1B2D3A"],
    formChain: ["sphere", "bloom", "leaf", "vortex", "product", "disperse"],
    backgrounds: [
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190909_0efdb7a0-94f2-47f8-a78b-e791bbc9715e.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190911_3dffac10-515d-4ea3-8467-ef77d3bdfc9f.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png",
      "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_0f63abec-caab-478b-a494-bd0a04d6d56d.png",
    ],
    aboutHeading: "The <em>digital marketplace</em> for creators.",
    about: [
      "Upload your ebook, Notion template, Lightroom preset or online course to Dropcart. Secure checkout, instant auto-delivery — no technical knowledge needed.",
      "No commission, no inventory, no complexity. Just you and your buyers.",
    ],
    aboutBig: "Delivers even while you sleep.",
    shopHeading: "Explore <em>products</em>.",
    shopSub: "Ebook · Template · Preset · Course",
    productMeta: "Digital product · Instant delivery",
    email: "info@dropcart.digital",
    footerFine: "Dropcart — the digital product marketplace.",
    year: 2026,
    legal: "All rights reserved by Dropcart.",
    products: [
      {
        n: "Ebook",
        t: "Digital book · PDF",
        form: "book",
        hex: "#EC9B78",
        price: "$29",
        img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190913_84f1f5c7-4663-47a7-b622-5f7b2b985e4c.png",
        world: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png",
        line: "Pour your knowledge onto the page.",
        d: "Sell your digital books in PDF format. The moment the buyer pays, the download link lands automatically in their inbox.",
      },
      {
        n: "Template",
        t: "Notion · Figma · Excel",
        form: "slab",
        hex: "#C8603A",
        price: "$19",
        img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190913_29eb8a85-4995-4b8e-b8ae-05e08b946218.png",
        world: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190909_0efdb7a0-94f2-47f8-a78b-e791bbc9715e.png",
        line: "Build once. Sell thousands of times.",
        d: "Upload your Notion, Figma or Excel templates. Same quality digital product, instant delivery, every single sale.",
      },
      {
        n: "Online Course",
        t: "Video · Certificate",
        form: "crystal",
        hex: "#A84330",
        price: "$99",
        img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190914_594d8983-9abb-45ad-be45-06159f7299ac.png",
        world: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190911_3dffac10-515d-4ea3-8467-ef77d3bdfc9f.png",
        line: "Package your expertise as a course.",
        d: "Sell your video lessons, PDF notes and certificates as one course. Dropcart manages access automatically.",
      },
    ],
  },
};

export default function MarketingPage() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"tr" | "en">("en");

  useEffect(() => {
    setMounted(true);
  }, []);

  const spec = SPECS[lang];
  const src = mounted
    ? `/engine.html#${encodeURIComponent(JSON.stringify(spec))}`
    : null;

  return (
    <main
      style={{
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: "#FBF7F2",
        position: "relative",
      }}
    >
      {src && (
        <iframe
          key={lang}
          src={src}
          title="Dropcart"
          style={{
            height: "100%",
            width: "100%",
            border: "none",
            display: "block",
          }}
        />
      )}

      {/* Dil toggle — iframe'in dışında, her zaman görünür */}
      {mounted && (
        <div
          style={{
            position: "fixed",
            top: "22px",
            right: "clamp(18px, 4vw, 42px)",
            zIndex: 9999,
            display: "flex",
            gap: "4px",
            background: "rgba(255,252,248,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: "999px",
            padding: "4px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          }}
        >
          {(["tr", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "7px 14px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: lang === l ? "#1B2D3A" : "transparent",
                color: lang === l ? "#EC9B78" : "#7A5A3A",
                fontWeight: lang === l ? 700 : 400,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
