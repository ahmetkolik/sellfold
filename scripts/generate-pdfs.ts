/**
 * generate-pdfs.ts
 * Generates product guide PDFs in TR + EN and uploads to Supabase Storage.
 * Run: npx tsx scripts/generate-pdfs.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── Color palette matching example PDF ─────────────────────────────────────
const COLORS = {
  orange: "#C45C3A",
  orangeLight: "#F0E6DF",
  orangeMid: "#D97B5A",
  dark: "#1A1A1A",
  darkSecondary: "#333333",
  muted: "#6B6B6B",
  border: "#E8DFD8",
  bg: "#FDFAF7",
  cardBg: "#F5EDEA",
  white: "#FFFFFF",
};

// ── Products ───────────────────────────────────────────────────────────────
const PRODUCTS: Array<{
  id: string;
  titleTr: string;
  titleEn: string;
  type: string;
  emoji: string;
  fileSlugTr: string;
  fileSlugEn: string;
  sections: {
    tr: Array<{ heading: string; body: string; steps?: string[]; tip?: string }>;
    en: Array<{ heading: string; body: string; steps?: string[]; tip?: string }>;
  };
}> = [
  // ── Claude Code Kullanım Kılavuzu ────────────────────────────────────────
  {
    id: "fc4b0a55-7af2-46d3-8443-40ab49d123c1",
    titleTr: "Claude Code\nKullanım Kılavuzu",
    titleEn: "Claude Code\nUsage Guide",
    type: "Kılavuz · E-Kitap",
    emoji: "💻",
    fileSlugTr: "claude-code-guide-tr.pdf",
    fileSlugEn: "claude-code-guide-en.pdf",
    sections: {
      tr: [
        {
          heading: "Kurulum",
          body: "Claude Code, Anthropic'in resmi komut satırı aracıdır. Node.js v18+ gereklidir.",
          steps: [
            "Node.js v18+ kurulu olduğundan emin olun: node --version",
            "npm install -g @anthropic-ai/claude-code komutuyla yükleyin",
            "claude --version ile kurulumu doğrulayın",
            "İlk çalıştırma: proje klasöründe claude yazın",
          ],
          tip: "İlk açılışta Anthropic hesabınıza giriş yapmanız istenecektir.",
        },
        {
          heading: "Temel Komutlar",
          body: "Günlük kullanımda en çok ihtiyaç duyacağınız komutlar:",
          steps: [
            "claude — etkileşimli sohbet başlatır",
            "claude --help — tüm komutları listeler",
            '/exit veya Ctrl+D — oturumu kapatır',
            "Ctrl+C — mevcut işlemi iptal eder",
          ],
          tip: "Konuşma içinde /help yazarak skill ve komut listesine ulaşabilirsiniz.",
        },
        {
          heading: "Plan Mode — Güvenli Planlama",
          body: "Plan Mode, değişiklik yapmadan önce Claude'un planını onaylamanızı sağlar. Büyük değişikliklerde mutlaka kullanın.",
          steps: [
            "/plan komutunu yazarak Plan Mode'a girin",
            "Claude, yapacaklarını adım adım listeler",
            "Onaylamak için 'Devam et' deyin ya da düzeltin",
            "Çıkmak için /exit-plan kullanın",
          ],
        },
        {
          heading: "CLAUDE.md — Proje Hafızası",
          body: "Proje kökünüze CLAUDE.md dosyası ekleyerek Claude'a proje hakkında kalıcı talimatlar verebilirsiniz.",
          steps: [
            "Proje kökünde CLAUDE.md dosyası oluşturun",
            "Kullandığınız teknoloji yığınını yazın",
            "Kodlama kurallarınızı ve kısıtlamalarınızı ekleyin",
            "Önemli dosya yollarını ve açıklamaları ekleyin",
          ],
          tip: "Claude, her oturumda CLAUDE.md'yi otomatik okur — tekrar açıklamak zorunda kalmazsınız.",
        },
        {
          heading: "MCP Sunucuları",
          body: "Model Context Protocol (MCP) sunucuları Claude'un yeteneklerini genişletir: veritabanı, tarayıcı, API erişimi ve daha fazlası.",
          steps: [
            "~/.claude/mcp_settings.json dosyasını açın",
            "Kullanmak istediğiniz MCP sunucusunu ekleyin",
            "Claude'u yeniden başlatın",
            "/list-mcp ile aktif sunucuları görün",
          ],
        },
        {
          heading: "Skills & Hooks",
          body: "Skills, özel slash komutları oluşturmanızı sağlar. Hooks, belirli olaylara otomatik tepkiler eklemenizi sağlar.",
          steps: [
            "Skills: ~/.claude/skills/ klasöründe .md dosyaları oluşturun",
            "/skill-name ile özel komutunuzu çalıştırın",
            "Hooks: ~/.claude/hooks/ klasöründe tanımlayın",
            "Otomatik test, lint veya deploy için hooks kullanın",
          ],
          tip: "Bu koleksiyondaki 50+ hazır skill'i hemen kullanabilirsiniz.",
        },
      ],
      en: [
        {
          heading: "Installation",
          body: "Claude Code is Anthropic's official CLI tool. Node.js v18+ is required.",
          steps: [
            "Ensure Node.js v18+ is installed: node --version",
            "Install globally: npm install -g @anthropic-ai/claude-code",
            "Verify installation: claude --version",
            "First launch: navigate to a project folder and type claude",
          ],
          tip: "On first launch, you'll be prompted to log in to your Anthropic account.",
        },
        {
          heading: "Core Commands",
          body: "The most essential commands for daily use:",
          steps: [
            "claude — start an interactive chat session",
            "claude --help — list all available commands",
            "/exit or Ctrl+D — end the session",
            "Ctrl+C — cancel the current operation",
          ],
          tip: "Type /help inside a session to see available skills and commands.",
        },
        {
          heading: "Plan Mode — Safe Planning",
          body: "Plan Mode lets you review Claude's plan before any changes are made. Always use it for large-scale modifications.",
          steps: [
            "Type /plan to enter Plan Mode",
            "Claude lists what it intends to do step by step",
            "Approve with 'Continue' or redirect as needed",
            "Use /exit-plan to leave Plan Mode",
          ],
        },
        {
          heading: "CLAUDE.md — Project Memory",
          body: "Add a CLAUDE.md file to your project root to give Claude permanent instructions about your project.",
          steps: [
            "Create CLAUDE.md in your project root",
            "Write your technology stack details",
            "Add your coding rules and constraints",
            "Include important file paths and explanations",
          ],
          tip: "Claude reads CLAUDE.md automatically every session — no need to repeat yourself.",
        },
        {
          heading: "MCP Servers",
          body: "Model Context Protocol (MCP) servers extend Claude's capabilities: database access, browser control, API integrations and more.",
          steps: [
            "Open ~/.claude/mcp_settings.json",
            "Add the MCP server configuration you want",
            "Restart Claude",
            "Use /list-mcp to see active servers",
          ],
        },
        {
          heading: "Skills & Hooks",
          body: "Skills let you create custom slash commands. Hooks add automatic responses to specific events.",
          steps: [
            "Skills: create .md files in ~/.claude/skills/",
            "Run your skill with /skill-name",
            "Hooks: define them in ~/.claude/hooks/",
            "Use hooks for automated testing, linting, or deploys",
          ],
          tip: "This collection includes 50+ ready-made skills you can use immediately.",
        },
      ],
    },
  },
  // ── Claude Code Skills Koleksiyonu ───────────────────────────────────────
  {
    id: "702bc658-ef31-4b6c-8162-d46a84517509",
    titleTr: "Claude Code\nSkills Koleksiyonu",
    titleEn: "Claude Code\nSkills Collection",
    type: "Şablon · Koleksiyon",
    emoji: "⚡",
    fileSlugTr: "claude-code-skills-tr.pdf",
    fileSlugEn: "claude-code-skills-en.pdf",
    sections: {
      tr: [
        {
          heading: "Kurulum",
          body: "50+ skill dosyasını Claude Code ortamınıza kurmak yalnızca birkaç dakika alır.",
          steps: [
            "İndirdiğiniz ZIP dosyasını açın",
            "skills/ klasörünü ~/.claude/ dizinine kopyalayın",
            "Terminal'de claude yazarak Claude Code'u başlatın",
            "/help yazarak yüklü skilleri görüntüleyin",
          ],
          tip: "Skill dosyaları .md formatındadır ve düzenlenebilir.",
        },
        {
          heading: "Frontend & Design Skills",
          body: "Kullanıcı arayüzü ve tasarım sistemleri için hazır komutlar:",
          steps: [
            "/design-system — Tailwind ile tasarım sistemi oluşturur",
            "/component [isim] — React bileşeni üretir",
            "/responsive — Mobile-first layout optimize eder",
            "/dark-mode — Dark mode desteği ekler",
          ],
        },
        {
          heading: "Next.js & TypeScript",
          body: "Modern web geliştirme için optimize edilmiş skilllar:",
          steps: [
            "/api-route [endpoint] — Next.js API route oluşturur",
            "/server-action — Server Action tanımlar",
            "/types [model] — TypeScript arayüzleri üretir",
            "/middleware — Next.js middleware şablonu",
          ],
        },
        {
          heading: "Supabase & Veritabanı",
          body: "Supabase entegrasyonu ve veritabanı işlemleri için skilllar:",
          steps: [
            "/supabase-table [tablo] — Tablo ve RLS politikaları",
            "/supabase-auth — Auth akışı kurulumu",
            "/migration — Veritabanı migration dosyası",
            "/rls-policy — Row Level Security politikaları",
          ],
        },
        {
          heading: "Stripe & Ödeme",
          body: "Ödeme sistemi entegrasyonu için hazır komutlar:",
          steps: [
            "/stripe-checkout — Checkout session oluşturur",
            "/stripe-webhook — Webhook handler şablonu",
            "/subscription — Abonelik akışı kurar",
            "/payment-link — Ödeme linki üretir",
          ],
          tip: "Stripe skilllarını kullanmadan önce .env.local'daki API key'leri kontrol edin.",
        },
        {
          heading: "DevOps & Güvenlik",
          body: "Deployment ve güvenlik için skilllar:",
          steps: [
            "/deploy-vercel — Vercel deployment kontrolü",
            "/security-audit — Güvenlik açığı taraması",
            "/env-check — Ortam değişkenleri doğrulama",
            "/ci-pipeline — GitHub Actions workflow oluşturur",
          ],
        },
      ],
      en: [
        {
          heading: "Installation",
          body: "Installing all 50+ skill files into your Claude Code environment takes just a few minutes.",
          steps: [
            "Extract the downloaded ZIP file",
            "Copy the skills/ folder to ~/.claude/ directory",
            "Launch Claude Code by typing claude in terminal",
            "Type /help to view installed skills",
          ],
          tip: "Skill files are in .md format and fully editable.",
        },
        {
          heading: "Frontend & Design Skills",
          body: "Ready-to-use commands for UI and design systems:",
          steps: [
            "/design-system — Creates a Tailwind design system",
            "/component [name] — Generates a React component",
            "/responsive — Optimizes for mobile-first layout",
            "/dark-mode — Adds dark mode support",
          ],
        },
        {
          heading: "Next.js & TypeScript",
          body: "Skills optimized for modern web development:",
          steps: [
            "/api-route [endpoint] — Creates a Next.js API route",
            "/server-action — Defines a Server Action",
            "/types [model] — Generates TypeScript interfaces",
            "/middleware — Next.js middleware template",
          ],
        },
        {
          heading: "Supabase & Database",
          body: "Skills for Supabase integration and database operations:",
          steps: [
            "/supabase-table [table] — Table schema with RLS policies",
            "/supabase-auth — Sets up auth flow",
            "/migration — Database migration file",
            "/rls-policy — Row Level Security policies",
          ],
        },
        {
          heading: "Stripe & Payments",
          body: "Ready-to-use commands for payment system integration:",
          steps: [
            "/stripe-checkout — Creates a checkout session",
            "/stripe-webhook — Webhook handler template",
            "/subscription — Sets up subscription flow",
            "/payment-link — Generates a payment link",
          ],
          tip: "Check your .env.local API keys before using Stripe skills.",
        },
        {
          heading: "DevOps & Security",
          body: "Skills for deployment and security:",
          steps: [
            "/deploy-vercel — Vercel deployment verification",
            "/security-audit — Security vulnerability scan",
            "/env-check — Environment variable validation",
            "/ci-pipeline — Creates GitHub Actions workflow",
          ],
        },
      ],
    },
  },
  // ── Claude Code Mega Prompt Paketi ───────────────────────────────────────
  {
    id: "0289733b-2240-43c6-a5f8-20684aee5194",
    titleTr: "Claude Code\nMega Prompt Paketi",
    titleEn: "Claude Code\nMega Prompt Pack",
    type: "Prompt Koleksiyonu",
    emoji: "🚀",
    fileSlugTr: "claude-code-prompts-tr.pdf",
    fileSlugEn: "claude-code-prompts-en.pdf",
    sections: {
      tr: [
        {
          heading: "Nasıl Kullanılır?",
          body: "200+ prompt, kategoriler halinde düzenlenmiştir. Her promptu doğrudan Claude Code'a yapıştırabilirsiniz.",
          steps: [
            "Kategoriye göre uygun promptu seçin",
            "Köşeli parantez içindeki [] yerleri kendi değerlerinizle doldurun",
            "Promptu Claude Code sohbet penceresine yapıştırın",
            "Çıktıyı inceleyin ve gerekirse düzeltin",
          ],
          tip: "Promptları CLAUDE.md dosyanıza ekleyerek kalıcı hale getirebilirsiniz.",
        },
        {
          heading: "Özellik Geliştirme",
          body: "Yeni özellik eklemek için kullanılan en popüler promptlar:",
          steps: [
            '"[özellik] için eksiksiz bir implementasyon yaz, hata kontrolü dahil"',
            '"[komponent] bileşenine [davranış] ekle, mevcut kodu bozmadan"',
            '"[API endpoint] için Zod schema ve validation ekle"',
            '"[form] için client-side ve server-side doğrulama uygula"',
          ],
        },
        {
          heading: "Hata Ayıklama",
          body: "Hataları hızla tespit etmek için güçlü debug promptları:",
          steps: [
            '"Bu hatayı analiz et ve kök nedenini bul: [hata mesajı]"',
            '"[dosya] dosyasını incele, olası bug\'ları listele"',
            '"TypeScript tip hatalarını düzelt, açıkla"',
            '"Console logları analiz et: [log çıktısı]"',
          ],
        },
        {
          heading: "Refactoring",
          body: "Mevcut kodu iyileştirmek için refactoring promptları:",
          steps: [
            '"Bu fonksiyonu daha okunabilir hale getir, logic değişmesin"',
            '"Tekrar eden kodu bir hook/utility\'e çıkar"',
            '"[dosya] dosyasını SOLID prensiplerine göre yeniden yaz"',
            '"Magic string\'leri constants\'a taşı"',
          ],
        },
        {
          heading: "Veritabanı & API",
          body: "Supabase, API ve veritabanı işlemleri için promptlar:",
          steps: [
            '"[tablo] için RLS politikaları yaz, [koşullar] ile"',
            '"[endpoint] için rate limiting ekle"',
            '"Supabase realtime subscription kur: [tablo]"',
            '"N+1 sorgu problemini çöz: [kod]"',
          ],
        },
        {
          heading: "UI/UX & Deployment",
          body: "Arayüz iyileştirme ve deployment için promptlar:",
          steps: [
            '"[sayfa] için loading ve error state\'leri ekle"',
            '"Bu bileşeni mobil uyumlu hale getir"',
            '"Vercel deployment hatalarını analiz et: [hata]"',
            '"Performance için lazy loading uygula: [bileşen]"',
          ],
        },
      ],
      en: [
        {
          heading: "How to Use",
          body: "200+ prompts organized by category. You can paste any prompt directly into Claude Code.",
          steps: [
            "Choose the right prompt for your category",
            "Fill in the [ ] placeholders with your specific values",
            "Paste the prompt into Claude Code's chat window",
            "Review the output and refine as needed",
          ],
          tip: "Add prompts to your CLAUDE.md file to make them permanent instructions.",
        },
        {
          heading: "Feature Development",
          body: "The most popular prompts for adding new features:",
          steps: [
            '"Write a complete implementation for [feature], including error handling"',
            '"Add [behavior] to [component] without breaking existing code"',
            '"Add Zod schema and validation for [API endpoint]"',
            '"Implement client-side and server-side validation for [form]"',
          ],
        },
        {
          heading: "Debugging",
          body: "Powerful debug prompts to quickly identify issues:",
          steps: [
            '"Analyze this error and find the root cause: [error message]"',
            '"Review [file] and list potential bugs"',
            '"Fix TypeScript type errors and explain each fix"',
            '"Analyze these console logs: [log output]"',
          ],
        },
        {
          heading: "Refactoring",
          body: "Prompts for improving existing code:",
          steps: [
            '"Make this function more readable without changing the logic"',
            '"Extract repeated code into a reusable hook/utility"',
            '"Rewrite [file] following SOLID principles"',
            '"Move magic strings to constants"',
          ],
        },
        {
          heading: "Database & API",
          body: "Prompts for Supabase, API, and database operations:",
          steps: [
            '"Write RLS policies for [table] with [conditions]"',
            '"Add rate limiting to [endpoint]"',
            '"Set up Supabase realtime subscription for: [table]"',
            '"Fix the N+1 query problem: [code]"',
          ],
        },
        {
          heading: "UI/UX & Deployment",
          body: "Prompts for UI improvements and deployment:",
          steps: [
            '"Add loading and error states to [page]"',
            '"Make this component responsive for mobile"',
            '"Analyze Vercel deployment errors: [error]"',
            '"Apply lazy loading for performance: [component]"',
          ],
        },
      ],
    },
  },
];

// ── HTML Template ───────────────────────────────────────────────────────────
function buildHTML(product: typeof PRODUCTS[0], lang: "tr" | "en"): string {
  const title = lang === "tr" ? product.titleTr : product.titleEn;
  const sections = product.sections[lang];
  const tocLabel = lang === "tr" ? "İÇİNDEKİLER" : "CONTENTS";
  const createdBy = lang === "tr" ? "dropcart.digital" : "dropcart.digital";

  const tocItems = sections.map((s, i) =>
    `<tr>
      <td style="padding:6px 0;font-size:13px;color:${COLORS.dark};font-weight:500;">
        <span style="font-weight:700;color:${COLORS.orange};margin-right:8px;">${String(i + 1).padStart(2, "0")}</span>
        ${s.heading}
      </td>
      <td style="padding:6px 0;font-size:13px;color:${COLORS.muted};text-align:right;">s.${i + 2}</td>
    </tr>`
  ).join("");

  const contentPages = sections.map((s, i) => {
    const stepsHtml = s.steps
      ? s.steps.map((step, si) => `
        <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:12px;">
          <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:${COLORS.orange};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;margin-top:2px;">${si + 1}</div>
          <div style="font-size:14px;color:${COLORS.dark};line-height:1.6;padding-top:4px;font-family:monospace;background:#1A1A1A;color:#E8E8E8;padding:8px 12px;border-radius:6px;flex:1;border-left:3px solid ${COLORS.orange};">
            ${step}
          </div>
        </div>
      `).join("")
      : "";

    const tipHtml = s.tip
      ? `<div style="margin-top:20px;background:${COLORS.orangeLight};border-left:4px solid ${COLORS.orange};border-radius:0 8px 8px 0;padding:14px 18px;">
          <p style="margin:0;font-size:13px;color:${COLORS.dark};font-weight:700;">💡 ${lang === "tr" ? "İpucu" : "Tip"}</p>
          <p style="margin:6px 0 0;font-size:13px;color:${COLORS.darkSecondary};line-height:1.6;">${s.tip}</p>
        </div>`
      : "";

    return `
      <div class="page" style="width:210mm;min-height:297mm;padding:40px 45px;box-sizing:border-box;position:relative;background:${COLORS.bg};page-break-before:always;">
        <!-- Terminal header -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid ${COLORS.border};">
          <span style="width:11px;height:11px;border-radius:50%;background:#FF5F57;display:inline-block;"></span>
          <span style="width:11px;height:11px;border-radius:50%;background:#FFBD2E;display:inline-block;"></span>
          <span style="width:11px;height:11px;border-radius:50%;background:#28C840;display:inline-block;"></span>
          <span style="margin-left:10px;font-family:monospace;font-size:12px;color:${COLORS.muted};">${String(i + 1).padStart(2, "0")}_${s.heading.toLowerCase().replace(/\s+/g, "_")}.md</span>
        </div>

        <!-- Section number + heading -->
        <div style="margin-bottom:24px;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.orange};font-weight:700;margin:0 0 8px;">${String(i + 1).padStart(2, "0")} · ${s.heading.toUpperCase()}</p>
          <h2 style="margin:0;font-size:28px;font-weight:800;color:${COLORS.dark};line-height:1.2;">${s.heading} <em style="color:${COLORS.orange};font-style:italic;">${lang === "tr" ? "nasıl?" : "how?"}</em></h2>
        </div>

        <!-- Body text -->
        <p style="font-size:15px;color:${COLORS.darkSecondary};line-height:1.7;margin:0 0 24px;">${s.body}</p>

        <!-- Steps -->
        ${s.steps ? `<p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${COLORS.muted};font-weight:700;margin:0 0 16px;">${lang === "tr" ? "ADIM ADIM" : "STEP BY STEP"}</p>` : ""}
        ${stepsHtml}
        ${tipHtml}

        <!-- Footer -->
        <div style="position:absolute;bottom:28px;left:45px;right:45px;display:flex;justify-content:space-between;align-items:center;">
          <p style="margin:0;font-size:11px;color:${COLORS.muted};">${lang === "tr" ? String(i + 1).padStart(2, "0") + " · " + s.heading : String(i + 1).padStart(2, "0") + " · " + s.heading}</p>
          <p style="margin:0;font-size:11px;color:${COLORS.muted};">@dropcart.digital</p>
        </div>
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: white; }
  @page { size: A4; margin: 0; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
</style>
</head>
<body>

<!-- Cover Page -->
<div class="page" style="width:210mm;min-height:297mm;padding:0;box-sizing:border-box;background:${COLORS.bg};">

  <!-- Top bar -->
  <div style="background:${COLORS.orange};padding:18px 45px;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);"></span>
      <span style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);"></span>
      <span style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.5);"></span>
      <span style="font-family:monospace;font-size:12px;color:rgba(255,255,255,.8);margin-left:10px;">guide_${lang}.md</span>
    </div>
    <span style="font-size:11px;color:rgba(255,255,255,.7);letter-spacing:0.1em;">v1.0</span>
  </div>

  <!-- Hero section -->
  <div style="padding:50px 45px 0;">
    <!-- Emoji visual -->
    <div style="display:inline-flex;align-items:center;justify-content:center;background:${COLORS.orangeLight};border-radius:20px;padding:28px 36px;margin-bottom:36px;">
      <span style="font-size:60px;line-height:1;">${product.emoji}</span>
      <span style="font-size:40px;margin:0 16px;color:${COLORS.orange};font-weight:300;">→</span>
      <span style="font-size:28px;font-weight:800;color:${COLORS.orange};font-family:monospace;">1</span>
    </div>

    <!-- Title -->
    <div style="margin-bottom:16px;">
      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.orange};font-weight:700;margin:0 0 10px;">dropcart.digital · ${product.type}</p>
      <h1 style="font-size:42px;font-weight:800;line-height:1.1;color:${COLORS.dark};white-space:pre-line;">${title}</h1>
    </div>

    <!-- Subtitle -->
    <p style="font-size:15px;color:${COLORS.muted};line-height:1.7;max-width:420px;margin-bottom:40px;">
      ${lang === "tr"
        ? `Bu kılavuzda adım adım her şeyi öğreneceksiniz. Kurulumdan gelişmiş kullanıma, ${sections.length} bölümde tam rehber.`
        : `This guide covers everything step by step. From installation to advanced usage — a complete guide in ${sections.length} chapters.`}
    </p>

    <!-- Divider -->
    <div style="height:1px;background:${COLORS.border};margin-bottom:32px;"></div>

    <!-- Table of contents -->
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.muted};font-weight:700;margin-bottom:16px;">${tocLabel}</p>
    <table style="width:100%;border-collapse:collapse;">
      ${tocItems}
    </table>
  </div>

  <!-- Footer -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:22px 45px;border-top:1px solid ${COLORS.border};display:flex;justify-content:space-between;align-items:center;">
    <p style="font-size:11px;color:${COLORS.muted};">${lang === "tr" ? (title.split("\n")[0] + " · Kullanım Kılavuzu") : (title.split("\n")[0] + " · Usage Guide")}</p>
    <p style="font-size:11px;color:${COLORS.muted};">@dropcart.digital</p>
  </div>
</div>

${contentPages}

</body>
</html>`;
}

// ── Upload to Supabase ──────────────────────────────────────────────────────
async function uploadToSupabase(filePath: string, storagePath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const { error } = await supabase.storage
    .from("product-files")
    .upload(storagePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("product-files").getPublicUrl(storagePath);
  return data.publicUrl;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const outDir = path.join(__dirname, "../.generated-pdfs");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();

  for (const product of PRODUCTS) {
    for (const lang of ["tr", "en"] as const) {
      const slug = lang === "tr" ? product.fileSlugTr : product.fileSlugEn;
      const localPath = path.join(outDir, slug);
      const storagePath = `content/${slug}`;

      console.log(`\n📄 Generating ${slug}...`);

      // 1. Build HTML
      const html = buildHTML(product, lang);
      const htmlPath = localPath.replace(".pdf", ".html");
      fs.writeFileSync(htmlPath, html, "utf-8");

      // 2. Convert to PDF
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.pdf({
        path: localPath,
        format: "A4",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await page.close();
      console.log(`  ✅ PDF saved: ${localPath}`);

      // 3. Upload to Supabase
      try {
        const publicUrl = await uploadToSupabase(localPath, storagePath);
        console.log(`  ☁️  Uploaded: ${publicUrl}`);

        // 4. Update DB
        const field = lang === "tr" ? "file_url" : "file_url_en";
        const { error } = await supabase.from("products").update({ [field]: publicUrl }).eq("id", product.id);
        if (error) console.error(`  ⚠️  DB update failed: ${error.message}`);
        else console.log(`  🗄️  DB updated: ${field}`);
      } catch (err) {
        console.error(`  ⚠️  Upload error: ${err}`);
      }
    }
  }

  await browser.close();
  console.log("\n✨ All PDFs generated and uploaded!");
}

main().catch(console.error);
