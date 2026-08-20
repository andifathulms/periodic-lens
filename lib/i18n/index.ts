/**
 * English primary, Indonesian secondary — reversed from the sibling projects
 * (PRD.md §2), because chemistry vocabulary is international and this is the
 * project most likely to be found by a non-Indonesian reader.
 *
 * Element names, symbols and chemical terms stay in their standard
 * international form in both locales.
 */
export const LOCALES = ['en', 'id'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Each locale named in its own language, for the switcher's accessible name.
 * "EN" and "ID" announce as two letters with no meaning (WCAG 2.4.4); the
 * visible label stays short, the accessible name says what it does.
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  id: 'Bahasa Indonesia',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

type Dictionary = Record<string, string>

const en: Dictionary = {
  'site.name': 'Periodic Lens',
  'site.tagline': 'Why the table has that shape — and who digs the elements out of the ground.',
  'site.lead':
    'An interactive periodic table built for two things a general reference does not do: it animates where the shape of the table comes from, and it shows Indonesia’s share of world production, element by element.',
  'site.skipToTable': 'Skip to the table',
  'site.toBuild': 'Watch the shape get built',
  'site.toIndonesia': 'See the production figures',
  'table.hint':
    'One lens is active at a time. Choosing a lens recolours all 118 cells; choosing a cell opens its detail beside the table.',
  'panel.empty': 'Select any element for its configuration, its properties and the source behind each one.',
  'nav.table': 'Table',
  'nav.build': 'The build',
  'nav.layouts': 'Layouts',
  'nav.indonesia': 'Indonesia',
  'nav.method': 'Method',
  'lens.label': 'Lens',
  'layout.label': 'Layout',
  'view.label': 'View',
  'view.grid': 'Grid',
  'view.gridRegion': 'Periodic table',
  'view.topography': 'Topography',
  'view.timeline': 'Timeline',
  'view.timelineUnrecorded': 'No recorded year',
  'view.topographyUnavailable':
    'Topography needs a continuous lens — height cannot order categories.',
  'view.topographyNote':
    'The same lens as height as well as colour. Unknown values are drawn as a dashed void spanning the whole range, because a cell resting on the baseline would read as the smallest value.',
  'view.timelineNote':
    'The same 118 elements along one axis, coloured by the active lens. Elements with no recorded year are held off the axis in their own group.',
  'lens.category': 'Category',
  'lens.block': 'Block',
  'lens.origin': 'Origin',
  'lens.production-id': 'Indonesian production',
  'lens.electronegativity': 'Electronegativity',
  'lens.atomic-radius': 'Atomic radius',
  'lens.ionisation-energy': 'Ionisation energy',
  'lens.melting-point': 'Melting point',
  'lens.density': 'Density',
  'lens.discovery': 'Discovery',
  'lens.unmeasured': 'Unknown properties',
  'legend.nothingHatched':
    'Nothing is hatched on this lens. The count itself is always known — an element with five missing properties is a fact, not a gap.',
  'legend.unknownReasonProduction':
    'no commodity covering this element appears in the USGS edition in use',
  'legend.unknownReasonProperty': 'no published value exists for this element',
  'panel.rulePredicts': 'The aufbau rule predicts',
  'panel.ruleWrong': 'and is wrong here',
  'panel.groupFrom': 'Group',
  'panel.periodFrom': 'Period',
  'panel.fBlockNoGroup': 'The f-block carries no group number.',
  'panel.whys': 's-block starts the row, so its two columns are groups 1 and 2. The period is the shell number itself.',
  'panel.whyp': 'p-block starts at group 13 because s and d have already taken twelve columns to its left: 2 + 10. The period is the shell number itself.',
  'panel.whyd': 'd-block starts at group 3 because s took groups 1 and 2. Its period is one more than its shell number, because 3d fills after 4s — the backtrack the rule makes.',
  'panel.whyf': 'f-block sits outside the group numbering. Its period is two more than its shell number, because 4f fills after 6s.',
  'panel.whyHere': 'Why it sits here',
  'panel.differentiating': 'Differentiating electron',
  'panel.blockWidth': 'Block width',
  'panel.byConvention':
    'Position by convention, not by configuration: helium is s-block and sits with the noble gases.',
  'panel.positionFromRule':
    'Position follows the filling order, not the published configuration — which is why this differs from the notation above, and why the exception stays in its block.',
  'build.pattern': 'Half-filled or filled?',
  'build.patternYes': 'yes',
  'build.patternNo': 'no',
  'build.patternNote':
    'What to look for: in eight of these, the borrowed electron lands a d or f subshell exactly half-filled or exactly full. Chromium takes one early to make 3d5, copper to make 3d10, silver 4d10, gadolinium 4f7. Those configurations are more stable than the rule\u2019s arithmetic predicts.',
  'build.patternLimit':
    'The other twelve are not explained by that pattern, and this page does not offer an explanation for them. Niobium, ruthenium, rhodium, platinum and the early actinides land nowhere special. A pattern that covers eight of twenty is a useful thing to notice and a poor thing to call a reason \u2014 the published values stand on measurement, not on any story told about them.',
  'build.published': 'Published',
  'build.predicted': 'Rule predicts',
  'layout.standard': 'Standard',
  'layout.left-step': 'Left-step (Janet)',
  'layout.spiral': 'Spiral (after Benfey)',
  'legend.region': 'Legend',
  'legend.showing': 'Showing',
  'legend.unknown': 'not known',
  'legend.notProduced': 'not produced',
  'legend.unknownNote': 'hatched on every lens — never a colour, never a position on the scale',
  'legend.blockNote':
    'These four colours are the shape of the table. A block is as wide as its subshell is deep — s holds 2 electrons, p holds 6, d holds 10, f holds 14 — so the blocks are 2, 6, 10 and 14 columns across. Count them. The outline of the table is that and nothing else.',
  'legend.scale': 'Scale',
  'legend.logScale':
    'Logarithmic scale — each step is a multiple, not an addition. The middle of the ramp is not the middle value.',
  'legend.binned':
    'colour steps, so this ramp groups values rather than distinguishing all 118. Two elements sharing a colour are close, not equal.',
  'panel.close': 'Close',
  'panel.configuration': 'Electron configuration',
  'panel.anomalous': 'Published configuration departs from the aufbau rule.',
  'panel.properties': 'Properties',
  'panel.activeLens': 'On the active lens',
  'panel.production': 'Indonesian production',
  'panel.neighbours': 'Group and period',
  'prop.mass': 'Standard atomic weight',
  'prop.electronegativity': 'Electronegativity (Pauling)',
  'prop.atomicRadius': 'Atomic radius',
  'prop.ionisationEnergy': 'First ionisation energy',
  'prop.meltingPoint': 'Melting point',
  'prop.density': 'Density',
  'prop.discovery': 'First identified',
  'prop.origin': 'Dominant origin',
  'prop.category': 'Category',
  'prop.block': 'Block',
  'prop.group': 'Group',
  'prop.period': 'Period',
  'text.symbol': 'Symbol',
  'text.name': 'Name',
  'text.mass': 'Mass',
  'text.sortedBy': 'Sorted by',
  'text.heading': 'The table as text',
  'text.note': 'Always present, never a fallback. Sortable by any column.',
  'worked.heading': 'Three elements, all the way through',
  'worked.intro':
    'Before the animation, one pass by hand. Each element has one more electron than the last; the rule above says which subshell that electron enters; the subshell decides the block, and the block and the count decide the square.',
  'worked.electron': 'electron',
  'worked.electrons': 'electrons',
  'worked.conventional':
    'Group 18 here is the one number on this page the rule did not produce. Helium is s-block by configuration and would sit in group 2; it is placed with the noble gases because it behaves like one. A convention, stated as such.',
  'worked.lastEnters': 'the last one enters',
  'worked.holds': 'holds',
  'worked.nowFull': 'is now full',
  'worked.note1': 'The first row begins.',
  'worked.note2':
    'This is why the first row has exactly two elements and then stops: s holds two, and there is nothing else in shell 1 to fill.',
  'worked.note3': 'Shell 1 is finished, so the next electron starts shell 2 — and a new row.',
  'worked.closing':
    'All 118 are placed this way. Nothing below is drawn by hand: every position in the table on this page comes out of that rule and the capacities 2, 6, 10 and 14.',
  'what.heading': 'What if the order were different?',
  'what.intro':
    'The claim on this page is that the shape follows from the filling order. That is worth testing rather than taking on trust, so here is the other ordering — the one most people assume before they meet the rule: finish shell 1, then shell 2, then shell 3, in order. Switch between them and watch the row lengths.',
  'what.label': 'Fill by',
  'what.madelung': 'n + ℓ (the real rule)',
  'what.strict-n': 'strict shell order',
  'what.rows': 'Row lengths',
  'what.realNote':
    '2, 8, 8, 18, 18, 32, 32 — the row lengths of the actual periodic table. Nothing here is drawn from a picture of the table; these numbers fall out of the ordering above and the capacities 2, 6, 10 and 14.',
  'what.hypotheticalNote':
    'A different table. Filling shell by shell puts 3d before 4s, so the transition metals move up a row and the third period becomes eighteen elements long instead of eight — there would be no short second and third rows at all. This is a hypothetical: it is not what atoms do, and nothing else on this site is built from it. It is here because the difference between these two lists is the entire reason the rule matters.',
  'rule.heading': 'The rule, in full',
  'rule.statement':
    'Electrons fill subshells in order of n + ℓ, lowest first; where two subshells tie, the one with the lower n fills first. n is the shell number and ℓ is 0 for s, 1 for p, 2 for d, 3 for f. That is the entire rule — every sum below is worked out from it, and the order of the table follows.',
  'rule.backtrack':
    'Read along and the surprise is 4s before 3d: 4+0 = 4 and 3+2 = 5, so the fourth shell starts before the third one finishes. That single step is why the transition metals sit where they do, and why period 4 is eighteen elements long instead of eight.',
  'build.title': 'How the table gets its shape',
  'build.play': 'Play',
  'build.pause': 'Pause',
  'build.replay': 'Replay',
  'build.step': 'Step',
  'build.exceptions': 'Show where the rule fails',
  'build.keyException': 'published configuration disagrees with the rule',
  'build.keyFollows': 'rule and published configuration agree',
  'build.filling': 'Filling',
  'build.readoutGloss':
    'Reading that: shell {n}, subshell type {l}, holding {within} of the {capacity} electrons that a {l} subshell can take.',
  'build.placed': 'electrons placed',
  'build.reduced': 'Reduced motion: advance one subshell at a time.',
  'ancient.note':
    'Elements in use since antiquity have no recorded year of discovery, so they are hatched rather than dated.',
}

const id: Dictionary = {
  'site.name': 'Periodic Lens',
  'site.tagline': 'Mengapa tabel ini berbentuk demikian — dan siapa yang menambang unsurnya.',
  'site.lead':
    'Tabel periodik interaktif yang dibangun untuk dua hal yang tidak dilakukan rujukan umum: menganimasikan asal-usul bentuk tabel, dan menampilkan pangsa produksi dunia milik Indonesia, unsur demi unsur.',
  'site.skipToTable': 'Lewati ke tabel',
  'site.toBuild': 'Lihat bentuknya tersusun',
  'site.toIndonesia': 'Lihat angka produksinya',
  'table.hint':
    'Satu lensa aktif setiap saat. Memilih lensa mewarnai ulang ke-118 sel; memilih sel membuka rinciannya di samping tabel.',
  'panel.empty': 'Pilih unsur mana pun untuk konfigurasi, sifat, dan sumber di balik masing-masingnya.',
  'nav.table': 'Tabel',
  'nav.build': 'Pembentukan',
  'nav.layouts': 'Tata letak',
  'nav.indonesia': 'Indonesia',
  'nav.method': 'Metode',
  'lens.label': 'Lensa',
  'layout.label': 'Tata letak',
  'view.label': 'Tampilan',
  'view.grid': 'Kisi',
  'view.gridRegion': 'Tabel periodik',
  'view.topography': 'Topografi',
  'view.timeline': 'Lini masa',
  'view.timelineUnrecorded': 'Tanpa tahun tercatat',
  'view.topographyUnavailable':
    'Topografi memerlukan lensa kontinu — tinggi tidak dapat mengurutkan kategori.',
  'view.topographyNote':
    'Lensa yang sama sebagai tinggi sekaligus warna. Nilai yang tidak diketahui digambar sebagai rongga putus-putus setinggi seluruh rentang, karena sel yang rata di garis dasar akan terbaca sebagai nilai terkecil.',
  'view.timelineNote':
    'Ke-118 unsur yang sama pada satu sumbu, diwarnai oleh lensa aktif. Unsur tanpa tahun tercatat ditahan di luar sumbu dalam kelompok tersendiri.',
  'lens.category': 'Kategori',
  'lens.block': 'Blok',
  'lens.origin': 'Asal-usul',
  'lens.production-id': 'Produksi Indonesia',
  'lens.electronegativity': 'Keelektronegatifan',
  'lens.atomic-radius': 'Jari-jari atom',
  'lens.ionisation-energy': 'Energi ionisasi',
  'lens.melting-point': 'Titik leleh',
  'lens.density': 'Massa jenis',
  'lens.discovery': 'Penemuan',
  'lens.unmeasured': 'Sifat tidak diketahui',
  'legend.nothingHatched':
    'Tidak ada yang diarsir pada lensa ini. Cacahnya sendiri selalu diketahui — unsur dengan lima sifat yang hilang adalah sebuah fakta, bukan sebuah rongga.',
  'legend.unknownReasonProduction':
    'tidak ada komoditas yang mencakup unsur ini dalam edisi USGS yang dipakai',
  'legend.unknownReasonProperty': 'tidak ada nilai terbitan untuk unsur ini',
  'panel.rulePredicts': 'Aturan aufbau memprediksi',
  'panel.ruleWrong': 'dan keliru di sini',
  'panel.groupFrom': 'Golongan',
  'panel.periodFrom': 'Periode',
  'panel.fBlockNoGroup': 'Blok f tidak memiliki nomor golongan.',
  'panel.whys': 'Blok s memulai baris, sehingga dua kolomnya adalah golongan 1 dan 2. Periodenya sama dengan nomor kulitnya.',
  'panel.whyp': 'Blok p mulai di golongan 13 karena s dan d telah mengambil dua belas kolom di sebelah kirinya: 2 + 10. Periodenya sama dengan nomor kulitnya.',
  'panel.whyd': 'Blok d mulai di golongan 3 karena s mengambil golongan 1 dan 2. Periodenya satu lebih besar daripada nomor kulitnya, karena 3d terisi setelah 4s.',
  'panel.whyf': 'Blok f berada di luar penomoran golongan. Periodenya dua lebih besar daripada nomor kulitnya, karena 4f terisi setelah 6s.',
  'panel.whyHere': 'Mengapa berada di sini',
  'panel.differentiating': 'Elektron pembeda',
  'panel.blockWidth': 'Lebar blok',
  'panel.byConvention':
    'Posisi menurut konvensi, bukan menurut konfigurasi: helium berada di blok s dan ditempatkan bersama gas mulia.',
  'panel.positionFromRule':
    'Posisi mengikuti urutan pengisian, bukan konfigurasi terbitan — karena itu nilai ini berbeda dari notasi di atas, dan pengecualian tetap berada di bloknya.',
  'build.pattern': 'Setengah atau penuh?',
  'build.patternYes': 'ya',
  'build.patternNo': 'tidak',
  'build.patternNote':
    'Yang perlu diperhatikan: pada delapan di antaranya, elektron yang berpindah membuat subkulit d atau f tepat terisi setengah atau tepat penuh. Kromium mengambil satu lebih awal untuk membentuk 3d5, tembaga 3d10, perak 4d10, gadolinium 4f7. Konfigurasi itu lebih stabil daripada yang diprediksi aritmetika aturannya.',
  'build.patternLimit':
    'Dua belas sisanya tidak dijelaskan oleh pola itu, dan halaman ini tidak menawarkan penjelasan untuknya. Niobium, rutenium, rodium, platina dan aktinida awal tidak mendarat di tempat istimewa mana pun. Pola yang mencakup delapan dari dua puluh layak diperhatikan tetapi buruk bila disebut alasan \u2014 nilai terbitan berdiri di atas pengukuran, bukan di atas cerita apa pun tentangnya.',
  'build.published': 'Terbitan',
  'build.predicted': 'Prediksi aturan',
  'layout.standard': 'Standar',
  'layout.left-step': 'Langkah kiri (Janet)',
  'layout.spiral': 'Spiral (mengikuti Benfey)',
  'legend.region': 'Legenda',
  'legend.showing': 'Menampilkan',
  'legend.unknown': 'tidak diketahui',
  'legend.notProduced': 'tidak diproduksi',
  'legend.unknownNote': 'diarsir pada setiap lensa — bukan warna, bukan posisi pada skala',
  'legend.blockNote':
    'Keempat warna ini adalah bentuk tabelnya. Lebar sebuah blok sama dengan kapasitas subkulitnya — s menampung 2 elektron, p 6, d 10, f 14 — sehingga blok-blok itu selebar 2, 6, 10 dan 14 kolom. Hitunglah. Garis luar tabel hanyalah itu.',
  'legend.scale': 'Skala',
  'legend.logScale':
    'Skala logaritmik — setiap langkah adalah kelipatan, bukan penambahan. Bagian tengah skala bukan nilai tengah.',
  'legend.binned':
    'langkah warna, sehingga skala ini mengelompokkan nilai alih-alih membedakan ke-118 unsur. Dua unsur berwarna sama berarti berdekatan, bukan sama.',
  'panel.close': 'Tutup',
  'panel.configuration': 'Konfigurasi elektron',
  'panel.anomalous': 'Konfigurasi terbitan menyimpang dari aturan aufbau.',
  'panel.properties': 'Sifat',
  'panel.activeLens': 'Pada lensa aktif',
  'panel.production': 'Produksi Indonesia',
  'panel.neighbours': 'Golongan dan periode',
  'prop.mass': 'Bobot atom standar',
  'prop.electronegativity': 'Keelektronegatifan (Pauling)',
  'prop.atomicRadius': 'Jari-jari atom',
  'prop.ionisationEnergy': 'Energi ionisasi pertama',
  'prop.meltingPoint': 'Titik leleh',
  'prop.density': 'Massa jenis',
  'prop.discovery': 'Pertama diidentifikasi',
  'prop.origin': 'Asal-usul dominan',
  'prop.category': 'Kategori',
  'prop.block': 'Blok',
  'prop.group': 'Golongan',
  'prop.period': 'Periode',
  'text.symbol': 'Lambang',
  'text.name': 'Nama',
  'text.mass': 'Massa',
  'text.sortedBy': 'Diurutkan menurut',
  'text.heading': 'Tabel dalam bentuk teks',
  'text.note': 'Selalu tersedia, bukan cadangan. Dapat diurutkan menurut kolom mana pun.',
  'worked.heading': 'Tiga unsur, dari awal sampai akhir',
  'worked.intro':
    'Sebelum animasinya, satu kali telusur manual. Setiap unsur memiliki satu elektron lebih banyak daripada sebelumnya; aturan di atas menentukan subkulit mana yang diisi elektron itu; subkulit menentukan blok, dan blok beserta cacahnya menentukan kotaknya.',
  'worked.electron': 'elektron',
  'worked.electrons': 'elektron',
  'worked.conventional':
    'Golongan 18 di sini adalah satu-satunya angka di halaman ini yang bukan hasil aturan. Helium berada di blok s menurut konfigurasinya dan semestinya di golongan 2; ia ditempatkan bersama gas mulia karena sifatnya demikian. Sebuah konvensi, dan dinyatakan sebagai konvensi.',
  'worked.lastEnters': 'yang terakhir masuk ke',
  'worked.holds': 'menampung',
  'worked.nowFull': 'kini penuh',
  'worked.note1': 'Baris pertama dimulai.',
  'worked.note2':
    'Inilah sebabnya baris pertama berisi tepat dua unsur lalu berhenti: s menampung dua, dan tidak ada lagi yang bisa diisi di kulit 1.',
  'worked.note3': 'Kulit 1 selesai, sehingga elektron berikutnya memulai kulit 2 — dan baris baru.',
  'worked.closing':
    'Ke-118 unsur ditempatkan dengan cara ini. Tidak ada yang digambar manual: setiap posisi dalam tabel di halaman ini keluar dari aturan itu dan kapasitas 2, 6, 10 dan 14.',
  'what.heading': 'Bagaimana jika urutannya berbeda?',
  'what.intro':
    'Klaim di halaman ini adalah bahwa bentuk tabel mengikuti urutan pengisian. Itu layak diuji, bukan sekadar dipercaya, jadi inilah urutan yang lain — yang biasanya diandaikan orang sebelum mengenal aturannya: selesaikan kulit 1, lalu kulit 2, lalu kulit 3, berurutan. Bergantilah di antara keduanya dan perhatikan panjang barisnya.',
  'what.label': 'Isi menurut',
  'what.madelung': 'n + ℓ (aturan sebenarnya)',
  'what.strict-n': 'urutan kulit ketat',
  'what.rows': 'Panjang baris',
  'what.realNote':
    '2, 8, 8, 18, 18, 32, 32 — panjang baris tabel periodik yang sebenarnya. Tidak ada yang disalin dari gambar tabel; angka-angka ini keluar dari urutan di atas dan kapasitas 2, 6, 10 dan 14.',
  'what.hypotheticalNote':
    'Tabel yang berbeda. Mengisi kulit demi kulit menempatkan 3d sebelum 4s, sehingga logam transisi naik satu baris dan periode ketiga menjadi delapan belas unsur, bukan delapan — tidak akan ada baris kedua dan ketiga yang pendek sama sekali. Ini hipotesis: bukan perilaku atom yang sebenarnya, dan tidak ada bagian lain situs ini yang dibangun darinya. Ia ada di sini karena perbedaan antara kedua daftar itulah seluruh alasan aturan tersebut penting.',
  'rule.heading': 'Aturannya, selengkapnya',
  'rule.statement':
    'Elektron mengisi subkulit menurut urutan n + ℓ, terkecil lebih dahulu; bila dua subkulit bernilai sama, yang ber-n lebih kecil mengisi lebih dahulu. n adalah nomor kulit dan ℓ bernilai 0 untuk s, 1 untuk p, 2 untuk d, 3 untuk f. Itulah keseluruhan aturannya — setiap penjumlahan di bawah dihitung darinya, dan urutan tabel mengikutinya.',
  'rule.backtrack':
    'Susuri urutannya dan kejutannya adalah 4s sebelum 3d: 4+0 = 4 dan 3+2 = 5, sehingga kulit keempat mulai terisi sebelum kulit ketiga selesai. Satu langkah itulah sebabnya logam transisi berada di tempatnya, dan sebabnya periode 4 memuat delapan belas unsur, bukan delapan.',
  'build.title': 'Bagaimana tabel memperoleh bentuknya',
  'build.play': 'Mainkan',
  'build.pause': 'Jeda',
  'build.replay': 'Ulangi',
  'build.step': 'Langkah',
  'build.exceptions': 'Tampilkan tempat aturan ini gagal',
  'build.keyException': 'konfigurasi terbitan tidak sesuai aturan',
  'build.keyFollows': 'aturan dan konfigurasi terbitan sesuai',
  'build.filling': 'Mengisi',
  'build.readoutGloss':
    'Cara membacanya: kulit {n}, jenis subkulit {l}, berisi {within} dari {capacity} elektron yang dapat ditampung subkulit {l}.',
  'build.placed': 'elektron ditempatkan',
  'build.reduced': 'Gerak dikurangi: maju satu subkulit setiap langkah.',
  'ancient.note':
    'Unsur yang telah dipakai sejak zaman kuno tidak memiliki tahun penemuan tercatat, sehingga diarsir alih-alih diberi tanggal.',
}

const DICTIONARIES: Record<Locale, Dictionary> = { en, id }

/**
 * Document titles. Every page carried the same <title>, so five open tabs all
 * read "Periodic Lens". The landing keeps the bare name; every other page
 * names itself first, because that is the half a narrow tab shows.
 */
export function pageTitle(locale: Locale, key?: string): string {
  const name = t(locale, 'site.name')
  return key ? `${t(locale, key)} — ${name}` : name
}

export function t(locale: Locale, key: string): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key
}

