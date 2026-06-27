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

  // ── Canva Sosyal Medya Paketi ──────────────────────────────────────────────
  {
    id: "e383277d-2532-4e89-8fa4-14dce790f3e3",
    titleTr: "Canva Sosyal\nMedya Paketi",
    titleEn: "Canva Social\nMedia Pack",
    type: "Şablon · Koleksiyon",
    emoji: "🎨",
    fileSlugTr: "canva-guide-tr.pdf",
    fileSlugEn: "canva-guide-en.pdf",
    sections: {
      tr: [
        {
          heading: "Pakete Erişim",
          body: "Paket, 50+ hazır Canva şablonu içerir. Tüm şablonlar düzenlenebilir ve marka renklerinize uyarlanabilir.",
          steps: [
            "E-postanızdaki bağlantıya tıklayarak Canva'ya gidin",
            "Şablonu kopyalamak için 'Bu şablonu kullan' butonuna basın",
            "Canva hesabınıza otomatik olarak eklenir",
            "Metin, renk ve görselleri kendi markanıza göre değiştirin",
          ],
          tip: "Ücretsiz Canva hesabıyla tüm şablonları kullanabilirsiniz.",
        },
        {
          heading: "Instagram Gönderileri",
          body: "1:1 kare ve 4:5 dikey formatlarda hazır tasarımlar. Feed tutarlılığı için renk paletleri dahildir.",
          steps: [
            "Şablonu açın ve metni kendi mesajınızla değiştirin",
            "Arka plan rengini marka renginizle değiştirin",
            "Görseli kendi fotoğrafınızla değiştirin (opsiyonel)",
            "PNG veya JPG olarak 1080x1080px indirin",
          ],
        },
        {
          heading: "Instagram & TikTok Story",
          body: "9:16 dikey formatta hazır Story şablonları. Dikkat çekici animasyon fikirleri dahildir.",
          steps: [
            "Story şablonunu seçin (9:16 format)",
            "Metni ve CTA butonunu güncelleyin",
            "Arka planı markanıza göre özelleştirin",
            "Canva üzerinden animasyon ekleyebilirsiniz",
          ],
          tip: "Story'ler için metni kısa tutun, maksimum 7 kelime önerilir.",
        },
        {
          heading: "LinkedIn Gönderi Tasarımı",
          body: "Profesyonel görünümlü LinkedIn gönderileri için özel şablonlar. Karousel ve tekli gönderi formatları.",
          steps: [
            "LinkedIn şablonunu seçin (1200x627px veya 1080x1080px)",
            "Başlık metnini 5 kelimeyi aşmayacak şekilde yazın",
            "Marka logonuzu sol üst köşeye yerleştirin",
            "LinkedIn mavi tonlarını veya marka renginizi kullanın",
          ],
        },
        {
          heading: "Renk & Yazı Tipi Özelleştirme",
          body: "Tüm şablonlar marka kılavuzunuza uyarlanabilir. Canva'nın Brand Kit özelliğini kullanın.",
          steps: [
            "Sol menüden Brand Kit seçeneğine gidin",
            "Logonuzu ve renk paletinizi yükleyin",
            "Kullandığınız yazı tiplerini ekleyin",
            "Şablonu açtığınızda marka renkleri otomatik uygulanır",
          ],
          tip: "Pro hesap olmadan da Brand Kit özelliğinin bazı özellikleri ücretsiz kullanılabilir.",
        },
        {
          heading: "İçerik Takvimi & Planlama",
          body: "Pakete ek olarak aylık içerik takvimi şablonu dahildir. Hangi günlerde ne paylaşacağınızı planlayın.",
          steps: [
            "İçerik takvimi şablonunu açın",
            "Haftalık tema ve konularınızı doldurun",
            "Her gün için şablon numarası not edin",
            "Canva Scheduler ile gönderileri planlayın (Pro)",
          ],
        },
      ],
      en: [
        {
          heading: "Accessing the Pack",
          body: "The pack includes 50+ ready-to-use Canva templates. All templates are editable and adaptable to your brand colors.",
          steps: [
            "Click the link in your email to open Canva",
            "Press 'Use this template' to copy it to your account",
            "The template is automatically added to your Canva library",
            "Change text, colors, and visuals to match your brand",
          ],
          tip: "All templates work with a free Canva account.",
        },
        {
          heading: "Instagram Feed Posts",
          body: "Ready-made designs in 1:1 square and 4:5 portrait formats. Matching color palettes included.",
          steps: [
            "Open the template and replace the text with your message",
            "Change the background color to your brand color",
            "Replace the image with your own photo (optional)",
            "Download as PNG or JPG at 1080x1080px",
          ],
        },
        {
          heading: "Instagram & TikTok Stories",
          body: "Ready-made story templates in 9:16 vertical format. Attention-grabbing animation ideas included.",
          steps: [
            "Select a story template (9:16 format)",
            "Update the text and CTA button",
            "Customize the background to match your brand",
            "Add animations via Canva's animation tool",
          ],
          tip: "Keep story text short, a maximum of 7 words is recommended.",
        },
        {
          heading: "LinkedIn Post Design",
          body: "Professional LinkedIn post templates. Carousel and single-post formats available.",
          steps: [
            "Select a LinkedIn template (1200x627px or 1080x1080px)",
            "Write your headline, keep it under 5 words",
            "Place your brand logo in the top-left corner",
            "Use LinkedIn blue tones or your brand color",
          ],
        },
        {
          heading: "Color & Font Customization",
          body: "All templates can be adapted to your brand guidelines. Use Canva's Brand Kit feature.",
          steps: [
            "Go to Brand Kit in the left menu",
            "Upload your logo and color palette",
            "Add your brand fonts",
            "Brand colors are automatically applied when you open a template",
          ],
          tip: "Some Brand Kit features are available for free without a Pro account.",
        },
        {
          heading: "Content Calendar & Planning",
          body: "A monthly content calendar template is included. Plan which posts to share on which days.",
          steps: [
            "Open the content calendar template",
            "Fill in your weekly themes and topics",
            "Note the template number for each day",
            "Use Canva Scheduler to plan posts in advance (Pro)",
          ],
        },
      ],
    },
  },

  // ── ChatGPT Mega Prompt Paketi ─────────────────────────────────────────────
  {
    id: "5cd199e1-4bd1-4131-b95a-7bdd120e9802",
    titleTr: "ChatGPT Mega\nPrompt Paketi",
    titleEn: "ChatGPT Mega\nPrompt Pack",
    type: "Koleksiyon · Şablon",
    emoji: "🤖",
    fileSlugTr: "chatgpt-guide-tr.pdf",
    fileSlugEn: "chatgpt-guide-en.pdf",
    sections: {
      tr: [
        {
          heading: "Paketi Nasıl Kullanırsın",
          body: "300+ kategorilendirilmiş ChatGPT promptu. [ ] içindeki kısımları kendi değerlerinizle doldurun.",
          steps: [
            "Istediğiniz kategoriyi bulun (içerik, e-posta, satış vb.)",
            "Promptu kopyalayın",
            "[ ] kısımlarını kendi bilgilerinizle değiştirin",
            "ChatGPT'ye yapıştırın ve yanıtı alın",
          ],
          tip: "GPT-4 veya GPT-4o ile en iyi sonuçları alırsınız.",
        },
        {
          heading: "Içerik Üretimi",
          body: "Blog yazısı, sosyal medya, video script için en çok kullanılan promptlar:",
          steps: [
            '"[konu] hakkında SEO uyumlu 1000 kelimelik blog yazısı yaz"',
            '"[ürün] için Instagram caption, emoji ve hashtag dahil"',
            '"[sektör] için YouTube video scripti, kanca ile başla"',
            '"[marka] için 30 günlük içerik takvimi oluştur"',
          ],
        },
        {
          heading: "Satış & Pazarlama",
          body: "Dönüşüm oranını artıran satış odaklı promptlar:",
          steps: [
            '"[ürün] için AIDA formatında satış metni yaz"',
            '"[hedef kitle] için e-posta bülteni, konu satırı dahil"',
            '"[rakip] ile kıyaslamalı ürün analizi yap"',
            '"[landing page] için 5 farklı başlık öner"',
          ],
          tip: "Promptları zincirleme kullanın: birinin çıktısını diğerine girin.",
        },
        {
          heading: "Müşteri Hizmetleri",
          body: "Profesyonel ve empatik yanıt promptları:",
          steps: [
            '"[şikayet] için özür e-postası yaz, çözüm öner"',
            '"[soru] için SSS cevabı, sade ve net"',
            '"Kızgın müşteriyi sakinleştiren yanıt yaz"',
            '"Geri iade talebi için politika açıklaması"',
          ],
        },
        {
          heading: "Proje & Strateji",
          body: "İş planı, strateji ve analiz promptları:",
          steps: [
            '"[iş fikri] için SWOT analizi yap"',
            '"[proje] için 30-60-90 günlük plan oluştur"',
            '"[sektör] için rakip analizi, 5 rakip"',
            '"Startup için pitch deck ana hatları"',
          ],
        },
        {
          heading: "Verimlilik Ipuçları",
          body: "Promptlardan maksimum verim almak için teknikler:",
          steps: [
            "Rol ver: Uzman bir [meslek] gibi yanıt ver",
            "Çıktı formatı belirt: tablo, madde, kod bloğu",
            "Uzunluk sınırla: 200 kelimeden fazla olmasın",
            "Örnek ver: şu formatta yaz diyerek örnek gösterin",
          ],
          tip: "Aynı konuyu 3 farklı prompt ile deneyin, en iyisini seçin.",
        },
      ],
      en: [
        {
          heading: "How to Use the Pack",
          body: "300+ categorized ChatGPT prompts. Fill in the [ ] placeholders with your specific values.",
          steps: [
            "Find the category you need (content, email, sales, etc.)",
            "Copy the prompt",
            "Replace the [ ] placeholders with your information",
            "Paste into ChatGPT and get your result",
          ],
          tip: "Best results with GPT-4 or GPT-4o.",
        },
        {
          heading: "Content Creation",
          body: "The most-used prompts for blog posts, social media, and video scripts:",
          steps: [
            '"Write a 1000-word SEO-optimized blog post about [topic]"',
            '"Instagram caption for [product], include emojis and hashtags"',
            '"YouTube video script for [industry], start with a hook"',
            '"Create a 30-day content calendar for [brand]"',
          ],
        },
        {
          heading: "Sales & Marketing",
          body: "Conversion-focused prompts to boost sales:",
          steps: [
            '"Write sales copy for [product] in AIDA format"',
            '"Email newsletter for [target audience], include subject line"',
            '"Comparative product analysis vs [competitor]"',
            '"Suggest 5 different headlines for [landing page]"',
          ],
          tip: "Chain prompts: feed the output of one into the next.",
        },
        {
          heading: "Customer Service",
          body: "Professional and empathetic response prompts:",
          steps: [
            '"Write an apology email for [complaint] and offer a solution"',
            '"FAQ answer for [question], clear and concise"',
            '"Write a response that calms an angry customer"',
            '"Policy explanation for a refund request"',
          ],
        },
        {
          heading: "Project & Strategy",
          body: "Business planning, strategy, and analysis prompts:",
          steps: [
            '"Do a SWOT analysis for [business idea]"',
            '"Create a 30-60-90 day plan for [project]"',
            '"Competitor analysis for [industry], 5 competitors"',
            '"Pitch deck outline for a startup"',
          ],
        },
        {
          heading: "Productivity Tips",
          body: "Techniques to get the most out of your prompts:",
          steps: [
            "Assign a role: Respond as an expert [profession]",
            "Specify output format: table, bullet points, code block",
            "Limit length: No more than 200 words",
            "Give an example: write in this format and show a sample",
          ],
          tip: "Try the same topic with 3 different prompts, pick the best result.",
        },
      ],
    },
  },

  // ── Viral İçerik Üretme Rehberi ───────────────────────────────────────────
  {
    id: "573792c0-9df4-450a-97d1-47bb874c5fe5",
    titleTr: "Viral İçerik\nÜretme Rehberi",
    titleEn: "Viral Content\nCreation Guide",
    type: "Kılavuz · E-Kitap",
    emoji: "🚀",
    fileSlugTr: "viral-guide-tr.pdf",
    fileSlugEn: "viral-guide-en.pdf",
    sections: {
      tr: [
        {
          heading: "Viral İçerik Psikolojisi",
          body: "Viral olan içerikler 6 temel duygudan birini tetikler: şaşkınlık, sevinç, öfke, korku, üzüntü veya tiksinti.",
          steps: [
            "İçeriğinizin hangi duyguyu hedeflediğini belirleyin",
            "Başlık ve kanca o duyguyu ilk 3 saniyede vermelidir",
            "Paylaşma motivasyonu yaratın: Bu arkadaşlarını yansıtıyor",
            "Kimlik ile bağ kurun: Bunu bilen biri paylaşır",
          ],
          tip: "Şaşkınlık duygusu en yüksek paylaşım oranını üretir.",
        },
        {
          heading: "Hook Formula - İlk 3 Saniye",
          body: "İzleyicinin karar anı ilk 3 saniyedir. Kanca olmadan içerik viral olmaz.",
          steps: [
            "Soru formatı: Neden [beklenmedik durum] oluyor?",
            "İddia formatı: [Rakam] kişi bunu hala bilmiyor",
            "Zıt formatı: Herkesin yaptığı şey aslında yanlış",
            "Hikaye formatı: Geçen hafta [sürpriz] oldu ve şimdi...",
          ],
          tip: "İlk kareye merak uyandıran bir görsel veya metin koyun.",
        },
        {
          heading: "Platform Algoritmaları",
          body: "Her platformun algoritması farklı sinyalleri önceliklendirir. Doğru strateji platform bazlı değişir.",
          steps: [
            "TikTok: izlenme süresi ve yeniden izleme oranı önceliklidir",
            "Instagram Reels: kaydetme ve paylaşma en güçlü sinyaldir",
            "YouTube Shorts: tıklama oranı ve izleme tamamlama kritiktir",
            "LinkedIn: yorum kalitesi ve bekleme süresi önemlidir",
          ],
        },
        {
          heading: "İçerik Formatları",
          body: "2024-2025'te en yüksek erişim sağlayan içerik formatları:",
          steps: [
            "Öğretici içerik: X adımda Y nasıl yapılır",
            "Transformation: Öncesi vs Sonrası formatı",
            "Tartışma: Herkes X yapar, ben Y yaparım (işte neden)",
            "Günlük vlog: Bir günümde neler oluyor",
          ],
          tip: "Seriler tek videolardan daha fazla takipçi kazandırır.",
        },
        {
          heading: "SEO & Hashtag Stratejisi",
          body: "Doğru anahtar kelime ve hashtag seçimi organik erişimi 10 kat artırabilir.",
          steps: [
            "Nişinizde 3-5 orta rekabetli hashtag kullanın",
            "Başlık ve açıklamaya anahtar kelimeyi doğal yerleştirin",
            "TikTok aramasında nişinizi araştırın",
            "İlk yorum olarak ek hashtag ekleyin",
          ],
        },
        {
          heading: "Analiz & Optimizasyon",
          body: "Veriye dayalı içerik stratejisi için temel metrikler:",
          steps: [
            "İzlenme süresi oranı: hedef yüzde 50 üzeri",
            "Kaydetme oranı: yüzde 2 üzeri güçlü sinyal",
            "Paylaşma ve görüntülenme oranını haftalık takip edin",
            "En iyi 3 içeriğinizi analiz edip benzerlerini üretin",
          ],
          tip: "En iyi performans gösteren içeriğinizi formüle dönüştürün.",
        },
      ],
      en: [
        {
          heading: "Psychology of Viral Content",
          body: "Viral content triggers one of 6 core emotions: awe, joy, anger, fear, sadness, or disgust.",
          steps: [
            "Identify which emotion your content targets",
            "Your hook and headline must deliver that emotion in 3 seconds",
            "Create a sharing motivation: This perfectly describes my friend",
            "Build identity connection: Someone who knows this will share it",
          ],
          tip: "Awe produces the highest share rates of any emotion.",
        },
        {
          heading: "Hook Formula - First 3 Seconds",
          body: "The viewer's decision happens in the first 3 seconds. No hook means no virality.",
          steps: [
            "Question format: Why does [unexpected thing] happen?",
            "Claim format: [Number] people still do not know this",
            "Contrarian format: What everyone does is actually wrong",
            "Story format: Last week [surprise] happened and now...",
          ],
          tip: "Put a curiosity-driving visual or text in the first frame.",
        },
        {
          heading: "Platform Algorithms",
          body: "Each platform's algorithm prioritizes different signals. The right strategy changes by platform.",
          steps: [
            "TikTok: watch time and rewatch rate are top priorities",
            "Instagram Reels: saves and shares are the strongest signals",
            "YouTube Shorts: click-through rate and completion rate are critical",
            "LinkedIn: comment quality and dwell time matter most",
          ],
        },
        {
          heading: "Content Formats",
          body: "The highest-reach content formats of 2024-2025:",
          steps: [
            "Tutorial: How to do Y in X steps",
            "Transformation: Before vs After format",
            "Contrarian: Everyone does X, I do Y and here is why",
            "Daily vlog: What happens in my typical day",
          ],
          tip: "Series earn more followers than standalone videos.",
        },
        {
          heading: "SEO & Hashtag Strategy",
          body: "The right keywords and hashtags can multiply organic reach by 10x.",
          steps: [
            "Use 3-5 medium-competition hashtags in your niche",
            "Naturally include your keyword in the title and description",
            "Research your niche in TikTok search",
            "Add extra hashtags as the first comment",
          ],
        },
        {
          heading: "Analytics & Optimization",
          body: "Key metrics for a data-driven content strategy:",
          steps: [
            "Watch time rate: target above 50 percent",
            "Save rate: above 2 percent is a strong signal",
            "Track your share-to-view ratio weekly",
            "Analyze your top 3 posts and produce similar content",
          ],
          tip: "Turn your best-performing content into a repeatable formula.",
        },
      ],
    },
  },

  // ── E-Ticaret Finansal Tracker ─────────────────────────────────────────────
  {
    id: "5d3c4e5d-29e9-4352-b962-677545ef67f1",
    titleTr: "E-Ticaret\nFinansal Tracker",
    titleEn: "E-Commerce\nFinancial Tracker",
    type: "Şablon · Araç",
    emoji: "📊",
    fileSlugTr: "eticaret-guide-tr.pdf",
    fileSlugEn: "eticaret-guide-en.pdf",
    sections: {
      tr: [
        {
          heading: "Şablona Erişim & Kurulum",
          body: "E-Ticaret Finansal Tracker, Google Sheets şablonudur. Google hesabınıza kopyalayarak hemen kullanmaya başlayabilirsiniz.",
          steps: [
            "Paylaşılan bağlantıyı açın",
            "Sağ üst köşeden Kopyasını Oluştur seçeneğine tıklayın",
            "Şablonu Google Drive'ınıza kaydedin",
            "Sarı hücrelerden kendi bilgilerinizi girmeye başlayın",
          ],
          tip: "Formülleri değiştirmeyin, yalnızca sarı renkli hücrelere veri girin.",
        },
        {
          heading: "Ürün & Maliyet Analizi",
          body: "Ürün karlılığını doğru hesaplamak için tüm maliyetleri girmelisiniz.",
          steps: [
            "Ürün adı ve satış fiyatını girin",
            "Tedarik maliyetini KDV dahil girin",
            "Kargo ve ambalaj maliyetini ekleyin",
            "Platform komisyonunu yüzde olarak girin",
          ],
        },
        {
          heading: "Satış Takibi",
          body: "Günlük, haftalık ve aylık satış verilerinizi takip edin:",
          steps: [
            "Her satışı tarih ve platform bilgisiyle girin",
            "Satış Takibi sekmesine sipariş numarasını ekleyin",
            "İptal ve iade satışlarını işaretleyin",
            "Haftalık özet otomatik hesaplanır",
          ],
          tip: "Her gün 5 dakika ayırarak verileri güncel tutun.",
        },
        {
          heading: "Gider Yönetimi",
          body: "Sabit ve değişken giderleri ayrı takip edin:",
          steps: [
            "Sabit giderler: reklam paketi, depo kirası, abonelikler",
            "Değişken giderler: reklam harcaması, iade kargo bedeli",
            "Gider kategorisini belirleyin: pazarlama, operasyon vb.",
            "Aylık gider raporu otomatik oluşturulur",
          ],
        },
        {
          heading: "Karlılık Dashboard",
          body: "Tüm veriler otomatik olarak ana dashboard'a yansır. Anlık kar ve zarar görebilirsiniz.",
          steps: [
            "Dashboard sekmesini açın",
            "Aylık brüt kar ve net kar otomatik hesaplanır",
            "Ürün bazlı karlılık grafiğini inceleyin",
            "En karlı ve en zararlı ürünleri belirleyin",
          ],
          tip: "Net kar marjınız yüzde 20'nin altına düştüğünde uyarı ikonu görünür.",
        },
        {
          heading: "Vergi & Muhasebe",
          body: "Muhasebecimize verecekleriniz için hazır raporlar:",
          steps: [
            "Aylık gelir özeti sekmesini açın",
            "KDV hesaplamalarını inceleyin",
            "Üç aylık raporu PDF olarak dışa aktarın",
            "Gider faturalarını Belgeler sütununa not edin",
          ],
        },
      ],
      en: [
        {
          heading: "Accessing & Setting Up",
          body: "The E-Commerce Financial Tracker is a Google Sheets template. Copy it to your Google account and start right away.",
          steps: [
            "Open the shared link",
            "Click Make a copy in the top-right corner",
            "Save the template to your Google Drive",
            "Start entering your data in the yellow-highlighted cells",
          ],
          tip: "Do not modify formulas, enter data only in the yellow cells.",
        },
        {
          heading: "Product & Cost Analysis",
          body: "To accurately calculate product profitability, enter all costs:",
          steps: [
            "Enter the product name and selling price",
            "Enter the supply cost including tax",
            "Add shipping and packaging costs",
            "Enter the platform commission as a percentage",
          ],
        },
        {
          heading: "Sales Tracking",
          body: "Track your daily, weekly, and monthly sales data:",
          steps: [
            "Enter each sale with the date and platform",
            "Add order numbers to the Sales Tracking tab",
            "Mark cancelled and returned orders",
            "Weekly summaries are calculated automatically",
          ],
          tip: "Spend 5 minutes each day keeping data current.",
        },
        {
          heading: "Expense Management",
          body: "Track fixed and variable expenses separately:",
          steps: [
            "Fixed costs: ad packages, warehouse rent, subscriptions",
            "Variable costs: ad spend, return shipping fees",
            "Assign an expense category: marketing, operations, etc.",
            "Monthly expense reports are generated automatically",
          ],
        },
        {
          heading: "Profitability Dashboard",
          body: "All data reflects automatically in the main dashboard. See profit and loss in real time.",
          steps: [
            "Open the Dashboard tab",
            "Monthly gross and net profit are calculated automatically",
            "Review the product-level profitability chart",
            "Identify your most and least profitable products",
          ],
          tip: "A warning icon appears when your net profit margin drops below 20 percent.",
        },
        {
          heading: "Tax & Accounting",
          body: "Ready-made reports to hand to your accountant:",
          steps: [
            "Open the Monthly Income Summary tab",
            "Review the VAT calculations",
            "Export the quarterly report as a PDF",
            "Note expense receipts in the Documents column",
          ],
        },
      ],
    },
  },

  // ── Freelancer Notion CRM Şablonu ─────────────────────────────────────────
  {
    id: "b366a630-a3e4-4f10-92f6-d068e86693b2",
    titleTr: "Freelancer\nNotion CRM",
    titleEn: "Freelancer\nNotion CRM",
    type: "Şablon · Araç",
    emoji: "🗂️",
    fileSlugTr: "freelancer-guide-tr.pdf",
    fileSlugEn: "freelancer-guide-en.pdf",
    sections: {
      tr: [
        {
          heading: "Şablonu Kopyalama",
          body: "Notion CRM şablonu, Notion hesabınıza tek tıkla kopyalanır. Ücretsiz Notion hesabı yeterlidir.",
          steps: [
            "E-postanızdaki Notion şablon bağlantısını açın",
            "Sağ üst köşeden Duplicate butonuna tıklayın",
            "Şablon çalışma alanınıza kopyalanır",
            "My CRM adıyla kaydedin ve düzenlemeye başlayın",
          ],
          tip: "Notion Mobile uygulamasıyla her yerden erişebilirsiniz.",
        },
        {
          heading: "Müşteri Veritabanı",
          body: "Tüm mevcut ve potansiyel müşterilerinizi tek bir veritabanında yönetin.",
          steps: [
            "Müşteri adı ve iletişim bilgilerini girin",
            "Durum etiketini belirleyin: Potansiyel, Aktif, Tamamlandı",
            "Sektör ve bütçe aralığını ekleyin",
            "İlk görüşme tarihini not edin",
          ],
        },
        {
          heading: "Proje & Görev Takibi",
          body: "Her müşteriyle bağlantılı projelerinizi ve görevlerinizi takip edin:",
          steps: [
            "Müşteri sayfasından Proje Ekle butonuna basın",
            "Proje adı, bütçe ve teslim tarihini girin",
            "Görevleri alt bölümlere ekleyin",
            "Tamamlanma yüzdesini güncelleyin",
          ],
          tip: "Proje görünümünü Kanban veya Timeline olarak değiştirebilirsiniz.",
        },
        {
          heading: "Teklif & Fatura Takibi",
          body: "Gönderilen teklifleri ve faturaları aynı yerden yönetin:",
          steps: [
            "Teklif durumunu seçin: Taslak, Gönderildi, Kabul, Reddedildi",
            "Teklif tutarı ve tarihini girin",
            "Fatura oluşturulduğunda durumu güncelleyin",
            "Ödeme tarihini ve tutarı not edin",
          ],
        },
        {
          heading: "İletişim Geçmişi",
          body: "Her müşteriyle yapılan görüşmeleri kayıt altına alın:",
          steps: [
            "Müşteri sayfasına gidin ve Not Ekle seçin",
            "Görüşme tarihini ve kanalını belirtin: e-posta, telefon",
            "Konuşulanları özetle yazın",
            "Sonraki adımı ve takip tarihini ekleyin",
          ],
          tip: "Önemli e-postaları kopyalayıp Notion'a yapıştırın, arama özelliğiyle bulabilirsiniz.",
        },
        {
          heading: "Gelir & Hedef Takibi",
          body: "Aylık gelir hedeflerinizi belirleyin ve gerçekleşeni takip edin:",
          steps: [
            "Dashboard sayfasını açın",
            "Aylık gelir hedefinizi girin",
            "Onaylanan projeler otomatik olarak gelire eklenir",
            "Hedef ve gerçekleşme grafiğini inceleyin",
          ],
        },
      ],
      en: [
        {
          heading: "Copying the Template",
          body: "The Notion CRM template copies to your Notion workspace with one click. A free Notion account is all you need.",
          steps: [
            "Open the Notion template link from your email",
            "Click Duplicate in the top-right corner",
            "The template is copied to your workspace",
            "Save it as My CRM and start editing",
          ],
          tip: "Access it from anywhere with the Notion Mobile app.",
        },
        {
          heading: "Client Database",
          body: "Manage all your current and potential clients in a single database.",
          steps: [
            "Enter the client name and contact information",
            "Set the status tag: Prospect, Active, Completed",
            "Add the industry and budget range",
            "Note the date of first contact",
          ],
        },
        {
          heading: "Project & Task Tracking",
          body: "Track projects and tasks linked to each client:",
          steps: [
            "Click Add Project from the client page",
            "Enter the project name, budget, and deadline",
            "Add tasks as sub-items",
            "Update the completion percentage as you progress",
          ],
          tip: "Switch the project view to Kanban or Timeline mode.",
        },
        {
          heading: "Proposal & Invoice Tracking",
          body: "Manage your proposals and invoices from the same place:",
          steps: [
            "Select the proposal status: Draft, Sent, Accepted, Rejected",
            "Enter the proposal amount and date",
            "Update the status when an invoice is created",
            "Note the payment date and amount received",
          ],
        },
        {
          heading: "Communication History",
          body: "Keep a record of every interaction with each client:",
          steps: [
            "Go to the client page and select Add Note",
            "Specify the meeting date and channel: email, phone, etc.",
            "Summarize what was discussed",
            "Add the next step and follow-up date",
          ],
          tip: "Copy important emails and paste them into Notion, find them later with search.",
        },
        {
          heading: "Revenue & Goal Tracking",
          body: "Set monthly income goals and track actuals:",
          steps: [
            "Open the Dashboard page",
            "Enter your monthly income goal",
            "Confirmed projects are automatically added to revenue",
            "Review the goal versus actual chart",
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
