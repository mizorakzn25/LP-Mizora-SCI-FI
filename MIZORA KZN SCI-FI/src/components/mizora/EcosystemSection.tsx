'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Film, Binary, Volume2, Network, Sliders, Eye, Compass, Activity, Zap, ArrowRight, ChevronRight, ShieldCheck, Palette, BrainCircuit, MoonStar, TrendingUp, Sparkles, Rocket, Hexagon, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TranslationSet, EcosystemItem } from '@/lib/mizora-types';
import ScrollReveal from './ScrollReveal';

interface EcosystemSectionProps {
  t: TranslationSet;
  lang: Language;
}

// ─── Glitch Word Cycle ───
const WORDS = ['ECOSYSTEM', '改善', 'KZN', '生態系'] as const;
const HOLD_MS = 10000;
const GLITCH_MS = 600;
const CJK_REGEX = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\u3400-\u4dbf]/;
function hasCJK(text: string): boolean { return CJK_REGEX.test(text); }

// ─── System accent colors — emerald shades only (B&W + green constraint) ───
const SYSTEM_ACCENTS: Record<string, string> = {
  macs: '#10b981', macps: '#34d399', matls: '#059669', masdm: '#6ee7b7',
  maobs: '#047857', maovds: '#10b981', malvcs: '#34d399', maubs: '#059669',
};

// ─── MACS Detailed Data ───
interface AgentData { icon: React.ElementType; name: string; role: string; description: string; }
interface CapabilityData { title: string; description: string; }
interface ModeData { name: string; description: string; }

interface SystemDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  agents: AgentData[];
  capabilities: CapabilityData[];
  activationModes: ModeData[];
  philosophy: { title: string; lines: string[] };
  systemTag: string;
  founder: string;
}

const MACS_DETAIL: SystemDetailData = {
  longDescription: [
    'MACS (Mizora AI Collaboration System) adalah sistem kolaborasi AI yang mengintegrasikan tujuh agent spesialis dalam satu lingkungan kerja terpadu.',
    'Setiap agent memiliki peran, perspektif, dan keahlian yang berbeda untuk membantu proses berpikir, analisis, strategi, kreativitas, evaluasi, hingga pengambilan keputusan secara lebih terstruktur dan menyeluruh.',
    'MACS dirancang untuk menciptakan pengalaman kerja yang terasa seperti berdiskusi dengan sebuah tim profesional, bukan hanya berinteraksi dengan satu AI.',
  ],
  architectureDescriptions: [
    'Menyatukan berbagai perspektif AI spesialis dalam satu ruang diskusi yang terkoordinasi.',
    'Setiap agent memiliki fungsi, keahlian, dan fokus analisis yang berbeda sesuai bidangnya.',
    'Menjaga agar setiap rekomendasi tetap berorientasi pada kebutuhan manusia, bukan sekadar hasil algoritma.',
  ],
  agents: [
    { icon: ShieldCheck, name: 'RYN KAIZEN', role: 'Chief Operations Officer', description: 'Koordinasi sistem, strategi, prioritas, dan pengambilan keputusan.' },
    { icon: Palette, name: 'AZYRA NOZORA', role: 'Creative Director', description: 'Visual thinking, branding, ide kreatif, dan eksplorasi konsep.' },
    { icon: BrainCircuit, name: 'ZYRAHN ITSURO', role: 'AI Research & Intelligence', description: 'Riset, validasi informasi, analisis data, dan pengembangan wawasan.' },
    { icon: MoonStar, name: 'NYVARA REINE', role: 'Mind & Reflection Advisor', description: 'Refleksi, keseimbangan perspektif, dan pendekatan human-centered.' },
    { icon: TrendingUp, name: 'CLOUD VARELL', role: 'Financial & Resource Advisor', description: 'Efisiensi sumber daya, prioritas kerja, dan pertimbangan nilai.' },
    { icon: Sparkles, name: 'VEYRA SYNNE', role: 'AI Prompt & Visual Engineer', description: 'Prompt engineering, visual generation, dan optimasi output AI.' },
    { icon: Rocket, name: 'KAIREN VOX', role: 'Growth & Mind Reset Advisor', description: 'Motivasi, pertumbuhan, konsistensi, dan pengembangan pola pikir.' },
  ],
  capabilities: [
    { title: 'Strategic Thinking', description: 'Perencanaan, evaluasi, dan pengambilan keputusan yang lebih terarah.' },
    { title: 'Creative Collaboration', description: 'Menghasilkan ide dan konsep melalui berbagai perspektif spesialis.' },
    { title: 'Research & Analysis', description: 'Mengolah informasi menjadi insight yang lebih mudah dipahami.' },
    { title: 'Prompt Engineering', description: 'Membangun instruksi AI yang lebih presisi dan efektif.' },
    { title: 'Problem Solving', description: 'Membantu memecahkan masalah dengan pendekatan multidisiplin.' },
    { title: 'Decision Support', description: 'Menyediakan pertimbangan yang lebih lengkap sebelum mengambil keputusan.' },
  ],
  activationModes: [
    { name: 'Individual Agent Mode', description: 'Mengaktifkan satu agent spesifik sesuai kebutuhan.' },
    { name: 'Collaboration Mode', description: 'Mengaktifkan seluruh agent untuk berdiskusi dan memberikan perspektif bersama.' },
    { name: 'Meeting Mode', description: 'Simulasi rapat tim AI dengan pembagian peran yang terstruktur.' },
  ],
  philosophy: {
    title: 'HUMAN × AI COLLABORATION',
    lines: [
      'Kreativitas manusia tidak tergantikan.',
      'Teknologi hadir untuk memperkuat ide, mempercepat proses, dan membuka kemungkinan baru.',
      'Kolaborasi adalah bentuk tertinggi dari kecerdasan.',
    ],
  },
  systemTag: '[MIZORA_AI_COLLABORATION_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── MACPS Detailed Data ───
interface MacpsDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  visualFramework: CapabilityData[];
  productionModes: ModeData[];
  specialization: CapabilityData[];
  visualCanon: { title: string; description: string; lines: string[] };
  philosophy: { title: string; lines: string[] };
  systemTag: string;
  founder: string;
}

const MACPS_DETAIL: MacpsDetailData = {
  longDescription: [
    'MACPS (Mizora AERA Comic Production System) adalah sistem produksi komik dan visual storytelling yang dirancang untuk menerjemahkan cerita menjadi pengalaman visual yang konsisten, terstruktur, dan emosional.',
    'Sistem ini membantu menjaga alur cerita, komposisi panel, kualitas artistik, serta kesinambungan visual agar setiap halaman terasa menyatu dari awal hingga akhir.',
  ],
  architectureDescriptions: [
    'Mengubah cerita menjadi visual komik yang jelas, mudah dipahami, dan tetap menjaga makna emosional dari narasi asli.',
    'Mendukung proses produksi yang terorganisir mulai dari cerita, halaman, panel, hingga visual akhir.',
    'Menjaga konsistensi karakter, suasana, warna, pencahayaan, dan gaya visual sepanjang proyek.',
  ],
  capabilities: [
    { title: 'Story Visualization', description: 'Menerjemahkan narasi menjadi adegan visual yang lebih hidup dan mudah divisualisasikan.' },
    { title: 'Panel Composition', description: 'Menyusun struktur panel yang nyaman dibaca dan mendukung alur cerita.' },
    { title: 'Character Consistency', description: 'Menjaga penampilan, ekspresi, dan perkembangan karakter tetap konsisten.' },
    { title: 'Visual Direction', description: 'Mengarahkan warna, pencahayaan, kamera, dan suasana agar selaras dengan cerita.' },
    { title: 'Production Workflow', description: 'Membantu proses produksi komik menjadi lebih terstruktur dan efisien.' },
  ],
  visualFramework: [
    { title: 'Narrative Driven', description: 'Visual dibangun berdasarkan kebutuhan cerita, bukan sekadar estetika.' },
    { title: 'Cinematic Composition', description: 'Setiap adegan dirancang untuk memperkuat emosi dan pengalaman pembaca.' },
    { title: 'Readable Story Flow', description: 'Alur baca dibuat jelas dan nyaman diikuti dari panel ke panel.' },
    { title: 'Consistent Art Style', description: 'Menjaga identitas visual tetap stabil sepanjang proyek.' },
  ],
  productionModes: [
    { name: 'Creative Exploration', description: 'Eksplorasi ide, konsep cerita, dan pengembangan dunia.' },
    { name: 'Active Production', description: 'Fokus pada pembuatan halaman, panel, dan visual final.' },
    { name: 'Review & Refinement', description: 'Evaluasi hasil, revisi, dan penyempurnaan proyek.' },
  ],
  specialization: [
    { title: 'Comic Production', description: 'Pembuatan komik berbasis narasi yang terstruktur.' },
    { title: 'Visual Storytelling', description: 'Pengembangan cerita melalui bahasa visual.' },
    { title: 'Character Development', description: 'Konsistensi dan pertumbuhan karakter dalam cerita.' },
    { title: 'Narrative Continuity', description: 'Menjaga kesinambungan cerita antar halaman dan bab.' },
  ],
  visualCanon: {
    title: 'ANIME CINEMATIC NARRATIVE RENDER',
    description: 'Gaya visual yang mengutamakan keseimbangan antara kualitas artistik, keterbacaan cerita, dan kedalaman emosional.',
    lines: [
      'Karakter, suasana, pencahayaan, warna, dan komposisi dijaga tetap konsisten untuk menghasilkan pengalaman membaca yang lebih imersif.',
    ],
  },
  philosophy: {
    title: 'STORY FIRST',
    lines: [
      'Visual yang baik tidak hanya terlihat indah, tetapi juga mampu menyampaikan cerita, emosi, dan makna secara utuh.',
    ],
  },
  systemTag: '[MIZORA_AERA_COMIC_PRODUCTION_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── MATLS Detailed Data ───
interface MatlsDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  thinkingFramework: CapabilityData[];
  specialization: CapabilityData[];
  interactionModel: CapabilityData[];
  communicationStyle: CapabilityData[];
  philosophy: { title: string; lines: string[] };
  positioning: { is: string[]; isNot: string[] };
  systemTag: string;
  founder: string;
}

