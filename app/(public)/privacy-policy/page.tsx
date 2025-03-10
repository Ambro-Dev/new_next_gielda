import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type Props = {};

const ProvacyPolicy = (props: Props) => {
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="text-center p-5">
          Polityka prywatności opisuje zasady przetwarzania przez nas informacji
          na Twój temat, w tym danych osobowych oraz ciasteczek, czyli tzw.
          cookies.
        </CardTitle>
      </CardHeader>
      <CardContent className="px-10 text-justify">
        <ol className="list-decimal list-outside space-y-8">
          <li className="space-y-4 text-xl">
            <strong>Informacje ogólne</strong>
            <div className="space-y-2 text-sm">
              <p>
                Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod
                adresem url: <b>gielda.fenilo.pl</b>
              </p>{" "}
              <p>
                Operatorem serwisu oraz Administratorem danych osobowych jest:
                Fenilo sp. z.o.o Szlak 77/222, 31-153, Kraków
              </p>{" "}
              <p>
                Adres kontaktowy poczty elektronicznej operatora:
                fenilo@fenilo.pl
              </p>
              <p>
                Operator jest Administratorem Twoich danych osobowych w
                odniesieniu do danych podanych dobrowolnie w Serwisie.
              </p>{" "}
              <p>Serwis wykorzystuje dane osobowe w następujących celach:</p>
              <ul className="list-disc list-outside ml-5">
                <li>Prowadzenie rozmów typu chat online</li>
                <li>Prezentacja profil użytkownika innym użytkownikom</li>
                <li>Wyświetlanie ogłoszeń użytkowników</li>
                <li>Obsługa zapytań przez formularz</li>
                <li>Prezentacja oferty lub informacji</li>
              </ul>
            </div>
            <div className="space-y-2 text-sm">
              <p>Serwis wykorzystuje dane osobowe w następujących celach:</p>
              <ul className="list-none list-outside ml-5">
                <li>
                  Poprzez dobrowolnie wprowadzone w formularzach dane, które
                  zostają wprowadzone do systemów Operatora.
                </li>
                <li>
                  Poprzez zapisywanie w urządzeniach końcowych plików cookie
                  (tzw. „ciasteczka”).
                </li>
              </ul>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>
              Wybrane metody ochrony danych stosowane przez Operatora
            </strong>
            <div className="space-y-2 text-sm">
              <p>
                Miejsca logowania i wprowadzania danych osobowych są chronione w
                warstwie transmisji (certyfikat SSL). Dzięki temu dane osobowe i
                dane logowania, wprowadzone na stronie, zostają zaszyfrowane w
                komputerze użytkownika i mogą być odczytane jedynie na docelowym
                serwerze.
              </p>
              <p>
                Dane osobowe przechowywane w bazie danych są zaszyfrowane w taki
                sposób, że jedynie posiadający Operator klucz może je odczytać.
                Dzięki temu dane są chronione na wypadek wykradzenia bazy danych
                z serwera.
              </p>
              <p>
                Hasła użytkowników są przechowywane w postaci hashowanej.
                Funkcja hashująca działa jednokierunkowo - nie jest możliwe
                odwrócenie jej działania, co stanowi obecnie współczesny
                standard w zakresie przechowywania haseł użytkowników.
              </p>
              <p>Operator okresowo zmienia swoje hasła administracyjne.</p>

              <p>
                Istotnym elementem ochrony danych jest regularna aktualizacja
                wszelkiego oprogramowania, wykorzystywanego przez Operatora do
                przetwarzania danych osobowych, co w szczególności oznacza
                regularne aktualizacje komponentów programistycznych.
              </p>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>Hosting</strong>
            <p className="space-y-2 text-sm">
              Serwis jest hostowany (technicznie utrzymywany) na serwerach
              operatora: nazwa.pl
            </p>
          </li>
          <li className="space-y-4 text-xl">
            <strong>
              Twoje prawa i dodatkowe informacje o sposobie wykorzystania danych
            </strong>
            <div className="space-y-2 text-sm">
              <p>
                W niektórych sytuacjach Administrator ma prawo przekazywać Twoje
                dane osobowe innym odbiorcom, jeśli będzie to niezbędne do
                wykonania zawartej z Tobą umowy lub do zrealizowania obowiązków
                ciążących na Administratorze. Dotyczy to takich grup odbiorców:
              </p>
              <ul className="list-disc list-outside ml-5">
                <li>organy publiczne</li>
                <li>
                  upoważnieni pracownicy i współpracownicy, którzy korzystają z
                  danych w celu realizacji celu działania strony
                </li>
              </ul>
              <p>
                Twoje dane osobowe przetwarzane przez Administratora nie dłużej,
                niż jest to konieczne do wykonania związanych z nimi czynności
                określonych osobnymi przepisami (np. o prowadzeniu
                rachunkowości). W odniesieniu do danych marketingowych dane nie
                będą przetwarzane dłużej niż przez 3 lata.
              </p>
              <p>Przysługuje Ci prawo żądania od Administratora:</p>
              <ul className="list-disc list-outside ml-5">
                <li>dostępu do danych osobowych Ciebie dotyczących,</li>
                <li>ich sprostowania,</li>
                <li>usunięcia,</li>
                <li>ograniczenia przetwarzania,</li>
                <li>oraz przenoszenia danych.</li>
              </ul>
              <p>
                Przysługuje Ci prawo do złożenia sprzeciwu w zakresie
                przetwarzania wskazanego w pkt 3.3 c) wobec przetwarzania danych
                osobowych w celu wykonania prawnie uzasadnionych interesów
                realizowanych przez Administratora, w tym profilowania, przy
                czym prawo sprzeciwu nie będzie mogło być wykonane w przypadku
                istnienia ważnych prawnie uzasadnionych podstaw do
                przetwarzania, nadrzędnych wobec Ciebie interesów, praw i
                wolności, w szczególności ustalenia, dochodzenia lub obrony
                roszczeń.
              </p>
              <p>
                Na działania Administratora przysługuje skarga do Prezesa Urzędu
                Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.
              </p>
              <p>
                Podanie danych osobowych jest dobrowolne, lecz niezbędne do
                obsługi Serwisu.
              </p>
              <p>
                W stosunku do Ciebie mogą być podejmowane czynności polegające
                na zautomatyzowanym podejmowaniu decyzji, w tym profilowaniu w
                celu świadczenia usług w ramach zawartej umowy oraz w celu
                prowadzenia przez Administratora marketingu bezpośredniego.
              </p>
              <p>
                Dane osobowe nie są przekazywane od krajów trzecich w rozumieniu
                przepisów o ochronie danych osobowych. Oznacza to, że nie
                przesyłamy ich poza teren Unii Europejskiej.
              </p>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>Informacje w formularzach</strong>
            <div className="space-y-2 text-sm">
              <p>
                Serwis zbiera informacje podane dobrowolnie przez użytkownika, w
                tym dane osobowe, o ile zostaną one podane.
              </p>
              <p>
                Serwis może zapisać informacje o parametrach połączenia
                (oznaczenie czasu, adres IP).
              </p>
              <p>
                Serwis, w niektórych wypadkach, może zapisać informację
                ułatwiającą powiązanie danych w formularzu z adresem e-mail
                użytkownika wypełniającego formularz. W takim wypadku adres
                e-mail użytkownika pojawia się wewnątrz adresu url strony
                zawierającej formularz.
              </p>
              <p>
                Dane podane w formularzu są przetwarzane w celu wynikającym z
                funkcji konkretnego formularza, np. w celu dokonania procesu
                obsługi zgłoszenia serwisowego lub kontaktu handlowego,
                rejestracji usług itp. Każdorazowo kontekst i opis formularza w
                czytelny sposób informuje, do czego on służy.
              </p>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>Logi Administratora</strong>
            <div className="space-y-2 text-sm">
              <p>
                Informacje zachowaniu użytkowników w serwisie mogą podlegać
                logowaniu. Dane te są wykorzystywane w celu administrowania
                serwisem.
              </p>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>Istotne techniki marketingowe</strong>
            <div className="space-y-2 text-sm">
              <p>
                Operator stosuje analizę statystyczną ruchu na stronie, poprzez
                Google Analytics (Google Inc. z siedzibą w USA). Operator nie
                przekazuje do operatora tej usługi danych osobowych, a jedynie
                zanonimizowane informacje. Usługa bazuje na wykorzystaniu
                ciasteczek w urządzeniu końcowym użytkownika. W zakresie
                informacji o preferencjach użytkownika gromadzonych przez sieć
                reklamową Google użytkownik może przeglądać i edytować
                informacje wynikające z plików cookies przy pomocy narzędzia:
                https://www.google.com/ads/preferences/
              </p>
              <p>
                Operator stosuje rozwiązanie badające zachowanie użytkowników
                poprzez tworzenie map ciepła oraz nagrywanie zachowania na
                stronie. Te informacje są anonimizowane zanim zostaną przesłane
                do operatora usługi tak, że nie wie on jakiej osoby fizycznej
                one dotyczą. W szczególności nagrywaniu nie podlegają wpisywane
                hasła oraz inne dane osobowe.
              </p>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>Informacja o plikach cookies</strong>
            <div className="space-y-2 text-sm">
              <p>Serwis korzysta z plików cookies.</p>
              <p>
                Pliki cookies (tzw. „ciasteczka”) stanowią dane informatyczne, w
                szczególności pliki tekstowe, które przechowywane są w
                urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do
                korzystania ze stron internetowych Serwisu. Cookies zazwyczaj
                zawierają nazwę strony internetowej, z której pochodzą, czas
                przechowywania ich na urządzeniu końcowym oraz unikalny numer.
              </p>
              <p>
                Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika
                Serwisu pliki cookies oraz uzyskującym do nich dostęp jest
                operator Serwisu.
              </p>
              <p>Pliki cookies wykorzystywane są w następujących celach:</p>
              <ul className="list-disc list-outside ml-5">
                <li>
                  utrzymanie sesji użytkownika Serwisu (po zalogowaniu), dzięki
                  której użytkownik nie musi na każdej podstronie Serwisu
                  ponownie wpisywać loginu i hasła;
                </li>
                <li>
                  realizacji celów określonych powyżej w części &quot;Istotne
                  techniki marketingowe&quot;;
                </li>
              </ul>
              <p>
                W ramach Serwisu stosowane są dwa zasadnicze rodzaje plików
                cookies: „sesyjne” (session cookies) oraz „stałe” (persistent
                cookies). Cookies „sesyjne” są plikami tymczasowymi, które
                przechowywane są w urządzeniu końcowym Użytkownika do czasu
                wylogowania, opuszczenia strony internetowej lub wyłączenia
                oprogramowania (przeglądarki internetowej). „Stałe” pliki
                cookies przechowywane są w urządzeniu końcowym Użytkownika przez
                czas określony w parametrach plików cookies lub do czasu ich
                usunięcia przez Użytkownika.
              </p>
              <p>
                Oprogramowanie do przeglądania stron internetowych (przeglądarka
                internetowa) zazwyczaj domyślnie dopuszcza przechowywanie plików
                cookies w urządzeniu końcowym Użytkownika. Użytkownicy Serwisu
                mogą dokonać zmiany ustawień w tym zakresie. Przeglądarka
                internetowa umożliwia usunięcie plików cookies. Możliwe jest
                także automatyczne blokowanie plików cookies Szczegółowe
                informacje na ten temat zawiera pomoc lub dokumentacja
                przeglądarki internetowej.
              </p>
              <p>
                Ograniczenia stosowania plików cookies mogą wpłynąć na niektóre
                funkcjonalności dostępne na stronach internetowych Serwisu.
              </p>
              <p>
                Pliki cookies zamieszczane w urządzeniu końcowym Użytkownika
                Serwisu wykorzystywane mogą być również przez współpracujące z
                operatorem Serwisu podmioty, w szczególności dotyczy to firm:
                Google (Google Inc. z siedzibą w USA), Facebook (Facebook Inc. z
                siedzibą w USA), Twitter (Twitter Inc. z siedzibą w USA).
              </p>
            </div>
          </li>
          <li className="space-y-4 text-xl">
            <strong>
              Zarządzanie plikami cookies – jak w praktyce wyrażać i cofać
              zgodę?
            </strong>
            <div className="space-y-2 text-sm">
              <p>
                Jeśli użytkownik nie chce otrzymywać plików cookies, może
                zmienić ustawienia przeglądarki. Zastrzegamy, że wyłączenie
                obsługi plików cookies niezbędnych dla procesów
                uwierzytelniania, bezpieczeństwa, utrzymania preferencji
                użytkownika może utrudnić, a w skrajnych przypadkach może
                uniemożliwić korzystanie ze stron www
              </p>
              <p>
                W celu zarządzania ustawienia cookies wybierz z listy poniżej
                przeglądarkę internetową, której używasz i postępuj zgodnie z
                instrukcjami:
              </p>
              <ul className="list-disc list-outside ml-5">
                <li>
                  <a
                    href="https://support.microsoft.com/pl-pl/help/10607/microsoft-edge-view-delete-browser-history"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Edge
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/pl-pl/help/278835/how-to-delete-cookie-files-in-internet-explorer"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Internet Explorer
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647?hl=pl"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/pl/kb/usuwanie-ciasteczek"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://help.opera.com/pl/latest/web-preferences/#cookies"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Opera
                  </a>
                </li>
              </ul>
              <p>Urządzenia mobilne:</p>
              <ul className="list-disc list-outside ml-5">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647?hl=pl"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Android
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/pl-pl/HT201265"
                    className="hover:text-amber-500"
                    target="_blank"
                  >
                    Safari (iOS)
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <p className="text-sm text-justify">
            Niniejszy wzór polityki został wygenerowany bezpłatnie, w celach
            informacyjnych, w oparciu o naszą wiedzę, branżowe praktyki i
            przepisy prawa obowiązujące na dzień 2018-08-14. Zalecamy
            sprawdzenie wzoru polityki przed użyciem jej na stronie. Wzór opiera
            się na najczęściej występujących na stronach internetowych
            sytuacjach, ale może nie odzwierciedlać pełnej i dokładnej specyfiki
            Twojej strony www. Przeczytaj uważnie wygenerowany dokument i w
            razie potrzeb dostosuj go do Twojej sytuacji lub zasięgnij porady
            prawnej. Nie bierzemy odpowiedzialności za skutki posługiwania się
            tym dokumentem, ponieważ tylko Ty masz wpłw na to, czy wszystkie
            informacje w nim zawarte są zgodne z prawdą. Zwróć także uwagę, że
            Polityka Prywatności, nawet najlepsza, jest tylko jednym z elementów
            Twojej troski o dane osobowe i prywatność użytkownika na stronie
            www.
          </p>
        </ol>
      </CardContent>
    </Card>
  );
};

export default ProvacyPolicy;
