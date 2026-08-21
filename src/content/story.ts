import type { Story } from "./types"

export const story: Story = {
  coverImage: "cover.webp",
  backgroundMusic: "background_music.mp3",
  answerFormatRule:
    "A törteket a legegyszerűbb alakban add meg pl.: 2/12 → 1/6! Végtelene tizedes törteket általános tört alakban add meg pl.: 0,66 → 1/3!",
  screens: [
    {
      type: "narration",
      image: "01.webp",
      audio: "01.mp3",
      caption:
        "Sóhaj-öböl kikötője sosem alszik. Hajnalban is nyikorognak az árbocok, a sirályok a halászokkal veszekednek, a mólón pedig ott ül egy lány, aki a fél tengert kívülről ismeri, pedig még csak tizennégy éves. Vidrának hívják. Ő a Korallszív nevű hajó térképész tanonca, és még nem tudja, hogy ez a reggel mindent megváltoztat.",
      captionTimings: [2.86, 16.79, 19.04, 28.46],
    },
    {
      type: "narration",
      image: "02.webp",
      audio: "02.mp3",
      captionTimings: [5.92, 12.99, 20.2, 25.19],
      caption:
        "Vidra már a fogadóban ült, amikor Bors kapitány úgy lökte be az ajtót, mint egy viharfelhő. Rossz hírt hozott: Cirkalom mester, a Korallszív öreg navigátora nyomtalanul eltűnt. Csak egy lezárt ládát hagyott hátra, rajta üzenettel: aki kinyitja, azé a térképem. Az vezesse a hajót a Törtek tengerére, a Törtkirály kincséhez.",
    },
    {
      type: "narration",
      image: "03.webp",
      audio: "03.mp3",
      captionTimings: [12.64, 20.83],
      caption:
        "A láda zárján három számtárcsa és egy tekerőkerék helyezkedett el, mellettük Cirkalom mester girbegurba kézírása sorolta, mire kell állítani őket. Pí, a Korallszív legbecsületesebb papagája, Vidra vállára röppent: „Rajtad a sor, tanonc!”",
    },
    {
      type: "exercise",
      backgroundImage: "wood.webp",
      introText:
        "Cirkalom mester lezárt ládáján három számtárcsa és egy tekerőkerék van. Oldd meg a feladványt, hogy kinyíljon!",
      exercises: [
        {
          id: "tarcsa1",
          prompt: "Első tárcsa: a $16; 9; 18; 3; 4$ számsokaság mediánja.",
          fields: [
            {
              id: "tarcsa1mezo",
              label: "Első tárcsa",
              acceptedAnswers: ["9"],
            },
          ],
          hints: [
            "A medián a középső érték, de csak akkor, ha már sorba rendezted a számokat.",
            "Rendezd növekvő sorrendbe mind az öt számot.",
            "Öt szám esetén a középső a harmadik a rendezett sorban, nem az, amelyik eredetileg középen állt.",
          ],
          // A correct answer here ends the demo: the Tovabb button leaves for the
          // thank you page on the main site instead of moving to the next task.
          continueUrl: "https://kalandmatek.hu/koszonjuk",
        },
        {
          id: "tarcsa2",
          prompt: "Második tárcsa: a $12$ és a $15$ legkisebb közös többszöröse.",
          fields: [
            {
              id: "tarcsa2mezo",
              label: "Második tárcsa",
              acceptedAnswers: ["60"],
            },
          ],
          hints: [
            "Olyan számot keresel, amely mindkét számnak többszöröse, és a lehető legkisebb.",
            "Bontsd fel mindkét számot prímtényezőkre, vagy írd fel a többszöröseiket egymás alá.",
            "A két szám szorzata is közös többszörös, de nem biztos, hogy az a legkisebb. Nézd meg, van-e közös osztójuk.",
          ],
        },
        {
          id: "tarcsa3",
          prompt: "Harmadik tárcsa: egy szabályos hatszög átlóinak száma.",
          fields: [
            {
              id: "tarcsa3mezo",
              label: "Harmadik tárcsa",
              acceptedAnswers: ["9"],
            },
          ],
          hints: [
            "Az átló két olyan csúcsot köt össze, amelyek nem szomszédosak.",
            "Rajzold le a hatszöget, és számold meg, hány átló indul egyetlen csúcsból. Utána gondolj arra, hogy hat csúcs van.",
            "Ha csúcsonként összeszámolod az átlókat, minden átlót kétszer számoltál, mert két végpontja van.",
          ],
        },
        {
          id: "kerek",
          prompt:
            "Eddig tekerd a kereket: $2 : \\frac{8}{15}$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "kerekmezo",
              label: "Fordulatok száma",
              acceptedAnswers: ["15/4", "3,75"],
            },
          ],
          hints: [
            "Egy egész számot osztasz törttel.",
            "Osztani egy törttel ugyanaz, mint szorozni a reciprokával, tehát fordítsd meg a törtet.",
            "A végén egyszerűsíts, ha lehet. Az eredmény törtként és tizedes tört alakban is megadható.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "04.webp",
      audio: "04.mp3",
      captionTimings: [1.02, 2.22, 4.43, 15.11, 17.32, 33.54],
      caption:
        "Kilenc. Hatvan. Kilenc. A tárcsák sorra a helyükre kattantak, aztán Vidra háromszor teljesen körbetekerte a kereket, és ráadott még egy háromnegyed fordulatot. A zár engedett. A ládában ott feküdt a Törtek tengerének térképe, tele jelekkel és girbegurba vonalakkal, a sarkában Cirkalom kézjegyével és egy odavetett sorral: a Törtek tengere nem szereti a hívatlan vendégeket.",
    },
    {
      type: "narration",
      image: "05.webp",
      audio: "05.mp3",
      captionTimings: [3.33, 11.85, 16.96, 22.86],
      caption:
        "A Korallszív fedélzetén kiterítették a térképet. Az első bejegyzés rögtön a kikötő zátonyairól szólt: aki teli vitorlával fut ki, azt az áramlat a sziklákra dobja. Cirkalom a margóra írta fel, hogyan kell beállítani a köteleket és a vitorlát. Bors kapitány Vidrára nézett: „Nos, tanonc, olvasd!”",
    },
    {
      type: "exercise",
      backgroundImage: "map.webp",
      introText:
        "A térkép első bejegyzése a kikötő zátonyairól szól: aki teli vitorlával fut ki, azt az áramlat a sziklákra dobja. Cirkalom a margóra írta, hogyan állítsd be a köteleket és a vitorlát.",
      exercises: [
        {
          id: "oromkotel",
          prompt: "$\\frac{\\text{Oromkötél hossza}}{4} = 10{,}25$",
          fields: [
            {
              id: "oromkotelmezo",
              label: "Oromkötél hossza",
              acceptedAnswers: ["41"],
            },
          ],
          hints: [
            "Azt a számot keresed, amelynek a negyedét ismered.",
            "Az osztás fordított művelete a szorzás.",
            "Szorozd meg néggyel a jobb oldalon álló számot, és figyelj a tizedesvesszőre.",
          ],
        },
        {
          id: "keresztkotel",
          prompt: "Keresztkötél feszítése: az $1; 2; 4; 8; 10$ számok átlaga.",
          fields: [
            {
              id: "keresztkotelmezo",
              label: "Keresztkötél feszítése",
              acceptedAnswers: ["5"],
            },
          ],
          hints: [
            "Az átlag kiszámításához mind az öt számra szükséged van.",
            "Add össze a számokat, majd oszd el annyival, ahány szám van.",
            "Ellenőrizd, hogy öt számmal osztottál, és hogy egyiket sem hagytad ki az összeadásból.",
          ],
        },
        {
          id: "horgonylanc",
          prompt:
            "Horgonylánc szemei: a legkisebb pozitív egész szám, amelynek $1; 2; 4; 5$ és $6$ is osztója.",
          fields: [
            {
              id: "horgonylancmezo",
              label: "Horgonylánc szemei",
              acceptedAnswers: ["60"],
            },
          ],
          hints: [
            "Olyan számot keresel, amely mindegyik felsorolt számmal maradék nélkül osztható.",
            "Ez a felsorolt számok legkisebb közös többszöröse.",
            "Ha találsz egy megfelelő számot, ellenőrizd, hogy nincs-e nála kisebb, ami szintén mindegyikkel osztható.",
          ],
        },
        {
          id: "vitorla",
          prompt:
            "Ennyi vitorlát bonts ki: a $\\frac{3}{4}$ szám $\\frac{4}{5}$ része. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "vitorlamezo",
              label: "Kibontott vitorla",
              acceptedAnswers: ["3/5", "0,6"],
            },
          ],
          hints: [
            "Egy szám valahányad része mindig szorzással jön ki.",
            "Szorozd össze a két törtet: számlálót a számlálóval, nevezőt a nevezővel.",
            "A végén egyszerűsítsd a törtet a lehető legegyszerűbb alakra.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "06.webp",
      audio: "06.mp3",
      captionTimings: [13.94, 19.52, 23.09, 29.14],
      caption:
        "„Negyvenegy arasz az oromkötél, ötösre feszítsd a keresztkötelet, hatvan szem horgonyláncot ereszd, és háromötöd vitorlát bonts, egy arasszal se többet!”, kiáltotta Vidra a hajóorrból. A Korallszív lelassult, és kecsesen siklott át a fekete sziklák között. Az áramlat morogva engedte tovább őket. Pí a korláton billegett, és úgy tett, mintha egy pillanatig sem izgult volna.",
    },
    {
      type: "narration",
      image: "07.webp",
      audio: "07.mp3",
      captionTimings: [8.01, 22.9, 27.31, 34.58],
      caption:
        "Két napig békésen futottak, aztán a láthatáron fehér fal emelkedett: a Suttogó-köd. A térkép széljegyzete szerint odabent harangbóják kongatnak, és a hajó csak úgy jut át, ha sorra elhalad a bóják mellett, számolja a kongásokat, és pontosan a megfelelő bójánál fordul északnak. Aki elvéti, azt a köd nem engedi el egykönnyen. Cirkalom mester a fordulót is elrejtette, hogy csak az követhesse a térképét, aki méltó rá.",
    },
    {
      type: "exercise",
      backgroundImage: "patchment.webp",
      introText:
        "A Suttogó-ködben harangbóják kongatnak, és a hajó csak akkor jut át, ha a megfelelő bójánál fordul északnak. Cirkalom jelei megmondják, melyiknél.",
      exercises: [
        {
          id: "jel1",
          prompt:
            "Első jel: $\\frac{11}{9} - 2$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "jel1mezo",
              label: "Első jel",
              acceptedAnswers: ["-7/9"],
            },
          ],
          hints: [
            "Egy törtből vonsz ki egy egész számot.",
            "Írd fel a $2$-t is kilencedekben, hogy azonos nevezővel dolgozhass.",
            "Figyelj a végeredmény előjelére, mert a kivonandó nagyobb, mint amiből kivonod.",
          ],
        },
        {
          id: "jel3",
          prompt:
            "Harmadik jel: a $2; 3; 3; 4; 5; 2; 3; 3; 2; 4; 1$ számsokaság módusza.",
          fields: [
            {
              id: "jel3mezo",
              label: "Harmadik jel",
              acceptedAnswers: ["3"],
            },
          ],
          hints: [
            "A módusz nem a középső érték és nem is az átlag.",
            "Számold meg, melyik szám hányszor fordul elő a felsorolásban.",
            "Az a szám lesz a jó, amelyik a legtöbbször szerepel. Számolj újra, ha két jelölt is közel van egymáshoz.",
          ],
        },
        {
          id: "jel4",
          prompt:
            "Negyedik jel: az a számjegy, amellyel a $\\overline{32D57}$ ötjegyű szám osztható $9$-cel.",
          fields: [
            {
              id: "jel4mezo",
              label: "Negyedik jel",
              acceptedAnswers: ["1"],
            },
          ],
          hints: [
            "A kilenccel való oszthatóságnak van egy egyszerű szabálya.",
            "Egy szám akkor osztható kilenccel, ha a számjegyeinek összege is osztható kilenccel.",
            "Add össze az ismert számjegyeket, és nézd meg, mennyi hiányzik a legközelebbi kilenccel osztható számig.",
          ],
        },
        {
          id: "jel2",
          prompt:
            "Ennél a harangbójánál fordulj északnak: az a kitevő, amelyre $7^9 \\cdot 7^8 = 7^{Bója}$.",
          fields: [
            {
              id: "jel2mezo",
              label: "A bója száma",
              acceptedAnswers: ["17"],
            },
          ],
          hints: [
            "Azonos alapú hatványokat szorzol össze.",
            "Ilyenkor az alap változatlan marad, és csak a kitevőkkel kell műveletet végezned.",
            "A kitevőket összeadod, nem összeszorzod.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "08.webp",
      audio: "08.mp3",
      captionTimings: [1.09, 4.41, 8.7, 9.75, 10.99, 12.17, 14.17, 21.78, 24.3],
      caption:
        "Tizenhét. A tizenhetedik harangnál kell fordulni. A tejfehér semmiben csak a kongás számított. Tizenöt. Tizenhat. Tizenhét! Kormányt északnak! A Korallszív orra kifúrta magát a ködből, és a fedélzetre újra rásütött a nap. Pí diadalmasan rikkantott.",
    },
    {
      type: "narration",
      image: "09.webp",
      audio: "09.mp3",
      captionTimings: [5.17, 18.57, 21.43, 25.1],
      caption:
        "A köd túloldalán sziklába vájt város bújt meg: Csempészzug. A kapuja fölött négy üres betűhely és egy vésett üzenet: idegen, fejtsd meg, mit érnek a betűk, add össze őket, és kiáltsd a kapunak az eredményt. Vidra elvigyorodott. Ez bizony Cirkalom mester keze munkája.",
    },
    {
      type: "exercise",
      backgroundImage: "stone.webp",
      introText:
        "Csempészzug kapuja fölött négy üres betűhely van. Számold ki a betűk értékét, add össze őket, és kiáltsd a kapunak az eredményt!",
      exercises: [
        {
          id: "betuO",
          prompt: "$O = 2 - \\frac{2}{3}$",
          fields: [
            {
              id: "betuOmezo",
              label: "O értéke",
              acceptedAnswers: ["4/3"],
            },
          ],
          hints: [
            "Egy egész számból vonsz ki egy törtet.",
            "Írd fel a $2$-t harmadokban, hogy azonos neveződ legyen.",
            "Ha megvan a közös nevező, már csak a számlálókkal kell kivonást végezned.",
          ],
        },
        {
          id: "betuK",
          prompt: "$K$: a $2$ kétharmad része.",
          fields: [
            {
              id: "betuKmezo",
              label: "K értéke",
              acceptedAnswers: ["4/3"],
            },
          ],
          hints: [
            "Valaminek a kétharmad része szorzással jön ki.",
            "Szorozd meg a $2$-t a $\\frac{2}{3}$ törttel.",
            "Az egész számot felírhatod tört alakban is, így a szorzás egyszerűbb lesz.",
          ],
        },
        {
          id: "betuS",
          prompt: "$S = \\left(\\frac{2}{3}\\right)^2$",
          fields: [
            {
              id: "betuSmezo",
              label: "S értéke",
              acceptedAnswers: ["4/9"],
            },
          ],
          hints: [
            "Egy törtet emelsz négyzetre.",
            "A számlálót és a nevezőt is külön-külön négyzetre kell emelned.",
            "Ne felejtsd el, hogy a nevező is négyzetre emelődik, nem marad változatlan.",
          ],
        },
        {
          id: "betuX",
          prompt: "$X = O + K + O + S$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "betuXmezo",
              label: "X értéke",
              acceptedAnswers: ["40/9"],
            },
          ],
          hints: [
            "A már kiszámolt értékeket kell összeadnod, de figyelj arra, melyik hányszor szerepel.",
            "Hozd közös nevezőre a törteket, mielőtt összeadod őket.",
            "Nézd meg jól a sorrendet, mert az egyik betű kétszer is előfordul az összegben.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "10.webp",
      audio: "10.mp3",
      captionTimings: [3.73, 10.65, 14.59, 21.58],
      caption:
        "„OKOS!”, kiáltotta Vidra teli torokból. A kapuőr elismerően füttyentett: „Negyven kilenced, mi? Rég járt erre olyan, aki ezt fejben kiszámolta.” A rácsok csikorogva felemelkedtek, és a Korallszív befuthatott a sziklák gyomrába.",
    },
    {
      type: "narration",
      image: "11.webp",
      audio: "11.mp3",
      captionTimings: [9.7, 19.76, 27.42, 29.74],
      caption:
        "Csempészzug piacán mindent árultak: térképet, füstölt polipot, kétes eredetű álszakállat. Vidráéknak egyetlen dolog kellett: Kagylós Kelemen áramlat-térképe, ami átvezet a Törtek tengerének örvényei közt. „Az ára ezüstben annyi, amennyit ez a cédula mond”, vigyorgott a kagylónyakláncos kereskedő. „Egy garassal se kevesebb!”",
    },
    {
      type: "exercise",
      backgroundImage: "wood.webp",
      introText:
        "Kagylós Kelemen az áramlat-térképért ezüstöt kér. A cédulájáról derül ki, mennyit.",
      exercises: [
        {
          id: "cedula1",
          prompt: "A cédula első sora: $36 : (5 \\cdot 4)$",
          fields: [
            {
              id: "cedula1mezo",
              label: "Első sor",
              acceptedAnswers: ["1,8", "9/5"],
            },
          ],
          hints: [
            "A zárójelben álló művelet mindig előbb jön.",
            "Számold ki a zárójelben álló szorzatot, és csak utána oszd el vele a $36$-ot.",
            "Az eredmény nem egész szám, tizedes tört és tört alakban is megadható.",
          ],
        },
        {
          id: "cedula2",
          prompt: "A cédula második sora: $24$ és $9$ legkisebb közös többszöröse.",
          fields: [
            {
              id: "cedula2mezo",
              label: "Második sor",
              acceptedAnswers: ["72"],
            },
          ],
          hints: [
            "Mindkét számnak többszöröse kell legyen, és a lehető legkisebb.",
            "Bontsd prímtényezőkre a $24$-et és a $9$-et.",
            "A közös többszörösben minden prímtényező a nagyobbik kitevővel szerepel.",
          ],
        },
        {
          id: "cedula4",
          prompt:
            "A cédula utolsó sora: $\\frac{2}{3} - \\frac{2}{5}$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "cedula4mezo",
              label: "Utolsó sor",
              acceptedAnswers: ["4/15"],
            },
          ],
          hints: [
            "Különböző nevezőjű törteket vonsz ki egymásból.",
            "Keress közös nevezőt a $3$-hoz és az $5$-höz.",
            "Ha megvan a közös nevező, a számlálókat is át kell alakítanod, mielőtt kivonsz.",
          ],
        },
        {
          id: "ezust",
          prompt: "Ennyi ezüstöt fizess: az árnak a kétharmada $32$.",
          fields: [
            {
              id: "ezustmezo",
              label: "Fizetendő ezüst",
              acceptedAnswers: ["48"],
            },
          ],
          hints: [
            "Itt nem a kétharmadot kell kiszámolnod, hanem az egészet keresed.",
            "Ha a kétharmad rész ismert, előbb az egyharmadot érdemes meghatározni.",
            "Az egyharmad megvan, ha elfelezed a kétharmadot. Utána még egy lépés hiányzik az egészhez.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "12.webp",
      audio: "12.mp3",
      captionTimings: [6.15, 17.75, 19.68, 27.63, 29.96, 33.17],
      caption:
        "A negyvennyolc ezüst már Kelemen markában volt, az áramlat-térkép pedig Vidra táskájában. A kereskedő még utánuk kiáltott valamit hetvenkét szem kagylóról, de akkor már senki sem figyelt rá: a szirtek mögül sötét vitorla fordult utánuk. A Fekete Hínár! A kormánynál Cápafog Cézár állt, aki fél életében a Törtkirály kincsét kereste. Neki nem kellett térkép. Neki elég volt követni Vidráékat.",
    },
    {
      type: "narration",
      image: "13.webp",
      audio: "13.mp3",
      captionTimings: [3.84, 10.56, 15.03, 17.29, 22.76, 27.3],
      caption:
        "A Fekete Hínár óráról órára közelebb ért. Előttük viszont feketére vált az ég: viharfal tornyosult a Törtek tengere fölé. „Oda épeszű hajós nem megy be”, morogta Bors kapitány. Vidra a naplót lapozta. Cirkalom mester járt már itt: viharban engedd le a viharhorgonyt! Már csak meg kell határozni, hány ölnyit eresszenek le.",
    },
    {
      type: "exercise",
      backgroundImage: "patchment.webp",
      introText:
        "Cirkalom naplója szerint viharban a viharhorgony kötelének hossza a kulcs, ölben mérve.",
      exercises: [
        {
          id: "arbocgyuru",
          prompt: "Árbócgyűrűk száma: $2^3 + 3^2$",
          fields: [
            {
              id: "arbocgyurumezo",
              label: "Árbócgyűrűk",
              acceptedAnswers: ["17"],
            },
          ],
          hints: [
            "Két hatvány összegét kell kiszámolnod.",
            "A hatvány azt jelenti, hogy az alapot annyiszor szorzod önmagával, amennyi a kitevő.",
            "Számold ki külön a két hatványt, és csak a végén add össze őket. Vigyázz, a $2^3$ és a $3^2$ nem ugyanaz.",
          ],
        },
        {
          id: "lampas",
          prompt: "Lámpások száma: az egyjegyű pozitív prímszámok száma.",
          fields: [
            {
              id: "lampasmezo",
              label: "Lámpások",
              acceptedAnswers: ["4"],
            },
          ],
          hints: [
            "Nem összeadnod kell a prímszámokat, hanem megszámolnod őket.",
            "Az egyjegyű számok az $1$-től a $9$-ig tartanak, nézd végig őket sorban.",
            "Az $1$ nem prímszám, ezt szokták a legtöbben elfelejteni.",
          ],
        },
        {
          id: "meroon",
          prompt: "Mérőónok száma: $12 \\cdot \\frac{5}{6}$",
          fields: [
            {
              id: "meroonmezo",
              label: "Mérőónok",
              acceptedAnswers: ["10"],
            },
          ],
          hints: [
            "Egész számot szorzol törttel.",
            "Az egész számot beírhatod a tört számlálójába.",
            "Egyszerűsíthetsz már a szorzás előtt is, így kisebb számokkal dolgozhatsz.",
          ],
        },
        {
          id: "kotelhossz",
          prompt:
            "Ennyi öl kötelet engedj ki: $\\text{árbócgyűrűk} - (\\text{lámpások} - \\text{mérőónok}) + \\text{árbócgyűrűk}$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "kotelhosszmezo",
              label: "Kötél hossza ölben",
              acceptedAnswers: ["40"],
            },
          ],
          hints: [
            "A korábban kiszámolt három értéket kell behelyettesítened.",
            "A zárójelben álló kivonást végezd el először.",
            "A zárójel eredménye negatív, és a zárójel előtt mínusz áll. Két mínusz találkozásából plusz lesz.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "14.webp",
      audio: "14.mp3",
      captionTimings: [6.71, 11.91, 18.97, 21.42],
      caption:
        "Negyven öl kötél futott ki a viharhorgonnyal, és a Korallszív orra engedelmesen a hullámoknak fordult. Az ég szakadt, a fedélzet nyikorgott, de a kötél tartott. Cápafog a vihar széléről nézte, ahogy elnyeli Vidráékat a sötétség, aztán káromkodva visszafordult. Ő ugyan nem megy utánuk.",
    },
    {
      type: "narration",
      image: "15.webp",
      audio: "15.mp3",
      captionTimings: [3.15, 9.66, 11.73, 20.49],
      caption:
        "Hajnalra a vihar elfáradt. A Törtek tengere üvegsimán terült szét, a láthatáron pedig szigetek rajzolódtak ki. Egyik olyan, mint a másik. A térkép szerint a kincs szigetét kőoszlopok gyűrűje őrzi, és a napló pontosan megmondja, hányat kell számolni.",
    },
    {
      type: "exercise",
      backgroundImage: "stone.webp",
      introText:
        "A kincs szigetét kőoszlopok gyűrűje őrzi. Cirkalom naplója megmondja, hányat keress.",
      exercises: [
        {
          id: "egyszerusites",
          prompt: "Egyszerűsítsd a következő törtet: $\\frac{9}{15}$",
          fields: [
            {
              id: "egyszerusitesszamlalo",
              label: "Számláló",
              acceptedAnswers: ["3"],
            },
            {
              id: "egyszerusitesnevezo",
              label: "Nevező",
              acceptedAnswers: ["5"],
            },
          ],
          hints: [
            "Keress olyan számot, amellyel a számláló és a nevező is osztható.",
            "Oszd el mindkettőt a legnagyobb közös osztójukkal.",
            "Az egyszerűsítés után ellenőrizd, hogy tovább már nem lehet osztani a két számot.",
          ],
        },
        {
          id: "hianyzo",
          prompt:
            "Tedd igazzá az egyenlőséget a hiányzó számok beírásával: $3 \\cdot \\frac{?}{?} = 7$",
          fields: [
            {
              id: "hianyzoszamlalo",
              label: "Számláló",
              acceptedAnswers: ["7"],
            },
            {
              id: "hianyzonevezo",
              label: "Nevező",
              acceptedAnswers: ["3"],
            },
          ],
          hints: [
            "Egy törtet keresel, amellyel a $3$-at megszorozva pontosan $7$-et kapsz.",
            "Gondolj arra, hogy a szorzás fordított művelete az osztás.",
            "Ellenőrizd a megoldásodat visszaszorzással: a $3$-mal megszorozva valóban $7$-et kell kapnod.",
          ],
        },
        {
          id: "osztas",
          prompt:
            "Végezd el a következő osztást: $3\\frac{2}{3} : 5$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "osztasmezo",
              label: "Az osztás eredménye",
              acceptedAnswers: ["11/15"],
            },
          ],
          hints: [
            "Vegyes számmal dolgozol, ezt érdemes először átalakítani.",
            "Írd át a vegyes számot áltörtté, és csak utána oszd el az egész számmal.",
            "Osztani egy egész számmal ugyanaz, mint szorozni a reciprokával, tehát a nevező változik meg.",
          ],
        },
        {
          id: "kooszlop",
          prompt:
            "Ennyi kőoszlop veszi körül a szigetet: hány páratlan egész szám van $10$ és $26$ között?",
          fields: [
            {
              id: "kooszlopmezo",
              label: "Kőoszlopok száma",
              acceptedAnswers: ["8"],
            },
          ],
          hints: [
            "Először tisztázd, melyik a legkisebb és melyik a legnagyobb páratlan szám a megadott határok között.",
            "Írd fel őket sorban, kettesével lépkedve.",
            "A $10$ és a $26$ maga nem tartozik bele, mert a feladat a köztük lévő számokat kéri.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "16.webp",
      audio: "16.mp3",
      captionTimings: [1.03, 6.33, 8.44, 13.79, 23.53, 28.03],
      caption:
        "Nyolc. Nyolc kőoszlop állt őrt a hullámokban a harmadik sziget körül. Partra szálltak. A parton egyetlen sziklatömb magasodott: a kettéhasadt Koponyakő. Az oldalába vésve újabb üzenet várta őket: a Koponyakő árnyékától lépj napnyugat felé. Hogy hányat, azt Cirkalom megint elrejtette.",
    },
    {
      type: "exercise",
      backgroundImage: "map.webp",
      introText:
        "A Koponyakő árnyékától napnyugat felé kell lépned. Cirkalom számai megmondják, hányat.",
      exercises: [
        {
          id: "osztok",
          prompt: "Első rész: a $6$ pozitív egész osztóinak a száma.",
          fields: [
            {
              id: "osztokmezo",
              label: "Osztók száma",
              acceptedAnswers: ["4"],
            },
          ],
          hints: [
            "Nem összeadnod kell az osztókat, hanem megszámolnod őket.",
            "Írd fel sorban azokat a számokat, amelyekkel a $6$ maradék nélkül osztható.",
            "Az $1$ és maga a $6$ is osztó, ezeket szokták kifelejteni.",
          ],
        },
        {
          id: "tizedes",
          prompt: "Második rész: a $\\frac{12}{15}$ tizedes tört alakja.",
          fields: [
            {
              id: "tizedesmezo",
              label: "Tizedes tört alak",
              acceptedAnswers: ["0,8"],
            },
          ],
          hints: [
            "A törtvonal osztást jelent.",
            "Egyszerűsítsd előbb a törtet, így sokkal könnyebb lesz az osztás.",
            "Alakítsd a nevezőt tízessé, mert onnan már közvetlenül leolvasható a tizedes tört.",
          ],
        },
        {
          id: "hatvany",
          prompt: "Harmadik rész: a $36{,}25 \\cdot 10^4$ értéke egyetlen számmal.",
          fields: [
            {
              id: "hatvanymezo",
              label: "Az érték",
              acceptedAnswers: ["362500"],
            },
          ],
          hints: [
            "Tízhatvánnyal szorzol.",
            "A $10^4$ azt jelenti, hogy a tizedesvesszőt négy helyiértékkel kell jobbra tolnod.",
            "Ha közben elfogynak a számjegyek, nullákkal kell pótolnod a helyiértékeket.",
          ],
        },
        {
          id: "lepes",
          prompt:
            "Ennyi lépést tégy napnyugatnak: $b - 3a$, ahol $a = -\\frac{1}{3}$ és $b = 4$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "lepesmezo",
              label: "Lépések száma",
              acceptedAnswers: ["5"],
            },
          ],
          hints: [
            "Helyettesítsd be a megadott értékeket a kifejezésbe.",
            "Figyelj arra, hogy az $a$ értéke negatív, és ezt szorzod meg $3$-mal.",
            "Negatív számot vonsz ki, és két mínusz találkozásából plusz lesz.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "17.webp",
      audio: "17.mp3",
      captionTimings: [2.12, 3.4, 4.53, 5.94, 7.03, 8.27, 13.34, 17.84, 21.31, 24.05],
      caption:
        "Öt lépés napnyugatnak. Egy. Kettő. Három. Négy. Öt. Vidra csizmája alatt tompán megkondult a föld. A homok alól kőlap került elő, alatta lépcső vezetett a mélybe. Pí egy teljes pillanatra elhallgatott. Nála ez a legnagyobb elismerés.",
    },
    {
      type: "narration",
      image: "18.webp",
      audio: "18.mp3",
      captionTimings: [3.32, 8.07, 15.85, 22.44],
      caption:
        "A lépcső alján kőkapu állta útjukat. Közepén deltoid alakú véset, körülötte forgatható számtárcsa. A felirat rövid volt: fordíts annyit, amennyi a deltoid belső szögeinek összege. „Bemelegítésnek szánta”, mosolyodott el a lány, és a tárcsára tette a kezét.",
    },
    {
      type: "exercise",
      backgroundImage: "stone.webp",
      introText:
        "A kőkapu közepén deltoid alakú véset és egy forgatható számtárcsa. Cirkalom számai kellenek a nyitáshoz.",
      exercises: [
        {
          id: "primszam",
          prompt: "Első érték: a $60$ osztói közül a legnagyobb prímszám.",
          fields: [
            {
              id: "primszammezo",
              label: "Első érték",
              acceptedAnswers: ["5"],
            },
          ],
          hints: [
            "Előbb gyűjtsd össze a $60$ osztóit.",
            "Az osztók közül válaszd ki azokat, amelyek prímszámok.",
            "Bontsd a $60$-at prímtényezőkre, és nézd meg, melyik a legnagyobb közülük.",
          ],
        },
        {
          id: "hatvanyoszt",
          prompt: "Harmadik érték: $\\frac{2^6}{2^3}$",
          fields: [
            {
              id: "hatvanyosztmezo",
              label: "Harmadik érték",
              acceptedAnswers: ["8"],
            },
          ],
          hints: [
            "Azonos alapú hatványokat osztasz egymással.",
            "Ilyenkor az alap változatlan marad, és csak a kitevőkkel kell műveletet végezned.",
            "A kitevőket kivonod egymásból, majd számold ki a kapott hatvány értékét.",
          ],
        },
        {
          id: "vegyesmuvelet",
          prompt:
            "Negyedik érték: $\\frac{3}{4} - \\frac{5}{7} : \\frac{15}{14}$. Írd le a számolás menetét a füzetedbe!",
          fields: [
            {
              id: "vegyesmuveletmezo",
              label: "Negyedik érték",
              acceptedAnswers: ["1/12"],
            },
          ],
          hints: [
            "Több művelet van egy kifejezésben, ezért a műveleti sorrend számít.",
            "Az osztás előbbre való, mint a kivonás, tehát azzal kezdd.",
            "A törttel való osztás után hozd közös nevezőre a két törtet, és csak utána vonj ki.",
          ],
        },
        {
          id: "deltoid",
          prompt: "Ennyit fordíts a tárcsán: a deltoid belső szögeinek összege.",
          fields: [
            {
              id: "deltoidmezo",
              label: "Fordulat fokban",
              acceptedAnswers: ["360"],
            },
          ],
          hints: [
            "A deltoid egy négyszög, tehát a négyszögek tulajdonságai érvényesek rá.",
            "Bármely négyszög felbontható két háromszögre egyetlen átlóval.",
            "Egy háromszög belső szögeinek összege $180$ fok, és ebből következtethetsz a négyszögre.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "19.webp",
      audio: "19.mp3",
      captionTimings: [1.28, 5.56, 14.86, 19.88],
      caption:
        "Háromszázhatvan. Teljes kör, ahogy egy deltoidhoz illik. A tárcsa kattant, a kőkapu dübörögve félrecsúszott, odabent pedig maguktól lobbantak fel a fáklyák. Mintha a barlang már nagyon régóta várt volna valakire.",
    },
    {
      type: "narration",
      image: "20.webp",
      audio: "20.mp3",
      captionTimings: [4.04, 10.17, 14.45, 20.61, 24.93],
      caption:
        "A terem közepén két egyforma láda állt. A falon Cirkalom mester utolsó üzenete: az egyik láda csapda. Az igazi kinyílik, ha a helyes számra állítod a mutatót. És el ne felejtsd: a Törtek tengerén a nulla alatt is vannak számok. A mohó kalózok itt szoktak elbukni.",
    },
    {
      type: "exercise",
      backgroundImage: "patchment.webp",
      introText:
        "A teremben két egyforma láda áll, az egyik csapda. Az igazi zár akkor nyílik, ha a helyes számra állítod a mutatót. Ezek Cirkalom utolsó számai.",
      exercises: [
        {
          id: "lkkt",
          prompt: "Első érték: $125$ és $20$ legkisebb közös többszöröse.",
          fields: [
            {
              id: "lkktmezo",
              label: "Első érték",
              acceptedAnswers: ["500"],
            },
          ],
          hints: [
            "Olyan számot keresel, amely mindkét számnak többszöröse, és a lehető legkisebb.",
            "Bontsd prímtényezőkre a $125$-öt és a $20$-at.",
            "A közös többszörösben minden prímtényező a nagyobbik kitevővel szerepel.",
          ],
        },
        {
          id: "prim2",
          prompt: "Második érték: a legkisebb kétjegyű prímszám.",
          fields: [
            {
              id: "prim2mezo",
              label: "Második érték",
              acceptedAnswers: ["11"],
            },
          ],
          hints: [
            "A kétjegyű számok a $10$-től kezdődnek.",
            "A prímszámnak pontosan két osztója van, az $1$ és önmaga.",
            "Indulj a legkisebb kétjegyű számtól felfelé, és az elsőnél állj meg, amelyik prím. A páros számok mind kiesnek.",
          ],
        },
        {
          id: "tallerok",
          prompt: "Ennyi aranytallér van az igazi ládában: $1509$ kétharmada.",
          fields: [
            {
              id: "tallerokmezo",
              label: "Aranytallérok",
              acceptedAnswers: ["1006"],
            },
          ],
          hints: [
            "Valaminek a kétharmad része két lépésben is kiszámolható.",
            "Előbb határozd meg az egyharmadot, azt könnyebb kiszámolni.",
            "Ha megvan az egyharmad, már csak meg kell kétszerezned.",
          ],
        },
        {
          id: "zar",
          prompt:
            "Ide állítsd a zár mutatóját: $\\frac{5}{9} \\cdot \\frac{18}{20} - \\frac{3}{2}$. A Törtek tengerén a nulla alatt is vannak számok!",
          fields: [
            {
              id: "zarmezo",
              label: "A zár állása",
              acceptedAnswers: ["-1"],
            },
          ],
          hints: [
            "Először a szorzást végezd el, csak utána a kivonást.",
            "A szorzás előtt keresztbe is egyszerűsíthetsz, így sokkal kisebb számokkal dolgozhatsz.",
            "A kivonandó nagyobb, mint amiből kivonod, ezért figyelj a végeredmény előjelére.",
          ],
        },
      ],
    },
    {
      type: "narration",
      image: "21.webp",
      audio: "21.mp3",
      captionTimings: [1.44, 4.71, 12.15, 22.25, 26.92],
      caption:
        "Mínusz egy. Egyetlen rovátkával a nulla alá. A legtöbb kalóz plusz egyre állítaná, és vihetné is a csapda jutalmát, egy láda ázott kétszersültet. Az igazi zár viszont halkan kattant, a fedél felnyílt, és ezerhat aranytallér fénye töltötte be a barlangot. Pí akkorát rikkantott, hogy a denevérek is felriadtak.",
    },
    {
      type: "narration",
      image: "22.webp",
      audio: "22.mp3",
      captionTimings: [9.19, 11.42, 14.28, 21.11, 23.6],
      caption:
        "A tallérok tetején levél feküdt, Cirkalom mester írásával: ha ezt olvasod, jobb navigátor lettél, mint én valaha. A kincs a tiétek. Én már új vizeken járok. Vidra sokáig nézte a girbegurba betűket, aztán elmosolyodott, és zsebre tette a levelet. A Korallszív hazaindulhatott.",
    },
  ],
}