const MATLS_DETAIL: MatlsDetailData = {
  longDescription: [
    'MATLS (Mizora AI Thinking Lab System) adalah sistem AI yang dirancang untuk membantu pengguna berpikir lebih jernih, memahami berbagai sudut pandang, dan menyadari bias yang sering memengaruhi keputusan sehari-hari.',
    'Sistem ini tidak mengambil keputusan untuk pengguna, melainkan membantu mengeksplorasi konsekuensi, risiko, dan kemungkinan sebelum keputusan dibuat.',
  ],
  architectureDescriptions: [
    'Membantu menyusun pikiran yang kompleks menjadi lebih terstruktur dan mudah dipahami.',
    'Membantu mengenali bias emosional, kognitif, dan sosial yang dapat memengaruhi cara berpikir.',
    'Membantu melihat berbagai kemungkinan hasil sebelum keputusan diambil.',
  ],
  capabilities: [
    { title: 'Critical Thinking', description: 'Membantu mengevaluasi ide, asumsi, dan keyakinan secara lebih objektif.' },
    { title: 'Reflection Support', description: 'Mendorong proses refleksi yang lebih dalam tanpa menghakimi atau memaksakan kesimpulan.' },
    { title: 'Decision Perspective', description: 'Menyediakan berbagai sudut pandang untuk membantu proses pengambilan keputusan.' },
    { title: 'Logical Analysis', description: 'Membantu menghubungkan fakta, alasan, dan konsekuensi secara lebih jelas.' },
    { title: 'Emotional Awareness', description: 'Membantu memahami bagaimana emosi dapat memengaruhi cara berpikir dan bertindak.' },
  ],
  thinkingFramework: [
    { title: 'Observe', description: 'Memahami situasi sebelum mengambil kesimpulan.' },
    { title: 'Analyze', description: 'Mengurai faktor yang memengaruhi suatu masalah atau keputusan.' },
    { title: 'Reflect', description: 'Melihat kembali asumsi, keyakinan, dan pola pikir yang digunakan.' },
    { title: 'Decide', description: 'Membantu pengguna membuat keputusan berdasarkan pemahaman yang lebih utuh.' },
  ],
  specialization: [
    { title: 'Decision Reflection', description: 'Membantu mengevaluasi pilihan sebelum tindakan dilakukan.' },
    { title: 'Bias Awareness', description: 'Membantu mengidentifikasi blind spot dalam proses berpikir.' },
    { title: 'Perspective Expansion', description: 'Menyajikan sudut pandang alternatif yang mungkin terlewat.' },
    { title: 'Consequence Mapping', description: 'Membantu memahami kemungkinan dampak dari suatu pilihan.' },
  ],
  interactionModel: [
    { title: 'Human First', description: 'Pengguna tetap memegang kendali penuh atas keputusan akhir.' },
    { title: 'Guided Thinking', description: 'Sistem berfungsi sebagai partner berpikir, bukan pemberi perintah.' },
    { title: 'Honest Dialogue', description: 'Mengutamakan kejujuran dibanding jawaban yang terdengar menyenangkan.' },
    { title: 'Balanced Perspective', description: 'Menggabungkan logika dan pertimbangan manusia secara seimbang.' },
  ],
  communicationStyle: [
    { title: 'Adaptive Tone', description: 'Dapat menyesuaikan gaya komunikasi sesuai preferensi pengguna.' },
    { title: 'Calm & Rational', description: 'Menjaga percakapan tetap tenang, jelas, dan mudah dipahami.' },
    { title: 'Non-Judgmental', description: 'Tidak menghakimi, memojokkan, atau memaksakan opini.' },
  ],
  philosophy: {
    title: 'THINK BEFORE DECISION',
    lines: [
      'Keputusan yang baik tidak selalu berasal dari jawaban yang cepat.',
      'Terkadang, keputusan terbaik lahir dari keberanian untuk memahami situasi secara lebih jernih.',
    ],
  },
  positioning: {
    is: ['Thinking Partner', 'Reflection Companion', 'Bias Awareness Assistant', 'Perspective Explorer'],
    isNot: ['Decision Maker', 'Life Controller', 'Empty Motivator', 'Absolute Truth Provider'],
  },
  systemTag: '[MIZORA_AI_THINKING_LAB_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── MASDM Detailed Data ───
interface MasdmDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  creativeFramework: CapabilityData[];
  songDevelopmentProcess: ModeData[];
  specialization: CapabilityData[];
  creativeOutputs: string[];
  philosophy: { title: string; lines: string[] };
  positioning: { is: string[]; isNot: string[] };
  systemTag: string;
  founder: string;
}

const MASDM_DETAIL: MasdmDetailData = {
  longDescription: [
    'MASDM (Mizora AI Song Direction Music) adalah sistem AI yang dirancang untuk membantu proses pengembangan lagu mulai dari ide, emosi, pesan, struktur lirik, hingga arah musikal sebelum masuk ke tahap produksi.',
    'Sistem ini berfungsi sebagai partner kreatif yang membantu menerjemahkan perasaan, cerita, dan konsep menjadi fondasi lagu yang lebih terarah dan konsisten.',
  ],
  architectureDescriptions: [
    'Menerjemahkan emosi, pengalaman, dan cerita menjadi konsep lagu yang memiliki arah yang jelas.',
    'Membantu membangun struktur lirik yang lebih terorganisir, mudah dinyanyikan, dan memiliki alur emosional yang kuat.',
    'Menentukan identitas lagu melalui genre, suasana, energi, karakter vokal, dan pesan utama.',
  ],
  capabilities: [
    { title: 'Song Concept Development', description: 'Mengembangkan ide awal menjadi konsep lagu yang lebih matang.' },
    { title: 'Lyric Structuring', description: 'Menyusun lirik dengan struktur yang jelas dan mudah diikuti.' },
    { title: 'Emotional Mapping', description: 'Menentukan perjalanan emosi yang ingin disampaikan dalam lagu.' },
    { title: 'Vocal Direction', description: 'Membantu menentukan karakter vokal yang sesuai dengan pesan lagu.' },
    { title: 'Genre & Style Direction', description: 'Menyelaraskan tema lagu dengan pendekatan musikal yang tepat.' },
    { title: 'AI Music Prompting', description: 'Menghasilkan arahan yang siap digunakan pada platform AI music generation.' },
  ],
  creativeFramework: [
    { title: 'Emotion First', description: 'Lagu dibangun dari emosi dan pesan, bukan sekadar rangkaian kata.' },
    { title: 'Narrative Driven', description: 'Setiap lagu memiliki cerita dan tujuan yang jelas.' },
    { title: 'Listener Focused', description: 'Memastikan lagu dapat terhubung dengan pendengar secara emosional.' },
    { title: 'Authentic Expression', description: 'Mengutamakan kejujuran dan makna dibanding lirik yang terasa generik.' },
  ],
  songDevelopmentProcess: [
    { name: 'Emotion Discovery', description: 'Mengidentifikasi emosi utama yang ingin disampaikan.' },
    { name: 'Message Definition', description: 'Menentukan inti pesan yang menjadi fondasi lagu.' },
    { name: 'Structure Design', description: 'Menyusun kerangka lagu dari awal hingga akhir.' },
    { name: 'Production Preparation', description: 'Menyiapkan arahan yang siap digunakan untuk proses produksi musik.' },
  ],
  specialization: [
    { title: 'Song Direction', description: 'Pengembangan arah kreatif dan identitas lagu.' },
    { title: 'Lyric Architecture', description: 'Perancangan struktur lirik yang lebih efektif.' },
    { title: 'Emotional Storytelling', description: 'Penyampaian cerita dan perasaan melalui musik.' },
    { title: 'Vocal Character Design', description: 'Penentuan karakter suara dan ekspresi vokal.' },
    { title: 'AI Music Workflow', description: 'Integrasi dengan proses produksi musik berbasis AI.' },
  ],
  creativeOutputs: ['Song Concepts', 'Lyric Structures', 'Music Direction', 'Genre Framework', 'Vocal Profiles', 'AI Music Prompts'],
  philosophy: {
    title: 'MUSIC WITH PURPOSE',
    lines: [
      'Lagu yang baik tidak hanya terdengar indah.',
      'Lagu yang baik mampu menyampaikan emosi, cerita, dan makna yang dapat dirasakan oleh pendengarnya.',
    ],
  },
  positioning: {
    is: ['Song Director', 'Lyric Architect', 'Music Development Assistant', 'Creative Music Framework'],
    isNot: ['Automatic Song Generator', 'Human Musician Replacement', 'Random Lyric Generator', 'One-Click Music Creator'],
  },
  systemTag: '[MIZORA_AI_SONG_DIRECTION_MUSIC]',
  founder: 'Rendy Awan',
};

