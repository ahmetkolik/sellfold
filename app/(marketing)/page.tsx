"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight, ArrowRight, Store, Zap, CreditCard, Mail, Users, TicketPercent,
  Check, Sparkles, Plus, Minus, X, BookOpen, LayoutTemplate, SlidersHorizontal,
  GraduationCap, Star, TrendingUp,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

const moduleIcons = [Store, Zap, CreditCard, Mail, Users, TicketPercent];

const content = {
  tr: {
    nav: ["Ne yapar", "Nasıl çalışır", "Fiyatlar"], signin: "Giriş yap", demo: "Demoyu dene",
    badge: "Yaratıcılar için dijital dükkân",
    h1a: "Bilgini ürüne çevir.", h1b: "Uyurken bile", h1c: "satsın.",
    sub: "Sellfold, e-kitabını, şablonunu, presetini ve kursunu satışa açar. Güzel bir ürün sayfası, kart ödemesi ve anında otomatik teslimat — tek panelde. Komisyon avı yok, stok yok, kargo yok.",
    cta1: "Dükkânı aç", cta2: "Nasıl göründüğüne bak", note: "· kart yok · 60 saniyelik demo",
    proofAvatars: "1.200+ yaratıcı ürünlerini Sellfold'den satıyor.",
    /* interactive inline demo */
    tryKicker: "Anında teslim · canlı dene",
    tryH: ["Satın al'a bas,", "teslimatı izle."],
    tryBody: "Aşağıdaki gerçek bir ürün kartı. \"Satın al\"a bas; ödemenin geçişini, dosyanın paketlenişini ve indirme linkinin alıcıya düşüşünü saniyeler içinde izle. Sayaç da artar — tıpkı gerçek dükkânında olduğu gibi.",
    tryProduct: "Sinematik Lightroom Preset Paketi", tryType: "Preset · 24 LUT",
    tryBuy: "Satın al", tryProcessing: "Ödeme alınıyor…", tryPacking: "Dosya paketleniyor…",
    tryDelivered: "Teslim edildi", tryDownload: "İndirme linki hazır", tryReset: "Tekrar dene",
    trySoldLabel: "bugünkü satış", tryRevLabel: "bugünkü gelir", tryEmailLine: "elif@studio.co adresine gönderildi",
    trySteps: ["Kart çekildi", "Dosya güvenli linke sarıldı", "Markalı e-posta yollandı"],
    /* use cases / personas */
    useKicker: "Kimler satıyor",
    useH: ["Bir dosyan varsa,", "Sellfold'ün var demektir."],
    useCases: [
      { tag: "Tasarımcı", t: "Şablon & kit satıcısı", b: "Notion, Figma, Canva şablonlarını paketle; her satışta dosya otomatik teslim olsun.", emoji: "🎨", hue: "32" },
      { tag: "Yazar", t: "E-kitap & rehber", b: "PDF rehberini, çalışma kitabını ya da serini yükle; lansman kuponuyla satışı başlat.", emoji: "📚", hue: "70" },
      { tag: "Müzisyen", t: "Ses & sample paketi", b: "Sample, preset, beat paketlerini sat; alıcı saniyeler içinde indirir, sen sahnede ol.", emoji: "🎧", hue: "300" },
      { tag: "Eğitmen", t: "Kurs & topluluk", b: "Video kursunu, kontenjanlı kohortunu ve Discord erişimini tek üründe sun.", emoji: "🎓", hue: "152" },
    ],
    /* product types showcase */
    typesKicker: "Ne satabilirsin",
    typesH: ["Dijital olan her şey,", "tek dükkânda."],
    typesBody: "Tek dosya, bir link ya da abonelik — Sellfold hepsini bir ürün sayfasına ve otomatik teslimata dönüştürür.",
    types: [
      { t: "E-kitap", b: "PDF, EPUB rehberler", emoji: "📘", hue: "70" },
      { t: "Şablon", b: "Notion, Figma, Canva", emoji: "🗂️", hue: "32" },
      { t: "Preset", b: "Lightroom, LUT, filtre", emoji: "🎞️", hue: "350" },
      { t: "Kurs", b: "Video dersler, kohort", emoji: "🎓", hue: "152" },
      { t: "Lisans", b: "Yazılım, font, eklenti", emoji: "🔑", hue: "250" },
      { t: "Ses", b: "Sample, beat, podcast", emoji: "🎧", hue: "300" },
    ],
    marqueeTitle: "Sellfold her dijital ürünü satar",
    marquee: ["E-kitap", "Notion şablonu", "Lightroom preset", "Video kurs", "Figma kiti", "Ses paketi", "İkon seti", "Çalışma kitabı", "LUT paketi", "Topluluk", "Prompt paketi", "PDF rehber"],
    problemKicker: "Kaos",
    problemH: ["Gumroad %10 alıyor.", "Dosyayı elle yollamak yoruyor."],
    problemBody: "İndirim kodu Notion'da, dosya Drive'da, ödeme DM'de, fatura aklında... Her satışta linkleri tek tek kopyalıyorsun, gece 2'de gelen siparişi sabah görüyorsun. Sellfold bütün bu işi tek panele ve sıfır el emeğine indirir.",
    problemStats: [
      { n: "%10", l: "platformların aldığı komisyon" },
      { n: "6 sa", l: "elle teslimde ortalama gecikme" },
      { n: "4 araç", l: "satış için açık duran sekme" },
      { n: "%38", l: "yavaş teslimde iade isteyen alıcı" },
    ],
    whatKicker: "Ne yapar",
    whatH: ["Bir e-ticaret ekibi kadar iş,", "tek panelde, sessizce."],
    modules: [
      { t: "Ürün sayfaları", b: "Her ürüne kapak, açıklama, fiyat ve önizleme. Saniyeler içinde yayında, mobilde kusursuz, SEO uyumlu." },
      { t: "Anında teslimat", b: "Ödeme onaylandığı an dosya ya da link alıcının mailine düşer. Sen uyurken bile teslim olur." },
      { t: "Kart ile ödeme", b: "Stripe ile güvenli ödeme — tek seferlik ya da abonelik. Para araya kimse girmeden senin hesabına." },
      { t: "E-posta teslimi", b: "Markalı teslimat e-postaları Resend ile gider; indirme linki, kupon ve teşekkür notu dahil." },
      { t: "Müşteri defteri", b: "Kim ne aldı, kaç kez döndü, ne kadar harcadı — hepsi tek listede, tek tıkla dışa aktarılabilir." },
      { t: "Kupon & paket", b: "İndirim kodu üret, ürünleri paketle, lansman fiyatı koy. Satışı sen yönlendir." },
    ],
    deepKicker: "Yakından bak",
    deepH: ["Ödeme geçti.", "Gerisi sana kalmadı."],
    deepBody: "Bir alıcı kartıyla öder ödemez Sellfold zinciri tek başına yürütür: ödemeyi doğrular, dosyayı güvenli bir linke paketler, markalı e-postayı yollar, müşteriyi deftere yazar ve geliri panele işler. Sen telefona bile bakmazsın.",
    deepSteps: [
      { t: "Ödeme onaylandı", b: "Stripe kartı çeker; para doğrudan senin hesabına.", icon: CreditCard },
      { t: "Dosya paketlendi", b: "Ürün güvenli, süreli bir indirme linkine sarılır.", icon: Zap },
      { t: "E-posta gönderildi", b: "Markalı teslimat maili alıcının kutusuna düşer.", icon: Mail },
      { t: "Deftere yazıldı", b: "Müşteri ve satış otomatik kaydedilir, gelir güncellenir.", icon: Users },
    ],
    howKicker: "Üç adım",
    howH: ["Yüklemekten ilk satışa,", "öğleden önce."],
    steps: [
      { n: "01", t: "Ürünü yükle", b: "Dosyanı sürükle, kapak ve fiyat ekle, türünü seç. Ürün sayfan kendiliğinden hazırlanır." },
      { n: "02", t: "Linki paylaş", b: "Sellfold linkini bio'na, story'ne, bültenine koy. İsteyen tek tıkla kartıyla öder." },
      { n: "03", t: "Otomatik teslim", b: "Ödeme geçer geçmez ürün teslim olur, para hesabına düşer, müşteri defterine yazılır. Sen hiçbir şey yapmazsın." },
    ],
    compareKicker: "Karşılaştır",
    compareH: ["Aynı ürün,", "üç farklı dükkân."],
    compareCols: ["Gumroad", "Etsy", "Sellfold"],
    compareTable: [
      { f: "Satış komisyonu", v: ["%10'a kadar", "%6,5 + liste ücreti", "%0 (Üretici)"] },
      { f: "Anında otomatik teslim", v: ["kısmen", "elle", "tam"] },
      { f: "Markalı teslim e-postası", v: ["hayır", "hayır", "evet"] },
      { f: "Kupon & paket", v: ["evet", "sınırlı", "evet"] },
      { f: "Abonelik ürünleri", v: ["evet", "hayır", "evet"] },
      { f: "Müşteri listesi senin", v: ["kısmen", "hayır", "evet"] },
      { f: "Özel alan adı & marka", v: ["ek paket", "hayır", "dahil"] },
      { f: "Türkçe panel & ₺ ödeme", v: ["hayır", "kısmi", "evet"] },
    ],
    proof: [
      { big: "%0", l: "satış komisyonu", c: "Üretici planında, satış başına" },
      { big: "12 sn", l: "ortalama teslim süresi", c: "Ödemeden e-postaya kadar" },
      { big: "1.200+", l: "yaratıcı dükkânı", c: "Sellfold'den düzenli satıyor" },
    ],
    voicesKicker: "Yaratıcılar ne diyor",
    voicesH: "Bilgisini gelire çevirenler.",
    voices: [
      { q: "İlk Notion şablonumu cuma yükledim, pazartesi 40 satış vardı. Tek bir dosya yollamadım — Sellfold hepsini hallediyor.", n: "Selin Aksoy", r: "Verimlilik içerik üreticisi", metric: "İlk hafta 40 satış" },
      { q: "Preset paketimi Gumroad'dan taşıdım, komisyon farkı ilk ay kira ödedi resmen. Teslimat e-postası da markalı, çok şık.", n: "Burak Çelik", r: "Fotoğrafçı · 30K takipçi", metric: "Ayda +%18 net" },
      { q: "Kursumun kontenjanını, kuponunu, müşteri listesini tek yerden yönetiyorum. Excel'e veda ettim.", n: "Zeynep Ar", r: "Topluluk kurucusu", metric: "₺120K kurs geliri" },
      { q: "Beat paketlerimi gece yüklüyorum, sabaha satışlar gelmiş oluyor. Anında teslim sayesinde tek mesaj atmıyorum.", n: "Kaan Öztürk", r: "Müzik prodüktörü", metric: "320+ otomatik teslim" },
      { q: "E-kitabımı Sellfold'e koyalı dönüşüm iki katına çıktı. Ödeme sayfası hızlı, mobilde kusursuz, alıcı tereddüt etmiyor.", n: "Defne Yalçın", r: "Yazar · bülten 12K", metric: "%4,8 → %9,1 dönüşüm" },
      { q: "Lansman gününde 600 sipariş geldi, sistem hiç sendelemedi. Kupon, paket, müşteri defteri — hepsi tek panelde.", n: "Emre Şahin", r: "Tasarım stüdyosu", metric: "Lansman günü ₺214K" },
    ],
    integrationsKicker: "Sorunsuz bağlanır",
    integrationsH: "Zaten kullandığın araçlarla.",
    integrations: ["Stripe", "Resend", "Notion", "Gumroad içe aktar", "Substack", "Instagram", "YouTube", "Linktree"],
    /* payouts / instant-delivery deep dive */
    payoutKicker: "Para & teslimat",
    payoutH: ["Ödeme senin hesabına,", "teslimat alıcıya — anında."],
    payoutBody: "Sellfold araya girip paranı tutmaz. Alıcı kartıyla öder, para doğrudan Stripe hesabına geçer; aynı saniyede dosya güvenli bir linke sarılır ve markalı e-posta gönderilir. Banka transferini, ödeme planını Stripe panelinden sen yönetirsin.",
    payoutStats: [
      { n: "12 sn", l: "ödemeden teslimat e-postasına" },
      { n: "%0", l: "Sellfold'ün tuttuğu pay (Üretici)" },
      { n: "7 gün", l: "indirme linki geçerlilik süresi (ayarlanabilir)" },
    ],
    payoutBullets: [
      "Para doğrudan Stripe hesabına; bekletme, dondurma yok.",
      "Süreli ve cihaz-bağımlı güvenli indirme linkleri.",
      "Markalı e-posta: logo, indirme butonu, teşekkür notu.",
      "İade ve geri ödeme tek tıkla, defter otomatik güncellenir.",
    ],
    /* tools strip — payment & delivery rails */
    railsKicker: "Ödeme & teslimat altyapısı",
    railsH: "Güvendiğin raylar üzerinde.",
    rails: [
      { t: "Stripe", b: "Kart ödemesi" },
      { t: "iyzico", b: "Yerel kart & taksit" },
      { t: "PayPal", b: "Global ödeme" },
      { t: "Resend", b: "Teslimat e-postası" },
      { t: "Discord", b: "Topluluk erişimi" },
      { t: "Webhook", b: "Kendi otomasyonun" },
    ],
    promiseKicker: "Dürüst söz",
    promiseH: ["Senin dükkânın.", "Senin paran."],
    promiseBody: "Sellfold araya girip paranı tutmaz; ödeme doğrudan Stripe hesabına geçer. Müşteri listen senindir, dışa aktarabilirsin. İstediğin an ürününü indirir, taşırsın. Kilit yok.",
    promiseBullets: [
      "Para doğrudan Stripe hesabına; Sellfold bekletmez.",
      "Müşteri listesi ve satış verisi her zaman senin, dışa aktarılabilir.",
      "Üretici planında satış komisyonu yok.",
      "İstediğin an ürünleri indir, başka yere taşı — kilit yok.",
    ],
    pricingKicker: "Fiyatlar",
    pricingH: ["Tek dükkân.", "Dürüst fiyat."],
    plans: [
      { name: "Başlangıç", price: "₺0", cad: "başlangıç", body: "İlk ürününü satmaya başla.", bullets: ["3 ürün", "Anında teslimat", "%5 işlem payı", "Müşteri defteri"], cta: "Ücretsiz başla", featured: false },
      { name: "Üretici", price: "₺349", cad: "/ay", body: "Düzenli satan içerik üreticisi için.", bullets: ["Sınırsız ürün", "İşlem payı yok", "Kupon & paket", "Markalı teslim e-postası", "Özel alan adı"], cta: "30 gün ücretsiz dene", featured: true },
      { name: "Stüdyo", price: "₺899", cad: "/ay", body: "Ekip ve marka için tam dükkân.", bullets: ["Üretici'deki her şey", "Ekip & roller", "Abonelik ürünleri", "API & webhook"], cta: "Ekip kur", featured: false },
    ],
    faqKicker: "Merak edilenler",
    faqH: "Kısa cevaplar.",
    faq: [
      { q: "Denemek için anahtar gerekir mi?", a: "Hayır. Sellfold örnek ürünler, satışlar ve müşterilerle demo modda açılır — hemen tıklayabilirsin. Canlı satış için Stripe ve Resend anahtarını /setup ile bağlarsın." },
      { q: "Hangi ürünleri satabilirim?", a: "Dijital her şey: e-kitap, Notion/Figma şablonu, Lightroom preset'i, video kursu, ses paketi, yazılım lisansı — tek dosya ya da link." },
      { q: "Teslimat nasıl çalışıyor?", a: "Ödeme onaylanır onaylanmaz alıcıya markalı bir e-posta gider; indirme linki güvenli ve süreli olabilir. Hiçbir şeyi elle göndermen gerekmez." },
      { q: "Para bana nasıl ulaşıyor?", a: "Ödemeler Stripe hesabına doğrudan geçer; Sellfold araya girmez. Ödeme planları ve banka aktarımı Stripe panelinden yönetilir." },
      { q: "Gumroad ya da Etsy'den taşınabilir miyim?", a: "Evet. Ürünlerini ve müşteri listeni içe aktar, ürün sayfalarını dakikalar içinde yeniden kur. Eski linklerini yönlendirebilirsin." },
      { q: "Komisyon gerçekten %0 mı?", a: "Üretici planında satış başına Sellfold payı yoktur — yalnızca Stripe'ın standart kart işlem ücreti uygulanır. Başlangıç planında %5 işlem payı vardır." },
      { q: "Abonelik veya üyelik satabilir miyim?", a: "Evet. Aylık erişim, kohort kontenjanı ya da Discord üyeliği gibi yinelenen ürünleri Stüdyo planında kurabilirsin." },
      { q: "Müşteri verisi kime ait?", a: "Sana. Müşteri listeni ve satış kayıtlarını istediğin an CSV olarak dışa aktarır, başka yere taşırsın. Kilit yoktur." },
    ],
    finaleKicker: "Dene · 60 saniye",
    finaleH: ["İlk ürününü bugün", "satışa aç."],
    finaleBody: "Önceden doldurulmuş canlı bir dükkân demosunu gez — her ekran tıklanabilir. Kart yok, kayıt yok.",
    footTagline: "Yaratıcılar için dijital ürün dükkânı ve anında teslimat.",
    toast: "Yeni satış geldi", revenueChip: "Bu ay gelir",
  },
  en: {
    nav: ["What it does", "How it works", "Pricing"], signin: "Sign in", demo: "Try the demo",
    badge: "A digital store for creators",
    h1a: "Turn your know-how into a product.", h1b: "Let it sell", h1c: "while you sleep.",
    sub: "Sellfold puts your ebook, template, preset and course on sale. A beautiful product page, card payment and instant auto-delivery — in one panel. No commission hunting, no inventory, no shipping.",
    cta1: "Open your store", cta2: "See what it looks like", note: "· no card · 60-second demo",
    proofAvatars: "1,200+ creators sell their products through Sellfold.",
    /* interactive inline demo */
    tryKicker: "Instant delivery · try it live",
    tryH: ["Hit Buy,", "watch it deliver."],
    tryBody: "Below is a real product card. Tap \"Buy\" and watch the payment clear, the file get packaged and the download link land in the buyer's inbox in seconds. The counter ticks up too — exactly like it would in your live store.",
    tryProduct: "Cinematic Lightroom Preset Pack", tryType: "Preset · 24 LUTs",
    tryBuy: "Buy", tryProcessing: "Taking payment…", tryPacking: "Packaging the file…",
    tryDelivered: "Delivered", tryDownload: "Download link ready", tryReset: "Run it again",
    trySoldLabel: "sales today", tryRevLabel: "revenue today", tryEmailLine: "Sent to elif@studio.co",
    trySteps: ["Card charged", "File wrapped in a secure link", "Branded email sent"],
    /* use cases / personas */
    useKicker: "Who sells here",
    useH: ["If you have a file,", "you have a Sellfold store."],
    useCases: [
      { tag: "Designer", t: "Template & kit seller", b: "Bundle your Notion, Figma and Canva templates; every sale auto-delivers the file.", emoji: "🎨", hue: "32" },
      { tag: "Writer", t: "Ebook & guide", b: "Upload your PDF guide, workbook or series; kick off the launch with a coupon.", emoji: "📚", hue: "70" },
      { tag: "Musician", t: "Audio & sample pack", b: "Sell samples, presets and beat packs; buyers download in seconds while you stay on stage.", emoji: "🎧", hue: "300" },
      { tag: "Educator", t: "Course & community", b: "Offer your video course, seated cohort and Discord access as one product.", emoji: "🎓", hue: "152" },
    ],
    /* product types showcase */
    typesKicker: "What you can sell",
    typesH: ["Anything digital,", "in one store."],
    typesBody: "A single file, a link, or a subscription — Sellfold turns it all into a product page with automatic delivery.",
    types: [
      { t: "Ebook", b: "PDF, EPUB guides", emoji: "📘", hue: "70" },
      { t: "Template", b: "Notion, Figma, Canva", emoji: "🗂️", hue: "32" },
      { t: "Preset", b: "Lightroom, LUT, filters", emoji: "🎞️", hue: "350" },
      { t: "Course", b: "Video lessons, cohorts", emoji: "🎓", hue: "152" },
      { t: "License", b: "Software, fonts, plugins", emoji: "🔑", hue: "250" },
      { t: "Audio", b: "Samples, beats, podcasts", emoji: "🎧", hue: "300" },
    ],
    marqueeTitle: "Sellfold sells any digital product",
    marquee: ["Ebook", "Notion template", "Lightroom preset", "Video course", "Figma kit", "Audio pack", "Icon set", "Workbook", "LUT pack", "Community", "Prompt pack", "PDF guide"],
    problemKicker: "The chaos",
    problemH: ["Gumroad takes 10%.", "Sending files by hand is exhausting."],
    problemBody: "The discount code lives in Notion, the file in Drive, the payment in a DM, the invoice in your head... every sale means copying links one by one, and the order that came in at 2am you only see in the morning. Sellfold collapses all of it into one panel and zero manual work.",
    problemStats: [
      { n: "10%", l: "commission platforms take" },
      { n: "6 hrs", l: "average delay on manual delivery" },
      { n: "4 tools", l: "tabs open just to make a sale" },
      { n: "38%", l: "buyers asking refunds on slow delivery" },
    ],
    whatKicker: "What it does",
    whatH: ["A whole e-commerce team's work,", "in one panel, quietly."],
    modules: [
      { t: "Product pages", b: "A cover, description, price and preview for every product. Live in seconds, flawless on mobile, SEO-friendly." },
      { t: "Instant delivery", b: "The file or link hits the buyer's inbox the moment payment clears — even while you sleep." },
      { t: "Card checkout", b: "Secure Stripe checkout — one-time or subscription. Money lands in your account with no middleman." },
      { t: "Email fulfilment", b: "Branded delivery emails go out via Resend — download link, coupon and thank-you note included." },
      { t: "Customer ledger", b: "Who bought what, how often they returned, how much they spent — one exportable list, one click." },
      { t: "Coupons & bundles", b: "Spin up discount codes, bundle products, set launch pricing. You steer the sales." },
    ],
    deepKicker: "A closer look",
    deepH: ["Payment cleared.", "The rest is off your plate."],
    deepBody: "The moment a buyer pays by card, Sellfold runs the chain on its own: it verifies the payment, packages the file into a secure link, sends the branded email, logs the customer and updates your revenue. You don't even glance at your phone.",
    deepSteps: [
      { t: "Payment confirmed", b: "Stripe charges the card; money goes straight to your account.", icon: CreditCard },
      { t: "File packaged", b: "The product is wrapped in a secure, time-limited download link.", icon: Zap },
      { t: "Email sent", b: "A branded delivery email lands in the buyer's inbox.", icon: Mail },
      { t: "Logged to ledger", b: "Customer and sale are saved automatically; revenue updates.", icon: Users },
    ],
    howKicker: "Three steps",
    howH: ["From upload to first sale,", "before noon."],
    steps: [
      { n: "01", t: "Upload the product", b: "Drag your file, add a cover and price, pick the type. Your product page builds itself." },
      { n: "02", t: "Share the link", b: "Drop the Sellfold link in your bio, story or newsletter. Anyone pays by card in one tap." },
      { n: "03", t: "Auto-deliver", b: "The moment payment clears, the product is delivered, money lands, the customer is logged. You do nothing." },
    ],
    compareKicker: "Compare",
    compareH: ["Same product,", "three different stores."],
    compareCols: ["Gumroad", "Etsy", "Sellfold"],
    compareTable: [
      { f: "Sales commission", v: ["up to 10%", "6.5% + listing fee", "0% (Üretici)"] },
      { f: "Instant auto-delivery", v: ["partial", "manual", "full"] },
      { f: "Branded delivery email", v: ["no", "no", "yes"] },
      { f: "Coupons & bundles", v: ["yes", "limited", "yes"] },
      { f: "Subscription products", v: ["yes", "no", "yes"] },
      { f: "Customer list is yours", v: ["partial", "no", "yes"] },
      { f: "Custom domain & brand", v: ["add-on", "no", "included"] },
      { f: "Local panel & ₺ payouts", v: ["no", "partial", "yes"] },
    ],
    proof: [
      { big: "0%", l: "sales commission", c: "On the Üretici plan, per sale" },
      { big: "12 s", l: "average delivery time", c: "From payment to email" },
      { big: "1,200+", l: "creator stores", c: "Selling through Sellfold regularly" },
    ],
    voicesKicker: "What creators say",
    voicesH: "People turning know-how into income.",
    voices: [
      { q: "I uploaded my first Notion template on Friday; by Monday I had 40 sales. I never sent a single file — Sellfold handles all of it.", n: "Selin Aksoy", r: "Productivity creator", metric: "40 sales first week" },
      { q: "I moved my preset pack off Gumroad, and the commission savings literally paid my rent the first month. The delivery email is branded and sharp, too.", n: "Burak Çelik", r: "Photographer · 30K followers", metric: "+18% net/mo" },
      { q: "I manage my course's seats, coupons and customer list from one place. I said goodbye to spreadsheets.", n: "Zeynep Ar", r: "Community founder", metric: "₺120K course revenue" },
      { q: "I upload my beat packs at night and wake up to sales. Thanks to instant delivery I never send a single message.", n: "Kaan Öztürk", r: "Music producer", metric: "320+ auto-deliveries" },
      { q: "Since I put my ebook on Sellfold my conversion doubled. The checkout is fast, flawless on mobile, buyers don't hesitate.", n: "Defne Yalçın", r: "Author · 12K newsletter", metric: "4.8% → 9.1% conversion" },
      { q: "We got 600 orders on launch day and the system never flinched. Coupons, bundles, customer ledger — all in one panel.", n: "Emre Şahin", r: "Design studio", metric: "₺214K launch day" },
    ],
    integrationsKicker: "Connects seamlessly",
    integrationsH: "With the tools you already use.",
    integrations: ["Stripe", "Resend", "Notion", "Gumroad import", "Substack", "Instagram", "YouTube", "Linktree"],
    /* payouts / instant-delivery deep dive */
    payoutKicker: "Money & delivery",
    payoutH: ["Payment to your account,", "delivery to the buyer — instantly."],
    payoutBody: "Sellfold never sits in the middle holding your cash. The buyer pays by card, the money goes straight to your Stripe account; in the same second the file is wrapped in a secure link and the branded email goes out. Bank transfers and payout schedules you manage from Stripe.",
    payoutStats: [
      { n: "12 s", l: "from payment to delivery email" },
      { n: "0%", l: "held by Sellfold (Üretici)" },
      { n: "7 days", l: "download link validity (configurable)" },
    ],
    payoutBullets: [
      "Money goes straight to your Stripe account; no holds, no freezes.",
      "Time-limited, device-aware secure download links.",
      "Branded email: your logo, a download button, a thank-you note.",
      "Refunds in one click; the ledger updates itself.",
    ],
    /* tools strip — payment & delivery rails */
    railsKicker: "Payment & delivery rails",
    railsH: "On rails you already trust.",
    rails: [
      { t: "Stripe", b: "Card checkout" },
      { t: "iyzico", b: "Local cards & installments" },
      { t: "PayPal", b: "Global payments" },
      { t: "Resend", b: "Delivery email" },
      { t: "Discord", b: "Community access" },
      { t: "Webhook", b: "Your own automation" },
    ],
    promiseKicker: "The honest promise",
    promiseH: ["Your store.", "Your money."],
    promiseBody: "Sellfold never sits in the middle holding your cash; payment goes straight to your Stripe account. Your customer list is yours and exportable. Download and move your products any time. No lock-in.",
    promiseBullets: [
      "Money goes straight to your Stripe account; Sellfold never holds it.",
      "Your customer list and sales data are always yours, exportable.",
      "No sales commission on the Üretici plan.",
      "Download your products and move them elsewhere any time — no lock-in.",
    ],
    pricingKicker: "Pricing",
    pricingH: ["One store.", "Honest pricing."],
    plans: [
      { name: "Başlangıç", price: "₺0", cad: "to start", body: "Start selling your first product.", bullets: ["3 products", "Instant delivery", "5% per-sale fee", "Customer ledger"], cta: "Start free", featured: false },
      { name: "Üretici", price: "₺349", cad: "/ mo", body: "For the creator selling regularly.", bullets: ["Unlimited products", "No per-sale fee", "Coupons & bundles", "Branded delivery email", "Custom domain"], cta: "Try free for 30 days", featured: true },
      { name: "Stüdyo", price: "₺899", cad: "/ mo", body: "The full store for a team & brand.", bullets: ["Everything in Üretici", "Team & roles", "Subscription products", "API & webhooks"], cta: "Set up a team", featured: false },
    ],
    faqKicker: "Good to know",
    faqH: "The short answers.",
    faq: [
      { q: "Do I need API keys to try it?", a: "No. Sellfold boots in demo mode with sample products, sales and customers — click around immediately. Wire your Stripe and Resend keys via /setup to sell live." },
      { q: "What can I sell?", a: "Anything digital: ebooks, Notion/Figma templates, Lightroom presets, video courses, audio packs, software licenses — a single file or a link." },
      { q: "How does delivery work?", a: "The moment payment clears, the buyer gets a branded email with a secure, optionally time-limited download link. You never send anything by hand." },
      { q: "How do I get paid?", a: "Payments go straight to your Stripe account; Sellfold never holds your money. Payouts and bank transfers are managed from your Stripe dashboard." },
      { q: "Can I move over from Gumroad or Etsy?", a: "Yes. Import your products and customer list, rebuild product pages in minutes, and redirect your old links." },
      { q: "Is the commission really 0%?", a: "On the Üretici plan there's no Sellfold per-sale fee — only Stripe's standard card processing rate applies. The starter plan carries a 5% transaction fee." },
      { q: "Can I sell subscriptions or memberships?", a: "Yes. Recurring products like monthly access, cohort seats or Discord membership can be set up on the Stüdyo plan." },
      { q: "Who owns the customer data?", a: "You do. Export your customer list and sales records as CSV any time and move them elsewhere. No lock-in." },
    ],
    finaleKicker: "Try it · 60 seconds",
    finaleH: ["Put your first product", "on sale today."],
    finaleBody: "Take a live, pre-loaded store demo for a spin — every screen interactive. No card, no signup.",
    footTagline: "A digital product store and instant delivery for creators.",
    toast: "New sale", revenueChip: "Revenue this month",
  },
};

