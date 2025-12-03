# FAZA #1 – Setup și Infrastructură proiect

- Creăm structura de foldere și fișiere goale  
- Intalăm dependințele
- Creăm fișierul de bază `server.js` 
- Creăm setup-ul pentru baza de date
- Scriem fișierul HTML de bază structurat tip Single Page Application `index.html`  
- Creăm fișierul CSS `variables.css`  
- Creăm fișierele `api.js` pentru salvarea și citirea datelor și `router.js` pentru navigarea între paginile aplicației  
- Creăm fișierul `app.js` care inițializează aplicația  

---

# FAZA #2 – Autentificare și Utilizatori

- Creăm în fișierul `models/User.js` un model user cu câmpurile aferente
- Creăm endpoints: 
  - *POST /api/auth/signup* - înregistrare utilizator
  - *POST /api/auth/login* - autentificare
  - *GET /api/auth/me* - utilizator curent
  - *POST /api/auth/logout* - deconectare
- Creăm funcțiile pentru comunicare cu backend-ul în `api.js` 
  -`signup()`, `login()`, `logout()`, `getCurrentUser()`, `apiRequest()`
- Creăm funcțiile de validare în fișierul `validation.js` (pentru email, parolă)  
- Implementăm logica de autentificare în `auth.js`   
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
  - editare profil - *PUT /api/auth/profile*
  - schimbare parolă - *PUT /api/auth/password*
  - statistici  
  - logout  
- Stilizăm pagina în `profile.css`  

---

# FAZA #3 – Proiecte

- Creăm în fișierul `models/Project.js` un model proiect cu câmpurile aferente
- Implementăm endpoints:
  - *GET /api/projects* - toate proiectele
  - *GET /api/projects/:id* - proiect după id
  - *POST /api/projects* - creare proiect
  - *PUT /api/projects/:id* - editare proiect
  - *DELETE /api/projects/:id* - ștergere proiect
  - *POST /api/projects/:id/join* - înregistrare ca TST
  - *POST /api/projects/:id/members* - adăugare MP
  - *DELETE /api/projects/:id/members/:userId* - scoatere membru
- Implementăm middleware de permisiuni în `permissions.js`
- Modificăm `api.js`, adăugând funcții pentru proiecte precum:
  -`getAllProjects()`, `getProjectById()`, `createProject()`, `joinAsTester()` etc..
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

# FAZA #4 – Bug-uri

- Creăm în fișierul `models/Bug.js` un model bug cu câmpurile aferente
- Implementăm endpoinds:
  - *GET /api/bugs* - afișsarea tuturor bug-urilor
  - *GET /api/bugs/:id* - bug după id
  - *POST /api/bugs* - raportare  bug
  - *PUT /api/bugs/:id* - actualizare bug
  - *PUT /api/bugs/:id/assign* - alocare bug
  - *PUT /api/bugs/:id/reject* - refuzare bug
  - *PUT /api/bugs/:id/status* - schimbare status 
  - *PUT /api/bugs/:id/close* - închidere bug
  - *DELETE /api/bugs/:id* - ștergere bug
- Implementăm validări
- Modificăm `api.js`, adăugând funcții pentru bug-uri, precum: 
  -`getAllBugs()`, `getBugById()`, `createBug()`, `acceptBug()`, `closeBug()` etc..
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

# FAZA #5 – Dashboard

- Creăm în fișierul `models/Activity.js` un model activitate cu câmpurile aferente
- Implementăm endpoints:
  - *GET /api/activities* - activitățile relevante user-ului
  - *GET /api/activities/project/:projectId* - activitățile unui anumit proiect
  - *POST /api/activities* - creare activitate
  - *GET /api/dashboard/stats* - returnarea statisticilor
- Modificăm `api.js`, adăugând funcșiile pentru activități și statistici:
  -`getDashboardStats()`, `getAllActivities()`, `getActivitiesByProject()`
- Creăm structura HTML a paginii în `dashboard.js`  
  - layout principal  
  - secțiunea de statistici  
  - secțiunea de istoric  
  - filtru proiecte  
- Logica statisticilor:  
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

# FAZA #6 – Sistemul de Permisiuni

- Creăm verificări pentru roluri în `permissions.js`:  
  - `isMP()`, `isTST()`, `isCreator()`  
  - `canEditProject()`, `canDeleteProject()`, `canAssignBugs()`, `canCloseBug()`  
- Implementăm `renderWithPermissions(element, permission)`  

---

# FAZA #7 – Integrare GitHub

- Integrare GitHub API în `github.js`  
- Funcția `validateRepository(repoUrl)` 
  - *GET /repos/:owner/:repo* - extragere owner și repo name
- Afișare informații repository  
- Funcția `validateCommit(repoUrl, commitHash)` 
  - *GET /repos/:owner/:repo/commits/:sha*
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

