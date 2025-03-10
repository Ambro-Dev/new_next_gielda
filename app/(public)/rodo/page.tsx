import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center py-5">
          Zgoda na przetwarzanie danych osobowych
        </CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
        <p
          className="indent-10 whitespace-normal break-normal hyphens-auto"
          lang="pl"
        >
          Na podstawie art. 6 ust. 1 lit. a, art. 9 ust. 2 lit. a rozporządzenia
          Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016
          r.{" "}
          <i>
            w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych
            osobowych i w sprawie swobodnego przepływu takich danych oraz
            uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie
            danych)
          </i>
          Dz. Urz. UE L 119/1, z 4.5.2016, zwanego dalej „RODO” wyrażam zgodę na
          przetwarzanie następujących kategorii moich danych osobowych (imię,
          nazwisko, telefon, mail, adres). Podanie przeze mnie danych osobowych
          jest dobrowolne.
        </p>
        <br />
        <p
          className="indent-10 whitespace-normal break-normal hyphens-auto"
          lang="pl"
        >
          Podane przeze mnie dane osobowe będą przetwarzane wyłącznie w celach
          szkoleniowych i na potrzeby firmy Fenilo Sp. z o.o. oraz do wysyłania
          drogą komunikacji elektronicznej ofert związanych z działalnością
          szkoleniową oraz ubezpieczeniową. Jest mi wiadomym, że posiadam prawo
          do:
        </p>
        <br />
        <ol className="list-decimal space-y-2 px-5">
          <li>
            żądania od wskazanego w niniejszym oświadczeniu administratora
            danych osobowych:
            <ul className="list-disc list-outside ml-5">
              <li>dostępu do moich danych osobowych;</li>
              <li>sprostowania moich danych osobowych;</li>
              <li>
                usunięcia moich danych osobowych, jeżeli zachodzi jedna z
                okoliczności wskazanych w art. 17 ust. 1 RODO i jeżeli
                przetwarzanie moich danych osobowych nie jest niezbędne w
                zakresie wskazanym w art. 17 ust. 3 RODO;
              </li>
              <li>
                ograniczenia przetwarzania moich danych osobowych w przypadkach
                wskazanych w art. 18 ust. 1 RODO,
              </li>
            </ul>
          </li>
          <li>
            wniesienia do wskazanego w niniejszym oświadczeniu administratora
            danych osobowych sprzeciwu wobec przetwarzania moich danych
            osobowych:
            <ul className="list-disc list-outside ml-5">
              <li>
                na potrzeby marketingu bezpośredniego, w tym profilowania, w
                zakresie, w jakim przetwarzanie jest związane z takim
                marketingiem bezpośrednim,
              </li>
              <li>
                do celów badań naukowych lub historycznych lub do celów
                statystycznych na mocy art. 89 ust. 1 RODO, z przyczyn
                związanych z moją szczególną sytuacją, chyba że przetwarzanie
                jest niezbędne do wykonania zadania realizowanego w interesie
                publicznym.
              </li>
            </ul>
          </li>
          <li>przenoszenia moich danych osobowych,</li>
          <li>
            wniesienia skargi do organu nadzorczego, tj. do Prezesa Urzędu
            Ochrony Danych Osobowych, w przypadku uznania, że przetwarzanie
            moich danych osobowych narusza przepisy RODO,
          </li>
          <li>
            wycofania w dowolnym momencie zgody na przetwarzanie moich danych
            osobowych.
          </li>
        </ol>
        <br />
        <p
          className="indent-10 whitespace-normal break-normal hyphens-auto"
          lang="pl"
        >
          Zapoznałam/em się z informacjami dotyczącymi przetwarzania moich
          danych osobowych zgodnie z art. 13 i 14 rozporządzenia Parlamentu
          Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.{" "}
          <i>
            w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych
            osobowych i w sprawie swobodnego przepływu takich danych oraz
            uchylenia dyrektywy 95/46/WE
          </i>{" "}
          (dalej: RODO), zamieszczonymi na stronie internetowej MNiSW w zakładce
          Komunikaty.
        </p>
      </CardContent>
    </Card>
  );
};

export default Page;
