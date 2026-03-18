I kursen Datadrivna applikationer har vi fått i uppgift att utveckla en fullstack-lösning för det fiktiva företaget Filmskaparna AB. 
Företaget driver en biosalong och uppgiften har varit att bygga ett system utifrån ett antal user stories som vi ska uppfylla under
projektets gång. Som en del av uppgiften har vi också fått i uppdrag att dokumentera den tekniska skuld som uppstår under 
utvecklingen av projektet. Syftet med den här rapporten är därför att beskriva och reflektera över den tekniska skuld som vi
upplever att vi har fått, eller haft, under arbetets gång, samt vilka faktorer som har påverkat kodens kvalitet, struktur och
underhållbarhet.

När det kommer till vårt projekt har vi märkt att vi på olika sätt har samlat på oss flera typer av teknisk skuld. En bidragande
faktor är att gruppmedlemmarna har haft olika kunskapsnivåer, vilket har gjort att alla inte alltid haft full förståelse för hela 
kodbasen eller för varandras implementationer. Det har lett till att vissa delar av koden i praktiken bara är välkända av den person 
som skrev dem. När andra i gruppen senare behöver arbeta vidare med dessa delar kan det därför ta extra tid att sätta sig in i hur 
de fungerar.

Under projektets gång har vi också flera gånger hamnat i situationer där vi märkt att en lösning fungerar, men där koden egentligen 
hade kunnat förbättras. I dessa fall har vi ibland valt att gå vidare istället för att lägga mer tid på att städa upp eller 
strukturera om koden direkt. Det har hjälpt oss att hålla tempot i utvecklingen, men har samtidigt bidragit till en viss 
programmerings- eller kvalitetsskuld eftersom koden inte alltid är så tydlig eller genomtänkt som den hade kunnat vara. På så sätt 
har vi också medvetet tagit på oss en form av aktiv teknisk skuld för att kunna fortsätta utveckla funktionaliteten i projektet.

En annan faktor som påverkat projektet är att vi ännu inte har så mycket erfarenhet av testning. Därför har vi inte arbetat med 
någon mer omfattande teststrategi. De tester som har gjorts har främst varit enklare kontroller för att se att funktioner fungerar 
som de ska. Det har varit tillräckligt för att få programmet att fungera i praktiken, men det ger inte alltid en djupare förståelse
 för varför något fungerar eller vilka problem som kan uppstå längre fram.

Användningen av AI-verktyg under utvecklingen har också haft både fördelar och nackdelar. AI har ofta hjälpt oss att komma vidare 
när vi har fastnat eller behövt inspiration till lösningar. Samtidigt har det ibland lett till vissa code smells i koden, till 
exempel duplicerad kod eller lösningar som inte riktigt passar ihop med resten av projektet. På vissa ställen har också typen any
använts istället för mer specifika typer, ibland utan att vi fullt ut förstått konsekvenserna. Det kan göra koden svårare att läsa 
och underhålla i längden.

Trots detta har vi försökt att undvika onödig upprepning i koden och istället återanvända funktioner när det varit möjligt. 
Samtidigt har projektets storlek och det växande antalet filer gjort det svårare att hela tiden ha full överblick över hela 
kodbasen. Det är något vi har märkt blir viktigare ju större projektet blir.

Under projektets gång har vi därför också arbetat en del med refaktorering, både i frontend och backend, för att förbättra 
strukturen i koden och göra den mer lättförståelig. Arbetet har fortfarande förbättringspotential, men vi har märkt att när vi 
diskuterar problem och lösningar tillsammans i gruppen får vi en bättre förståelse för programmets brister. De diskussionerna har 
hjälpt oss att identifiera vad som kan förbättras och har också gett oss en bättre bild av hur vi kan arbeta mer strukturerat i 
framtida projekt.