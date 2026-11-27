import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroCanvas } from './webgl/heroCanvas';
import { initSpecsCanvas } from './webgl/specsCanvas';

import sudanHeroSeederImg from './assets/images/sudan_hero_seeder_exact_1795766987330.jpg';
import sudanToubPlanterImg from './assets/images/sudan_toub_planter_portrait_1795765210859.jpg';
import sudanFieldSeederImg from './assets/images/sudan_seeder_field_exact_1795766986708.jpg';
import sudanToubHarvestImg from './assets/images/sudan_toub_harvest_wide_1795765212236.jpg';
import sudanToubShowcaseWideImg from './assets/images/sudan_toub_showcase_wide_1795766981775.jpg';

import seederStudioImg from './assets/images/seeder_studio_exact_1795765770455.jpg';
import seederNozzleImg from './assets/images/seeder_nozzles_exact_1795766984512.jpg';
import seederHopperImg from './assets/images/seeder_hopper_roller_exact_1795766985763.jpg';
import planterStudioImg from './assets/images/planter_studio_sage_1795764324012.jpg';
import seedKitStudioImg from './assets/images/sudan_seed_kit_arabic_1795766986917.jpg';
import comparisonBroadcastImg from './assets/images/comparison_hand_broadcast_1795766981901.jpg';
import comparisonPrecisionImg from './assets/images/comparison_precision_rows_1795766982862.jpg';

gsap.registerPlugin(ScrollTrigger);

type ProductId = 'seeder' | 'planter' | 'seeds';
type VariantFinishId =
  | 'crimson'
  | 'field'
  | 'slate'
  | 'sage'
  | 'terracotta'
  | 'basalt'
  | 'meadow';

interface ProductVariantOption {
  id: VariantFinishId;
  name: string;
  dot: string;
}

interface ProductSizeOption {
  label: string;
  scale: number;
}

interface ProductSpec {
  key: string;
  val: string;
}

interface ProductDefinition {
  id: ProductId;
  tabLabel: string;
  name: string;
  description: string;
  heroImage: string;
  image: string;
  imageAlt: string;
  finishGroupLabel: string;
  sizeGroupLabel: string;
  finishes: ProductVariantOption[];
  sizes: ProductSizeOption[];
  specs: ProductSpec[];
  note?: string;
}

