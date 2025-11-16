# LadyBug – Bug Tracking Web Application  
**Proiect Tehnologii Web**

LadyBug este o aplicație web Single Page Application destinată echipelor de studenți care dezvoltă proiecte software colaborative. Scopul principal este gestionarea eficientă a bug-urilor și facilitarea comunicării între membri.

---

## ## Descriere Proiect

LadyBug permite raportarea, gestionarea și urmărirea defectelor apărute în timpul dezvoltării. Aplicația este intuitivă, rapidă (SPA) și ușor de utilizat de echipe mici.

---

## ## Tipuri de utilizatori și permisiuni

Există două roluri principale:

### **MP – Membru Proiect**
Student care face parte din echipa de dezvoltare și are responsabilitate directă în rezolvarea bug-urilor.

### **TST – Tester**
Student care testează aplicația și raportează bug-uri, fără acces la rezolvare.

---

## ## Cum devine un user MP?

- **Creator al proiectului:** utilizatorul care înregistrează proiectul devine automat MP.
- **Adăugat de creator:** creatorul poate adăuga alți studenți ca MP.

### **Permisiuni MP**
- Poate vedea toate bug-urile proiectului  
- Poate să-și aloce bug-uri  
- Poate actualiza statusul bug-urilor proprii  
- Poate rezolva bug-urile proprii  
- Poate închide bug-uri  
- Poate raporta bug-uri  
- **Dacă este creator:** poate edita/șterge proiectul, gestiona membri, aloca/dezaloca bug-uri altor MP

---

## ## Cum devine un user TST?

- **Auto-adăugare:** orice student se poate înscrie singur ca tester la proiectele publice.

### **Permisiuni TST**
- Poate vedea bug-urile proiectului  
- Poate raporta bug-uri  
- Nu poate aloca bug-uri  
- Nu poate actualiza statusuri  
- Nu poate rezolva bug-uri  
- Nu poate edita proiectul  

---

## ## Fluxul aplicației

1. Utilizatorul accesează aplicația și este întâmpinat de pagina de **LogIn / SignUp**.  
2. După autentificare, ajunge în pagina principală cu acces la:
   - Home  
   - Dashboard  
   - Proiecte  
   - Bug-uri  
   - Contul meu  

### **Dashboard**
Include:
- statistici: număr total de proiecte, bug-uri totale, bug-uri alocate, bug-uri deschise  
- activitate recentă filtrată după proiect  

### **Pagina de Proiecte**
- listă în timp real de proiecte publice  
- formular pentru creare proiect:  
  - nume  
  - detalii  
  - link repository  
  - adăugare MP (după email)  
- proiectele utilizatorului apar în „Proiectele mele”  
- posibilitatea de editare (doar de creator)  

### **Raportare bug**
Formularul include:
- titlul bug-ului  
- descriere  
- severitate: Critical / High / Medium / Low  
- prioritate: High / Medium / Low  
- link GitHub commit  
- butoane: Anulează / Raportează  

### **Flux bug**
Un bug poate trece prin următoarele statusuri:

1. **Assigned** – MP nu a acceptat încă bug-ul  
2. **In progress** – MP a început lucrul  
3. **Resolved** – bug-ul a fost rezolvat  
4. **In testing** – testerul verifică rezolvarea  
5. **Closed** – creatorul închide bug-ul după confirmare  

Toate activitățile se reflectă în Dashboard.

---

## ## Caracteristici Tehnice Principale

- **Single Page Application** – navigare fluidă fără refresh  
- **LocalStorage** – persistarea datelor fără server  
- **Integrare GitHub API** – validarea repo/commit-uri  
- **Responsive Design** – funcționează pe orice dispozitiv  
- **UI intuitiv** – interfață simplă și ușor de folosit  
- **Sistem de permisiuni** – roluri MP și TST  
- **Dashboard informativ** – statistici și activitate live  
- **Filtrare și căutare** – găsire rapidă bug-uri  
- **Istoric complet** – fiecare modificare este înregistrată  
