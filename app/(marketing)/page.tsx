"use client";

import { useEffect, useRef } from "react";

const SPEC = {
  brand: "Sellfold",
  tagline: "bilgini ürüne çevir",
  outro: "Dükkânını aç, uyurken kazan.",
  loaderSub: "dijital ürün platformu",
  ctaPrimary: "Dükkânı aç",
  ctaSecondary: "Nasıl çalışır?",
  accent: "#D96B4A",
  particle: "shard",
  particleTint: "#C8603A",
  particleRoughness: 0.48,
  particleMetalness: 0.08,
  envColor: "#C8603A",
  fontLink:
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap",
  displayFamily: "'Fraunces', serif",
  layout: "left",
  heroAlign: "left",
  heroVAlign: "center",
  titleGradient: ["#F5C5A3", "#D96B4A", "#A84330"],
  palette: ["#FBF7F2", "#F5C5A3", "#C8603A", "#3D1A0E"],
  formChain: ["sphere", "bloom", "leaf", "vortex", "product", "disperse"],
  backgrounds: [
    "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190909_0efdb7a0-94f2-47f8-a78b-e791bbc9715e.png",
    "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190911_3dffac10-515d-4ea3-8467-ef77d3bdfc9f.png",
    "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png",
    "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_0f63abec-caab-478b-a494-bd0a04d6d56d.png",
  ],
  aboutHeading: "İçerik üreticileri için <em>dijital dükkân</em>.",
  about: [
    "E-kitabını, Notion şablonunu, Lightroom preset'ini veya online kursunu yükle. Sellfold güzel bir ürün sayfası, güvenli kart ödemesi ve anında otomatik teslimat sunar — hiçbir teknik bilgi gerekmez.",
    "Komisyon yok, stok yok, karmaşıklık yok. Sadece sen ve alıcıların — araya giren kimse olmadan.",
  ],
  aboutBig: "Uyurken bile teslim eder.",
  shopHeading: "<em>Ürünleri</em> keşfet.",
  shopSub: "E-kitap · Şablon · Preset · Kurs",
  productMeta: "Dijital ürün · Anında teslimat",
  email: "hello@sellfold.com",
  footerFine: "Sellfold — yaratıcılar için dijital ürün platformu.",
  year: 2026,
  legal: "Sellfold tüm hakları saklıdır.",
  products: [
    {
      n: "E-Kitap",
      t: "Dijital kitap · PDF",
      form: "book",
      hex: "#D96B4A",
      price: "$29",
      img: "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190913_84f1f5c7-4663-47a7-b622-5f7b2b985e4c.png",
      world:
        "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190912_2de16b33-f1b7-418e-9092-201248e24ebb.png",
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
      world:
        "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190909_0efdb7a0-94f2-47f8-a78b-e791bbc9715e.png",
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
      world:
        "https://d8j0ntlcm91z4.cloudfront.net/user_30XxtVGDxC1u9yMn0otLBrsAcLg/hf_20260625_190911_3dffac10-515d-4ea3-8467-ef77d3bdfc9f.png",
      line: "Uzmanlığını kurs olarak paketle.",
      d: "Video derslerini, PDF notlarını ve sertifikalarını tek bir kurs olarak sat. Sellfold erişimi otomatik yönetir.",
    },
  ],
};

export default function MarketingPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build the engine src purely as a string — no browser globals at module scope
  const src =
    typeof window !== "undefined"
      ? `/engine.html#${encodeURIComponent(JSON.stringify(SPEC))}`
      : "";

  return (
    <main style={{ height: "100dvh", width: "100%", overflow: "hidden", background: "#FBF7F2" }}>
      {src && (
        <iframe
          ref={iframeRef}
          src={src}
          title="Sellfold"
          style={{ height: "100%", width: "100%", border: "none", display: "block" }}
        />
      )}
    </main>
  );
}