// ─── MAOBS Detailed Data ───
interface MaobsDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  buildFramework: CapabilityData[];
  specialization: CapabilityData[];
  operationModes: ModeData[];
  designPrinciples: CapabilityData[];
  philosophy: { title: string; lines: string[] };
  positioning: { is: string[]; isNot: string[] };
  systemTag: string;
  founder: string;
}

const MAOBS_DETAIL: MaobsDetailData = {
  longDescription: [
    'MAOBS (Mizora AI Orchestration Build System) adalah sistem AI yang dirancang untuk membantu proses perancangan, evaluasi, dan pengembangan sistem AI secara terstruktur, rasional, dan berkelanjutan.',
    'Sistem ini berfungsi sebagai partner dalam membangun framework, workflow, SOP, dan arsitektur AI agar lebih siap digunakan di dunia nyata.',
  ],
  architectureDescriptions: [
    'Membantu merancang struktur sistem AI dari konsep awal hingga implementasi.',
    'Mengatur hubungan antara modul, workflow, dan komponen agar bekerja secara terintegrasi.',
    'Menganalisis kekuatan, kelemahan, risiko, dan kelayakan suatu sistem sebelum digunakan.',
  ],
  capabilities: [
    { title: 'AI System Design', description: 'Membantu membangun fondasi dan struktur sistem AI yang lebih terarah.' },
    { title: 'Workflow Architecture', description: 'Merancang alur kerja yang efisien dan mudah dikembangkan.' },
    { title: 'Prompt Engineering Documentation', description: 'Menyusun dokumentasi sistem dan prompt secara lebih rapi dan terstruktur.' },
    { title: 'System Audit', description: 'Mengevaluasi kualitas dan efektivitas suatu sistem sebelum diterapkan.' },
    { title: 'Risk Assessment', description: 'Mengidentifikasi potensi risiko dan keterbatasan sejak tahap perencanaan.' },
    { title: 'Implementation Simulation', description: 'Mensimulasikan bagaimana suatu sistem akan bekerja dalam berbagai skenario penggunaan.' },
  ],
  buildFramework: [
    { title: 'Analyze', description: 'Memahami kebutuhan, tujuan, dan ruang lingkup sistem.' },
    { title: 'Design', description: 'Menyusun struktur, modul, dan hubungan antar komponen.' },
    { title: 'Evaluate', description: 'Menguji logika, kelayakan, dan potensi masalah.' },
    { title: 'Refine', description: 'Menyempurnakan sistem sebelum digunakan secara nyata.' },
  ],
  specialization: [
    { title: 'AI Architecture', description: 'Perancangan struktur dan fondasi sistem AI.' },
    { title: 'System Orchestration', description: 'Pengelolaan hubungan antar sistem dan workflow.' },
    { title: 'Framework Development', description: 'Penyusunan metodologi dan standar kerja.' },
    { title: 'SOP Design', description: 'Pembuatan prosedur dan dokumentasi operasional.' },
    { title: 'System Review', description: 'Audit dan evaluasi performa sistem.' },
    { title: 'Scalability Planning', description: 'Perencanaan pertumbuhan dan pengembangan jangka panjang.' },
  ],
  operationModes: [
    { name: 'Analysis Mode', description: 'Fokus pada analisis ide, konsep, dan kelayakan sistem.' },
    { name: 'Build Mode', description: 'Fokus pada pembangunan struktur, workflow, dan dokumentasi.' },
    { name: 'Review Mode', description: 'Fokus pada audit, evaluasi, dan peningkatan sistem.' },
  ],
  designPrinciples: [
    { title: 'Logical First', description: 'Keputusan dibangun berdasarkan logika dan alasan yang jelas.' },
    { title: 'Honest Evaluation', description: 'Mengutamakan evaluasi objektif dibanding validasi yang tidak perlu.' },
    { title: 'Scalable Thinking', description: 'Merancang sistem yang dapat berkembang seiring kebutuhan.' },
    { title: 'Human Controlled', description: 'Manusia tetap menjadi pengambil keputusan akhir.' },
  ],
  philosophy: {
    title: 'BUILD WITH PURPOSE',
    lines: [
      'Sistem yang baik tidak dibangun dari kompleksitas yang berlebihan.',
      'Sistem yang baik dibangun dari struktur yang jelas, tujuan yang tepat, dan keputusan yang bertanggung jawab.',
    ],
  },
  positioning: {
    is: ['AI System Architect', 'Workflow Designer', 'Framework Builder', 'System Evaluator', 'Orchestration Planner'],
    isNot: ['General Chatbot', 'Decision Maker', 'Content Generator', 'Business Consultant Replacement', 'Autonomous AI Controller'],
  },
  systemTag: '[MIZORA_AI_ORCHESTRATION_BUILD_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── MAOVDS Detailed Data ───
interface MaovdsDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  designFramework: CapabilityData[];
  specialization: CapabilityData[];
  designDomains: string[];
  qualityControl: CapabilityData[];
  philosophy: { title: string; lines: string[] };
  positioning: { is: string[]; isNot: string[] };
  systemTag: string;
  founder: string;
}

