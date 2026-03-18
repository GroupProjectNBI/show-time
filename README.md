# 🎬 ShowTime (Filmvisarna)
[Länk till repot](https://github.com/GroupProjectNBI/show-time)
**Group E/5:**
* [Jarl (@webcrunch)](https://github.com/webcrunch)
* [Edvin (@Grevendev)](https://github.com/Grevendev)
* [Kifle (@KHS1993)](https://github.com/KHS1993)
* [Cecilia (@ceccav)](https://github.com/ceccav)
* [Zhaneta (@Zhaneta-Lecini)](https://github.com/Zhaneta-Lecini)

Ett komplett och modernt bokningssystem för en biograf som en del av grupparbetet i kursen Datadrivna Applikationer. Projektet hanterar allt från dynamisk schemaläggning av filmer och sätesbokning, till AI-drivna filmtips och automatiska e-postbekräftelser.

## Dokumentation

Utöver README filen innehåller projektet ytterligare dokumentation allt samlat i mappen "documents".

* TECHDEBT - rapport för den tekniska skuld som gruppen upplever att vi haft under arbetets gång.

* README-DYNDATA 



---

## ✨ Nyckelfunktioner (Features)

* Dynamiskt Bioprogram: Frontend som hämtar och filtrerar aktuella visningar blixtsnabbt (utan caching-spöken!).

* Evighetsmaskinen (Auto-Scheduling): Databasen är självkörande. Ett SQL-event körs varje natt kl. 03:00 och kopierar förra veckans schema till nästa vecka, med inbyggt skydd mot krockar (Filmlängd + 30 minuter städning).

* Sätesbokning & Bekräftelser: Visuellt gränssnitt för att boka platser. Bekräftelsemail skickas automatiskt ut via Mailpit (lokal SMTP-server).

* AI-Assistent: Integrerad AI-chatt som hjälper besökare att hitta rätt film.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, TailwindCSS, Vite
* **Backend:** C# .NET Minimal API
* **Databas:** MySQL 
* **Verktyg:** Docker, Mailpit, GitHub Actions (CI/CD)

---

## 📋 Förberedelser (Prerequisites)

För att köra detta projekt lokalt behöver du ha följande installerat:
* [Node.js](https://nodejs.org/) (v18+)
* [.NET 1o SDK](https://dotnet.microsoft.com/)
* [MySQL](https://www.mysql.com/)  
* [Docker Desktop](https://www.docker.com/) (rekommenderas men inget krav )

---

## 🚀 Kom igång lokalt (Utan Docker)

Om du vill köra alla delar separat på din maskin:

### 1. Databasen
1. Skapa en lokal MySQL-databas.
2. Sätt upp projektet: Beroende på om du kör docker eller lokalt så sätter du upp det olika.
 
Lokalt:
Skapa/kopiera filen db-config.json och fyll i dina uppgifter till databsen , email och AI-tjänst.
 
{
    "host": "xxxxxxx",
    "port": ,
    "username": "xxx",
    "password": "xxxxx",
    "database": "xxxx",
    "createTablesIfNotExist": true,
    "seedDataIfEmpty": true,
    "aiAccessToken": "xxxxx",  
    "smtpServer": "",
    "smtpPort": ,
    "emailUsername": "",
    "emailPassword": ""
}
 
Vid användande av MailPit istället för gmail så behöver du en extra nyckel:
 
useMailPit: true
 
Vid start av projektet sker uppkopplingen och hämtningen av data per automatik. Förutsatt att projektet satts upp korrekt.

###  3. Backend (C#)
Gå till backend-mappen: cd backend

Skapa/kopiera filen db-config.json och fyll i dina lokala databasuppgifter.

Starta servern:

Bash
dotnet run
4. Frontend (React)
Gå till frontend-mappen: cd frontend

Installera beroenden: npm install

Starta utvecklingsservern:

Bash
npm run dev

### 🐳 Kom igång med Docker (Enklaste vägen)
För en blixtsnabb setup med databas och Mailpit färdigkonfigurerat:

Se till att Docker är igång.

I projektets rotmapp, kör:

Bash
docker-compose up -d
Detta startar:

MySQL-databasen på port 3306.

Mailpit (Webb-UI på localhost:8025, SMTP på 1025).

Starta sedan Frontend och Backend manuellt enligt instruktionerna ovan (eller via Docker om ni har byggt containers för dem också!).

---

## 📊 Databasmodell (ER-diagram)

Vår databas är en normaliserad relationsdatabas, designad för att vara både robust och skalbar. Modellen nedan illustrerar hur kärnentiteterna i vårt system – såsom filmer, salonger, dynamiska filmvisningar, recensioner och detaljerade stolbokningar – är sammankopplade via tydliga relationer och kopplingstabeller.

```mermaid
erDiagram
    %% Relationer
    AVATAR ||--o{ USER : "uses"
    USER ||--o{ BOOKING : "makes"
    THEATER ||--o{ SEAT : "contains"
    THEATER ||--o{ SCREENING : "hosts"
    MOVIE ||--o{ SCREENING : "is shown in"
    SCREENING ||--o{ BOOKING : "has"
    BOOKING ||--|{ TICKET : "contains"
    SEAT ||--o{ TICKET : "is booked as"
    TICKETTYPE ||--o{ TICKET : "defines"
    MOVIE ||--o{ REVIEW : "receives"
    
    %% Kopplingstabeller för Många-till-Många
    MOVIE ||--o{ MOVIETOCATEGORY : "has"
    CATEGORY ||--o{ MOVIETOCATEGORY : "belongs to"
    MOVIE ||--o{ MOVIETOACTOR : "features"
    ACTOR ||--o{ MOVIETOACTOR : "acts in"

    %% Tabeller
    USER {
        int id PK
        string userName
        string email UK
        string password
        int avatarUrl FK
        enum role
        date created
    }

    AVATAR {
        int id PK
        string Url
    }

    MOVIE {
        int id PK
        string title
        text description
        time duration
        enum ageLimit
        string language
        datetime dateRelease
        string trailerUrl
        date productionYear
        string distributor
        boolean subtitles
        boolean popular
    }

    THEATER {
        int id PK
        enum name
        int amountOfSeats
        int seatsPerRow
    }

    SEAT {
        int id PK
        int row
        int number
        int theaterId FK
        enum seatType
    }

    SCREENING {
        int id PK
        date date
        timestamp startTime
        int theaterId FK
        int movieId FK
    }

    BOOKING {
        int id PK
        int ScreeningId FK
        timestamp createdAtUTC
        boolean status
        timestamp bookingDate
        int totalAmount
        string email FK
    }

    TICKET {
        int id PK
        int bookingId FK
        int seatId FK
        int ticketType FK
        int price
    }

    TICKETTYPE {
        int id PK
        string name
        int basePrice
    }

    REVIEW {
        int id PK
        decimal gradingOfStars
        string description
        string author
        int movieId FK
    }

    ACTOR {
        int id PK
        string name
        string country
        string bio
    }

    CATEGORY {
        int id PK
        string type
    }

    MOVIETOCATEGORY {
        int id PK
        int movieId FK
        int categoryId FK
    }

    MOVIETOACTOR {
        int id PK
        int actorId FK
        int movieId FK
    }
```


## 🚀 CI/CD & Security
Vår pipeline är designad för säker och smidig continuous delivery till vår live-server:
* **GitHub Actions:** Hanterar automatisk deployment av applikationen till produktionsmiljön när ny kod slås ihop med `main`-branchen.
* **HashiCorp Vault:** Istället för att förlita oss på standardlösningar hanterar vi våra databas-strängar och API-nycklar (secrets) via HashiCorp Vault. Detta säkerställer en enterprise-klassad säkerhet under hela deployment-processen och innebär att inga känsliga uppgifter någonsin exponeras.

### 🧠 Arkitektur & Smarta Lösningar

Varför krockar aldrig våra filmer?
Systemet använder ett noga uträknat SQL-event. Istället för att manuellt lägga in filmer, har vi en "Golden Week" inskriven i databasen. Eventet använder en WHERE NOT EXISTS-koll samt kontrollerar tiden med logiken (startTime + duration + 30 minuter buffer) för att säkerställa att personalen hinner städa salongen innan nästa film börjar!

## Planerat men ej genomfört arbete

Refaktorera systemet ur ett säkerhetsperspektiv, för att kunna uppfylla de krav som kommer med lagar och förordningar som exempelvis GDPR, NIST2 med flera. Men också för att stärka upp våra sårbarheter mot eventuella cyber attacker.

Gruppen har planerat och påbörjat en fullt utvecklad admin sida för att kunna hantera admin-funtkioner så som: Att lägga till och justera visningstider för en film, justera priser för snacks, hantera bokningar, ta bort användarkonton på begäran, skapa och hantera åtkomster för admin-konton.

Vidareutvecklingen därifrån är implementationen av en funktion som gör det möjligt att skapa/hantera olika typer av event genom admin sidan, ett exempel på ett event skulle kunna vara: ''Scary Tuesdays'' där värden lägger ihop film, salong, snacks och tider i ett event som kan ske en eller upprepade gånger. 

Det finns även en idé om att utefter säsong/ högtid kunna ändra utseendet på hela applikationen. Snöflingor och julfilmer i december, sommarklassiker för regniga dagar med flera. 