const PRODUCTS: Record<ProductId, ProductDefinition> = {
  seeder: {
    id: 'seeder',
    tabLabel: 'البذّارة اليدوية',
    name: 'بذّارة الدفع اليدوية بـ ١٠ مناقير',
    description:
      'بذّارة متعددة المهام من الحديد المجلفن والبولي كربونات الشفاف للمنحدرات والمدرجات والمزارع الصغيرة والبيوت المحمية، مزوّدة بفتحة إمالة للتفريغ وعجلة رصّ خلفية.',
    heroImage: sudanHeroSeederImg,
    image: seederStudioImg,
    imageAlt:
      'بذّارة دفع يدوية بـ ١٠ مناقير فولاذية وخزان بذور أحمر شفاف وعجلة رص خلفية',
    finishGroupLabel: 'لون الخزان والهيكل',
    sizeGroupLabel: 'عدد المناقير',
    finishes: [
      { id: 'crimson', name: 'أحمر وأسود', dot: '#C9342B' },
      { id: 'field', name: 'أخضر حقلي', dot: '#48634B' },
      { id: 'slate', name: 'معدني مجلفن', dot: '#5E6462' },
    ],
    sizes: [
      { label: '٦ مناقير', scale: 0.96 },
      { label: '٧ مناقير', scale: 0.98 },
      { label: '١٠ مناقير', scale: 1.0 },
    ],
    specs: [
      { key: 'المواد والطلاء', val: 'حديد مجلفن مطلي · ABS · بولي كربونات وبولي بروبيلين' },
      { key: 'عمق الغرس', val: '٣.٥ – ٧.٨ سم (١.٣٨ – ٣.٠٧ بوصة)' },
      { key: 'المسافة والكمية', val: '١٦ سم (٦.٣ بوصة) · ١–٢ بذرة/جورة' },
      { key: 'أقطار البذور', val: '٣ – ١٥ ملم (ذرة، فول سوداني، صويا، قطن، دوّار شمس)' },
      { key: 'السعة والأبعاد', val: '٣.٧٥ كجم (٨.٢٧ رطل) · ٩.٤٥ × ٢٠.٤٧ × ٢٤.٤١ بوصة' },
      { key: 'الوزن والملحقات', val: '٩.٥ كجم · تشمل البذّارة ودليل التركيب وكامل القطع' },
    ],
    note: 'ملاحظات التشغيل: تُدفع البذّارة للأمام فقط مع ضبط زاوية المقبض، وتُستخدم ببذور جافة مع تنظيفها وتزييت التروس دورياً (منفذ بذور واحد دون تسميد مزدوج).',
  },
  planter: {
    id: 'planter',
    tabLabel: 'الأصص الشخصية',
    name: 'أصيص خزفي ذاتي السقي',
    description:
      'أصيص خزفي مُحرق على حرارة عالية بقاعدة ارتشاح شعرية ومؤشر نحاسي لمتابعة الرطوبة، مثالي لأعشاب المطبخ والأسطح والأحواش.',
    heroImage: sudanToubPlanterImg,
    image: planterStudioImg,
    imageAlt:
      'أصيص خزفي ذاتي السقي بلون الميرمية مع نباتات الريحان والزعتر الطازجة',
    finishGroupLabel: 'لون الخزف',
    sizeGroupLabel: 'المقاس',
    finishes: [
      { id: 'sage', name: 'أخضر النيل', dot: '#5B6B4F' },
      { id: 'terracotta', name: 'طمي نيّ', dot: '#A95C42' },
      { id: 'basalt', name: 'بازلت داكن', dot: '#2B302E' },
    ],
    sizes: [
      { label: 'أصيص مفرد (١٥ سم)', scale: 0.96 },
      { label: 'طقم ثلاثي (٣٨ سم)', scale: 1.0 },
      { label: 'حوض شرفة (٦٠ سم)', scale: 1.04 },
    ],
    specs: [
      { key: 'نظام الري', val: 'ارتشاح شعري ذاتي يدوم أسبوعين' },
      { key: 'الخامة', val: 'خزف صلب ومؤشر منسوب نحاسي' },
      { key: 'التهوية', val: 'شبكة تصريف وتهوية للجذور قابلة للفك' },
    ],
  },
  seeds: {
    id: 'seeds',
    tabLabel: 'البذور الأصيلة',
    name: 'مجموعة البذور البلدية وأقراص الكوكو',
    description:
      'بذور خضروات وأعشاب بلدية عضوية غير معدّلة وراثياً، مفحوصة لنسب إنبات عالية ومناسبة للبذّارات اليدوية والأصص المنزلية.',
    heroImage: seedKitStudioImg,
    image: seedKitStudioImg,
    imageAlt:
      'مجموعة بذور بلدية في مغلفات ورقية مع أوتاد غرس نحاسية وأقراص تربة مضغوطة',
    finishGroupLabel: 'تشكيلة البذور',
    sizeGroupLabel: 'حجم العبوة',
    finishes: [
      { id: 'sage', name: 'أعشاب المطبخ', dot: '#48634B' },
      { id: 'meadow', name: 'محاصيل الحقل والذرة', dot: '#6F8B57' },
      { id: 'terracotta', name: 'طماطم وبامية بلدية', dot: '#B6513B' },
    ],
    sizes: [
      { label: 'باقة البداية (٦ أنواع)', scale: 0.96 },
      { label: 'باقة الموسم (١٢ نوع)', scale: 1.0 },
      { label: 'صندوق المزارع (٢٤ نوع)', scale: 1.04 },
    ],
    specs: [
      { key: 'نسبة الإنبات', val: '٩٤٪ مفحوصة مخبرياً بدون معالجة كيميائية' },
      { key: 'الأصل', val: 'بذور إرثية مفتوحة التلقيح غير معدّلة' },
      { key: 'المحتويات', val: 'أقراص جوز الهند، غارز نحاسي، وبطاقات خشب' },
    ],
  },
};

const HERO_SPOTLIGHTS: { id: ProductId; label: string; dot: string }[] = [
  { id: 'seeder', label: 'البذّارة اليدوية', dot: '#C9342B' },
  { id: 'planter', label: 'الأصص الشخصية', dot: '#5B6B4F' },
  { id: 'seeds', label: 'البذور الأصيلة', dot: '#A95C42' },
];

const SHOWCASE_STAGES = [
  {
    src: sudanFieldSeederImg,
    alt: 'مزارع سوداني بالجلابية والعمّة البيضاء يدفع بذّارة يدوية بـ ١٠ مناقير على ضفاف النيل',
    title: 'زراعة دقيقة على ضفاف النيل',
    sub: 'دفع مريح بوضع الوقوف وتوازن بثلاث عجلات لأطول الخطوط الزراعية',
  },
  {
    src: sudanToubHarvestImg,
    alt: 'سيدات سودانيات بالثوب السوداني التراثي يجمعن الخضروات الطازجة في قفف السعف',
    title: 'جمال الحصاد والتراث السوداني',
    sub: 'خير الأرض يزهر في ألوان الثوب السوداني وقفف السعف المنسوجة يدوياً',
  },
  {
    src: seederNozzleImg,
    alt: 'صورة مقربة لمناقير الغرس الفولاذية على أسطوانة البذّارة اليدوية فوق تربة خصبة',
    title: 'مناقير فولاذية لغرس متوازن',
    sub: 'تخترق التربة بسرعة وتُسقط ١–٢ بذرة على عمق واحد دون إتلاف القشرة',
  },
  {
    src: sudanToubShowcaseWideImg,
    alt: 'سيدة سودانية بالثوب السوداني التراثي تعتني بأصص خزفية ذاتية السقي مزروعة بالريحان والنعناع وإكليل الجبل في فناء سوداني مشمس',
    title: 'من الحقل إلى فناء البيت',
    sub: 'أناقة الثوب السوداني مع أصص خزفية ذاتية السقي تمنحك أعشاب المطبخ الطازجة في كل صباح',
  },
];