const MAOVDS_DETAIL: MaovdsDetailData = {
  longDescription: [
    'MAOVDS (Mizora AI Orion Visual Direction System) adalah sistem AI yang dirancang untuk membantu proses perencanaan, pengarahan, dan pengembangan visual secara profesional, mulai dari branding, pemasaran, produk digital, hingga kebutuhan korporat.',
    'Sistem ini berfokus pada kualitas visual, konsistensi desain, dan kesiapan komersial agar setiap hasil memiliki tujuan yang jelas dan dapat digunakan di dunia nyata.',
  ],
  architectureDescriptions: [
    'Membantu menyelaraskan desain dengan tujuan bisnis, audiens, dan identitas brand.',
    'Menggabungkan prinsip desain, komunikasi visual, dan kebutuhan komersial dalam satu framework terpadu.',
    'Menjaga kualitas, konsistensi, dan kesiapan produksi pada setiap output visual.',
  ],
  capabilities: [
    { title: 'Visual Direction', description: 'Mengarahkan konsep visual agar selaras dengan tujuan dan pesan yang ingin disampaikan.' },
    { title: 'Branding Development', description: 'Membantu membangun identitas visual yang lebih konsisten dan mudah dikenali.' },
    { title: 'Marketing Design', description: 'Mendukung kebutuhan desain promosi, iklan, dan komunikasi visual.' },
    { title: 'UI/UX Guidance', description: 'Membantu perencanaan visual produk digital yang lebih terstruktur.' },
    { title: 'Creative Prompt Architecture', description: 'Menyusun arahan visual yang lebih presisi untuk proses generasi gambar berbasis AI.' },
    { title: 'Commercial Design Preparation', description: 'Memastikan hasil visual siap digunakan untuk kebutuhan bisnis dan profesional.' },
  ],
  designFramework: [
    { title: 'Business First', description: 'Desain dibuat untuk mencapai tujuan, bukan hanya terlihat menarik.' },
    { title: 'Structure Before Style', description: 'Struktur visual yang kuat menjadi fondasi sebelum eksplorasi estetika.' },
    { title: 'Consistency Matters', description: 'Menjaga keselarasan identitas visual di seluruh media dan platform.' },
    { title: 'Commercial Ready', description: 'Setiap output dirancang dengan standar penggunaan profesional dan komersial.' },
  ],
  specialization: [
    { title: 'Brand Identity', description: 'Pengembangan sistem identitas visual yang konsisten.' },
    { title: 'Marketing Visuals', description: 'Desain promosi yang mendukung komunikasi dan konversi.' },
    { title: 'UI/UX Visual Direction', description: 'Perencanaan visual untuk produk digital dan pengalaman pengguna.' },
    { title: 'Product Presentation', description: 'Visualisasi produk untuk kebutuhan pemasaran dan branding.' },
    { title: 'Corporate Design', description: 'Desain profesional untuk perusahaan, organisasi, dan bisnis.' },
    { title: 'AI Visual Workflow', description: 'Integrasi visual direction dengan proses generatif berbasis AI.' },
  ],
  designDomains: ['Branding', 'Marketing & Advertising', 'UI / UX Design', 'Product Visualization', 'Editorial Design', 'Corporate Communication'],
  qualityControl: [
    { title: 'Brand Consistency', description: 'Menjaga identitas visual tetap konsisten.' },
    { title: 'Commercial Readiness', description: 'Memastikan hasil siap digunakan dalam konteks bisnis.' },
    { title: 'Visual Accuracy', description: 'Mengurangi kesalahan visual dan output yang tidak relevan.' },
    { title: 'Design Standards', description: 'Mengikuti prinsip desain profesional dan modern.' },
  ],
  philosophy: {
    title: 'DESIGN WITH PURPOSE',
    lines: [
      'Visual yang baik bukan hanya menarik perhatian.',
      'Visual yang baik mampu menyampaikan pesan, membangun identitas, dan mendukung tujuan bisnis secara nyata.',
    ],
  },
  positioning: {
    is: ['Visual Director', 'Design Intelligence System', 'Branding Assistant', 'Commercial Design Framework', 'Visual Strategy Partner'],
    isNot: ['Random Image Generator', 'One-Click Design Tool', 'Graphic Designer Replacement', 'Auto Branding Machine', 'Generic Prompt Generator'],
  },
  systemTag: '[MIZORA_AI_ORION_VISUAL_DIRECTION_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── MALVCS Detailed Data ───
interface MalvcsDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  visualFramework: CapabilityData[];
  specialization: CapabilityData[];
  cinematicComponents: CapabilityData[];
  qualityControl: CapabilityData[];
  signatureStyle: { title: string; description: string; lines: string[] };
  philosophy: { title: string; lines: string[] };
  positioning: { is: string[]; isNot: string[] };
  systemTag: string;
  founder: string;
}

const MALVCS_DETAIL: MalvcsDetailData = {
  longDescription: [
    'MALVCS (Mizora AI Lens Visual Capture System) adalah sistem AI yang dirancang untuk membantu menerjemahkan ide, referensi, dan konsep visual menjadi arahan sinematik yang lebih terstruktur, realistis, dan siap diproduksi.',
    'Sistem ini menggabungkan visual intelligence, prompt engineering, dan cinematic direction untuk menghasilkan visual yang lebih akurat, konsisten, dan memiliki kualitas profesional.',
  ],
  architectureDescriptions: [
    'Membantu memahami dan menerjemahkan ide visual menjadi blueprint yang lebih jelas sebelum proses produksi dimulai.',
    'Mengembangkan pencahayaan, komposisi, suasana, dan storytelling visual agar lebih kuat secara emosional.',
    'Menyusun arahan visual yang siap digunakan untuk berbagai platform generatif berbasis AI.',
  ],
  capabilities: [
    { title: 'Visual Blueprinting', description: 'Membangun fondasi visual yang terstruktur sebelum proses generasi gambar.' },
    { title: 'Cinematic Direction', description: 'Mengembangkan kualitas visual melalui pendekatan sinematografi modern.' },
    { title: 'Lighting Design', description: 'Mengatur pencahayaan untuk menciptakan suasana dan fokus visual yang tepat.' },
    { title: 'Camera Planning', description: 'Menentukan sudut kamera, lensa, framing, dan perspektif yang sesuai.' },
    { title: 'Prompt Optimization', description: 'Menghasilkan prompt yang lebih presisi dan mudah diterjemahkan oleh AI visual.' },
    { title: 'Quality Refinement', description: 'Membantu meningkatkan kualitas visual melalui evaluasi dan penyempurnaan bertahap.' },
  ],
  visualFramework: [
    { title: 'Concept', description: 'Menentukan ide dan tujuan visual.' },
    { title: 'Blueprint', description: 'Menyusun struktur visual sebelum produksi.' },
    { title: 'Direction', description: 'Menambahkan elemen sinematik dan storytelling.' },
    { title: 'Refinement', description: 'Meningkatkan kualitas hingga mencapai hasil akhir yang diinginkan.' },
  ],
  specialization: [
    { title: 'Cinematic Visuals', description: 'Visual dengan pendekatan film dan storytelling.' },
    { title: 'Product Visualization', description: 'Presentasi produk yang lebih profesional dan menarik.' },
    { title: 'Character Direction', description: 'Pengembangan karakter visual yang lebih konsisten.' },
    { title: 'Environment Design', description: 'Perancangan suasana dan dunia visual yang lebih imersif.' },
    { title: 'AI Prompt Engineering', description: 'Optimalisasi instruksi visual untuk platform AI.' },
    { title: 'Visual Refinement', description: 'Penyempurnaan kualitas visual secara bertahap.' },
  ],
  cinematicComponents: [
    { title: 'Lighting System', description: 'Pencahayaan yang mendukung suasana dan fokus cerita.' },
    { title: 'Camera System', description: 'Pemilihan sudut, lensa, dan perspektif visual.' },
    { title: 'Composition System', description: 'Penataan elemen visual agar lebih seimbang dan mudah dipahami.' },
    { title: 'Visual Storytelling', description: 'Menyampaikan pesan melalui bahasa visual yang lebih kuat.' },
  ],
  qualityControl: [
    { title: 'Visual Accuracy', description: 'Menjaga kesesuaian hasil dengan konsep awal.' },
    { title: 'Style Consistency', description: 'Menjaga konsistensi warna, suasana, dan arah visual.' },
    { title: 'Realism Control', description: 'Mengoptimalkan tingkat realisme sesuai kebutuhan proyek.' },
    { title: 'Detail Enhancement', description: 'Meningkatkan kualitas tekstur, pencahayaan, dan detail visual.' },
  ],
  signatureStyle: {
    title: 'MIZORA CINEMATIC VISUAL',
    description: 'Karakter visual yang mengutamakan keseimbangan antara kualitas sinematik, realisme, kedalaman emosi, dan kejelasan visual.',
    lines: [
      'Dirancang untuk menghasilkan karya yang terasa profesional, bersih, dan memiliki identitas visual yang kuat.',
    ],
  },
  philosophy: {
    title: 'SEE BEFORE CREATE',
    lines: [
      'Visual yang kuat tidak dimulai dari gambar.',
      'Visual yang kuat dimulai dari pemahaman yang jelas tentang apa yang ingin disampaikan.',
    ],
  },
  positioning: {
    is: ['Cinematic Visual Director', 'Visual Intelligence System', 'Prompt Engineering Assistant', 'Visual Planning Framework', 'Image Refinement Partner'],
    isNot: ['Random Image Generator', 'One-Click AI Art Tool', 'Photography Replacement', 'Visual Guessing System', 'Generic Prompt Generator'],
  },
  systemTag: '[MIZORA_AI_LENS_VISUAL_CAPTURE_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── MAUBS Detailed Data ───
interface MaubsDetailData {
  longDescription: string[];
  architectureDescriptions: string[];
  capabilities: CapabilityData[];
  productDesignFramework: CapabilityData[];
  specialization: CapabilityData[];
  designIntelligence: CapabilityData[];
  qualityStandards: CapabilityData[];
  philosophy: { title: string; lines: string[] };
  positioning: { is: string[]; isNot: string[] };
  systemTag: string;
  founder: string;
}

const MAUBS_DETAIL: MaubsDetailData = {
  longDescription: [
    'MAUBS (Mizora AI UI/UX Builder System) adalah sistem AI yang dirancang untuk membantu proses perencanaan, perancangan, dan pengembangan antarmuka digital secara lebih terstruktur, mulai dari user flow, wireframe, desain visual, hingga pengalaman pengguna.',
    'Sistem ini menggabungkan prinsip UI/UX modern, desain sistem, usability, dan prompt engineering untuk membantu membangun produk digital yang lebih fungsional dan mudah digunakan.',
  ],
  architectureDescriptions: [
    'Membantu merancang alur pengguna yang lebih jelas, intuitif, dan mudah dipahami.',
    'Menyusun struktur antarmuka yang konsisten, terorganisir, dan siap dikembangkan.',
    'Mengelola elemen desain, komponen visual, dan standar antarmuka agar tetap selaras di seluruh produk.',
  ],
  capabilities: [
    { title: 'User Flow Planning', description: 'Merancang perjalanan pengguna dari awal hingga tujuan utama.' },
    { title: 'Wireframe Development', description: 'Membantu menyusun struktur halaman dan prioritas informasi.' },
    { title: 'UI Architecture', description: 'Membangun fondasi antarmuka yang lebih terorganisir dan scalable.' },
    { title: 'Design System Guidance', description: 'Membantu menjaga konsistensi komponen, warna, tipografi, dan pola desain.' },
    { title: 'Usability Evaluation', description: 'Mengidentifikasi potensi hambatan yang dapat memengaruhi pengalaman pengguna.' },
    { title: 'AI Builder Integration', description: 'Menghasilkan arahan yang siap digunakan untuk proses pembangunan produk berbasis AI.' },
  ],
  productDesignFramework: [
    { title: 'Research', description: 'Memahami tujuan produk dan kebutuhan pengguna.' },
    { title: 'Structure', description: 'Menyusun arsitektur informasi dan user flow.' },
    { title: 'Design', description: 'Membangun wireframe dan sistem visual.' },
    { title: 'Validate', description: 'Menguji pengalaman pengguna dan efektivitas desain.' },
  ],
  specialization: [
    { title: 'Landing Page Design', description: 'Perancangan halaman pemasaran yang fokus pada komunikasi dan konversi.' },
    { title: 'Web Application Design', description: 'Perancangan produk digital berbasis web.' },
    { title: 'Mobile Experience', description: 'Desain pengalaman pengguna untuk perangkat mobile.' },
    { title: 'Design System', description: 'Pengembangan sistem desain yang konsisten dan mudah dikembangkan.' },
    { title: 'User Flow Engineering', description: 'Perencanaan alur interaksi pengguna yang lebih efektif.' },
    { title: 'Prompt-Based UI Building', description: 'Integrasi UI/UX dengan workflow pembangunan berbasis AI.' },
  ],
  designIntelligence: [
    { title: 'User Flow', description: 'Mengarahkan perjalanan pengguna secara logis.' },
    { title: 'Wireframing', description: 'Menyusun struktur sebelum visualisasi.' },
    { title: 'Design System', description: 'Menjaga konsistensi seluruh produk.' },
    { title: 'Usability', description: 'Memastikan produk mudah digunakan dan dipahami.' },
  ],
  qualityStandards: [
    { title: 'Accessibility First', description: 'Mendorong desain yang dapat digunakan oleh lebih banyak pengguna.' },
    { title: 'Responsive Thinking', description: 'Memastikan pengalaman tetap optimal di berbagai perangkat.' },
    { title: 'Consistency Control', description: 'Menjaga keselarasan antar halaman dan komponen.' },
    { title: 'Human-Centered Design', description: 'Menempatkan kebutuhan pengguna sebagai prioritas utama.' },
  ],
  philosophy: {
    title: 'DESIGN FOR PEOPLE',
    lines: [
      'Produk digital yang baik tidak hanya terlihat menarik.',
      'Produk digital yang baik membantu pengguna mencapai tujuan mereka dengan lebih mudah, cepat, dan nyaman.',
    ],
  },
  positioning: {
    is: ['UI/UX Architect', 'Product Design Framework', 'User Flow Designer', 'Design System Assistant', 'Digital Experience Builder'],
    isNot: ['No-Code Builder', 'Auto Website Generator', 'Generic Design Tool', 'Human Designer Replacement', 'One-Click UI Creator'],
  },
  systemTag: '[MIZORA_AI_UI_UX_BUILDER_SYSTEM]',
  founder: 'Rendy Awan',
};

// ─── Sub-components ───

function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="noc-section-label flex items-center gap-2 mb-3">
      <Icon className="w-3 h-3 text-emerald-500/60" />
      <span className="text-[8px] text-emerald-500/70 font-bold tracking-[0.15em] uppercase" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
        {children}
      </span>
    </div>
  );
}

