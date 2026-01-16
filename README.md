# UNIfy Frontend  
Interfață web pentru sistemul de management al evenimentelor universitare

UNIfy Frontend reprezintă partea de interfață a platformei **UNIfy**, responsabilă pentru afișarea evenimentelor, interacțiunea utilizatorilor și comunicarea cu backend-ul prin API-uri securizate. Aplicația oferă o experiență modernă și intuitivă pentru studenți, organizatori și administratori.

Proiect realizat de echipa **EventLords**.


## Scopul aplicației

Scopul principal al frontend-ului este de a oferi:
- o interfață clară și ușor de utilizat pentru descoperirea și gestionarea evenimentelor  
- suport pentru roluri diferite de utilizator (student, organizator, administrator)  
- integrare completă cu backend-ul prin servicii API  
- o experiență vizuală modernă, adaptată atât pentru desktop, cât și pentru dispozitive mobile  
- interacțiune cu un chatbot AI pentru asistență și recomandări personalizate  


## Funcționalități principale

### Pentru studenți
- Vizualizarea evenimentelor în listă și calendar interactiv  
- Filtrare și căutare evenimente după tip, dată, facultate și organizator  
- Vizualizarea detaliilor complete ale unui eveniment  
- Înscriere la evenimente și afișarea codului QR pentru check-in  
- Gestionarea listei de evenimente favorite  
- Vizualizarea notificărilor și reminderelor  
- Oferirea de feedback după participare  
- Recomandări personalizate afișate în dashboard  
- Interacțiune cu chatbot-ul AI pentru întrebări despre evenimente, înscrieri și recomandări  

### Pentru organizatori
- Creare și editare evenimente din interfața web  
- Vizualizarea participanților pentru fiecare eveniment  
- Încărcarea și gestionarea materialelor asociate evenimentelor  
- Vizualizarea statisticilor de bază despre evenimente  

### Pentru administratori
- Panou de control pentru validarea evenimentelor  
- Gestionarea utilizatorilor și a cererilor de organizator  
- Vizualizarea rapoartelor și statisticilor generale  



## Tehnologii folosite

- React  
- TypeScript  
- Vite  
- Tailwind CSS  
- Axios (pentru comunicarea cu backend-ul)  
- React Router  
- QR Code Generator / Scanner  

## Suport pentru mobile (Responsive Design)

Aplicația este optimizată pentru afișare atât pe:
- Desktop  
- Tablete  
- Telefoane mobile  

Interfața se adaptează automat în funcție de dimensiunea ecranului, asigurând o experiență consistentă pentru utilizatori indiferent de dispozitivul folosit.



## Structura proiectului

Structura frontend-ului este organizată modular, pe funcționalități și roluri:

```txt
src/
├── components/        # Componente UI reutilizabile
│   ├── ChatAssistant # Chatbot AI
│   ├── ui
│   └── events
│
├── features/          # Funcționalități separate pe roluri
│   ├── students
│   ├── organizer
│   ├── admin
│   └── auth
│
├── layouts/           # Layout-uri pentru fiecare tip de utilizator
│   ├── StudentLayout
│   ├── OrganizerLayout
│   └── DashboardLayout
│
├── pages/             # Pagini generale (Home, Login, Register etc.)
├── services/         # Servicii API (auth, events, notifications, AI, etc.)
├── router/           # Configurare rute aplicație
├── types/            # Tipuri TypeScript globale
├── utils/            # Funcții utilitare
├── App.tsx
└── main.tsx

```

## Cerințe de rulare

Node.js 18+
npm
Browser modern (Chrome, Edge, Firefox)

## Instalare

Accesează folderul frontend:
```
cd UNIfy-frontend
```


## Instalează dependențele:
```
npm install
```

## Creează fișierul .env în rădăcina proiectului:
```
VITE_API_URL=http://localhost:3000
```

## Pornește aplicația în modul development:
```
npm run dev
```
## Acces aplicație

După pornire, aplicația este disponibilă la:
```
http://localhost:5173
```

Aplicația poate fi accesată și de pe telefon folosind adresa IP a calculatorului din aceeași rețea locală:
```
http://<IP_LOCAL>:5173
```

## Chatbot AI

Frontend-ul include un chatbot AI integrat care oferă suport interactiv utilizatorilor. Acesta permite:

- afișarea evenimentelor la care studentul este înscris
- afișarea evenimentelor favorite
- recomandări personalizate pe baza intereselor și activității
- căutarea rapidă a evenimentelor
- afișarea detaliilor complete pentru un eveniment specific

Chatbot-ul comunică cu backend-ul prin serviciul aiChatService și afișează răspunsurile într-un format conversațional, simulând comportamentul unui asistent virtual real.

## Design și UX

Aplicația este realizată cu un design modern, folosind:
- layout-uri separate pentru fiecare tip de utilizator
- componente UI reutilizabile
- sistem de notificări vizuale și badge-uri (ex: 9+ notificări)
- suport pentru afișare responsive pe mobil și desktop

## Observații finale
Frontend-ul UNIfy este gândit să simuleze o aplicație reală, punând accent pe:
- claritatea interfeței
- separarea responsabilităților prin componente și servicii
- integrarea cu un backend modular și securizat
- experiența utilizatorului prin recomandări și asistență AI
