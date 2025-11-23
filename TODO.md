# FAZA #1 – Setup și Infrastructură proiect

- Creăm structura de foldere și fișiere goale  
- Scriem fișierul HTML de bază structurat tip Single Page Application `index.html`  
- Creăm fișierul CSS `variables.css`  
- Creăm fișierele `storage.js` pentru salvarea și citirea datelor și `router.js` pentru navigarea între paginile aplicației  
- Creăm fișierul `app.js` care inițializează aplicația  

---

# FAZA #2 – Autentificare și Utilizatori

- Creăm funcțiile de validare în fișierul `validation.js` (pentru email, parolă)  
- Implementăm logica de autentificare în `auth.js`  
  - `signUp()`, `login()`, `logout()`, `isAuthenticated()`, `getCurrentUser()`  
- Realizăm interfața Login/SignUp în `auth-page.js`  
  - HTML pentru formulare  
  - navigare între formulare (tab-uri / butoane)  
  - conectare cu funcțiile din `auth.js`  
- Stilizăm pagina de autentificare în `auth.css` (responsive, butoane, input-uri, erori/succes)  
- Implementăm protecția rutelor în `router.js`  
  - redirect către `/login` dacă utilizatorul nu este autentificat  
  - redirect către `/dashboard` dacă este autentificat  
- Creăm pagina *Contul meu* în `profile.js`  
  - date utilizator  
  - editare profil  
  - statistici  
  - logout  
- Stilizăm pagina în `profile.css`  

---

# FAZA #3 – Dashboard

- Creăm structura HTML a paginii în `dashboard.js`  
  - layout principal  
  - secțiunea de statistici  
  - secțiunea de istoric  
  - filtru proiecte  
- Logica statisticilor în `dashboard.js`:  
  - `getTotalProjects()`, `getTotalBugs()`, `getAssignedBugs()`, `getOpenBugs()`, `displayStatistics()`  
- Logica pentru istoric:  
  - `getAllActivities()`  
  - `filterActivitiesByProject(projectId)`  
  - `displayActivities(activities)`  
  - `formatActivityMessage(activity)`  
- Implementăm filtrarea activităților  
- Actualizare în timp real prin `refreshDashboard()`  
- Stilizăm în `dashboard.css`  

---

# FAZA #4 – Proiecte

- Creăm structura paginii *Proiecte* în `projects.js`  
  - layout secțiuni  
  - buton proiect nou  
  - listă proiecte  
- Funcții:  
  - `getPublicProjects()` și `displayPublicProjects(projects)`  
  - buton *Înregistrează-te ca Tester*  
- Afișarea proiectelor personale cu:  
  - `getMyProjects()`  
  - `displayMyProjects(projects)`  
- Formular proiect nou + validări  
  - `createProject(projectData)`  
- Funcție de alăturare ca tester:  
  - `joinAsTester(projectId)`  
- Pagină Detalii proiect  
  - informații, membri, bug-uri, buton raportare bug  
- Pentru MP Creator:  
  - editare proiect → `updateProject(projectId, updates)`  
  - adăugare/scoatere membri → `addMember()`, `removeMember()`  
  - ștergere proiect → `deleteProject(projectId)`  
- Stilizare în `projects.css`  

---

# FAZA #5 – Bug-uri

- Creăm formularul *Raportează Bug* în `bugs.js`  
  - salvare cu `createBug()`  
- Creăm pagina cu lista de bug-uri + filtrare  
- Creăm pagina de detalii pentru fiecare bug  
- Implementăm alocarea bug-urilor:  
  - `assignBugToSelf(bugId)` (pentru MP)  
  - `assignBugToMember(bugId, memberId)` (pentru MP Creator)  
- Funcții pentru accept/refuz membru  
- Pentru status *In Testing*:  
  - `confirmResolution(bugId)`  
  - `reportIssues(bugId, message)`  
- Închiderea bug-ului:  
  - `closeBug(bugId)`  

---

# FAZA #6 – Sistemul de Permisiuni

- Creăm verificări roluri în `permissions.js`:  
  - `isMP()`, `isTST()`, `isCreator()`  
  - `canEditProject()`, `canDeleteProject()`, `canAssignBugs()`, `canCloseBug()`  
- Implementăm `checkPermission(permission, userId, resourceId)`  
- Implementăm `renderWithPermissions(element, permission)`  

---

# FAZA #7 – Integrare GitHub

- Integrare GitHub API în `github.js`  
- Funcția `validateRepository(repoUrl)`  
- Afișare informații repository  
- Funcția `validateCommit(repoUrl, commitHash)`  
- Afișare detalii commit  

---

# FAZA #8 – Design interfață

- Design System în `variables.css`  
  - culori, fonturi, spacing, borders  
- Componente reutilizabile în `components.css`  
  - butoane, carduri, formulare, badges, alerts  
- Design responsive  
- Animații și tranziții  
  - hover, page transitions, loading spinners, smooth scroll  

---

# FAZA #9 – Testare și Finalizare

- Testăm funcționalitățile  
- Scriem documentația în `README.md`  

