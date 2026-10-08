/* Logo Studio — Stage 21: Dari/Persian interface layer (RTL). Offline, no dependencies.
   Translates visible UI text only. Generated prompts, library prompts, brand names and data values stay untouched. */
(function () {
  'use strict';
  var KEY = 'ls:lang';
  var FA = {
    /* navigation & shell */
    'Home':'خانه','Studio':'استودیو','Projects':'پروژه‌ها','My Prompts':'پرامپت‌های من','Examples':'نمونه‌ها','Popular':'محبوب','Search':'جستجو','Categories':'دسته‌ها','Favorites':'علاقه‌مندی‌ها','Library':'کتابخانه','Community':'جامعه',
    'Logo Studio':'لوگو استودیو','Logo Concept & Prompt Studio':'استودیوی مفهوم و پرامپت لوگو','Open Studio':'باز کردن استودیو','Go home':'رفتن به خانه','← Back':'بازگشت →','Back':'بازگشت','Next':'بعدی','Previous':'قبلی',
    '© 2026 Logo Studio · Built by Yasir':'© ۲۰۲۶ لوگو استودیو · ساخته یاسر',
    /* home / generic */
    'What is Logo Studio?':'لوگو استودیو چیست؟','What you can do with it':'با آن چه می‌توانید بکنید','Generate a prompt':'ساخت پرامپت','Create a direction':'ساخت یک جهت‌گیری','Professional logo directions':'جهت‌گیری‌های حرفه‌ای لوگو',
    'Logo styles you can explore':'سبک‌های لوگو برای کاوش','Pick a logo style to browse its prompts or generate a new one.':'یک سبک لوگو انتخاب کنید تا پرامپت‌هایش را ببینید یا یکی جدید بسازید.',
    'Generate a prompt from a brand name and a logo style.':'از نام برند و سبک لوگو یک پرامپت بسازید.',
    'Customize prompts with your brand name':'پرامپت‌ها را با نام برند خود شخصی‌سازی کنید','Preview with your brand name':'پیش‌نمایش با نام برند شما','Your brand name':'نام برند شما','Enter your brand name…':'نام برند را بنویسید…',
    'Customize any prompt with your own brand name before copying it.':'پیش از کپی، هر پرامپت را با نام برند خودتان شخصی‌سازی کنید.',
    'Generate Prompt':'ساخت پرامپت','Generate':'ساخت','Generate again':'ساخت دوباره','Your prompt appears here':'پرامپت شما اینجا نمایش داده می‌شود','Brand preview':'پیش‌نمایش برند',
    'Add a brand name, choose a category, and select Generate prompt.':'نام برند را بنویسید، یک دسته انتخاب کنید و «ساخت پرامپت» را بزنید.',
    /* search / categories / favorites */
    'Search prompts':'جستجوی پرامپت','Search the prompt library':'جستجو در کتابخانه پرامپت','Search prompts, categories or Prompt ID…':'جستجوی پرامپت، دسته یا شناسه پرامپت…','Search the library by keyword, category or Prompt ID.':'کتابخانه را با کلمه کلیدی، دسته یا شناسه پرامپت جستجو کنید.',
    'Type a keyword or a Prompt ID, or choose a category to begin.':'یک کلمه کلیدی یا شناسه پرامپت بنویسید، یا برای شروع یک دسته انتخاب کنید.',
    'All':'همه','All categories':'همه دسته‌ها','All styles':'همه سبک‌ها','Category':'دسته','Load more':'بارگذاری بیشتر','Prompt ID':'شناسه پرامپت',
    'No favorites yet':'هنوز علاقه‌مندی‌ای ندارید','Select Favorite on any prompt to save it here. Favorites stay on this device.':'روی هر پرامپت «علاقه‌مندی» را بزنید تا اینجا ذخیره شود. علاقه‌مندی‌ها روی همین دستگاه می‌مانند.',
    'Save favorites on your device and share a link to a prompt.':'علاقه‌مندی‌ها را روی دستگاه ذخیره کنید و پیوند پرامپت را به اشتراک بگذارید.',
    'No categories yet':'هنوز دسته‌ای نیست','Categories will appear here once the library is connected.':'پس از اتصال کتابخانه، دسته‌ها اینجا نمایش داده می‌شوند.','Categories couldn’t be loaded':'دسته‌ها بارگذاری نشدند',
    'Nothing matched this category yet. Try another category or choose All styles.':'هنوز چیزی با این دسته مطابقت نداشت. دسته دیگری را امتحان کنید یا «همه سبک‌ها» را انتخاب کنید.',
    'No prompt found':'پرامپتی پیدا نشد','Prompt not found':'پرامپت پیدا نشد','Invalid link':'پیوند نامعتبر','Page not found':'صفحه پیدا نشد','This page doesn’t exist.':'این صفحه وجود ندارد.','This prompt link isn’t valid. Check the address and try again.':'این پیوند پرامپت معتبر نیست. نشانی را بررسی کنید و دوباره امتحان کنید.',
    'Prompt library unavailable':'کتابخانه پرامپت در دسترس نیست','The prompt library didn’t load. Reload the page, and if this keeps happening, update your browser.':'کتابخانه پرامپت بارگذاری نشد. صفحه را دوباره باز کنید؛ اگر ادامه یافت، مرورگر خود را به‌روز کنید.',
    'Reload page':'بارگذاری دوباره صفحه','Try again':'دوباره امتحان کنید','Reload the page and try again. If this keeps happening, update your browser.':'صفحه را دوباره بارگذاری کنید. اگر ادامه یافت، مرورگر خود را به‌روز کنید.',
    /* actions */
    'Copy':'کپی','Share':'اشتراک‌گذاری','Favorite':'علاقه‌مندی','Save':'ذخیره','Save Project':'ذخیره پروژه','Open':'باز کردن','View':'دیدن','View Prompt':'دیدن پرامپت','Use':'استفاده','Use Prompt':'استفاده از پرامپت','Details':'جزئیات','Delete':'حذف','Rename':'تغییر نام','Duplicate':'کپی پروژه','Export':'خروجی','Import':'ورودی','Add':'افزودن','Remove':'برداشتن','Attach':'پیوست','Refresh':'تازه‌سازی','Project':'پروژه','Favorite project':'پروژه مورد علاقه',
    'Prompt details':'جزئیات پرامپت','Prompt used':'پرامپت استفاده شد',
    /* studio */
    'Build a logo direction, not just a prompt.':'فقط پرامپت نسازید؛ جهت‌گیری لوگو بسازید.',
    'A local, rule-based workspace from brand strategy to concept, Logo DNA, originality, applications and prompt variations.':'یک فضای کاری محلی و قاعده‌محور؛ از استراتژی برند تا مفهوم، دی‌ان‌ای لوگو، اصالت، کاربردها و نسخه‌های پرامپت.',
    'Saved Projects':'پروژه‌های ذخیره‌شده','Studio pipeline':'مراحل استودیو',
    '01 Brief':'۰۱ خلاصه','02 Concepts':'۰۲ مفهوم‌ها','03 DNA':'۰۳ دی‌ان‌ای','04 Prompt':'۰۴ پرامپت','05 Variations':'۰۵ نسخه‌ها','06 Save':'۰۶ ذخیره',
    'Brand name':'نام برند','What should the logo show?':'لوگو چه چیزی را نشان بدهد؟','(optional — the more specific, the better)':'(اختیاری — هرچه مشخص‌تر بهتر)','e.g. a coffee bean shaped like a mountain peak':'مثلاً دانهٔ قهوه به شکل قلهٔ کوه','Who is the brand and what should the identity communicate?':'برند چیست و هویت باید چه چیزی را برساند؟','Industry':'صنعت','Choose an industry…':'یک صنعت انتخاب کنید…','Target audience':'مخاطب هدف','Personality':'شخصیت','Desired feeling':'احساس مطلوب','Keywords':'کلمات کلیدی','Preferred colors':'رنگ‌های دلخواه','Logo type':'نوع لوگو','Style':'سبک','Applications':'کاربردها','Complexity':'پیچیدگی','Smart default':'پیش‌فرض هوشمند','Brand description':'توضیح برند','(optional)':'(اختیاری)','Add your own…':'مورد خودتان را بیفزایید…','e.g. NEXA':'مثلاً NEXA','What should the identity communicate?':'هویت باید چه چیزی را منتقل کند؟',
    'up to 2':'تا ۲','up to 3':'تا ۳','up to 4':'تا ۴','up to 5':'تا ۵','optional — leave empty for smart default':'اختیاری — برای پیش‌فرض هوشمند خالی بگذارید',
    'Generate Studio Direction':'ساخت جهت‌گیری استودیو','Studio direction generated':'جهت‌گیری استودیو ساخته شد','Concept selected':'مفهوم انتخاب شد','Brand name and industry are required.':'نام برند و صنعت الزامی است.',
    'Concept selection':'انتخاب مفهوم','Choose a direction — DNA, prompt and variations update automatically.':'یک جهت انتخاب کنید — دی‌ان‌ای، پرامپت و نسخه‌ها خودکار به‌روز می‌شوند.','Logo DNA':'دی‌ان‌ای لوگو','Primary prompt':'پرامپت اصلی','Prompt Variations':'نسخه‌های پرامپت','Same identity, different presentation modes':'همان هویت، حالت‌های نمایش متفاوت',
    'Short Prompt':'پرامپت کوتاه','Professional Prompt':'پرامپت حرفه‌ای','Premium Prompt':'پرامپت ممتاز','Minimal Prompt':'پرامپت مینیمال','3D Prompt':'پرامپت سه‌بعدی','8K Prompt':'پرامپت ۸K','Experimental Prompt':'پرامپت تجربی',
    'Generate a Studio direction and your prompt plus its variations will appear here.':'یک جهت‌گیری استودیو بسازید تا پرامپت و نسخه‌هایش اینجا نمایش داده شوند.',
    'Keep this direction on this device. You can reopen, export or import it from Saved Projects.':'این جهت‌گیری را روی همین دستگاه نگه دارید. از «پروژه‌های ذخیره‌شده» می‌توانید دوباره باز کنید، خروجی بگیرید یا وارد کنید.',
    'Library Inspiration':'الهام از کتابخانه','Related prompts from the existing library':'پرامپت‌های مرتبط از کتابخانه موجود','Recommendations from the built-in library and your own Studio prompts. The 100K+ collection stays read-only.':'پیشنهادها از کتابخانه داخلی و پرامپت‌های خود شما. مجموعه ۱۰۰ هزار+ فقط‌خواندنی می‌ماند.',
    'Generating related library prompts…':'در حال ساخت پرامپت‌های مرتبط…','Suggested for this Concept':'پیشنهاد برای این مفهوم','Attached to this Project':'پیوست‌شده به این پروژه','Attach useful references here to keep inspiration with the project.':'مرجع‌های مفید را اینجا پیوست کنید تا الهام کنار پروژه بماند.',
    /* projects */
    'Workspace':'فضای کاری','Projects stay on this device. Your existing 100K prompt library remains separate and untouched.':'پروژه‌ها روی همین دستگاه می‌مانند. کتابخانه ۱۰۰ هزار پرامپت جدا و دست‌نخورده می‌ماند.',
    'New Project':'پروژه جدید','Search projects':'جستجوی پروژه‌ها','Search projects by name, industry or style':'جستجوی پروژه با نام، صنعت یا سبک','No saved projects':'پروژه ذخیره‌شده‌ای نیست','Create a Studio direction and save it locally.':'یک جهت‌گیری استودیو بسازید و محلی ذخیره کنید.','No matching projects':'پروژه‌ای مطابقت ندارد','Try a different name, industry or style.':'نام، صنعت یا سبک دیگری را امتحان کنید.',
    'Project saved locally':'پروژه محلی ذخیره شد','Project deleted':'پروژه حذف شد','Project renamed':'نام پروژه تغییر کرد','Project duplicated':'پروژه کپی شد','Projects exported':'پروژه‌ها صادر شدند','Projects imported':'پروژه‌ها وارد شدند','Project not found':'پروژه پیدا نشد','Enter a project name':'نام پروژه را بنویسید','Could not duplicate project':'کپی پروژه ممکن نشد','Added to favorites':'به علاقه‌مندی‌ها افزوده شد','Removed from favorites':'از علاقه‌مندی‌ها برداشته شد','Saved to favorites':'در علاقه‌مندی‌ها ذخیره شد',
    'Open a saved Studio project first':'نخست یک پروژه ذخیره‌شده استودیو را باز کنید','Save the Studio project before attaching prompts':'پیش از پیوست پرامپت، پروژه استودیو را ذخیره کنید','Prompt added to project':'پرامپت به پروژه افزوده شد','Prompt attached to project':'پرامپت به پروژه پیوست شد','Prompt removed':'پرامپت برداشته شد','Personal prompt removed':'پرامپت شخصی حذف شد',
    'Your prompt memory':'حافظه پرامپت شما','Every prompt generated by Studio is kept locally and can become inspiration for future concepts.':'هر پرامپتی که استودیو می‌سازد محلی نگهداری می‌شود و می‌تواند الهام مفهوم‌های آینده شود.','No personal prompts yet':'هنوز پرامپت شخصی ندارید',
    'Copied to clipboard':'در کلیپ‌بورد کپی شد','Copied':'کپی شد','Copy failed':'کپی ناموفق بود','Copy failed. Select the text and copy manually.':'کپی ناموفق بود. متن را انتخاب کنید و دستی کپی کنید.','Copied. Replace [ENTER BRAND NAME HERE] with your brand name.':'کپی شد. [ENTER BRAND NAME HERE] را با نام برند خود جایگزین کنید.','Link copied':'پیوند کپی شد','Share links work once the site is uploaded to a host.':'پیوند اشتراک‌گذاری پس از بارگذاری سایت روی میزبان کار می‌کند.',
    /* examples / community */
    'Sample work':'نمونه کار','Explore Logo Examples':'کاوش نمونه‌های لوگو','See how Logo Studio prompts can translate into different visual directions.':'ببینید پرامپت‌های لوگو استودیو چگونه به جهت‌گیری‌های بصری گوناگون تبدیل می‌شوند.','View all examples':'دیدن همه نمونه‌ها','Loading examples…':'در حال بارگذاری نمونه‌ها…','Examples are coming soon.':'نمونه‌ها به‌زودی می‌آیند.','Studio Generated':'ساخته‌شده توسط استودیو',
    'Real examples connected to Logo Studio prompts, including Studio-generated showcase directions.':'نمونه‌های واقعی مرتبط با پرامپت‌های لوگو استودیو، از جمله جهت‌گیری‌های ساخته‌شده توسط استودیو.',
    'Most loved prompts':'محبوب‌ترین پرامپت‌ها','Prompts ranked by real community ratings and usage. No fake counters are shown.':'پرامپت‌ها بر پایه امتیاز و استفاده واقعی جامعه رتبه‌بندی می‌شوند. هیچ شمارنده ساختگی نمایش داده نمی‌شود.','No community rankings yet':'هنوز رتبه‌بندی جامعه‌ای نیست','Community rankings are not connected yet':'رتبه‌بندی جامعه هنوز وصل نشده','Once the community metrics endpoint is active, highly rated prompts will appear here.':'پس از فعال شدن سرویس آمار جامعه، پرامپت‌های پرامتیاز اینجا نمایش داده می‌شوند.',
    'Global when community metrics are connected':'جهانی، پس از اتصال آمار جامعه','Loading rating…':'در حال بارگذاری امتیاز…',
    'The site is currently offline/local-only, so global ratings and usage cannot be shared between different visitors. Local ratings still work on this device.':'سایت اکنون آفلاین/محلی است؛ بنابراین امتیاز و استفاده جهانی بین بازدیدکنندگان به اشتراک گذاشته نمی‌شود. امتیازهای محلی روی همین دستگاه کار می‌کنند.',
    /* theme/lang */
    'Toggle light and dark mode':'تغییر حالت روشن و تاریک','Logo Studio home':'خانه لوگو استودیو','Main':'اصلی','Footer':'پایین صفحه','Mobile':'موبایل',
    /* options: audience */
    'Founders & startups':'بنیان‌گذاران و استارتاپ‌ها','Developers & technical teams':'توسعه‌دهندگان و تیم‌های فنی','Young adults':'جوانان','Families':'خانواده‌ها','Professionals & B2B':'حرفه‌ای‌ها و B2B','Luxury customers':'مشتریان لوکس','Students':'دانشجویان','Gamers':'گیمرها','Everyone':'همه',
    /* feelings / keywords / colors */
    'Trust':'اعتماد','Innovation':'نوآوری','Warmth':'گرمی','Luxury':'لوکس','Energy':'انرژی','Calm':'آرامش','Playfulness':'شادابی','Confidence':'اطمینان','Reliability':'قابل‌اعتمادی','Creativity':'خلاقیت',
    'Signal':'سیگنال','Structure':'ساختار','Growth':'رشد','Connection':'ارتباط','Speed':'سرعت','Craft':'هنرِ دست','Nature':'طبیعت','Community ':'جامعه','Precision':'دقت','Future':'آینده','Heritage':'میراث','Light':'نور',
    'Black':'سیاه','White':'سفید','Silver':'نقره‌ای','Gold':'طلایی','Navy':'سرمه‌ای','Electric blue':'آبی الکتریکی','Red':'قرمز','Green':'سبز','Orange':'نارنجی','Purple':'بنفش','Brown':'قهوه‌ای','Cream':'کرم',
    'Simple':'ساده','Controlled':'کنترل‌شده','Expressive':'پرتعبیر','Intricate':'پیچیده',
    'Trustworthy':'قابل‌اعتماد','Confident':'مطمئن','Playful':'شاداب','Premium':'ممتاز','Technical':'فنی','Bold':'جسورانه','Elegant':'ظریف','Innovative':'نوآور','Warm':'گرم','Energetic':'پرانرژی',
    /* industries */
    'Technology':'تکنولوژی','Artificial Intelligence':'هوش مصنوعی','Developer / Coding':'توسعه‌دهنده / برنامه‌نویسی','Gaming / Esports':'گیمینگ / ورزش الکترونیک','Finance / Banking':'مالی / بانکداری','Business / Consulting':'تجارت / مشاوره','Real Estate':'املاک','Fashion / Clothing':'مد / پوشاک','Retail / Consumer Brand':'خرده‌فروشی / برند مصرفی','Electronics / Devices':'الکترونیک / دستگاه‌ها','Creative Studio / Media':'استودیوی خلاق / رسانه','Architecture':'معماری','Restaurant / Food':'رستورانت / غذا','Coffee / Café':'قهوه / کافه','Bakery':'نانوایی','Beauty / Cosmetics':'زیبایی / آرایشی','Healthcare / Wellness':'صحت / تندرستی','Education':'آموزش','General Brand':'برند عمومی',
    /* style families */
    'Modern':'مدرن','Premium':'ممتاز','Gaming':'گیمینگ','Business':'تجاری','Creative':'خلاق','Food & retail':'غذا و خرده‌فروشی','Systems':'سیستم‌ها','3D & materials':'سه‌بعدی و متریال',
    /* styles */
    'Modern Minimal':'مدرن مینیمال','Neo Geometry':'نئو هندسه','Futuristic Minimal':'مینیمال آینده‌نگر','Swiss-inspired':'الهام‌گرفته از سبک سوئیسی','Editorial':'ادیتوریال','Experimental':'تجربی','Abstract Geometry':'هندسه انتزاعی','Modular Identity':'هویت ماژولار','Luxury Minimal':'مینیمال لوکس','Jewelry':'جواهر','Fashion House':'خانه مد','Automotive Premium':'خودرویی ممتاز','Signature Luxury':'لوکس امضایی','Developer Identity':'هویت توسعه‌دهنده','AI':'هوش مصنوعی','SaaS':'سَس (SaaS)','Cybersecurity':'امنیت سایبری','Esports':'ورزش الکترونیک','Corporate':'سازمانی','Finance':'مالی','Creative Studio':'استودیوی خلاق','Food Brand':'برند غذایی','3D':'سه‌بعدی','Chrome':'کروم','Liquid Metal':'فلز مایع','Glass':'شیشه','Holographic':'هولوگرافیک','Titanium':'تیتانیوم','Embossed':'برجسته','Soft 3D':'سه‌بعدی نرم','Futuristic 3D':'سه‌بعدی آینده‌نگر','Crystal':'کریستال','Neon':'نئون','Product Render':'رندر محصول','Studio Lighting':'نورپردازی استودیویی',
    /* logo types */
    'Symbol Mark':'نشان نمادین','Wordmark':'وردمارک','Lettermark':'لترمارک','Monogram':'مونوگرام','Abstract Mark':'نشان انتزاعی','Combination Mark':'نشان ترکیبی','Emblem':'آرم نشان','Negative Space':'فضای منفی','Geometric Mark':'نشان هندسی','Symbol Fusion':'ادغام نمادها','Modular Mark':'نشان ماژولار','Signature Mark':'نشان امضایی','Architectural Mark':'نشان معماری',
    /* applications */
    'Website':'وب‌سایت','Mobile App':'اپ موبایل','App Icon':'آیکون اپ','Social Media':'شبکه‌های اجتماعی','Clothing':'پوشاک','Packaging':'بسته‌بندی','Business Card':'کارت ویزیت','Signage':'تابلو','Billboard':'بیلبورد','Product':'محصول','Vehicle':'وسیله نقلیه','Building':'ساختمان',
    /* Stage 22 additions */
    'Top rated':'برترین‌ها','More':'بیشتر','Top rated prompts':'پرامپت‌های برتر','Your ratings':'امتیازهای شما','Rate this prompt':'به این پرامپت امتیاز دهید','Rating saved on this device':'امتیاز روی همین دستگاه ذخیره شد','Browse prompts':'مرور پرامپت‌ها','No rated prompts yet':'هنوز پرامپتی امتیاز نگرفته است',
    'Open any prompt and tap the stars to rate it. Your best-rated prompts are listed here.':'هر پرامپت را باز کنید و با ستاره‌ها امتیاز دهید. بهترین‌هایتان اینجا فهرست می‌شوند.',
    'Your highest-rated prompts on this device. Use the stars on any prompt to rate it and it will appear here.':'پرامپت‌هایی که روی همین دستگاه بیشترین امتیاز را داده‌اید. با ستاره‌ها امتیاز بدهید تا اینجا نمایش داده شوند.',
    'How it works':'چگونه کار می‌کند','Features':'امکانات','Browse by style':'مرور بر اساس سبک','Explore':'کاوش','Styles':'سبک‌ها','Browse':'مرور','Prompt generator':'سازندهٔ پرامپت','Concept studio':'استودیوی مفهوم','Prompt library':'کتابخانهٔ پرامپت','Saved projects':'پروژه‌های ذخیره‌شده','Favorites & My Prompts':'علاقه‌مندی‌ها و پرامپت‌های من','Dari interface':'رابط دری',
    'Enter your brand':'نام برند را بنویسید','Choose a style':'سبک را انتخاب کنید','Copy and create':'کپی کنید و بسازید',
    'Logo styles':'سبک‌های لوگو','Prompts':'پرامپت','Skip to content':'رفتن به محتوا','Open Studio →':'باز کردن استودیو ←','Examples are unavailable right now.':'نمونه‌ها فعلاً در دسترس نیستند.',
    'Rankings are unavailable right now':'رتبه‌بندی فعلاً در دسترس نیست',
    'Studio':'استودیو'
  };
  var PATTERNS = [
    [/^up to (\d+)$/, function (n) { return 'تا ' + toFa(n); }],
    [/^Choose up to (\d+)$/, function (n) { return 'حداکثر ' + toFa(n) + ' مورد انتخاب کنید'; }],
    [/^Quality (\S+)$/, function (n) { return 'کیفیت ' + toFa(n); }],
    [/^(\d+) library prompts? attached · Updated (.*)$/, function (n, d) { return toFa(n) + ' پرامپت کتابخانه پیوست · به‌روزرسانی ' + d; }],
    [/^No prompt exists with ID (.*)$/, function (id) { return 'پرامپتی با شناسه ' + id + ' وجود ندارد'; }],
    [/^Rate (\d) stars?$/, function (n) { return 'امتیاز ' + toFa(n) + ' ستاره'; }]
  ];
  var ATTRS = ['placeholder', 'aria-label', 'title'];
  var SKIP = 'script,style,code,pre,textarea,.ptxt,.variation p,[data-no-i18n],.concept-panel p,.dna-grid';
  var lang = 'en', obs = null, busy = false;

  function toFa(v) { return String(v).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(d); }); }
  function lookup(text) {
    var t = text.trim(); if (!t) return null;
    if (Object.prototype.hasOwnProperty.call(FA, t)) return FA[t];
    for (var i = 0; i < PATTERNS.length; i++) { var m = t.match(PATTERNS[i][0]); if (m) return PATTERNS[i][1].apply(null, m.slice(1)); }
    return null;
  }
  function skipped(el) { return !el || (el.closest && el.closest(SKIP)); }

  function doText(node) {
    var el = node.parentElement; if (!el || skipped(el)) return;
    var cur = node.nodeValue;
    if (node.__lsOrig === undefined || (node.__lsSet !== cur)) { node.__lsOrig = cur; }
    if (lang === 'fa') {
      var tr = lookup(node.__lsOrig);
      if (tr) { var lead = node.__lsOrig.match(/^\s*/)[0], trail = node.__lsOrig.match(/\s*$/)[0]; node.__lsSet = lead + tr + trail; if (node.nodeValue !== node.__lsSet) node.nodeValue = node.__lsSet; }
      else { node.__lsSet = undefined; }
    } else if (node.__lsSet !== undefined && node.nodeValue === node.__lsSet) { node.nodeValue = node.__lsOrig; node.__lsSet = undefined; }
  }
  function doAttrs(el) {
    if (!el.getAttribute || skipped(el)) return;
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var key = '__lsA_' + a, set = '__lsS_' + a, cur = el.getAttribute(a);
      if (el[key] === undefined || el[set] !== cur) el[key] = cur;
      if (lang === 'fa') { var tr = lookup(el[key]); if (tr) { el[set] = tr; if (cur !== tr) el.setAttribute(a, tr); } else el[set] = undefined; }
      else if (el[set] !== undefined && cur === el[set]) { el.setAttribute(a, el[key]); el[set] = undefined; }
    });
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  function run(root) { busy = true; try { walk(root || document.body); } finally { busy = false; } }

  function start() {
    if (obs) return;
    obs = new MutationObserver(function (list) {
      if (busy) return;
      busy = true;
      try {
        list.forEach(function (m) {
          if (m.type === 'childList') m.addedNodes.forEach(walk);
          else if (m.type === 'characterData') doText(m.target);
          else if (m.type === 'attributes') doAttrs(m.target);
        });
      } finally { busy = false; }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function apply(l) {
    lang = l === 'fa' ? 'fa' : 'en';
    var h = document.documentElement;
    h.lang = lang; h.dir = lang === 'fa' ? 'rtl' : 'ltr';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    run(document.body); updateButton();
  }
  function updateButton() {
    var b = document.getElementById('lang-btn'); if (!b) return;
    b.textContent = lang === 'fa' ? 'EN' : 'دری';
    b.setAttribute('aria-label', lang === 'fa' ? 'Switch to English' : 'تغییر به دری');
    b.setAttribute('lang', lang === 'fa' ? 'en' : 'fa');
  }
  function mountButton() {
    if (document.getElementById('lang-btn')) return;
    var tg = document.querySelector('.top .tg'); if (!tg) return;
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'lang-btn'; b.className = 'tg lang-btn'; b.setAttribute('data-no-i18n', '');
    b.addEventListener('click', function () { apply(lang === 'fa' ? 'en' : 'fa'); });
    tg.parentNode.insertBefore(b, tg);
  }
  function init() {
    var saved = 'en'; try { saved = localStorage.getItem(KEY) === 'fa' ? 'fa' : 'en'; } catch (e) {}
    mountButton(); start(); apply(saved);
  }
  window.LogoStudioI18n = { set: apply, get: function () { return lang; }, dictionary: FA, translate: lookup };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
