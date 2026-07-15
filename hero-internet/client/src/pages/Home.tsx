import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Zap, Wifi, Users, MapPin, Phone, Mail, ArrowRight, Lightbulb, AlertCircle, HelpCircle, Clock, Shield, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { checkCoverage, getAllBTS } from "@/lib/bts-utils";
import { geocodeAddress } from "@/lib/geocoding";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BTSMap } from "@/components/BTSMap";

/**
 * Design Philosophy: Modern Connectivity
 * - Primary Color: Vibrant Orange (#FF6B35)
 * - Secondary: Deep Navy (#1A3A52)
 * - Accent: Bright Cyan (#00D4FF)
 * - Typography: Poppins (headlines) + Inter (body)
 * - Layout: Asymmetric, flowing with organic wave dividers
 * - Motion: Smooth, purposeful animations under 300ms
 * - Language: Bilingual (English + Bahasa Indonesia)
 * - BTS Data: Real coverage checking using 22 BTS towers from Excel
 * - UX: New customer-focused with onboarding, trust signals, mobile optimization
 */

export default function Home() {
  const [coverage, setCoverage] = useState<"checked" | "covered" | "waitlist" | "notfound" | null>(null);
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [language, setLanguage] = useState<"en" | "id">("id");
  const [isChecking, setIsChecking] = useState(false);
  const [nearestBTSInfo, setNearestBTSInfo] = useState<{ name: string; distance: string } | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [btsCount, setBtsCount] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Get BTS count for trust signal
  useEffect(() => {
    setBtsCount(getAllBTS().length);
  }, []);

  const handleCheckCoverage = async () => {
    if (district && address) {
      setIsChecking(true);
      setDetectedAddress(null);
      try {
        // Real geocoding (Maps API loaded on demand)
        const coords = await geocodeAddress(address, district);

        if (coords) {
          setDetectedAddress(coords.formattedAddress || null);
          // Check coverage against BTS data (400 m radius)
          const result = checkCoverage(coords.latitude, coords.longitude);

          const formatDistance = (d: number | null) =>
            d == null
              ? "—"
              : d < 1
                ? `${Math.round(d * 1000)} m`
                : `${d.toFixed(2)} km`;

          if (result.isCovered && result.nearestBTS) {
            setCoverage("covered");
            setNearestBTSInfo({
              name: result.nearestBTS.name,
              distance: formatDistance(result.distance),
            });
          } else {
            setCoverage("waitlist");
            // Still show the nearest tower so users understand how far they are
            setNearestBTSInfo(
              result.nearestBTS
                ? {
                    name: result.nearestBTS.name,
                    distance: formatDistance(result.distance),
                  }
                : null
            );
          }
        } else {
          // Address could not be located — do NOT guess, ask user to refine
          setCoverage("notfound");
          setNearestBTSInfo(null);
        }
      } catch (error) {
        console.error("Coverage check error:", error);
        setCoverage("notfound");
        setNearestBTSInfo(null);
      } finally {
        setIsChecking(false);
      }
    }
  };

  // Translation object
  const t = {
    en: {
      nav: { howItWorks: "How It Works", coverage: "Coverage", packages: "Packages", contact: "Contact", faq: "FAQ" },
      hero: {
        title: "Fast Internet for Rural Indonesia",
        titleHighlight: "Rural Indonesia",
        subtitle: "No fiber required. No hassle. Just reliable, fast connectivity for your home or business.",
        checkCoverage: "Check Coverage",
        applyNow: "Apply Now",
        trusted: "Trusted by 1000+ customers",
      },
      onboarding: {
        title: "Getting Started with Hero",
        subtitle: "Three simple steps to fast internet",
        step1: "Check Coverage",
        step1Desc: "See if Hero is available in your area",
        step2: "Apply Online",
        step2Desc: "Complete your application in 5 minutes",
        step3: "Get Connected",
        step3Desc: "Installation within 24-48 hours",
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Getting connected is simple. Just four easy steps.",
        step1: "Enter Your Address",
        step1Desc: "Tell us where you are",
        step2: "Check BTS Coverage",
        step2Desc: "We find the nearest tower",
        step3: "Apply Immediately",
        step3Desc: "If covered, apply right away",
        step4: "Join Waitlist",
        step4Desc: "If not covered, we'll notify you",
      },
      coverage: {
        title: "Check Your Coverage",
        subtitle: "Enter your address to see if Hero is available in your area. Takes less than 1 minute.",
        region: "Select Region",
        regionHint: "Choose your area",
        address: "Full Address",
        addressPlaceholder: "e.g., Jl. Merdeka No. 123",
        addressHint: "Street name and house number",
        checkBtn: "Check Coverage",
        checking: "Checking...",
        great: "Great News!",
        greatMsg: "Your address is covered by Hero! You can apply for service right now.",
        waitlist: "Join Our Waitlist",
        waitlistMsg: "Your area isn't covered yet, but we're expanding. Join the waitlist and we'll notify you when we arrive.",
        nearestBTS: "Nearest BTS Tower",
        distance: "Distance",
        viewMap: "View Coverage Map",
        cantFind: "Can't find your address?",
        contactSupport: "Contact our support team for help",
      },
      packages: {
        title: "Our Package",
        subtitle: "Fast, reliable internet at an affordable price. All packages include 24/7 local support.",
        name: "100 Mbps",
        price: "Rp 100,000",
        period: "/month",
        desc: "Perfect for homes and businesses",
        features: ["100 Mbps download", "Unlimited data", "24/7 support", "No installation fee", "Free modem", "Priority support"],
        getStarted: "Get Started",
        noSetup: "No setup fee",
        freeModem: "Free modem included",
      },
      whyUs: {
        title: "Why Choose Hero?",
        subtitle: "We're not just another internet provider. We're committed to connecting rural Indonesia.",
        stable: "Stable Connection",
        stableDesc: "Reliable 99.5% uptime guarantee",
        noFiber: "No Fiber Required",
        noFiberDesc: "Works with existing infrastructure",
        fastInstall: "Fast Installation",
        fastInstallDesc: "Get connected in 24-48 hours",
        localSupport: "Local Support",
        localSupportDesc: "Indonesian team, local language",
      },
      testimonials: {
        title: "What Our Customers Say",
        subtitle: "Real stories from real people in rural Indonesia.",
        verified: "Verified Customer",
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Have questions? We've got answers.",
        q1: "How do I check if my area is covered?",
        a1: "Simply enter your address in our Coverage Checker above. We'll instantly tell you if Hero is available in your location.",
        q2: "What if my area isn't covered yet?",
        a2: "Join our waitlist! We're rapidly expanding across rural Indonesia. You'll be notified as soon as we reach your area.",
        q3: "Do I need to install fiber cables?",
        a3: "No! Hero uses wireless technology, so there's no need for fiber installation. We work with existing infrastructure.",
        q4: "How long does installation take?",
        a4: "Most installations are completed within 24-48 hours of application approval. Our local team will schedule a convenient time.",
        q5: "What kind of support do you offer?",
        a5: "We provide 24/7 customer support in Indonesian. You can reach us via WhatsApp, email, or phone. Our team is always ready to help.",
        q6: "Can I upgrade my plan later?",
        a6: "Absolutely! You can upgrade your plan anytime without any penalties. Just contact our support team.",
      },
      contact: {
        title: "Get in Touch",
        subtitle: "Have questions? Our team is here to help.",
        whatsapp: "WhatsApp",
        email: "Email",
        office: "Office",
        responseTime: "Avg. response time: 5 minutes",
      },
      footer: {
        desc: "Connecting rural Indonesia with fast, reliable internet.",
        product: "Product",
        packages: "Packages",
        blog: "Blog",
        company: "Company",
        about: "About",
        careers: "Careers",
        legal: "Legal",
        privacy: "Privacy",
        terms: "Terms",
        cookies: "Cookies",
        copyright: "© 2026 Hero Internet. All rights reserved.",
      },
      trust: {
        coverage: "Coverage Areas",
        bts: "BTS Towers",
        customers: "Happy Customers",
        uptime: "Uptime Guarantee",
      },
    },
    id: {
      nav: { howItWorks: "Cara Kerja", coverage: "Cakupan", packages: "Paket", contact: "Kontak", faq: "FAQ" },
      hero: {
        title: "Internet Cepat untuk Indonesia Pedesaan",
        titleHighlight: "Indonesia Pedesaan",
        subtitle: "Tanpa fiber. Tanpa ribet. Hanya konektivitas yang andal dan cepat untuk rumah atau bisnis Anda.",
        checkCoverage: "Cek Cakupan",
        applyNow: "Daftar Sekarang",
        trusted: "Dipercaya oleh 1000+ pelanggan",
      },
      onboarding: {
        title: "Memulai dengan Hero",
        subtitle: "Tiga langkah sederhana untuk internet cepat",
        step1: "Cek Cakupan",
        step1Desc: "Lihat apakah Hero tersedia di area Anda",
        step2: "Daftar Online",
        step2Desc: "Selesaikan aplikasi dalam 5 menit",
        step3: "Terhubung",
        step3Desc: "Instalasi dalam 24-48 jam",
      },
      howItWorks: {
        title: "Cara Kerja",
        subtitle: "Terhubung sangat mudah. Hanya empat langkah sederhana.",
        step1: "Masukkan Alamat Anda",
        step1Desc: "Beritahu kami di mana Anda berada",
        step2: "Cek Cakupan BTS",
        step2Desc: "Kami menemukan menara terdekat",
        step3: "Daftar Segera",
        step3Desc: "Jika terjangkau, daftar sekarang",
        step4: "Bergabung Daftar Tunggu",
        step4Desc: "Jika belum terjangkau, kami akan memberitahu Anda",
      },
      coverage: {
        title: "Cek Cakupan Anda",
        subtitle: "Masukkan alamat Anda untuk melihat apakah Hero tersedia di area Anda. Hanya butuh kurang dari 1 menit.",
        region: "Pilih Wilayah",
        regionHint: "Pilih area Anda",
        address: "Alamat Lengkap",
        addressPlaceholder: "Contoh: Jl. Merdeka No. 123",
        addressHint: "Nama jalan dan nomor rumah",
        checkBtn: "Cek Cakupan",
        checking: "Sedang mengecek...",
        great: "Kabar Baik!",
        greatMsg: "Alamat Anda terjangkau oleh Hero! Anda bisa langsung mendaftar layanan.",
        waitlist: "Bergabung Daftar Tunggu",
        waitlistMsg: "Area Anda belum terjangkau, tetapi kami sedang berkembang. Bergabunglah dengan daftar tunggu dan kami akan memberitahu Anda saat kami tiba.",
        nearestBTS: "Menara BTS Terdekat",
        distance: "Jarak",
        viewMap: "Lihat Peta Cakupan",
        cantFind: "Tidak bisa menemukan alamat Anda?",
        contactSupport: "Hubungi tim dukungan kami untuk bantuan",
      },
      packages: {
        title: "Paket Kami",
        subtitle: "Internet cepat dan andal dengan harga terjangkau. Semua paket termasuk dukungan lokal 24/7.",
        name: "100 Mbps",
        price: "Rp 100.000",
        period: "/bulan",
        desc: "Sempurna untuk rumah dan bisnis",
        features: ["Download 100 Mbps", "Data unlimited", "Dukungan 24/7", "Tanpa biaya instalasi", "Modem gratis", "Dukungan prioritas"],
        getStarted: "Mulai Sekarang",
        noSetup: "Tanpa biaya setup",
        freeModem: "Modem gratis",
      },
      whyUs: {
        title: "Mengapa Memilih Hero?",
        subtitle: "Kami bukan hanya penyedia internet biasa. Kami berkomitmen menghubungkan Indonesia Pedesaan.",
        stable: "Koneksi Stabil",
        stableDesc: "Jaminan uptime 99,5% yang andal",
        noFiber: "Tanpa Fiber",
        noFiberDesc: "Bekerja dengan infrastruktur yang ada",
        fastInstall: "Instalasi Cepat",
        fastInstallDesc: "Terhubung dalam 24-48 jam",
        localSupport: "Dukungan Lokal",
        localSupportDesc: "Tim Indonesia, bahasa lokal",
      },
      testimonials: {
        title: "Apa Kata Pelanggan Kami",
        subtitle: "Cerita nyata dari orang-orang nyata di Indonesia Pedesaan.",
        verified: "Pelanggan Terverifikasi",
      },
      faq: {
        title: "Pertanyaan yang Sering Diajukan",
        subtitle: "Ada pertanyaan? Kami punya jawabannya.",
        q1: "Bagaimana cara mengecek apakah area saya terjangkau?",
        a1: "Cukup masukkan alamat Anda di Coverage Checker kami di atas. Kami akan langsung memberi tahu Anda apakah Hero tersedia di lokasi Anda.",
        q2: "Bagaimana jika area saya belum terjangkau?",
        a2: "Bergabunglah dengan daftar tunggu kami! Kami sedang berkembang pesat di seluruh Indonesia Pedesaan. Anda akan diberitahu segera setelah kami sampai ke area Anda.",
        q3: "Apakah saya perlu memasang kabel fiber?",
        a3: "Tidak! Hero menggunakan teknologi nirkabel, jadi tidak perlu instalasi fiber. Kami bekerja dengan infrastruktur yang sudah ada.",
        q4: "Berapa lama instalasi memakan waktu?",
        a4: "Sebagian besar instalasi selesai dalam 24-48 jam setelah persetujuan aplikasi. Tim lokal kami akan menjadwalkan waktu yang nyaman.",
        q5: "Jenis dukungan apa yang Anda tawarkan?",
        a5: "Kami menyediakan dukungan pelanggan 24/7 dalam bahasa Indonesia. Anda dapat menghubungi kami melalui WhatsApp, email, atau telepon. Tim kami selalu siap membantu.",
        q6: "Bisakah saya upgrade paket saya nanti?",
        a6: "Tentu saja! Anda dapat upgrade paket kapan saja tanpa penalti. Cukup hubungi tim dukungan kami.",
      },
      contact: {
        title: "Hubungi Kami",
        subtitle: "Ada pertanyaan? Tim kami siap membantu.",
        whatsapp: "WhatsApp",
        email: "Email",
        office: "Kantor",
        responseTime: "Waktu respons rata-rata: 5 menit",
      },
      footer: {
        desc: "Menghubungkan Indonesia Pedesaan dengan internet cepat dan andal.",
        product: "Produk",
        packages: "Paket",
        blog: "Blog",
        company: "Perusahaan",
        about: "Tentang",
        careers: "Karir",
        legal: "Hukum",
        privacy: "Privasi",
        terms: "Syarat",
        cookies: "Kuki",
        copyright: "© 2026 Hero Internet. Semua hak dilindungi.",
      },
      trust: {
        coverage: "Area Cakupan",
        bts: "Menara BTS",
        customers: "Pelanggan Puas",
        uptime: "Jaminan Uptime",
      },
    },
  };

  const content = t[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/hero-logo_252895ac.png" alt="Hero Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-foreground">Hero</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">{content.nav.howItWorks}</a>
            <a href="#coverage" className="text-sm font-medium hover:text-primary transition-colors">{content.nav.coverage}</a>
            <a href="#packages" className="text-sm font-medium hover:text-primary transition-colors">{content.nav.packages}</a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">{content.nav.faq}</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">{content.nav.contact}</a>
            <div className="flex gap-2 ml-4 border-l border-border pl-4">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === "en" ? "bg-primary text-white" : "text-foreground hover:bg-gray-100"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("id")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === "id" ? "bg-primary text-white" : "text-foreground hover:bg-gray-100"
                }`}
              >
                ID
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-blue-50 py-16 md:py-24">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                {language === "en" ? "Fast Internet for " : "Internet Cepat untuk "}
                <span className="text-primary">{content.hero.titleHighlight}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.hero.subtitle}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{content.hero.trusted}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-primary text-base px-8">
                {content.hero.checkCoverage}
              </Button>
              <Button size="lg" variant="outline" className="btn-outline text-base px-8">
                {content.hero.applyNow}
              </Button>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/manus-storage/hero-background_eb24b8c6.png" 
              alt="Rural Indonesia landscape with connectivity" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Onboarding Flow Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{content.onboarding.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.onboarding.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: content.onboarding.step1, desc: content.onboarding.step1Desc, icon: "🔍" },
              { step: 2, title: content.onboarding.step2, desc: content.onboarding.step2Desc, icon: "📝" },
              { step: 3, title: content.onboarding.step3, desc: content.onboarding.step3Desc, icon: "⚡" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="card-hover h-full border-2 border-primary/10 hover:border-primary/30">
                  <CardContent className="pt-8 space-y-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: content.trust.coverage, value: "5", unit: language === "en" ? "Regions" : "Wilayah" },
              { label: content.trust.bts, value: btsCount.toString(), unit: "Towers" },
              { label: content.trust.customers, value: "1000+", unit: "" },
              { label: content.trust.uptime, value: "99.5%", unit: "" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-sm text-foreground font-medium">{stat.label}</p>
                {stat.unit && <p className="text-xs text-muted-foreground">{stat.unit}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Checker Section */}
      <section id="coverage" className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{content.coverage.title}</h2>
              <p className="text-lg text-muted-foreground">
                {content.coverage.subtitle}
              </p>
            </div>

            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>{content.coverage.title}</CardTitle>
                <CardDescription>{language === "en" ? "Fill in your location details" : "Isi detail lokasi Anda"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step Indicator */}
                <div className="flex gap-2 mb-6">
                  {[0, 1, 2].map((step) => (
                    <div key={step} className={`h-2 flex-1 rounded-full transition-colors ${
                      step <= activeStep ? "bg-primary" : "bg-gray-200"
                    }`} />
                  ))}
                </div>

                {/* Region Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{content.coverage.region}</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{content.coverage.regionHint}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={district} onValueChange={(value) => {
                    setDistrict(value);
                    setActiveStep(1);
                  }}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === "en" ? "Select region" : "Pilih wilayah"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bojonegoro">Bojonegoro</SelectItem>
                      <SelectItem value="Lamongan">Lamongan</SelectItem>
                      <SelectItem value="Tuban">Tuban</SelectItem>
                      <SelectItem value="Probolinggo">Probolinggo</SelectItem>
                      <SelectItem value="Lumajang">Lumajang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{content.coverage.address}</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{content.coverage.addressHint}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input 
                    placeholder={content.coverage.addressPlaceholder}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (e.target.value) setActiveStep(2);
                    }}
                    className="h-12"
                  />
                </div>

                {/* Check Button */}
                <Button 
                  onClick={handleCheckCoverage}
                  className="w-full btn-primary text-base h-12"
                  disabled={!district || !address || isChecking}
                >
                  {isChecking ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {content.coverage.checking}
                    </>
                  ) : (
                    <>
                      {content.coverage.checkBtn}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* BTS Coverage Map */}
      {coverage === "covered" && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-foreground">{language === "en" ? "View Coverage Map" : "Lihat Peta Cakupan"}</h3>
          <BTSMap highlightBTS={nearestBTSInfo?.name} />
        </div>
      )}

                {/* Coverage Result */}
                {coverage === "notfound" && (
                  <div className="p-6 rounded-lg border-2 bg-amber-50 border-amber-200 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1 text-amber-600" />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-amber-900">
                          {language === "en" ? "Address Not Found" : "Alamat Tidak Ditemukan"}
                        </h4>
                        <p className="text-sm mt-1 text-amber-700">
                          {language === "en"
                            ? "We couldn't locate that address. Try adding more detail — street name, village (desa), and sub-district (kecamatan). Example: Jalan Agus Salim, Citrodiwangsan, Lumajang"
                            : "Kami tidak dapat menemukan alamat tersebut. Coba tambahkan detail — nama jalan, desa, dan kecamatan. Contoh: Jalan Agus Salim, Citrodiwangsan, Lumajang"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {(coverage === "covered" || coverage === "waitlist") && (
                  <div className={`p-6 rounded-lg border-2 animate-in fade-in slide-in-from-bottom-4 ${
                    coverage === "covered" 
                      ? "bg-green-50 border-green-200" 
                      : "bg-blue-50 border-blue-200"
                  }`}>
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-1 ${
                        coverage === "covered" ? "text-green-600" : "text-blue-600"
                      }`} />
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg ${
                          coverage === "covered" ? "text-green-900" : "text-blue-900"
                        }`}>
                          {coverage === "covered" ? content.coverage.great : content.coverage.waitlist}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          coverage === "covered" ? "text-green-700" : "text-blue-700"
                        }`}>
                          {coverage === "covered" ? content.coverage.greatMsg : content.coverage.waitlistMsg}
                        </p>
                        {detectedAddress && (
                          <p className={`text-xs mt-2 italic ${
                            coverage === "covered" ? "text-green-600" : "text-blue-600"
                          }`}>
                            {language === "en" ? "Location found: " : "Lokasi ditemukan: "}{detectedAddress}
                          </p>
                        )}
                        {nearestBTSInfo && (
                          <div className={`mt-4 pt-4 border-t space-y-2 ${
                            coverage === "covered" ? "border-green-200" : "border-blue-200"
                          }`}>
                            <p className={`text-xs font-semibold ${coverage === "covered" ? "text-green-900" : "text-blue-900"}`}>{content.coverage.nearestBTS}:</p>
                            <p className={`text-sm font-medium ${coverage === "covered" ? "text-green-700" : "text-blue-700"}`}>{nearestBTSInfo.name}</p>
                            <p className={`text-xs ${coverage === "covered" ? "text-green-600" : "text-blue-600"}`}>{content.coverage.distance}: {nearestBTSInfo.distance}</p>
                          </div>
                        )}
                        <Button className="mt-4 w-full btn-primary" size="sm">
                          {coverage === "covered" ? content.packages.getStarted : (language === "en" ? "Join Waitlist" : "Gabung Daftar Tunggu")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">{language === "en" ? "Tip:" : "Tips:"}</p>
                      <p>{language === "en" 
                        ? "Enter your street address for most accurate results. Include house number if available."
                        : "Masukkan alamat jalan Anda untuk hasil paling akurat. Sertakan nomor rumah jika tersedia."
                      }</p>
                    </div>
                  </div>
                </div>

                {/* Can't Find Help */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">{content.coverage.cantFind}</p>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {content.coverage.contactSupport}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{content.howItWorks.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.howItWorks.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: content.howItWorks.step1, desc: content.howItWorks.step1Desc },
              { step: 2, title: content.howItWorks.step2, desc: content.howItWorks.step2Desc },
              { step: 3, title: content.howItWorks.step3, desc: content.howItWorks.step3Desc },
              { step: 4, title: content.howItWorks.step4, desc: content.howItWorks.step4Desc },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                  </div>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{content.packages.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.packages.subtitle}
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="card-hover border-2 border-primary shadow-xl w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-3xl text-center">{content.packages.name}</CardTitle>
                <CardDescription className="text-center">{content.packages.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-primary">{content.packages.price}</span>
                  <span className="text-muted-foreground ml-2">{content.packages.period}</span>
                </div>
                <ul className="space-y-3">
                  {content.packages.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full btn-primary h-11 text-base">
                  {content.packages.getStarted}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-secondary to-blue-900 text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{content.whyUs.title}</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              {content.whyUs.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wifi, title: content.whyUs.stable, desc: content.whyUs.stableDesc },
              { icon: Zap, title: content.whyUs.noFiber, desc: content.whyUs.noFiberDesc },
              { icon: Clock, title: content.whyUs.fastInstall, desc: content.whyUs.fastInstallDesc },
              { icon: Users, title: content.whyUs.localSupport, desc: content.whyUs.localSupportDesc },
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{content.testimonials.title}</h2>
            <p className="text-lg text-muted-foreground">
              {content.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                location: "Bojonegoro",
                text: language === "en" 
                  ? "Finally, we have reliable internet in our village! Hero's service has changed how we do business."
                  : "Akhirnya, kami memiliki internet yang andal di desa kami! Layanan Hero telah mengubah cara kami berbisnis.",
                avatar: "BS",
                rating: 5,
              },
              {
                name: "Siti Nurhaliza",
                location: "Probolinggo",
                text: language === "en"
                  ? "The installation was quick and the support team is incredibly helpful. Highly recommended!"
                  : "Instalasi cepat dan tim dukungan sangat membantu. Sangat direkomendasikan!",
                avatar: "SN",
                rating: 5,
              },
              {
                name: "Ahmad Wijaya",
                location: "Lumajang",
                text: language === "en"
                  ? "Best decision we made for our family. Kids can study online, and I can work from home."
                  : "Keputusan terbaik yang kami buat untuk keluarga kami. Anak-anak bisa belajar online, dan saya bisa bekerja dari rumah.",
                avatar: "AW",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="card-hover border border-border">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-foreground italic">"{testimonial.text}"</p>
                  <p className="text-xs text-muted-foreground">{content.testimonials.verified}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{content.faq.title}</h2>
            <p className="text-lg text-muted-foreground">
              {content.faq.subtitle}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: content.faq.q1, a: content.faq.a1 },
              { q: content.faq.q2, a: content.faq.a2 },
              { q: content.faq.q3, a: content.faq.a3 },
              { q: content.faq.q4, a: content.faq.a4 },
              { q: content.faq.q5, a: content.faq.a5 },
              { q: content.faq.q6, a: content.faq.a6 },
            ].map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-secondary text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{content.contact.title}</h2>
            <p className="text-lg text-blue-100">
              {content.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: Phone,
                title: content.contact.whatsapp,
                value: "+62 812 3456 7890",
                link: "https://wa.me/6281234567890",
              },
              {
                icon: Mail,
                title: content.contact.email,
                value: "support@hero.id",
                link: "mailto:support@hero.id",
              },
              {
                icon: MapPin,
                title: content.contact.office,
                value: "Jakarta, Indonesia",
                link: "https://maps.google.com",
              },
            ].map((contact, idx) => (
              <a 
                key={idx}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-6 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
              >
                <contact.icon className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="font-bold text-lg mb-2">{contact.title}</h3>
                <p className="text-blue-100 mb-2">{contact.value}</p>
                <p className="text-xs text-blue-200">{content.contact.responseTime}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/manus-storage/hero-logo_252895ac.png" alt="Hero Logo" className="w-8 h-8" />
                <span className="font-bold">Hero</span>
              </div>
              <p className="text-sm text-gray-400">
                {content.footer.desc}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{content.footer.product}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#packages" className="hover:text-white transition-colors">{content.footer.packages}</a></li>
                <li><a href="#coverage" className="hover:text-white transition-colors">{content.nav.coverage}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{content.footer.blog}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{content.footer.company}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{content.footer.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{content.footer.careers}</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">{content.nav.contact}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{content.footer.legal}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{content.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{content.footer.terms}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{content.footer.cookies}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>{content.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