/** Category, origin and block names, in words. Chemical terms stay international. */
const TERMS: Record<Locale, Dictionary> = {
  en: {
    'alkali-metal': 'Alkali metal',
    'alkaline-earth-metal': 'Alkaline earth metal',
    'transition-metal': 'Transition metal',
    'post-transition-metal': 'Post-transition metal',
    metalloid: 'Metalloid',
    'reactive-nonmetal': 'Reactive nonmetal',
    'noble-gas': 'Noble gas',
    'inner-transition-metal': 'Inner transition metal',
    'big-bang': 'Big Bang nucleosynthesis',
    'cosmic-ray-fission': 'Cosmic ray fission',
    'dying-low-mass-stars': 'Dying low-mass stars',
    'exploding-massive-stars': 'Exploding massive stars',
    'exploding-white-dwarfs': 'Exploding white dwarfs',
    'merging-neutron-stars': 'Merging neutron stars',
    'human-made': 'Human-made',
    s: 's-block',
    p: 'p-block',
    d: 'd-block',
    f: 'f-block',
    mined: 'mined ore',
    refined: 'refined metal',
  },
  id: {
    'alkali-metal': 'Logam alkali',
    'alkaline-earth-metal': 'Logam alkali tanah',
    'transition-metal': 'Logam transisi',
    'post-transition-metal': 'Logam pasca-transisi',
    metalloid: 'Metaloid',
    'reactive-nonmetal': 'Nonlogam reaktif',
    'noble-gas': 'Gas mulia',
    'inner-transition-metal': 'Logam transisi dalam',
    'big-bang': 'Nukleosintesis Big Bang',
    'cosmic-ray-fission': 'Fisi sinar kosmik',
    'dying-low-mass-stars': 'Bintang bermassa rendah yang sekarat',
    'exploding-massive-stars': 'Bintang masif yang meledak',
    'exploding-white-dwarfs': 'Katai putih yang meledak',
    'merging-neutron-stars': 'Bintang neutron yang bergabung',
    'human-made': 'Buatan manusia',
    s: 'blok s',
    p: 'blok p',
    d: 'blok d',
    f: 'blok f',
    mined: 'bijih tambang',
    refined: 'logam olahan',
  },
}

export function term(locale: Locale, key: string): string {
  return TERMS[locale][key] ?? TERMS.en[key] ?? key
}