interface FieldStudy {
  id: string;
  crop: string;
  country: string;
  methodLabel: string;
  broadcastYield: string;
  precisionYield: string;
  yieldGain: string;
  savingsSummary: string;
  detailNote: string;
}

const FIELD_STUDIES: FieldStudy[] = [
  {
    id: 'onion-bd',
    crop: 'البصل — زراعة يدوية صغيرة',
    country: 'بنغلاديش',
    methodLabel: 'بذّارة يدوية صغيرة (الأقرب لحالتنا)',
    broadcastYield: '١٠.٢٥ طن / هكتار',
    precisionYield: '١٣.٢٦ طن / هكتار',
    yieldGain: 'زيادة ٢٩٪',
    savingsSummary: 'زمن الزراعة من ٤٨ ساعة إلى ٦ ساعات للهكتار',
    detailNote:
      'أقرب تجربة لحالة البذّارة اليدوية الصغيرة؛ انخفض زمن بذر الهكتار الواحد بمقدار ٨ أضعاف مع قفزة ٢٩٪ في المحصول.',
  },
  {
    id: 'wheat-in',
    crop: 'القمح',
    country: 'الهند (تجربة سنتين)',
    methodLabel: 'الرمي باليد مقابل الغرس الدقيق',
    broadcastYield: '٣.٨٦ طن / هكتار',
    precisionYield: '٤.٨٤ طن / هكتار',
    yieldGain: 'زيادة ٢٥.٤٪',
    savingsSummary: 'توزيع أدق للبذرة بنفس المياه والسماد',
    detailNote:
      'حققت التجربة الحقلية الممتدة لسنتين زيادة ربع المحصول تقريباً بنفس كمية الري والتسميد بفضل انتظام المسافات.',
  },
  {
    id: 'wheat-eg',
    crop: 'القمح',
    country: 'مصر',
    methodLabel: 'الزراعة بالسطارة مقابل الرمي',
    broadcastYield: 'تكلفة ٩٥.٩١ دولار / هـ',
    precisionYield: 'تكلفة ٥٢.٥١ دولار / هـ',
    yieldGain: 'زيادة ١٣٪',
    savingsSummary: 'توفير ٢٦٪ تقاوي وتكلفة أقل ٤٥٪',
    detailNote:
      'وفّرت السطارة ربع التقاوي تقريباً وخفضت التكلفة الكلية للهكتار من ٩٥.٩١ إلى ٥٢.٥١ دولار مع زيادة الإنتاج ١٣٪.',
  },
  {
    id: 'mustard-in',
    crop: 'الخردل',
    country: 'الهند (٢٠٢٤–٢٠٢٥)',
    methodLabel: 'الزراعة في خطوط مقابل الرمي باليد',
    broadcastYield: 'الرمي العشوائي باليد',
    precisionYield: 'صفوف منتظمة',
    yieldGain: 'زيادة ١٧–١٨٪',
    savingsSummary: 'استهلاك سماد أفضل وانتظام الإنبات',
    detailNote:
      'تفوقت الزراعة في صفوف على الرمي باليد بنسبة ١٧–١٨٪ مع امتصاص أفضل للعناصر والسماد.',
  },
  {
    id: 'canola-ca',
    crop: 'الكانولا',
    country: 'كندا',
    methodLabel: 'الزراعة الدقيقة مقابل النثر الهوائي',
    broadcastYield: 'نثر بـ ١٠٠٪ تقاوي',
    precisionYield: 'دقة بـ ٥٠٪ تقاوي',
    yieldGain: 'زيادة ١٥–٢٠٪',
    savingsSummary: 'تقليل كمية التقاوي للنصف (٥٠٪)',
    detailNote:
      'حتى مع خفض كمية التقاوي إلى النصف، حققت الزراعة الدقيقة إنتاجاً أعلى بنسبة ١٥–٢٠٪ من النثر العادي.',
  },
  {
    id: 'rice-cn',
    crop: 'الأرز',
    country: 'الصين',
    methodLabel: 'الزراعة الدقيقة في صفوف',
    broadcastYield: '٦,٠٤٠ كجم / هكتار',
    precisionYield: '٦,٧٣١ كجم / هكتار',
    yieldGain: 'زيادة ١١٪',
    savingsSummary: 'تقليل التنافس بين النباتات',
    detailNote:
      'رفع انتظام الصفوف الإنتاج بواقع ٦٩١ كجم في الهكتار عبر منح كل نبتة مساحة كافية للضوء والجذور.',
  },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeProductId, setActiveProductId] = useState<ProductId>('seeder');
  const [selectedStudyId, setSelectedStudyId] = useState<string>('onion-bd');
  const [selectedFinishByProduct, setSelectedFinishByProduct] = useState<
    Record<ProductId, VariantFinishId>
  >({
    seeder: 'crimson',
    planter: 'sage',
    seeds: 'sage',
  });
  const [selectedSizeIdxByProduct, setSelectedSizeIdxByProduct] = useState<
    Record<ProductId, number>
  >({
    seeder: 2,
    planter: 1,
    seeds: 1,
  });

  const [activeStage, setActiveStage] = useState<number>(0);
  const [captionBlur, setCaptionBlur] = useState<boolean>(false);
  const [splitPct, setSplitPct] = useState<number>(50);
  const [splitAnimate, setSplitAnimate] = useState<boolean>(false);

  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const tiltWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);
  const compWrapRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stageIdxRef = useRef<number>(0);
  const stageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const cleanupHeroGl = initHeroCanvas(heroCanvasRef.current);
    const cleanupSpecsGl = initSpecsCanvas(specsCanvasRef.current);

    let lenis: InstanceType<typeof Lenis> | null = null;
    let lenisTicker: ((time: number) => void) | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      lenisTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let tiltTicker: (() => void) | null = null;

    const heroStage = heroStageRef.current;
    const onHeroMove = (e: PointerEvent) => {
      if (!heroStage) return;
      const rect = heroStage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 12;
      targetRotX = -ny * 9;
    };
    const onHeroLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    if (heroStage && tiltWrapRef.current && !prefersReduced) {
      heroStage.addEventListener('pointermove', onHeroMove);
      heroStage.addEventListener('pointerleave', onHeroLeave);
      tiltTicker = () => {
        const ax = (targetRotX - curRotX) * 0.08;
        const ay = (targetRotY - curRotY) * 0.08;
        velX = (velX + ax) * 0.82;
        velY = (velY + ay) * 0.82;
        curRotX += velX;
        curRotY += velY;
        if (tiltWrapRef.current) {
          tiltWrapRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px) scale(${1 - Math.abs(curRotX) * 0.01})`;
        }
      };
      gsap.ticker.add(tiltTicker);
    }

    const gsapCtx = gsap.context(() => {
      if (prefersReduced) return;

      const frames = frameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (showcaseRef.current && frames.length === 4) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== stageIdxRef.current) {
                stageIdxRef.current = nextIdx;
                setCaptionBlur(true);
                if (stageTimerRef.current !== null) {
                  window.clearTimeout(stageTimerRef.current);
                }
                stageTimerRef.current = window.setTimeout(() => {
                  stageTimerRef.current = null;
                  setActiveStage(nextIdx);
                  setCaptionBlur(false);
                }, 100);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        frames.forEach((frame, i) => {
          if (i === 0) return;
          tl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        tl.set({}, {}, 3.5);
      }

      if (bentoGridRef.current) {
        gsap.from('.reveal-tile', {
          y: 28,
          scale: 0.96,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    });

    return () => {
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      cleanupHeroGl();
      cleanupSpecsGl();
      gsapCtx.revert();
      if (tiltTicker) gsap.ticker.remove(tiltTicker);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      heroStage?.removeEventListener('pointermove', onHeroMove);
      heroStage?.removeEventListener('pointerleave', onHeroLeave);
    };
  }, []);

  const selectStage = (idx: number) => {
    stageIdxRef.current = idx;
    setCaptionBlur(true);
    if (stageTimerRef.current !== null) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      stageTimerRef.current = null;
      setActiveStage(idx);
      setCaptionBlur(false);
    }, 110);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  const updateSplit = (pct: number, animate: boolean) => {
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitAnimate(animate);
    setSplitPct(clamped);
  };

  const handleCompPointerDown = (e: {
    currentTarget: HTMLDivElement;
    pointerId: number;
    clientX: number;
  }) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerMove = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
  }) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerUp = () => {
    isDraggingRef.current = false;
  };

  const activeProduct = PRODUCTS[activeProductId];
  const activeFinishId = selectedFinishByProduct[activeProductId];
  const activeFinish =
    activeProduct.finishes.find((f) => f.id === activeFinishId) ??
    activeProduct.finishes[0];
  const activeSizeIdx = selectedSizeIdxByProduct[activeProductId];
  const activeSize =
    activeProduct.sizes[activeSizeIdx] ?? activeProduct.sizes[0];

  const selectFinish = (finishId: VariantFinishId) => {
    setSelectedFinishByProduct((prev) => ({
      ...prev,
      [activeProductId]: finishId,
    }));
  };

  const selectSizeIdx = (idx: number) => {
    setSelectedSizeIdxByProduct((prev) => ({
      ...prev,
      [activeProductId]: idx,
    }));
  };

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <header className="site-header" id="site-header">
        <div className="container header-inner">
          <a href="#hero" className="brand-lockup" aria-label="الرئيسية - غرس">
            <svg
              className="brand-mark"
              width="22"
              height="18"
              viewBox="0 0 24 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 18V8M12 8C12 4.5 15.5 2 20 2C20 6.5 16.5 9.5 12 8ZM12 11C12 7.5 8.5 5 4 5C4 9.5 7.5 12.5 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="brand-wordmark">غَرس</span>
          </a>

          <nav className="header-nav" aria-label="التنقل الرئيسي">
            <a href="#showcase" className="nav-link">
              المعرض
            </a>
            <a href="#growth" className="nav-link">
              الدراسات
            </a>
            <a href="#craft" className="nav-link">
              الهندسة
            </a>
            <a href="#tools" className="nav-link">
              الأدوات
            </a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn theme-toggle"
              id="theme-toggle"
              aria-label="تبديل المظهر الفاتح والداكن"
              title="تبديل المظهر"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <svg
                id="theme-icon-sun"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="128" cy="128" r="56" stroke="currentColor" strokeWidth="18" />
                <line x1="128" y1="24" x2="128" y2="44" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="212" x2="128" y2="232" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="24" y1="128" x2="44" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="212" y1="128" x2="232" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="54" x2="68" y2="68" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="188" x2="202" y2="202" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="202" x2="68" y2="188" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="68" x2="202" y2="54" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
              </svg>
              <svg
                id="theme-icon-moon"
                width="19"
                height="19"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M210.69 158.18A96.78 96.78 0 0 1 192 160 96.11 96.11 0 0 1 96 64a96.78 96.78 0 0 1 1.82-18.69A96.04 96.04 0 1 0 210.69 158.18Z"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <a href="#contact" className="btn btn-primary btn-sm">
              تواصل معنا
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 1: Asymmetric Split Hero */}
        <section id="hero" className="hero">
          <canvas
            ref={heroCanvasRef}
            id="hero-gl-canvas"
            className="hero-canvas"
            aria-hidden="true"
          />

          <div className="container hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title">ودّع فاقد الرمي باليد.</h1>
              <p className="hero-sub">
                في السودان ما زال كثيرون ينثرون البذور باليد فتضيع للطيور والسيول
                وتتفاوت المسافات. تعرّف على البذّارات اليدوية الدقيقة التي تغرس
                حبة بحبة في صفوف منتظمة، فتحوّل هدر التقاوي والجهد إلى محصول
                وأرباح مضاعفة.
              </p>

              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary magnetic-btn">
                  تواصل معنا للاستفسار
                </a>
                <a href="#growth" className="btn btn-ghost">
                  شاهد الأرقام الموثّقة
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="192"
                      y1="64"
                      x2="64"
                      y2="192"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="168 192 64 192 64 88"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hero-stage" ref={heroStageRef} id="hero-stage">
              <div
                className="flask-tilt-wrap"
                ref={tiltWrapRef}
                id="flask-tilt-wrap"
              >
                <div className="product-hero-frame">
                  <img
                    src={activeProduct.heroImage}
                    alt={activeProduct.imageAlt}
                    className="product-hero-img"
                    id="hero-product-img"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="flask-shadow" ref={shadowRef} aria-hidden="true" />

              <div
                className="hero-swatches"
                role="radiogroup"
                aria-label="استعراض المنتجات"
              >
                {HERO_SPOTLIGHTS.map((item) => {
                  const isActive = activeProductId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      className={`swatch-btn${isActive ? ' is-active' : ''}`}
                      aria-checked={isActive}
                      onClick={() => setActiveProductId(item.id)}
                    >
                      <span
                        className="swatch-dot"
                        style={{ background: item.dot }}
                      />
                      <span className="swatch-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Pinned 4-Stage Environmental Showcase */}
        <section id="showcase" ref={showcaseRef} className="showcase-pin">
          <div className="showcase-viewport" id="showcase-viewport">
            <div className="showcase-frames" id="showcase-frames">
              {SHOWCASE_STAGES.map((stage, i) => (
                <figure
                  key={stage.title}
                  ref={(el: HTMLElement | null) => {
                    frameRefs.current[i] = el;
                  }}
                  className={`showcase-frame${i === 0 ? ' is-active' : ''}`}
                  data-index={i}
                >
                  <img
                    src={stage.src}
                    alt={stage.alt}
                    className="showcase-img"
                    referrerPolicy="no-referrer"
                  />
                </figure>
              ))}
            </div>

            <div className="showcase-hud">
              <div
                className={`showcase-caption${captionBlur ? ' is-blurring' : ''}`}
                id="showcase-caption"
              >
                <h2 className="caption-title" id="caption-title">
                  {SHOWCASE_STAGES[activeStage].title}
                </h2>
                <p className="caption-sub" id="caption-sub">
                  {SHOWCASE_STAGES[activeStage].sub}
                </p>
              </div>

              <div
                className="showcase-dots"
                role="tablist"
                aria-label="مشاهد المعرض"
              >
                {SHOWCASE_STAGES.map((stage, i) => (
                  <button
                    key={stage.title}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === i}
                    className={`stage-dot${activeStage === i ? ' is-active' : ''}`}
                    aria-label={`المشهد ${i + 1}`}
                    onClick={() => selectStage(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive Seed-to-Harvest Comparison Slider */}
        <section id="growth" className="thermal-section">
          <div className="container thermal-grid">
            <div
              className="comparison-wrap"
              ref={compWrapRef}
              id="comparison-wrap"
              onPointerDown={handleCompPointerDown}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onPointerCancel={handleCompPointerUp}
            >
              <div className="comparison-layer comparison-hot">
                <img
                  src={comparisonPrecisionImg}
                  alt="صفوف زراعية منتظمة على مسافة ١٦ سم تنبت فيها البادرات بتساوٍ على ضفاف النيل"
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                className="comparison-layer comparison-cold"
                id="comparison-cold"
                style={{
                  clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                  transition: splitAnimate
                    ? 'clip-path 380ms var(--ease-out)'
                    : 'none',
                }}
              >
                <img
                  src={comparisonBroadcastImg}
                  alt="مزارع سوداني بالجلابية والعمّة البيضاء ينثر البذور باليد فوق التربة مع تجمّع الطيور خلفه"
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                className={`comparison-handle${
                  splitPct <= 2 || splitPct >= 98 ? ' is-edge' : ''
                }`}
                id="comparison-handle"
                role="slider"
                tabIndex={0}
                aria-label="مقارنة مرحلة البذر باليوم الأول مع حصاد اليوم الثامن والعشرين"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(splitPct)}
                style={{
                  left: `clamp(22px, ${splitPct}%, calc(100% - 22px))`,
                  transition: splitAnimate
                    ? 'left 380ms var(--ease-out)'
                    : 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') updateSplit(splitPct - 8, true);
                  if (e.key === 'ArrowRight') updateSplit(splitPct + 8, true);
                }}
              >
                <div className="handle-line" />
                <div className="handle-knob">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <polyline
                      points="176 144 208 176 176 208"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="48"
                      y1="176"
                      x2="208"
                      y2="176"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="80 112 48 80 80 48"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="208"
                      y1="80"
                      x2="48"
                      y2="80"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="thermal-copy">
              <h2 className="section-title">الرمي باليد مقابل الغرس الدقيق.</h2>
              <p className="section-sub">
                الرمي العشوائي يفرض كثافة تقاوي عالية لتعويض ما تأكله الطيور أو
                يجرفه الماء. أما الغرس المعايَر بالبذّارة فيضع ١–٢ بذرة في الجورة
                الواحدة بدقة تصل إلى ٩٣–٩٧٪ لتخرج النباتات متزنة وبلا تنافس.
              </p>

              <div
                className="segmented-control"
                role="tablist"
                aria-label="مقارنة طرق البذر"
              >
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct >= 98 ? ' is-active' : ''}`}
                  aria-selected={splitPct >= 98}
                  onClick={() => updateSplit(100, true)}
                >
                  ١ · الرمي باليد
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct <= 2 ? ' is-active' : ''}`}
                  aria-selected={splitPct <= 2}
                  onClick={() => updateSplit(0, true)}
                >
                  ٢ · صفوف الغرس الدقيق
                </button>
              </div>

              <div className="thermal-metrics">
                <div className="metric-item">
                  <span className="metric-value">+٢٩٪</span>
                  <span className="metric-label">زيادة إنتاج البصل بالزراعة اليدوية</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">٤× أسرع</span>
                  <span className="metric-label">عمل وقوفاً دون انحناء (الفاو FAO)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            {(() => {
              const activeStudy =
                FIELD_STUDIES.find((s) => s.id === selectedStudyId) ??
                FIELD_STUDIES[0];
              return (
                <div className="research-panel" id="research">
                  <div className="research-header">
                    <div>
                      <h3 className="research-title">
                        كيف تتحوّل الخسائر إلى أرباح بالأرقام؟
                      </h3>
                      <p className="research-lead">
                        بيانات مستخلصة من أبحاث وتجارب حقلية منشورة تقارن مبدأ
                        الغرس الدقيق (حبة بحبة في صف) بالرمي اليدوي العشوائي.
                        اضغط على أي محصول لمقارنة الهكتار الواحد.
                      </p>
                    </div>

                    <div className="evidence-pair">
                      <div className="evidence-card">
                        <span className="evidence-stat">٤× أسرع</span>
                        <span className="evidence-source">
                          منظمة الأغذية والزراعة (FAO)
                        </span>
                        <span className="evidence-desc">
                          العامل يعمل واقفاً ومرتاحاً دون انحناء بالطورية، مع تقليل
                          فاقد الطيور والجريان.
                        </span>
                      </div>
                      <div className="evidence-card">
                        <span className="evidence-stat">٩٣٪ – ٩٧٪</span>
                        <span className="evidence-source">
                          دقة البذر الآلي المفرد
                        </span>
                        <span className="evidence-desc">
                          توفير ٥–١٠٪ تقاوي عالمياً، وأكبر بكثير مقارنة بالرمي
                          اليدوي العشوائي في السودان.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="transparency-note">
                    <strong>تنبيه مهم للشفافية:</strong> الأرقام التالية مأخوذة
                    من دراسات منشورة في الهند ومصر وبنغلاديش وكندا والصين، وليست
                    من تجربة سودانية مباشرة على البذّارة اليدوية؛ لأن هذا النوع من
                    الأدوات لم تُنشر عنه دراسة سودانية بعد. لكن المبدأ العلمي
                    واحد، والفرق في السودان قد يكون أكبر لأن الرمي اليدوي يهدر
                    قدراً أعلى من التقاوي.
                  </div>

                  <div className="study-spotlight" aria-live="polite">
                    <div className="spotlight-cell">
                      <span className="spotlight-kicker">
                        الدراسة المختارة · {activeStudy.crop} ({activeStudy.country})
                      </span>
                      <span className="spotlight-val">
                        الرمي التقليدي: {activeStudy.broadcastYield}
                      </span>
                    </div>
                    <div className="spotlight-cell">
                      <span className="spotlight-kicker">
                        الغرس الدقيق ({activeStudy.methodLabel})
                      </span>
                      <span className="spotlight-val is-accent">
                        {activeStudy.precisionYield} ({activeStudy.yieldGain})
                      </span>
                    </div>
                    <div className="spotlight-cell">
                      <span className="spotlight-kicker">الوفر والتكلفة / الزمن</span>
                      <span className="spotlight-val">
                        {activeStudy.savingsSummary}
                      </span>
                    </div>
                  </div>

                  <div className="research-table-wrap">
                    <table className="research-table">
                      <thead>
                        <tr>
                          <th>المحصول والدولة</th>
                          <th>الفرق في الإنتاج</th>
                          <th>الفرق في التقاوي / التكلفة / الزمن</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FIELD_STUDIES.map((study) => {
                          const isSelected = study.id === activeStudy.id;
                          return (
                            <tr
                              key={study.id}
                              className={`research-row${isSelected ? ' is-selected' : ''}`}
                              onClick={() => setSelectedStudyId(study.id)}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedStudyId(study.id);
                                }
                              }}
                            >
                              <td className="research-crop">
                                {study.crop} — {study.country}
                              </td>
                              <td className="research-gain">{study.yieldGain}</td>
                              <td className="research-note-cell">
                                {study.savingsSummary}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* SECTION 4: Asymmetric 3-Tile Editorial Bento (Manual Seeder Photos + 3D Wireframe Model) */}
        <section id="craft" className="bento-section">
          <div className="container">
            <div className="section-header-stack">
              <h2 className="section-title">هندسة زراعية لخطوط متقنة.</h2>
            </div>

            <div className="bento-grid" ref={bentoGridRef}>
              <article className="bento-tile bento-tall reveal-tile">
                <img
                  src={seederNozzleImg}
                  alt="صورة مقربة لمناقير الغرس الفولاذية على أسطوانة البذّارة اليدوية فوق التربة"
                  className="bento-img"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">مناقير غرس فولاذية</h3>
                  <p className="bento-sub">
                    بمسافات ١٦ سم ثابتة تخترق التربة وتُسقط ١–٢ بذرة (٣–١٥ ملم) دون إتلاف القشرة
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-top reveal-tile">
                <img
                  src={seederHopperImg}
                  alt="خزان البذور الشفاف بسعة ٣.٧٥ كجم وعجلة الرص الخلفية"
                  className="bento-img"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">خزان ٣.٧٥ كجم وفتحة تفريغ</h3>
                  <p className="bento-sub">
                    هيكل شفاف لمراقبة البذور، منفذ إمالة للتفريغ، وعجلة رصّ لتغطية الجور
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-bottom reveal-tile">
                <canvas
                  ref={specsCanvasRef}
                  id="specs-gl-canvas"
                  className="specs-canvas"
                  aria-hidden="true"
                />
                <div className="bento-footer bento-footer-specs">
                  <div>
                    <h3 className="bento-title">أسطوانة ١٠ مناقير</h3>
                    <p className="bento-sub">
                      عمق ٣.٥–٧.٨ سم · ٣ عجلات اتزان
                    </p>
                  </div>
                  <span className="spec-meta">مجسم ثلاثي الأبعاد · اسحب للتدوير</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5: Interactive Tool Guide & Technical Specifications */}
        <section id="tools" className="order-section">
          <div className="container order-grid">
            <div className="order-preview" id="order-preview">
              <img
                src={activeProduct.image}
                alt={activeProduct.imageAlt}
                className="order-product-img"
                id="order-product-img"
                data-finish={activeProductId === 'seeds' ? 'natural' : activeFinish.id}
                style={{ transform: `scale(${activeSize.scale})` }}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="order-panel">
              <div
                className="product-tabs"
                role="tablist"
                aria-label="استعراض الأداة"
              >
                {(Object.keys(PRODUCTS) as ProductId[]).map((pid) => {
                  const prod = PRODUCTS[pid];
                  const isActive = activeProductId === pid;
                  return (
                    <button
                      key={pid}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`product-tab${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveProductId(pid)}
                    >
                      {prod.tabLabel}
                    </button>
                  );
                })}
              </div>

              <h2 className="section-title">{activeProduct.name}</h2>
              <p className="order-desc">{activeProduct.description}</p>

              <div className="config-group">
                <span className="config-label">
                  {activeProduct.finishGroupLabel}
                </span>
                <div className="option-row" id="order-finish-row">
                  {activeProduct.finishes.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`pill-option${
                        activeFinish.id === opt.id ? ' is-active' : ''
                      }`}
                      onClick={() => selectFinish(opt.id)}
                    >
                      <span
                        className="dot"
                        style={{ background: opt.dot }}
                      />
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">
                  {activeProduct.sizeGroupLabel}
                </span>
                <div className="option-row" id="order-size-row">
                  {activeProduct.sizes.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      className={`pill-option${
                        activeSizeIdx === idx ? ' is-active' : ''
                      }`}
                      onClick={() => selectSizeIdx(idx)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="spec-list">
                {activeProduct.specs.map((spec) => (
                  <div key={spec.key} className="spec-row">
                    <span className="spec-key">{spec.key}</span>
                    <span className="spec-val">{spec.val}</span>
                  </div>
                ))}
              </div>

              {activeProduct.note && (
                <p className="tds-notes">{activeProduct.note}</p>
              )}

              <a
                href="#contact"
                className="btn btn-primary btn-full magnetic-btn"
              >
                تواصل معنا للاستفسار والمعاينة
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 6: Direct Contact & WhatsApp QR */}
        <section id="contact" className="contact-section">
          <div className="container contact-grid">
            <div className="contact-copy">
              <span className="contact-kicker">التواصل المباشر والإرشاد الميداني</span>
              <h2 className="section-title">هل ترغب في تجربة الزراعة الدقيقة في حقلك؟</h2>
              <p className="section-sub">
                هذه الصفحة مبادرة توعوية لتعريف المزارعين في السودان بأدوات
                الغرس اليدوي الحديثة وكيف توفّر التقاوي وتضاعف الإنتاج. يسعدنا
                التواصل معك مباشرة للإجابة عن استفساراتك.
              </p>

              <ul className="contact-points">
                <li className="contact-point">
                  <span className="contact-point-num">٠١</span>
                  <span>
                    استشارة مجانية لاختيار عدد المناقير الأنسب لمحصولك (الذرة،
                    الفول السوداني، السمسم، القطن، أو الخضروات).
                  </span>
                </li>
                <li className="contact-point">
                  <span className="contact-point-num">٠٢</span>
                  <span>
                    شرح عملي لكيفية ضبط العمق والمسافة وتشغيل البذّارة في تربة
                    الجزيرة ونهر النيل والمشاريع المطرية.
                  </span>
                </li>
                <li className="contact-point">
                  <span className="contact-point-num">٠٣</span>
                  <span>
                    تنسيق مباشر للراغبين في المعاينة الميدانية أو اقتناء الأدوات
                    للموسم الزراعي القادم.
                  </span>
                </li>
              </ul>
            </div>

            <div className="qr-panel">
              <div className="qr-frame">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-11-27_at_10.22.08_737aa85f.jpeg"
                  alt="رمز الاستجابة السريعة (QR) للتواصل المباشر عبر واتساب"
                  className="qr-img"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="qr-title">امسح الرمز للتواصل المباشر</h3>
              <p className="qr-caption">
                وجّه كاميرا الهاتف أو ماسح واتساب نحو الرمز للوصول المباشر
                لمعلومات التواصل والاستفسار عن البذّارة والأدوات.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">غَرس</span>
          <span className="footer-tag">مبادرة توعوية للزراعة الدقيقة في السودان.</span>
          <span className="footer-copy">© ٢٠٢٦ غَرس</span>
        </div>
      </footer>
    </>
  );
}
