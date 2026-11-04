# Terminal portfolio

Statyczny prototyp w Astro 7. About jest strona startowa `/`; pozostale zakladki to Resume, Blog i Contact. Bez frameworkow UI, zewnetrznych fontow i wykonywalnego JavaScript po stronie klienta. Jedyny element script zawiera dane SEO JSON-LD.

## Uruchomienie

Wymagany Node.js >= 22.23.4 i npm >= 9.6.5.

```powershell
cd C:\projects\PersonalWebsite
npm ci
npm run dev
```

Otworz adres wypisany przez Astro (domyslnie `http://127.0.0.1:4321`).

```powershell
npm run check
npm run build
npm test
npm run preview
```

`npm test` sprawdza gotowy `dist`, wiec najpierw wykonaj build. Na hosting statyczny wgrywaj zawartosc `dist`. Hosting musi obslugiwac katalogowe adresy URL i serwowac `404.html` dla nieistniejacych sciezek z kodem HTTP 404. Nie jest potrzebny serwer Node na produkcji.

Strona 404 ma terminalowy komunikat "Noosphere Connection Lost" i grafike ASCII; powrot do strony odbywa sie przez wspolna nawigacje. Konfiguracja `trailingSlash: 'ignore'` pozwala pokazac wlasne 404 takze dla blednych adresow bez koncowego ukosnika w dev/preview, zamiast technicznego bledu Astro. Linki, canonical i sitemap nadal korzystaja z adresow zakonczonych ukosnikiem.

## Przed publikacja

1. Skopiuj `.env.example` do `.env` i ustaw **SITE_URL** na prawdziwy publiczny origin, np. `https://twoja-domena.pl` (bez sciezki). Mozna zamiast pliku ustawic zmienna `SITE_URL` w srodowisku budowania; ma pierwszenstwo nad `.env`. To jedyne miejsce ustawiania domeny. Przebuduj po zmianie.
2. Edytuj **src/config.ts**: `profile` zawiera dane Przemyslawa Kleszcza, a `resume` doswiadczenie, umiejetnosci, wyksztalcenie i jezyki przepisane z dostarczonego CV. Zachowano daty oraz status "Present" z dokumentu; nie dopisywano niepodanych dat edukacji ani poziomow jezykowych. Prywatny adres i numer telefonu nie sa publikowane. Sam PDF nie jest kopiowany do strony ani osadzany. Teksty powitalne About sa niezalezne od tresci CV. Sprawdz aktualnosc danych przed wdrozeniem. Pusty e-mail oznacza komunikat o nieskonfigurowanym kontakcie. Linki spolecznosciowe przyjmuja postac `{ label: 'GitHub', url: 'https://...' }`.
3. Zastap lub usun przykladowe wpisy blogowe. Flaga `example` oznacza je czytelnie w UI.
4. Opcjonalnie zastap `public/social-card.png` wlasna grafika 1200 x 630. Obecna grafika jest celowo neutralna, bez przykladowej tozsamosci; jej edytowalne zrodlo to `public/social-card.svg`. Po edycji SVG trzeba ponownie wyeksportowac PNG.

Bez skonfigurowanego originu strona uzywa zarezerwowanego `https://example.invalid`, ma **noindex, nofollow**, a robots blokuje indeksowanie. To celowa ochrona prototypu. Ustawienie prawdziwego `SITE_URL` wlacza indeksowanie; nie jest zapewnieniem pozycji ani natychmiastowej indeksacji. Przed wdrozeniem nalezy samodzielnie zweryfikowac dane i domene.

Zdjecie przy Resume znajduje sie w `src/assets/przemyslaw-kleszcz.jpg`. To portretowy kadr z dostarczonego zdjecia, bez metadanych oryginalu. Astro podczas budowania tworzy male warianty WebP 176 i 352 px; oryginalna fotografia nie trafia do `dist`. Aby zmienic portret, zastap ten plik, zachowujac proporcje 4:5.

Tlo panelu About pochodzi z `src/assets/main-background.png`. Astro generuje WebP o szerokosci 720 i 1440 px; telefon pobiera mniejszy wariant. Zdjecie jest osobna warstwa `main::before` z `opacity: .18` w `src/styles/global.css`, wiec tekst pozostaje w pelni kryjacy. Tlo nie obejmuje nawigacji, stopki, innych podstron ani wydruku.

## Dodawanie wpisow

Utworz plik `src/content/blog/moj-wpis.md`:

```markdown
---
title: "Tytul wpisu"
description: "Krotki, unikalny opis do indeksu, RSS i wyszukiwarek."
pubDate: 2026-11-04
tags: ["astro", "notes"]
draft: false
example: false
---

Pierwszy akapit.

## Naglowek sekcji

Tresci w zwyklym Markdown, takze listy, tabele, obrazki i bloki kodu.
```

Adres powstaje z nazwy pliku: `/blog/moj-wpis/`. Frontmatter jest walidowany przez kolekcje Astro. Opcjonalne `updatedDate` nie moze byc wczesniejsze niz `pubDate`. Daty wyswietlane sa w UTC. Wpisy z `draft: true` lub przyszla data nie trafiaja do indeksu, routingu ani RSS (aby opublikowac zaplanowany wpis, trzeba ponownie uruchomic build). Dla nowego wpisu zacznij od `##`, bo `h1` generuje szablon.

Obrazki mozna importowac wzglednie w Markdown, aby Astro zoptymalizowalo je podczas budowania; zawsze podawaj sensowny tekst alternatywny. Zwykle lokalne zasoby umieszczaj w `public/`.

## SEO i wydajnosc

Kazda strona ma wlasny tytul/opis, canonical, Open Graph, Twitter card i JSON-LD. Wpisy maja date publikacji/aktualizacji oraz schemat BlogPosting. Dostepne sa `/rss.xml`, `/robots.txt`, `/sitemap-index.xml` i statyczne 404. RSS zawiera streszczenia i linki do pelnych wpisow. Kanoniczne adresy sa zakonczone ukosnikiem.

Nawigacja to normalne linki, bez animowanych przejsc, przechwytywania klikniec, routera ani hydracji. Systemowy monospace, maly lokalny CSS, bez analityki, cookies, fetchowania danych ani zewnetrznych polaczen. Jedyna animacja to migajacy kursor, wykonany wylacznie w CSS. Respektuje `prefers-reduced-motion`; przy ograniczonym ruchu i na wydruku kursor pozostaje statyczny. Wyglad korzysta dokladnie z akcentu `#0d699e`; czytelny tekst na ciemnym tle pozostaje jasny. Systemowe fonty moga sie nieznacznie roznic miedzy platformami.

Na hostingu wlacz kompresje Brotli/gzip, HTTPS oraz dlugi cache dla hashowanych plikow `/_astro/`. HTML i RSS powinny miec krotszy cache. To konfiguracja hostingu, nie kod wykonywany przez odwiedzajacego.
