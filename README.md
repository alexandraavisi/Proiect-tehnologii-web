PROIECT TEHNOLOGII WEB
Bug Tracking – LadyBug

1.	Descriere proiect
LadyBug este o aplicație web de tip Single Page Application destinată echipelor de studenți care lucrează la proiecte software colaborative. Scopul principal este facilitarea comunicării și gestionării eficiente a defectelor (bug-urilor) descoperite în timpul dezvoltării și testării aplicațiilor. 

2.	Tipuri de utilizatori și permisuni
În cadrul aplicației, utilizatorul poate avea 2 roluri concurente în funcție de activitatea pe care o realizează:
•	MP (Membru Proiect) - student care face parte din echipa de dezvoltare a unui proiect, are responsabilitate asupra codului și rezolvării bug-urilor.
•	TST (Tester) – student care testează aplicația și raportează bug-uri, nu face parte din echipa de dezvoltare, nu are acces să rezolve bug-uri.

Cum devine un user MP?
-	Creator al proiectului: când înregistrezi un proiect, devii automat MP.
-	Adăugat de creator: creatorul proiectului poate adăuga alți studenți ca MP la înregistrare sau după. 
Permisuni MP
	Poate vedea toate bug-urile proiectului
	Poate să-și aloce bug-uri
	Poate actualiza statusul bug-urilor proprii (alocate lui)
	Poate rezolva bug-urile proprii
	Poate închide bug-uri
	Poate raporta bug-uri (ca orice student)
	Dacă e creator: poate edita/șterge proiectul, adăuga/scoate membri, aloca/dezaloca bug-uri celorlalți MP
Cum devine un user TST?
-	Auto-adăugare: orice student poate să se adauge singur ca tester la orice proiect public.
Permisiuni TST
	Poate vedea bug-urile proiectului
	Poate raporta bug-uri noi în proiect
	NU poate aloca bug-uri
	NU poate actualiza statusul bug-urilor
	NU poate rezolva bug-uri
	NU poate edita proiectul

3.	Fluxul aplicației
Un utilizator accesează pentru prima dată din browser aplicația LadyBug. Acesta va fi întâmpinat de pagina principală de LogIn, unde se poate autentifica cu email-ul și parola sau se poate înregistra printr-un formular de SignUp, dacă nu are deja un cont valid.
După autentificare va fi redirecționat în pagina principală a aplicației unde ai acces la NavBar și la caracteristicile de bază ale aplicației.
NavigationBar-ul aplicației conține:
-	Pagina principală (Home)
-	Dashboard
-	Proiecte
-	Bug-uri
-	Contul meu
Dashboard-ul aplicației care este împărțit în mai multe secțiuni care se actualizează constant: 
-	O secțiune de statistici care cuprinde: numărul total de proiecte, numărul de bug-uri totale ale proiectelor, numărul bug-urilor alocate utilizatorului și numărul bug-urilor deschise la momentul actual împărțite atât pe user MP, cât și user TST. 
-	O  secțiune care conține un istoric al activităților filtrate în funcție de proiectul selectat.
Pagina de Proiecte presupune o listă în timp real a proiectelor publice unde poți alege un proiect și te poți înregistra ca tester al acestuia.  Tot aici, prin accesarea unui formular, poți crea un proiect nou, completând câmpuri precum: nume proiect, detalii proiect, link repository, adăugare MP (folosind adresele de mail ale acestora) și două butoane Creează/Anulează proiect. Proiectul nou creat va apărea în secțiunea Proiectele mele din cadrul aceleiași pagini, de unde poate fi editat și gestionat de către creator. Atât MP-ul asoctiat proiectului, cât și TST-ul pot vedea proiectul în acceași secțiune, fără a avea însă dreptul de editare al acestuia. 
Prin apăsarea butonului Raportează bug vizibil în footer-ul proiectului, se va deschide un nou formular care conține: titlul și descrierea bug-ului, severitatea (Critical/High/Medium/Low), prioritatea (High/Medium/Low), link-ul de GitHub asociat commit-ului unde apare bug-ul, alături de două butoane Anulează/Raportează Bug.
Fiecare MP asociat proiectului își poate însuși bug-ul sau îi poate fi asignat de către creator (acesta poate accepta sau refuza). 
Un bug are mai multe statusuri: 
-	Assigned: MP-ul nu a acceptat încă task-ul
-	In progress: MP-ul a acceptat task-ul și a început lucrul
-	Resolved: MP-ul a rezolvat problema
-	In testing: cel care a raportat bag-ul îl testează și confirmă succesul sau raportează eventualele erori
-	Closed: după confirmare, creatorul proiectului închide bug-ul
Sunt actualizate toate activitățile din Dashboard.

4.	Caracteristici tehnice principale
	Single Page Application - Navigare fluidă fără reload-uri de pagină
	LocalStorage - Date persistente fără necesitatea unui server
	Integrare GitHub API - Validare automată repository/commit-uri
	Responsive Design - Funcționează pe orice dispozitiv
	UI Intuitiv - Interfață curată, ușor de folosit
	Sistem Permisiuni - Roluri clare (MP-Creator, MP, TST)
	Dashboard Informativ - Statistici și activitate recentă
	Filtrare și Căutare - Găsește rapid bug-uri specifice
	Istoric Complet - Fiecare modificare este înregistrată
