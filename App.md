# Colors

slate-800: #1D293D
slate-700: #314158
slate-600: #45556C
orange: #FF8102

# App

Tło aplikacji ma kolor slate-800
W aplikacji używany 3 kolorów: białego, slate-600 i orange

kolor orange - to kolor zaznaczenia i aktynwgo przycisku
kolor slate-600 - to kolor nieaktywny

# Ekran 1

patrz (screen-0.jpg)

# Ekran 2

patrz (screen-1.jpg)

Przycisk "Continue" jest nieaktywny do czasu zaznaczenia ilu jest graczy i wypełnienia ich imion

# Ekran 3

patrz (screen-2.jpg, screen-3.jpg)

Przed każdą rundą gracza pokazujemy ekran z aktualnym wynikiem gracza, tak aby mógł zobaczyć jakich kombinacji mu jeszcze brakuje.

Na górze pokazujemy Imię gracza, aktualną rundę

W tabeli wymieniamy wszystkie możliwe kombinacje i szarymi polami w kolorze slate-600 zaznaczamy które kombinacje są nadal konieczne do wyrzucenia.
a w kolorze slate-800 te które już zostały wyrzucone i podajemy wartość punktową oraz sumujemy

Pola bonus posiadają ikonę korony i tło w kolorze slate-700

# Ekran gry

patrz (screen-4.jpg, screen-5.jpg)

Podczas swojej rundy każdy gracz dostaje widok 5 kostek, gdzie zaznacza jakie wartości wyrzucił

Poniżej aplikacja sprawdza wszystkie możliwe punktowane kombinacje na podstawie zaznaczonych kostek z możliwością wybrania przez gracza tej odpowiedniej.

Aplikacja powinna sprawdzać które kombinacje zostały już wyrzucone i pokazywać tylko te możliwe do zaznaczenia. Sortując wg najlepiej punktowanych.

Jeżeli z wyrzuconych kostek nie da się ułożyć żadnej kombinacji. Aplikacja powinna pokazać wszystkie pozostałe kombinacje z opcją wybrania 0pkt

Do czasu zaznaczenia kostek i wybrania kombinacji, przycisk "Continue" jest nieaktywny

# Podsumowanie

patrz (screen-6.jpg)

Po 13 rundach Aplikacja pokazuje posortowaną tablicę wyników