/* ── Hero illustration: a mini storefront with a live sale toast ─────────── */
function StorePreview({ lang }: { lang: "tr" | "en" }) {
  const products = [
    { hue: "32", emoji: "🗂️", price: "₺349", Icon: LayoutTemplate },
    { hue: "350", emoji: "🎞️", price: "₺199", Icon: SlidersHorizontal },
    { hue: "70", emoji: "📘", price: "₺149", Icon: BookOpen },
    { hue: "152", emoji: "🎓", price: "₺899", Icon: GraduationCap },
  ];
  const t = lang === "tr"
    ? { store: "Deren'in Dükkânı", live: "Yayında", buy: "Satın al", toast: "Yeni satış geldi 🎉", who: "Elif K. · Preset Paketi", revenue: "Bu ay gelir" }
    : { store: "Deren's Store", live: "Live", buy: "Buy", toast: "New sale 🎉", who: "Elif K. · Preset Pack", revenue: "Revenue this month" };
  return (
    <div className="relative h-[460px] sm:h-[520px]">
      {/* main storefront card */}
      <div className="absolute left-1/2 top-2 w-[300px] -translate-x-1/2 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty sm:left-2 sm:translate-x-0">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-base" style={{ backgroundImage: "linear-gradient(140deg, oklch(90% 0.12 32), oklch(80% 0.15 18))" }}>🛍️</span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{t.store}</p>
            <p className="inline-flex items-center gap-1 text-[10px] text-success"><span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> {t.live}</p>
          </div>
          <span className="ml-auto font-display text-xs font-semibold text-primary">sellfold.com</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {products.map((p, i) => (
            <div key={i} className="overflow-hidden rounded-lg ring-1 ring-border">
              <div className="grid aspect-[4/3] place-items-center" style={{ backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${p.hue}), oklch(86% 0.13 ${p.hue}))` }}>
                <span className="text-2xl">{p.emoji}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="font-display text-[11px] font-semibold tabular-nums text-primary">{p.price}</span>
                <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[8px] font-medium text-background">{t.buy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* revenue chip */}
      <div className="absolute right-0 top-24 rounded-xl border border-border bg-card px-4 py-3 shadow-pop floaty" style={{ animationDelay: "0.6s" }}>
        <p className="label-mono text-muted-foreground">{t.revenue}</p>
        <p className="mt-1 inline-flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-semibold tabular-nums">₺312.480</span>
        </p>
        <p className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-success"><ArrowUpRight className="h-3 w-3" />+38%</p>
      </div>
      {/* live sale toast */}
      <div className="absolute bottom-4 right-2 w-[230px] rounded-2xl bg-sidebar p-3.5 text-sidebar-foreground shadow-pop floaty" style={{ animationDelay: "1.2s" }}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success/20 text-success"><Zap className="h-4 w-4" /></span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">{t.toast}</p>
            <p className="truncate text-[11px] text-sidebar-muted">{t.who}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2.5">
          <span className="text-[11px] text-sidebar-muted">{lang === "tr" ? "Teslim edildi" : "Delivered"}</span>
          <span className="font-display text-sm font-semibold tabular-nums text-success">+₺199</span>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive inline demo: buy → instant delivery ────────────────────── */
type DeliverStage = "idle" | "paying" | "packing" | "done";
function InstantDeliveryDemo({ lang }: { lang: "tr" | "en" }) {
  const c = content[lang];
  const [stage, setStage] = useState<DeliverStage>("idle");
  const [sold, setSold] = useState(58);
  const [revenue, setRevenue] = useState(11542);
  const PRICE = 199;

  function buy() {
    if (stage !== "idle" && stage !== "done") return;
    setStage("paying");
    setTimeout(() => setStage("packing"), 1100);
    setTimeout(() => {
      setStage("done");
      setSold((s) => s + 1);
      setRevenue((r) => r + PRICE);
    }, 2300);
  }
  function reset() { setStage("idle"); }

  const stepDone = (i: number) =>
    (stage === "paying" && i === 0) ||
    (stage === "packing" && i <= 1) ||
    (stage === "done" && i <= 2);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
      {/* product card */}
      <div className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-pop ring-1 ring-border">
        <div className="overflow-hidden rounded-2xl ring-1 ring-border">
          <div className="grid aspect-[16/10] place-items-center" style={{ backgroundImage: "linear-gradient(140deg, oklch(94% 0.06 350), oklch(86% 0.14 350))" }}>
            <span className="text-5xl drop-shadow-sm">🎞️</span>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{c.tryProduct}</p>
            <p className="text-xs text-muted-foreground">{c.tryType}</p>
          </div>
          <p className="shrink-0 font-display text-xl font-semibold tabular-nums text-primary">₺{PRICE}</p>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9 · 211</span>
          <span><span className="font-semibold tabular-nums text-foreground">{sold}</span> {c.trySoldLabel}</span>
        </div>
        <button
          onClick={buy}
          disabled={stage === "paying" || stage === "packing"}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
        >
          {stage === "paying" ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" /> {c.tryProcessing}</>)
            : stage === "packing" ? (<><Zap className="h-4 w-4" /> {c.tryPacking}</>)
            : stage === "done" ? (<><Check className="h-4 w-4" /> {c.tryDelivered}</>)
            : (<><CreditCard className="h-4 w-4" /> {c.tryBuy} · ₺{PRICE}</>)}
        </button>
        {stage === "done" && (
          <button onClick={reset} className="mt-2 inline-flex w-full items-center justify-center text-xs font-medium text-muted-foreground hover:text-foreground">{c.tryReset}</button>
        )}
      </div>

      {/* delivery panel */}
      <div className="relative flex flex-col overflow-hidden rounded-3xl bg-sidebar p-6 text-sidebar-foreground shadow-pop">
        <span className="blob -right-16 -top-16 h-44 w-44 bg-primary/40 drift" aria-hidden />
        <div className="relative flex items-center justify-between">
          <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> {c.tryKicker}</p>
          <p className="label-mono text-sidebar-muted">{c.tryRevLabel}</p>
        </div>
        <p className="relative mt-2 font-display text-3xl font-semibold tabular-nums">₺{revenue.toLocaleString("tr-TR")}</p>

        {/* steps */}
        <ol className="relative mt-5 space-y-2.5">
          {c.trySteps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-xl bg-white/[0.05] px-3.5 py-2.5 ring-1 ring-white/10 transition">
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs transition", stepDone(i) ? "bg-success text-success-foreground" : "bg-white/10 text-sidebar-muted")}>
                {stepDone(i) ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("text-[13.5px]", stepDone(i) ? "text-sidebar-foreground" : "text-sidebar-muted")}>{s}</span>
              {stepDone(i) && <Zap className="ml-auto h-3.5 w-3.5 text-success" />}
            </li>
          ))}
        </ol>

        {/* download chip */}
        <div className={cn("relative mt-4 overflow-hidden rounded-2xl ring-1 transition-all", stage === "done" ? "bg-success/15 ring-success/40" : "bg-white/[0.03] ring-white/10")}>
          {stage === "done" ? (
            <div className="flex items-center gap-3 p-4 animate-float-up">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success/25 text-success"><Mail className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{c.tryDownload}</p>
                <p className="truncate text-[11.5px] text-sidebar-muted">{c.tryEmailLine}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success px-3 py-1.5 text-[11px] font-semibold text-success-foreground"><ArrowUpRight className="h-3 w-3" /> .zip</span>
            </div>
          ) : (
            <p className="p-4 text-center text-[12.5px] text-sidebar-muted">{lang === "tr" ? "Satın al'a bas → teslimat burada belirir" : "Hit Buy → delivery appears here"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellfoldLanding() {
  const { lang } = useLang();
  const c = content[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-dvh">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-8 w-8" /><span className="font-display text-lg font-semibold tracking-tight">Sellfold</span></Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#what" className="hover:text-foreground transition-colors">{c.nav[0]}</a>
            <a href="#how" className="hover:text-foreground transition-colors">{c.nav[1]}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{c.nav[2]}</a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-7">
            <LanguageToggle className="mr-1" />
            <Link href="/login" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{c.signin}</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90">{c.demo} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)", opacity: 0.7 }} />
        <span className="blob -left-24 -top-20 -z-10 h-96 w-96 bg-primary/25 drift" aria-hidden />
        <span className="blob right-1/4 top-32 -z-10 h-72 w-72 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--color-serif) 28%, transparent)", animationDelay: "2s" }} />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-24">
          <div>
            <p className="rise label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.badge}</p>
            <h1 className="rise mt-6 font-display text-[clamp(40px,6.5vw,76px)] font-semibold leading-[0.96] tracking-tight" style={{ animationDelay: "0.08s" }}>
              {c.h1a}<br />
              <span className="hl-primary">{c.h1b}</span> <span className="display-accent font-normal">{c.h1c}</span>
            </h1>
            <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.18s" }}>{c.sub}</p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.28s" }}>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-90">{c.cta1} <ArrowRight className="h-4 w-4" /></Link>
              <a href="#what" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium text-foreground ring-1 ring-border transition hover:bg-muted">{c.cta2}</a>
              <span className="hidden self-center label-mono text-muted-foreground sm:inline">{c.note}</span>
            </div>
            <div className="rise mt-9 flex items-center gap-3 text-sm text-muted-foreground" style={{ animationDelay: "0.38s" }}>
              <div className="flex -space-x-2">
                {["SA", "BÇ", "ZA", "MD", "EK"].map((i, k) => (
                  <span key={i} className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-foreground/70 ring-2 ring-background" style={{ background: `oklch(${84 - k * 4}% 0.08 ${30 + k * 18})` }}>{i}</span>
                ))}
              </div>
              <span>{c.proofAvatars}</span>
            </div>
          </div>
          <div className="rise" style={{ animationDelay: "0.3s" }}><StorePreview lang={lang} /></div>
        </div>
      </section>

      {/* ── Marquee ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-border py-7">
        <p className="label-mono mb-4 text-center text-muted-foreground">{c.marqueeTitle}</p>
        <div className="marquee gap-10">
          {[...c.marquee, ...c.marquee].map((it, i) => (
            <span key={i} className="display-accent whitespace-nowrap px-2 text-2xl text-muted-foreground/70">{it}<span className="ml-10 text-primary">·</span></span>
          ))}
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.problemKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.problemH[0]} <span className="display-accent font-normal">{c.problemH[1]}</span></h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{c.problemBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {c.problemStats.map((s, i) => (
              <div key={s.l} className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border" style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}>
                <p className="font-display text-[40px] font-semibold leading-none tabular-nums text-primary">{s.n}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ─────────────────────────────────────────────────── */}
      <section id="what" className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.whatKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.whatH[0]} <span className="display-accent font-normal">{c.whatH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {c.modules.map((mod, i) => {
              const Icon = moduleIcons[i];
              return (
                <article key={mod.t} className="group rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:scale-110"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{mod.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mod.b}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Interactive instant-delivery demo ───────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><Zap className="h-3.5 w-3.5" /> {c.tryKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.tryH[0]} <span className="display-accent font-normal">{c.tryH[1]}</span></h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{c.tryBody}</p>
          </div>
          <InstantDeliveryDemo lang={lang} />
        </div>
      </section>

      {/* ── Feature deep-dive: the delivery chain ───────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.deepKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.deepH[0]} <span className="display-accent font-normal">{c.deepH[1]}</span></h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{c.deepBody}</p>
          </div>
          <ol className="relative ml-3 space-y-4 border-l border-border pl-8">
            {c.deepSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.t} className="relative">
                  <span className="absolute -left-[42px] grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{s.t}</p>
                      <span className="font-mono text-[11px] text-primary tabular-nums">0{i + 1}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.b}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── How (3 steps) ───────────────────────────────────────────── */}
      <section id="how" className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.howKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.howH[0]} <span className="display-accent font-normal">{c.howH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.steps.map((s) => (
              <div key={s.n} className="relative rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
                <span className="font-display text-5xl font-semibold leading-none text-primary/25">{s.n}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases / personas ────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.useKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.useH[0]} <span className="display-accent font-normal">{c.useH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.useCases.map((u) => (
              <article key={u.t} className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                <div className="grid aspect-[5/3] place-items-center" style={{ backgroundImage: `linear-gradient(140deg, oklch(95% 0.05 ${u.hue}), oklch(88% 0.13 ${u.hue}))` }}>
                  <span className="text-4xl drop-shadow-sm transition group-hover:scale-110">{u.emoji}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="label-mono text-primary">{u.tag}</span>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{u.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{u.b}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product types showcase ──────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.typesKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.typesH[0]} <span className="display-accent font-normal">{c.typesH[1]}</span></h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{c.typesBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {c.types.map((ty) => (
              <article key={ty.t} className="group overflow-hidden rounded-2xl bg-card text-center shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                <div className="grid aspect-square place-items-center" style={{ backgroundImage: `linear-gradient(140deg, oklch(95% 0.05 ${ty.hue}), oklch(87% 0.13 ${ty.hue}))` }}>
                  <span className="text-4xl drop-shadow-sm transition group-hover:scale-110">{ty.emoji}</span>
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold tracking-tight">{ty.t}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">{ty.b}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table (Gumroad / Etsy / Sellfold) ──────────────── */}
      <section className="border-y border-border py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.compareKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.compareH[0]} <span className="display-accent font-normal">{c.compareH[1]}</span></h2>
          </div>
          <div className="overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border">
            {/* header row */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center border-b border-border bg-muted/50">
              <span className="px-4 py-4 text-[12px] font-medium text-muted-foreground sm:px-6" />
              {c.compareCols.map((col, i) => (
                <span key={col} className={cn("px-2 py-4 text-center text-[13px] font-semibold tracking-tight sm:px-3", i === 2 ? "relative text-primary" : "text-muted-foreground")}>
                  {i === 2 && <span className="absolute inset-x-1 -top-px h-1 rounded-b-full bg-primary" aria-hidden />}
                  {i === 2 ? <span className="inline-flex items-center gap-1.5"><LogoMark className="h-4 w-4" /> {col}</span> : col}
                </span>
              ))}
            </div>
            {c.compareTable.map((row, ri) => (
              <div key={row.f} className={cn("grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center", ri % 2 ? "bg-muted/20" : "")}>
                <span className="px-4 py-3.5 text-[13px] font-medium sm:px-6">{row.f}</span>
                {row.v.map((cell, ci) => {
                  const good = ci === 2;
                  const isYes = /^(evet|full|tam|yes|included|dahil)$/i.test(cell);
                  const isNo = /^(hayır|no|manual|elle)$/i.test(cell);
                  return (
                    <span key={ci} className={cn("px-2 py-3.5 text-center text-[12.5px] sm:px-3", good ? "bg-primary/[0.06] font-semibold text-foreground" : "text-muted-foreground")}>
                      {good && isYes ? <Check className="mx-auto h-4 w-4 text-success" />
                        : isNo ? <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
                        : <span className={cn(good && "inline-flex items-center gap-1")}>{good && isYes && <Check className="h-3.5 w-3.5 text-success" />}{cell}</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof ───────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3 lg:px-8">
          {c.proof.map((p) => (
            <div key={p.l}>
              <p className="font-display text-[64px] font-semibold leading-none tracking-tight text-primary">{p.big}</p>
              <p className="mt-2 text-sm font-medium">{p.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Payouts / instant-delivery deep-dive ────────────────────── */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-sidebar p-10 text-sidebar-foreground lg:p-16">
          <span className="blob -left-20 -top-16 h-72 w-72 bg-primary/40 drift" aria-hidden />
          <span className="blob right-1/4 bottom-0 h-56 w-56 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--color-serif) 40%, transparent)", animationDelay: "2.5s" }} />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.payoutKicker}</p>
              <h2 className="mt-4 font-display text-[clamp(26px,4vw,46px)] font-semibold leading-[1.04] tracking-tight">{c.payoutH[0]} <span className="display-accent font-normal" style={{ color: "var(--color-serif)" }}>{c.payoutH[1]}</span></h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-sidebar-muted">{c.payoutBody}</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {c.payoutStats.map((s) => (
                  <div key={s.l} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                    <p className="font-display text-2xl font-semibold tabular-nums text-primary">{s.n}</p>
                    <p className="mt-1 text-[11px] leading-tight text-sidebar-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <ul className="space-y-3 self-center">
              {c.payoutBullets.map((b) => (
                <li key={b} className="flex gap-3 rounded-2xl bg-white/[0.05] px-4 py-3.5 ring-1 ring-white/10"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p className="text-[13.5px] leading-relaxed text-sidebar-foreground/85">{b}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Payment & delivery rails strip ──────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-8 text-center">
            <p className="label-mono text-primary">{c.railsKicker}</p>
            <h2 className="mt-2 font-display text-[clamp(22px,3vw,34px)] font-semibold tracking-tight">{c.railsH}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {c.rails.map((r) => (
              <div key={r.t} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-5 text-center shadow-soft ring-1 ring-border">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <p className="mt-1 text-sm font-semibold tracking-tight">{r.t}</p>
                <p className="text-[11px] text-muted-foreground">{r.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.voicesKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(26px,4vw,44px)] font-semibold tracking-tight">{c.voicesH}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {c.voices.map((v, i) => (
              <figure key={v.n} className="flex flex-col rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border" style={{ transform: `rotate(${i % 3 === 1 ? 0 : i % 3 === 0 ? -1 : 1}deg)` }}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-0.5 text-primary">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-semibold text-success"><TrendingUp className="h-3 w-3" /> {v.metric}</span>
                </div>
                <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/90">“{v.q}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{v.n.split(" ").map((s) => s[0]).join("")}</span>
                  <div>
                    <p className="text-sm font-medium">{v.n}</p>
                    <p className="text-xs text-muted-foreground">{v.r}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integrations strip ──────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-8 text-center">
            <p className="label-mono text-primary">{c.integrationsKicker}</p>
            <h2 className="mt-2 font-display text-[clamp(22px,3vw,34px)] font-semibold tracking-tight">{c.integrationsH}</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {c.integrations.map((it) => (
              <span key={it} className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-soft ring-1 ring-border">
                <span className="h-2 w-2 rounded-full bg-primary" /> {it}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promise (inverted) ──────────────────────────────────────── */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-sidebar p-10 text-sidebar-foreground lg:p-16">
          <span className="blob -right-20 -top-20 h-72 w-72 bg-primary/40 drift" aria-hidden />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="label-mono inline-flex items-center gap-2 text-sidebar-muted"><span className="h-px w-7 bg-primary" /> {c.promiseKicker}</p>
              <h2 className="mt-4 font-display text-[clamp(28px,4vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.promiseH[0]} <span className="display-accent font-normal" style={{ color: "var(--color-serif)" }}>{c.promiseH[1]}</span></h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-sidebar-muted">{c.promiseBody}</p>
            </div>
            <ul className="space-y-3">
              {c.promiseBullets.map((b) => (
                <li key={b} className="flex gap-3 rounded-2xl bg-white/[0.05] px-4 py-3.5 ring-1 ring-white/10"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p className="text-[13.5px] leading-relaxed text-sidebar-foreground/85">{b}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono text-primary">{c.pricingKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.pricingH[0]} <span className="display-accent font-normal">{c.pricingH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.plans.map((p) => (
              <article key={p.name} className={cn("relative rounded-3xl p-7 lg:p-8", p.featured ? "bg-sidebar text-sidebar-foreground shadow-pop" : "bg-card ring-1 ring-border shadow-soft")}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">{lang === "tr" ? "Önerilen" : "Recommended"}</span>}
                <p className={cn("label-mono", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.name}</p>
                <p className="mt-3 flex items-end gap-1"><span className="font-display text-5xl font-semibold leading-none tracking-tight">{p.price}</span><span className={cn("pb-1.5 text-[13px]", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.cad}</span></p>
                <p className={cn("mt-3 text-[13px] leading-relaxed", p.featured ? "text-sidebar-foreground/75" : "text-muted-foreground")}>{p.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.bullets.map((b) => <li key={b} className="flex items-start gap-2 text-[13px]"><Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.featured ? "text-primary" : "text-success")} />{b}</li>)}
                </ul>
                <Link href="/signup" className={cn("mt-7 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-medium transition", p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "ring-1 ring-border hover:bg-muted")}>{p.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <p className="label-mono text-primary">{c.faqKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,42px)] font-semibold tracking-tight">{c.faqH}</h2>
          </div>
          <ul className="space-y-2.5">
            {c.faq.map((item, i) => (
              <li key={item.q} className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[15px] font-semibold tracking-tight">{item.q}</span>
                  {open === i ? <Minus className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {open === i && <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-muted-foreground">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Finale ──────────────────────────────────────────────────── */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] p-10 text-center text-white lg:p-16" style={{ background: "var(--grad-brand)" }}>
          <span className="blob left-1/4 -top-12 h-64 w-64 bg-white/20 drift" aria-hidden />
          <div className="relative">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-white/70"><Sparkles className="h-3 w-3" /> {c.finaleKicker}</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(32px,5.5vw,68px)] font-semibold leading-[1] tracking-tight">{c.finaleH[0]} <span className="italic" style={{ fontFamily: "var(--font-display)" }}>{c.finaleH[1]}</span></h2>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/85">{c.finaleBody}</p>
            <div className="mt-9"><Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-foreground transition hover:bg-white/90">{c.cta1} <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 text-sm text-muted-foreground md:grid-cols-6 lg:px-8">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-7 w-7" /><span className="font-display text-base font-semibold tracking-tight text-foreground">Sellfold</span></Link>
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">{c.footTagline} · sellfold.com · © 2026.</p>
            <p className="label-mono mt-5 inline-flex items-center gap-1.5 text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> {lang === "tr" ? "Tüm sistemler çalışıyor" : "All systems operational"}</p>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Ürün" : "Product"}</p>
            <ul className="space-y-1.5">
              <li><a href="#what" className="hover:text-foreground">{c.nav[0]}</a></li>
              <li><a href="#how" className="hover:text-foreground">{c.nav[1]}</a></li>
              <li><a href="#pricing" className="hover:text-foreground">{c.nav[2]}</a></li>
              <li><Link href="/login" className="hover:text-foreground">{c.demo}</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Satıcılar için" : "For sellers"}</p>
            <ul className="space-y-1.5">
              <li>{lang === "tr" ? "Yaratıcı rehberi" : "Creator guide"}</li>
              <li>{lang === "tr" ? "Gumroad'dan taşı" : "Move from Gumroad"}</li>
              <li>{lang === "tr" ? "Ücret hesaplayıcı" : "Fee calculator"}</li>
              <li>{lang === "tr" ? "Örnek dükkânlar" : "Example stores"}</li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Kaynaklar" : "Resources"}</p>
            <ul className="space-y-1.5">
              <li>{lang === "tr" ? "Yardım merkezi" : "Help center"}</li>
              <li>{lang === "tr" ? "Geliştirici API" : "Developer API"}</li>
              <li>{lang === "tr" ? "Durum" : "Status"}</li>
              <li>{lang === "tr" ? "Değişiklik günlüğü" : "Changelog"}</li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{lang === "tr" ? "Şirket" : "Company"}</p>
            <ul className="space-y-1.5"><li>hello@sellfold.com</li><li>{lang === "tr" ? "Hakkında" : "About"}</li><li>{lang === "tr" ? "Gizlilik" : "Privacy"}</li><li>{lang === "tr" ? "Şartlar" : "Terms"}</li></ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