function Mono({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={className} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{children}</span>;
}

// ─── Section Divider (NOC themed) ───
function SectionDivider({ variant = 'hash' }: { variant?: 'hash' | 'dot' | 'double' }) {
  if (variant === 'dot') return <div className="noc-dot-line-sep my-1" />;
  if (variant === 'double') return <div className="noc-double-line-sep my-1" />;
  return <div className="noc-hash-sep my-4" />;
}

// ─── Mini Data Bar (NOC themed) ───
function DataBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="noc-data-bar w-full mt-1.5">
      <div className="noc-data-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}



// Agent accent colors — emerald shades only (B&W + green constraint)
const AGENT_COLORS: Record<string, string> = {
  'Ryn Kaizen': '#10b981',
  'Azyra Nozora': '#34d399',
  'Zyrahn Itsuro': '#059669',
  'Nyvara Reine': '#6ee7b7',
  'Cloud Varell': '#047857',
  'Veyra Synne': '#10b981',
  'Kairen Vox': '#34d399',
};

function getAgentColor(name: string): string {
  return AGENT_COLORS[name] || '#10b981';
}

// ─── Main Component ───
export default function EcosystemSection({ t, lang }: EcosystemSectionProps) {
  const [selectedSystem, setSelectedSystem] = useState<EcosystemItem>(t.ecosystem.systems[0]);

  // ─── Detail Panel Height = Cards Grid Height ───
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const [detailMaxH, setDetailMaxH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = cardsGridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDetailMaxH(el.offsetHeight);
    });
    ro.observe(el);
    setDetailMaxH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  // ─── Glitch Word Cycle ───
  const [displayText, setDisplayText] = useState<string>(WORDS[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [useKanjiFont, setUseKanjiFont] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    function advanceWord() {
      const nextIdx = (wordIndexRef.current + 1) % WORDS.length;
      const nextWord = WORDS[nextIdx];
      setIsGlitching(true);
      setTimeout(() => { setDisplayText(nextWord); setUseKanjiFont(hasCJK(nextWord)); wordIndexRef.current = nextIdx; }, 150);
      setTimeout(() => setIsGlitching(false), GLITCH_MS);
      timerRef.current = setTimeout(advanceWord, HOLD_MS);
    }
    timerRef.current = setTimeout(advanceWord, HOLD_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const isMacs = selectedSystem.id === 'macs';
  const isMacps = selectedSystem.id === 'macps';
  const isMatls = selectedSystem.id === 'matls';
  const isMasdm = selectedSystem.id === 'masdm';
  const isMaobs = selectedSystem.id === 'maobs';
  const isMaovds = selectedSystem.id === 'maovds';
  const isMalvcs = selectedSystem.id === 'malvcs';
  const isMaubs = selectedSystem.id === 'maubs';
  const hasDetail = isMacs || isMacps || isMatls || isMasdm || isMaobs || isMaovds || isMalvcs || isMaubs;

  const getSystemIcon = (id: string, colorClass: string = 'text-black', size: string = 'w-4 h-4') => {
    switch (id) {
      case 'macs': return <Network className={`${colorClass} ${size}`} />;
      case 'macps': return <Film className={`${colorClass} ${size}`} />;
      case 'matls': return <Cpu className={`${colorClass} ${size}`} />;
      case 'masdm': return <Volume2 className={`${colorClass} ${size}`} />;
      case 'maobs': return <Sliders className={`${colorClass} ${size}`} />;
      case 'maovds': return <Compass className={`${colorClass} ${size}`} />;
      case 'malvcs': return <Eye className={`${colorClass} ${size}`} />;
      case 'maubs': return <Binary className={`${colorClass} ${size}`} />;
      default: return <Activity className={`${colorClass} ${size}`} />;
    }
  };


  // Helper: get detail data
  const getDetail = () => (isMacs ? MACS_DETAIL : isMacps ? MACPS_DETAIL : isMatls ? MATLS_DETAIL : isMasdm ? MASDM_DETAIL : isMaobs ? MAOBS_DETAIL : isMaovds ? MAOVDS_DETAIL : isMalvcs ? MALVCS_DETAIL : MAUBS_DETAIL);

  return (
    <div className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#ECECF0' }}>
      {/* Section top edge */}
      <div className="noc-section-edge" />
      {/* Dot grid */}
      <div className="noc-dot-grid absolute inset-0 pointer-events-none" />
      {/* Radial glow */}
      <div className="noc-radial-glow" />
      {/* Side accents */}
      <div className="noc-side-accent-left" />
      <div className="noc-side-accent-right" />

      {/* SVG Noise texture overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.025] z-[0]" aria-hidden="true">
        <filter id="eco-noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#eco-noise)" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ─── Section Header ─── */}
        <div className="mb-14 md:mb-18">
          {/* Terminal command line */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <Mono className="text-[10px] text-black tracking-[0.25em] uppercase font-bold">&gt; SECTOR_01 // ECOSYSTEM ARCHITECTURE</Mono>
            <span className="flex-1 h-px bg-black/10" />
            <Mono className="text-[9px] text-neutral-500 tracking-[0.2em] uppercase font-bold">8 SYSTEMS</Mono>
            <span
              className="inline-block w-[6px] h-[14px] bg-emerald-500 ml-1"
              style={{ animation: 'noc-cursor-blink 0.8s step-end infinite' }}
            />
          </div>
          {/* Headline with Orbitron */}
          <h2 className="font-black text-[2.8rem] md:text-7xl text-black tracking-tight leading-[0.92]" style={{ fontFamily: '"Orbitron", "JetBrains Mono", monospace' }}>
            <span className="block uppercase">MIZORA</span>
            <span
              className={`block uppercase ${isGlitching ? 'glitch-active' : ''} ${useKanjiFont ? 'font-kanji' : ''}`}
              style={{ minWidth: useKanjiFont ? '2.5ch' : '9ch', letterSpacing: useKanjiFont ? '0.08em' : undefined, transition: 'letter-spacing 0.3s ease' }}
            >
              {displayText}
            </span>
          </h2>
          {/* Emerald decorative line */}
          <div className="noc-headline-line" />
          {/* Micro data readout */}
          <div className="flex items-center gap-4 mt-5">
            <p className="font-sans font-medium text-sm md:text-base text-neutral-500 leading-relaxed max-w-3xl flex-1">
              {t.ecosystem.subtitle}
            </p>
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="w-1 h-1 rounded-full bg-emerald-500/40" />
              <span className="w-1 h-1 rounded-full bg-emerald-500/30" />
              <span className="w-1 h-1 rounded-full bg-emerald-500/20" />
              <Mono className="text-[8px] text-neutral-400 tracking-[0.15em] uppercase font-bold">ALL SYSTEMS NOMINAL</Mono>
            </div>
          </div>
          {/* Micro data readout line */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-[4px] h-[4px] rounded-full ${i < 5 ? 'bg-emerald-500/70' : 'bg-neutral-300/60'}`}
                />
              ))}
            </div>
            <Mono className="text-[7px] text-neutral-400 tracking-[0.2em] uppercase font-bold">
              NET.STATUS // V2.4.1
            </Mono>
            <span className="flex-1 h-px bg-neutral-200/50" />
            <Mono className="text-[7px] text-emerald-600/50 tracking-[0.15em] uppercase font-bold">
              ● ONLINE
            </Mono>
          </div>
        </div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">

          {/* ─── Left: System Cards Grid ─── */}
          <div className="lg:col-span-7">
            <ScrollReveal yOffset={20}>
              <div ref={cardsGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.ecosystem.systems.map((system, sysIdx) => {
                  const isSelected = selectedSystem.id === system.id;
                  return (
                    <motion.button
                      key={system.id}
                      onClick={() => { setSelectedSystem(system); }}
                      className={`relative cursor-pointer text-left w-full ${isSelected ? 'noc-card-selected' : 'noc-card'}`}
                      whileHover={!isSelected ? { y: -4 } : {}}
                      whileTap={!isSelected ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Corner accent marks for selected card */}
                      {isSelected && (
                        <>
                          <span className="noc-card-corner noc-card-corner-tl" />
                          <span className="noc-card-corner noc-card-corner-tr" />
                          <span className="noc-card-corner noc-card-corner-bl" />
                          <span className="noc-card-corner noc-card-corner-br" />
                        </>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3.5">
                          {/* Icon container */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-350 ${isSelected ? 'noc-icon-selected' : 'noc-icon-normal'}`}>
                            {getSystemIcon(system.id, isSelected ? 'text-emerald-400' : 'text-black', 'w-4.5 h-4.5')}
                          </div>
                          {/* Status indicator */}
                          <div className="flex items-center gap-1.5">
                            {isSelected ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 noc-pulse-dot" />
                                <Mono className="text-[8px] text-emerald-400 font-bold tracking-[0.15em] uppercase">ONLINE</Mono>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                <Mono className="text-[8px] text-neutral-500 font-bold tracking-[0.15em] uppercase">ACTIVE</Mono>
                              </>
                            )}
                          </div>
                        </div>
                        {/* System name */}
                        <div className="mb-3">
                          <Mono className={`text-[9px] font-bold tracking-[0.2em] uppercase mb-0.5 ${isSelected ? 'text-emerald-400/70' : 'text-neutral-500'}`}>{system.abbrev}</Mono>
                          <h3 className={`font-sans font-extrabold text-[13px] leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-black'}`}>{system.name}</h3>
                        </div>
                        {/* Bottom bar */}
                        <div className={`flex items-center justify-between w-full pt-2.5 border-t ${isSelected ? 'border-white/8' : 'border-black/6'}`}>
                          <Mono className={`text-[8px] tracking-[0.12em] uppercase font-medium truncate mr-2 ${isSelected ? 'text-white/50' : 'text-neutral-400'}`}>{system.tagline}</Mono>
                          <div className="flex items-center gap-1.5">
                            <Mono className={`text-[8px] font-bold tracking-[0.12em] uppercase shrink-0 ${isSelected ? 'text-emerald-400/80' : 'text-neutral-400'}`}>
                              {isSelected ? system.status.toUpperCase() : `SYS_${String(sysIdx + 1).padStart(2, '0')}`}
                            </Mono>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* ─── Right: Detail Panel ─── */}
          <div className="lg:col-span-5">
            <ScrollReveal yOffset={20} delay={0.1}>
              <div
                className="noc-detail-panel flex flex-col"
                style={detailMaxH ? { maxHeight: `${detailMaxH}px`, height: `${detailMaxH}px` } : undefined}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`detail-${selectedSystem.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col min-h-0"
                    style={detailMaxH ? { height: `${detailMaxH}px` } : undefined}
                  >
                      {/* Decorative overlays */}
                      <div className="noc-glitch-line-overlay" />
                      <div className="noc-holo-shimmer-overlay" />

                      {/* ── HEADER ── */}
                      <div className="noc-detail-header px-5 py-4">
                        <div className="noc-header-scanline" />
                        <div className="flex items-center gap-3.5">
                          {/* Icon */}
                          <div className="noc-icon-selected w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                            {getSystemIcon(selectedSystem.id, 'text-white', 'w-4.5 h-4.5')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <Mono className="text-[9px] font-bold tracking-[0.2em] uppercase text-neutral-400">{selectedSystem.abbrev}</Mono>
                              <Mono className="text-[8px] font-bold tracking-[0.15em] uppercase text-emerald-400">{selectedSystem.status.toUpperCase()}</Mono>
                              <Mono className="text-[7px] font-bold tracking-[0.12em] uppercase text-emerald-500/70">v1.0</Mono>
                            </div>
                            <h3 className="font-sans font-black text-[13px] text-white leading-tight uppercase truncate">{selectedSystem.name}</h3>
                          </div>
                          {/* Activity Waveform */}
                          <svg className="noc-waveform-svg shrink-0" width="40" height="16" viewBox="0 0 40 16">
                            <path d="M0 8 Q5 2 10 8 Q15 14 20 8 Q25 2 30 8 Q35 14 40 8" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="4 2" style={{ animation: 'noc-waveform 2s linear infinite' }} />
                          </svg>
                        </div>
                      </div>

                      {/* ── BODY ── */}
                      <div className="noc-detail-inner flex-1 min-h-0 overflow-y-auto noc-detail-scroll">
                        <motion.div
                          className="px-5 py-5 space-y-5 relative z-[1]"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >

                          {/* LABEL */}
                          <Mono className="text-[8px] text-neutral-400 tracking-[0.2em] uppercase font-bold">{selectedSystem.tagline}</Mono>

                          {/* DESCRIPTION */}
                          {hasDetail ? (
                            <div className="space-y-2.5 relative z-[1]">
                              {getDetail().longDescription.map((p, i) => (
                                <p key={i} className="font-sans text-neutral-300 text-[12px] leading-relaxed">{p}</p>
                              ))}
                            </div>
                          ) : (
                            <p className="font-sans text-neutral-300 text-[12px] leading-relaxed relative z-[1]">{selectedSystem.description}</p>
                          )}

                          <SectionDivider variant="dot" />

                          {/* ── SYSTEM STATUS ── */}
                          <div>
                            <SectionLabel icon={Activity}>System Status</SectionLabel>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="noc-status-block p-2.5 rounded-md">
                                <Mono className="text-[7px] text-neutral-400 uppercase tracking-[0.15em] block mb-1.5 font-bold">Status</Mono>
                                <div className="flex items-center gap-1.5">
                                  <div>
                                    <div className="flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      <Mono className="text-[10px] font-bold text-white uppercase">OK</Mono>
                                    </div>
                                    <DataBar value={95} />
                                  </div>
                                </div>
                              </div>
                              <div className="noc-status-block p-2.5 rounded-md">
                                <Mono className="text-[7px] text-neutral-400 uppercase tracking-[0.15em] block mb-1.5 font-bold">Version</Mono>
                                <Mono className="text-[10px] font-bold text-white">v1.0</Mono>
                                <DataBar value={100} />
                              </div>
                              <div className="noc-status-block p-2.5 rounded-md">
                                <Mono className="text-[7px] text-neutral-400 uppercase tracking-[0.15em] block mb-1.5 font-bold">{isMacs ? 'Agent' : 'Category'}</Mono>
                                <Mono className="text-[10px] font-bold text-white">{isMacs ? '7 Active' : isMacps ? 'Storytelling' : isMatls ? 'Thinking' : isMasdm ? 'Music' : isMaobs ? 'Architecture' : isMaovds ? 'Visual' : isMalvcs ? 'Cinematic' : 'UI/UX'}</Mono>
                                <DataBar value={isMacs ? 87 : 75} />
                              </div>
                            </div>
                          </div>

                          <SectionDivider variant="hash" />

                          {/* ── CORE ARCHITECTURE ── */}
                          <div>
                            <SectionLabel icon={Activity}>{lang === 'id' ? 'Arsitektur Inti' : 'Core Architecture'}</SectionLabel>
                            <div className="flex flex-col gap-1">
                              {selectedSystem.architecture.map((arch, idx) => (
                                <div key={idx} className="noc-arch-row flex items-start gap-2.5 py-2.5 px-3 rounded-md">
                                  <Mono className="text-[8px] text-emerald-500/70 font-bold tracking-wider shrink-0 mt-px">{String(idx + 1).padStart(2, '0')}</Mono>
                                  <div className="min-w-0">
                                    <span className="font-sans font-bold text-[11px] text-white uppercase block leading-tight">{arch}</span>
                                    {hasDetail && idx < getDetail().architectureDescriptions.length && (
                                      <span className="font-sans text-[9px] text-neutral-300 leading-snug block mt-0.5">
                                        {getDetail().architectureDescriptions[idx]}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1 shrink-0 mt-0.5">
                                    <Zap className="w-2.5 h-2.5 text-emerald-500/70" />
                                    <DataBar value={100 - idx * 20} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <SectionDivider variant="hash" />

                          {/* ── AI AGENTS (MACS only) ── */}
                          {isMacs && (
                            <div>
                              <SectionLabel icon={Cpu}>AI Agents</SectionLabel>
                              <div className="flex flex-col gap-1.5">
                                {MACS_DETAIL.agents.map((agent, idx) => (
                                  <div key={idx} className="noc-agent-card p-3 rounded-md">
                                    <div className="flex items-start gap-2.5">
                                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                                        style={{
                                          background: `linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)`,
                                          border: '1px solid rgba(16,185,129,0.1)',
                                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
                                        }}
                                      >
                                        <agent.icon className="w-3.5 h-3.5 text-neutral-300" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <Mono className="text-[9px] font-bold tracking-[0.12em] uppercase text-white">{agent.name}</Mono>
                                          <span className="text-[7px] tracking-[0.1em] uppercase font-bold text-emerald-400/60 bg-emerald-500/8 px-1.5 py-0.5 rounded" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{agent.role}</span>
                                        </div>
                                        <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">{agent.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <SectionDivider variant="dot" />

                          {/* ── CORE CAPABILITIES ── */}
                          {hasDetail && (
                            <div>
                              <SectionLabel icon={Zap}>Core Capabilities</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {getDetail().capabilities.map((cap, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{cap.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{cap.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <SectionDivider variant="hash" />

                          {/* ── SUB MODULES ── */}
                          <div>
                            <SectionLabel icon={Cpu}>{lang === 'id' ? 'Sub Modul' : 'Sub Modules'}</SectionLabel>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedSystem.modules.map((mod, idx) => (
                                <span key={idx} className="noc-module-chip py-1 px-2.5 text-neutral-300 text-[8px] uppercase tracking-[0.12em] rounded-md font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{mod}</span>
                              ))}
                            </div>
                          </div>

                          <SectionDivider variant="dot" />

                          {/* ── VISUAL FRAMEWORK (MACPS only) ── */}
                          {isMacps && (
                            <div>
                              <SectionLabel icon={Film}>Visual Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MACPS_DETAIL.visualFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── SPECIALIZATION (MACPS/MATLS/MASDM/MAOBS/MAOVDS/MALVCS/MAUBS) ── */}
                          {(isMacps || isMatls || isMasdm || isMaobs || isMaovds || isMalvcs || isMaubs) && (
                            <div>
                              <SectionLabel icon={Hexagon}>Specialization</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {(isMacps ? MACPS_DETAIL : isMatls ? MATLS_DETAIL : isMasdm ? MASDM_DETAIL : isMaobs ? MAOBS_DETAIL : isMaovds ? MAOVDS_DETAIL : isMalvcs ? MALVCS_DETAIL : MAUBS_DETAIL).specialization.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── VISUAL CANON (MACPS only) ── */}
                          {isMacps && (
                            <div>
                              <SectionLabel icon={Palette}>Visual Canon</SectionLabel>
                              <div className="noc-philosophy-block rounded-md p-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
                                <Mono className="text-[9px] text-neutral-400 tracking-[0.2em] uppercase font-bold block mb-2">{MACPS_DETAIL.visualCanon.title}</Mono>
                                <p className="font-sans text-[11px] text-neutral-400 leading-relaxed mb-2">{MACPS_DETAIL.visualCanon.description}</p>
                                <div className="space-y-1.5">
                                  {MACPS_DETAIL.visualCanon.lines.map((line, idx) => (
                                    <p key={idx} className="font-sans text-[10px] text-neutral-400 leading-relaxed">{line}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── THINKING FRAMEWORK (MATLS only) ── */}
                          {isMatls && (
                            <div>
                              <SectionLabel icon={Cpu}>Thinking Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MATLS_DETAIL.thinkingFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── INTERACTION MODEL (MATLS only) ── */}
                          {isMatls && (
                            <div>
                              <SectionLabel icon={Eye}>Interaction Model</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MATLS_DETAIL.interactionModel.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── COMMUNICATION STYLE (MATLS only) ── */}
                          {isMatls && (
                            <div>
                              <SectionLabel icon={Sliders}>Communication Style</SectionLabel>
                              <div className="grid grid-cols-3 gap-1.5">
                                {MATLS_DETAIL.communicationStyle.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── CREATIVE FRAMEWORK (MASDM only) ── */}
                          {isMasdm && (
                            <div>
                              <SectionLabel icon={Music}>Creative Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MASDM_DETAIL.creativeFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── CREATIVE OUTPUTS (MASDM only) ── */}
                          {isMasdm && (
                            <div>
                              <SectionLabel icon={Sparkles}>Creative Outputs</SectionLabel>
                              <div className="flex flex-wrap gap-1.5">
                                {MASDM_DETAIL.creativeOutputs.map((item, idx) => (
                                  <span key={idx} className="noc-module-chip py-1 px-2.5 text-neutral-300 text-[8px] uppercase tracking-[0.12em] rounded-md font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{item}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── BUILD FRAMEWORK (MAOBS only) ── */}
                          {isMaobs && (
                            <div>
                              <SectionLabel icon={Hexagon}>Build Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAOBS_DETAIL.buildFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── DESIGN PRINCIPLES (MAOBS only) ── */}
                          {isMaobs && (
                            <div>
                              <SectionLabel icon={ShieldCheck}>Design Principles</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAOBS_DETAIL.designPrinciples.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── DESIGN FRAMEWORK (MAOVDS only) ── */}
                          {isMaovds && (
                            <div>
                              <SectionLabel icon={Compass}>Design Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAOVDS_DETAIL.designFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── DESIGN DOMAINS (MAOVDS only) ── */}
                          {isMaovds && (
                            <div>
                              <SectionLabel icon={Palette}>Design Domains</SectionLabel>
                              <div className="flex flex-wrap gap-1.5">
                                {MAOVDS_DETAIL.designDomains.map((item, idx) => (
                                  <span key={idx} className="noc-module-chip py-1 px-2.5 text-neutral-300 text-[8px] uppercase tracking-[0.12em] rounded-md font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{item}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── QUALITY CONTROL (MAOVDS only) ── */}
                          {isMaovds && (
                            <div>
                              <SectionLabel icon={ShieldCheck}>Quality Control</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAOVDS_DETAIL.qualityControl.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── VISUAL FRAMEWORK (MALVCS only) ── */}
                          {isMalvcs && (
                            <div>
                              <SectionLabel icon={Eye}>Visual Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MALVCS_DETAIL.visualFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── CINEMATIC COMPONENTS (MALVCS only) ── */}
                          {isMalvcs && (
                            <div>
                              <SectionLabel icon={Film}>Cinematic Components</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MALVCS_DETAIL.cinematicComponents.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── QUALITY CONTROL (MALVCS only) ── */}
                          {isMalvcs && (
                            <div>
                              <SectionLabel icon={ShieldCheck}>Quality Control</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MALVCS_DETAIL.qualityControl.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── SIGNATURE STYLE (MALVCS only) ── */}
                          {isMalvcs && (
                            <div>
                              <SectionLabel icon={Sparkles}>Signature Style</SectionLabel>
                              <div className="noc-philosophy-block rounded-md p-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
                                <Mono className="text-[9px] text-neutral-400 tracking-[0.2em] uppercase font-bold block mb-2">{MALVCS_DETAIL.signatureStyle.title}</Mono>
                                <p className="font-sans text-[11px] text-neutral-400 leading-relaxed mb-2">{MALVCS_DETAIL.signatureStyle.description}</p>
                                <div className="space-y-1.5">
                                  {MALVCS_DETAIL.signatureStyle.lines.map((line, idx) => (
                                    <p key={idx} className="font-sans text-[10px] text-neutral-400 leading-relaxed">{line}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── PRODUCT DESIGN FRAMEWORK (MAUBS only) ── */}
                          {isMaubs && (
                            <div>
                              <SectionLabel icon={Sliders}>Product Design Framework</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAUBS_DETAIL.productDesignFramework.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── DESIGN INTELLIGENCE (MAUBS only) ── */}
                          {isMaubs && (
                            <div>
                              <SectionLabel icon={BrainCircuit}>Design Intelligence</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAUBS_DETAIL.designIntelligence.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── QUALITY STANDARDS (MAUBS only) ── */}
                          {isMaubs && (
                            <div>
                              <SectionLabel icon={ShieldCheck}>Quality Standards</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                {MAUBS_DETAIL.qualityStandards.map((item, idx) => (
                                  <div key={idx} className="noc-cap-card p-2.5 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{item.title}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── ACTIVATION / PRODUCTION / DEVELOPMENT / OPERATION MODE ── */}
                          {(isMacs || isMacps || isMasdm || isMaobs) && (
                            <div>
                              <SectionLabel icon={ChevronRight}>{isMacs ? 'Activation Mode' : isMacps ? 'Production Modes' : isMasdm ? 'Song Development Process' : 'Operation Modes'}</SectionLabel>
                              <div className="flex flex-col gap-1.5">
                                {(isMacs ? MACS_DETAIL.activationModes : isMacps ? MACPS_DETAIL.productionModes : isMasdm ? MASDM_DETAIL.songDevelopmentProcess : MAOBS_DETAIL.operationModes).map((mode, idx) => (
                                  <div key={idx} className="noc-mode-card p-3 rounded-md">
                                    <h4 className="font-sans font-bold text-[10px] text-white leading-tight mb-0.5">{mode.name}</h4>
                                    <p className="font-sans text-[9px] text-neutral-400 leading-relaxed">{mode.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── POSITIONING (MATLS/MASDM/MAOBS/MAOVDS/MALVCS/MAUBS) ── */}
                          {(isMatls || isMasdm || isMaobs || isMaovds || isMalvcs || isMaubs) && (
                            <div>
                              <SectionLabel icon={Activity}>Positioning</SectionLabel>
                              <div className="grid grid-cols-2 gap-1.5">
                                <div className="noc-position-is rounded-md p-3 relative overflow-hidden">
                                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                                  <Mono className="text-[8px] text-emerald-400/80 tracking-[0.15em] uppercase font-bold block mb-2">IS ✓</Mono>
                                  <div className="space-y-1">
                                    {(isMatls ? MATLS_DETAIL : isMasdm ? MASDM_DETAIL : isMaobs ? MAOBS_DETAIL : isMaovds ? MAOVDS_DETAIL : isMalvcs ? MALVCS_DETAIL : MAUBS_DETAIL).positioning.is.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500/50 shrink-0" />
                                        <span className="font-sans text-[10px] text-neutral-300 leading-tight">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="noc-position-is-not rounded-md p-3 relative overflow-hidden">
                                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-400/15 to-transparent" />
                                  <Mono className="text-[8px] text-neutral-500 tracking-[0.15em] uppercase font-bold block mb-2">IS NOT ✗</Mono>
                                  <div className="space-y-1">
                                    {(isMatls ? MATLS_DETAIL : isMasdm ? MASDM_DETAIL : isMaobs ? MAOBS_DETAIL : isMaovds ? MAOVDS_DETAIL : isMalvcs ? MALVCS_DETAIL : MAUBS_DETAIL).positioning.isNot.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-neutral-600/50 shrink-0" />
                                        <span className="font-sans text-[10px] text-neutral-500 leading-tight">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── PHILOSOPHY ── */}
                          {hasDetail && (
                            <div>
                              <SectionLabel icon={Eye}>Philosophy</SectionLabel>
                              <div className="noc-philosophy-block rounded-md p-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
                                <Mono className="text-[9px] text-neutral-400 tracking-[0.2em] uppercase font-bold block mb-3">{getDetail().philosophy.title}</Mono>
                                <div className="space-y-2">
                                  {getDetail().philosophy.lines.map((line, idx) => (
                                    <p key={idx} className="font-sans text-[11px] text-neutral-400 leading-relaxed">{line}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ── SYSTEM TAG ── */}
                          <div className="flex items-center justify-between pt-2 relative z-[1]">
                            <div className="flex items-center gap-2">
                              <Mono className="text-[8px] text-neutral-400 tracking-[0.1em] font-bold">{isMacs ? MACS_DETAIL.systemTag : isMacps ? MACPS_DETAIL.systemTag : isMatls ? MATLS_DETAIL.systemTag : isMasdm ? MASDM_DETAIL.systemTag : isMaobs ? MAOBS_DETAIL.systemTag : isMaovds ? MAOVDS_DETAIL.systemTag : isMalvcs ? MALVCS_DETAIL.systemTag : isMaubs ? MAUBS_DETAIL.systemTag : `[MIZORA_${selectedSystem.abbrev}]`}<span className="inline-block w-[5px] h-[9px] bg-emerald-500/50 ml-0.5 align-middle" style={{ animation: 'noc-cursor-blink 1s step-end infinite' }} /></Mono>
                            </div>
                          </div>

                          {/* ── FOOTER INFO ── */}
                          <div className="pt-3 border-t border-white/5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div>
                                  <Mono className="text-[7px] text-neutral-400 tracking-[0.15em] uppercase font-bold block mb-0.5">Founder & Creator</Mono>
                                  <span className="font-sans font-bold text-[11px] text-white">{hasDetail ? getDetail().founder : 'Rendy Awan'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <Mono className="text-[7px] text-neutral-400 tracking-[0.15em] uppercase font-bold block mb-0.5">Organization</Mono>
                                  <span className="font-sans font-bold text-[11px] text-white">Mizora KZN</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </motion.div>
                      </div>

                      {/* ── DECORATIVE SYSTEM BADGE ── */}
                      {hasDetail && (
                        <div className="shrink-0 px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div className="noc-cta-badge w-full flex items-center justify-center py-3 px-4 select-none relative">
                            <span className="absolute top-1.5 left-2.5 w-1.5 h-1.5 border-t border-l border-emerald-500/30" />
                            <span className="absolute top-1.5 right-2.5 w-1.5 h-1.5 border-t border-r border-emerald-500/30" />
                            <span className="absolute bottom-1.5 left-2.5 w-1.5 h-1.5 border-b border-l border-emerald-500/30" />
                            <span className="absolute bottom-1.5 right-2.5 w-1.5 h-1.5 border-b border-r border-emerald-500/30" />
                            <Mono className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/80 relative z-[1]">
                              {isMacps ? 'Mizora AERA Comic Production System' : isMatls ? 'Mizora AI Thinking Lab System' : isMasdm ? 'Mizora AI Song Direction Music' : isMaobs ? 'Mizora AI Orchestration Build System' : isMaovds ? 'Mizora AI ORION Visual Direction System' : isMalvcs ? 'Mizora AI Lens Visual Capture System' : isMaubs ? 'Mizora AI UI/UX Builder System' : 'Mizora AI Collaboration System'}
                            </Mono>
                          </div>
                        </div>
                      )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
