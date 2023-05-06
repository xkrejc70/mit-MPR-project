from django.core.management.base import BaseCommand
from app.models.user import User
from app.models.project import Project, UserProject
from app.models.risk import Risk, RiskCategory
from app.models.choices import Status, UserProjectRoles, Probability, Impact, Phase
from django.contrib.auth.hashers import make_password
from datetime import date


class Command(BaseCommand):
    manager_id = None
    user_1_id = None
    user_2_id = None
    user_3_id = None
    project_1_id = None
    project_2_id = None
    project_3_id = None
    password = "Password1"

    # Users
    def _create_admin(self):
        password = make_password(self.password)
        user = User(password=password, name="Jiří", surname="Riziko", email="admin@mpr.cz", role="ADMIN")
        user.save()

    def _create_project_manager(self):
        password = make_password(self.password)
        user = User(password=password, name="Jan", surname="Dvořák", email="manager@mpr.cz", role="PROJECT_MANAGER")
        user.save()
        self.manager_id = User.objects.latest('id')

    def _create_user_1(self):
        password = make_password(self.password)
        user = User(password=password, name="Tomáš", surname="Jirásek", email="user@mpr.cz", role="USER")
        user.save()
        self.user_1_id = User.objects.latest('id')

    def _create_user_2(self):
        password = make_password(self.password)
        user = User(password=password, name="Radek", surname="Jirásek", email="user2@mpr.cz", role="USER")
        user.save()
        self.user_2_id = User.objects.latest('id')

    def _create_user_3(self):
        password = make_password(self.password)
        user = User(password=password, name="Marie", surname="Nevím", email="user3@mpr.cz", role="USER")
        user.save()
        self.user_3_id = User.objects.latest('id')

    # Projects
    def _create_project_1(self):
        project = Project(
            owner_id=self.manager_id,
            name="Projekt 1",
            description="Popis Projektu 1",
            status=Status.CLOSED,
            scale_risk=True,
            date_begin=date(2022, 10, 1),
            date_end=date(2023, 1, 10)
        )
        project.save()
        self.project_1_id = Project.objects.latest('id')

    def _create_project_2(self):
        project = Project(
            owner_id=self.manager_id,
            name="Project Risk Manager",
            description="Systém pro podporu řízení rizik v projektech",
            status=Status.ACTIVE,
            scale_risk=False,
            date_begin=date(2023, 2, 20),
            date_end=date(2023, 5, 5)
        )
        project.save()
        self.project_2_id = Project.objects.latest('id')

    def _create_project_3(self):
        project = Project(
            owner_id=self.manager_id,
            name="Project Risk Manager 2.0",
            description="Lepší systém pro podporu řízení rizik v projektech",
            status=Status.CONCEPT,
            scale_risk=True,
            date_begin=date(2023, 5, 1),
            date_end=date(2023, 7, 1)
        )
        project.save()
        self.project_3_id = Project.objects.latest('id')

    # UserProject
    def _relate_user_project(self, user, project, role):
        user_project = UserProject(
            user=user,
            project=project,
            role=role
        )
        user_project.save()

    # Risk categorie
    def _create_risk_category(self, name):
        risk_cat = RiskCategory(name=name, description="")
        risk_cat.save()

    # Risks
    def _create_risk_1(self):
        cat_id = RiskCategory.objects.all().filter(name="Organizační riziko").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nemoc",
            description="Jedním z nejčastějších rizik v projektovém managementu je nemoc nebo absence členů týmu. Nemoc může ovlivnit schopnost týmu dokončit úkoly včas a v souladu s plánem. Absence jednoho nebo více členů týmu může mít za následek přepracování zbylých členů týmu a zvýšení rizika pro celkovou úspěšnost projektu.",
            danger="Zpoždění projektu, snížení kvality výsledků, zvýšení nákladů na projekt a zvýšení stresu pro zbylé členy týmu.",
            trigger="Neočekávaná a neplánovaná nemoc členů týmu, dovolená, rodinné závazky a další neplánované události, které mohou mít za následek absenci jednoho nebo více členů týmu.",
            reactions="Zahrnutí rizika nemoci nebo absence do plánu projektu, vytvoření plánu náhradního personálu, pravidelná komunikace s členy týmu ohledně jejich zdravotního stavu a plánů na dovolenou, předběžné plánování pro případné zpoždění projektu.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2022, 11, 2),
            date_updated=date(2022, 11, 4),
            date_reaction=date(2022, 11, 4)
        )
        risk.save()

    def _create_risk_2(self):
        cat_id = RiskCategory.objects.all().filter(name="Organizační riziko").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nedostatečné rozdělení úkolů",
            description=" Nesprávné nebo neúplné rozdělení úkolů mezi členy týmu, nejistota ohledně zodpovědnosti jednotlivých úkolů a chybějící jasné definice rolí a odpovědností v týmu.",
            danger="Neefektivní využívání zdrojů, zpoždění projektu a nedostatečné plnění úkolů",
            trigger="Nesprávné rozdělení úkolů při zadání projektu, nejasné požadavky a cíle projektu, změny v plánech projektu nebo nepředvídatelné okolnosti během projektu",
            reactions="Definice jasných rolí a odpovědností v týmu, pravidelná komunikace a koordinace úkolů a plánů, průběžné kontrolní body projektu, které kontrolují správnost rozdělení úkolů a případně možnost přehodnocení rozdělení úkolů",
            probability=Probability.HIGH,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2022, 10, 2),
            date_updated=date(2022, 10, 4),
            date_reaction=date(2022, 10, 4)
        )
        risk.save()

    def _create_risk_3(self):
        cat_id = RiskCategory.objects.all().filter(name="Externí rizika (legislativa)").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nedodržení právních požadavek",
            description="Nezohlednění relevantních právních požadavek prjektu.",
            danger="Může vést k sankcím nebo problémům s právní odpovědností.",
            trigger="Neznalost právních norem.",
            reactions="Prostudovat a definovat právní omezení projektu. A zabezpečit jejich dodržení při implementaci.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.TESTING,
            date_identified=date(2022, 10, 20),
            date_updated=date(2022, 10, 25),
            date_reaction=date(2022, 10, 25)
        )
        risk.save()

    def _create_risk_4(self):
        cat_id = RiskCategory.objects.all().filter(name="Obchodní rizika (smluvní podmínky)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nejasné nebo nedostatečné smluvní podmínky",
            description="Pokud jsou smluvní podmínky nejasné nebo nedostatečné během úvodní studie projektu, může to vést k nedorozuměním a nejasnostem v dalším průběhu projektu.",
            danger="Může to vést k finančním ztrátám společnosti, která dodáva výsledný produkt.",
            trigger="Nedostatečná komunikace se zákazníkem. Nedůsledné čtení nebo nepochopení částí smlouvy.",
            reactions="Je důležité, aby byly smluvní podmínky jasně a přesně definovány a aby je každá zúčastněná strana pochopila.",
            probability=Probability.LOW,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2022, 11, 12),
            date_updated=date(2022, 11, 21),
            date_reaction=date(2022, 11, 21)
        )
        risk.save()

    def _create_risk_5(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (zdroje)").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nedostatečné financování",
            description="Naplánovaní nedostatečného financoaní projektu.",
            danger="Může mít vliv na úspěšné dokončení projektu.",
            trigger="Během úvodní studie se nezohlední dostatečné financování projektu. Zlé plánování zdrojů a špatný odhad ich ceny.",
            reactions="Včasná komunikace se zákazníkem a obeznámení se situaci. Úprava smluvních podmínek.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.MANAGEMENT,
            date_identified=date(2022, 11, 3),
            date_updated=date(2022, 11, 15),
            date_reaction=date(2022, 11, 15)
        )
        risk.save()

    def _create_risk_6(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (komunikace)").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nedostatečná komunikace",
            description="Není zajištěna dostatečná komunikace mezi členy projektového týmu a zainteresovanými stranami.",
            danger="Může vést k nejasnostem mezi zúčastněnými stranami a následně k problémům v dalším průběhu projektu",
            trigger="Nezabezpečení dobré organizace v úvodu projektu. Málo střetnutí mezi zákazníkem a všemi členy projektového týmu.",
            reactions="Plánování střetnutí v určitých intervalech v úvodu projektu. Dobrá dokumentace cílů projektu.",
            probability=Probability.LOW,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.MANAGEMENT,
            date_identified=date(2022, 11, 18),
            date_updated=date(2022, 11, 25),
            date_reaction=date(2022, 11, 25)
        )
        risk.save()

    def _create_risk_7(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (projektové řízení)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nedostatečné posouzení rizik",
            description="Nepodaří se identifikovat alespoň většinu rizik nebo jejich dopadů.",
            danger="Může vést ke vzniku neočekávaných rizikových událostí počas vývoje a tím ke zpoždění projektu.",
            trigger="Nekvalitní analýza v úvodu projektu, neznalost dané problematiky, malá zkušenost s řízením projektů v dané sféře.",
            reactions="Zaznamenávat rizika při práci na jiných projektech. Zabezpečit manažment s dostatečnými zkušenostmi.",
            probability=Probability.MEDIUM,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2022, 10, 2),
            date_updated=date(2022, 10, 4),
            date_reaction=date(2022, 10, 4)
        )
        risk.save()

    def _create_risk_8(self):
        cat_id = RiskCategory.objects.all().filter(name="Technická rizika (Výkonnost)").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_1_id,
            title="Škálovateľnosť backendu",
            description="Programátori neuvažujú o využívaní software-u veľkým počtom používateľov",
            danger="Aplikácia bude pomalá pri veľkom počte požiadaviek na backend",
            trigger="Príliš veľký počet požiadaviek na aplikáciu v jeden moment",
            reactions="Vykonávanie záťažových testov aplikácie",
            probability=Probability.LOW,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2022, 11, 17),
            date_updated=date(2022, 11, 21),
            date_reaction=date(2022, 11, 21)
        )
        risk.save()

    def _create_risk_9(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Specifikace požadavků)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_1_id,
            title="Nedostatečná nebo nejasná specifikace",
            description="Nedostatečně specifikované nebo nejasné požadavky mohou vést k neúspěchu projektu, protože tým nebude mít jasnou představu o tom, co se od nich očekává.",
            danger="Projekt může být dokončen nesprávně nebo pozdě.",
            trigger="Nejasné požadavky, chyba v komunikaci.",
            reactions="Jasně definovat požadavky, stanovit přesné cíle projektu. Ujistit se, že všichni jsou do projektu zapojení a rozumějí požadavkům. Provádět pravidelné kontroly.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2022, 10, 2),
            date_updated=date(2022, 10, 4),
            date_reaction=date(2022, 10, 4)
        )
        risk.save()

    def _create_risk_201(self):
        cat_id = RiskCategory.objects.all().filter(name="Organizační riziko").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nemoc",
            description="Jedním z nejčastějších rizik v projektovém managementu je nemoc nebo absence členů týmu. Nemoc může ovlivnit schopnost týmu dokončit úkoly včas a v souladu s plánem. Absence jednoho nebo více členů týmu může mít za následek přepracování zbylých členů týmu a zvýšení rizika pro celkovou úspěšnost projektu.",
            danger="Zpoždění projektu, snížení kvality výsledků, zvýšení nákladů na projekt a zvýšení stresu pro zbylé členy týmu.",
            trigger="Neočekávaná a neplánovaná nemoc členů týmu, dovolená, rodinné závazky a další neplánované události, které mohou mít za následek absenci jednoho nebo více členů týmu.",
            reactions="Zahrnutí rizika nemoci nebo absence do plánu projektu, vytvoření plánu náhradního personálu, pravidelná komunikace s členy týmu ohledně jejich zdravotního stavu a plánů na dovolenou, předběžné plánování pro případné zpoždění projektu.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 4, 20),
            date_updated=date(2023, 4, 25),
            date_reaction=date(2023, 4, 25)
        )
        risk.save()

    def _create_risk_202(self):
        cat_id = RiskCategory.objects.all().filter(name="Externí rizika (legislativa)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nedodržení právních požadavek",
            description="Nezohlednění relevantních právních požadavek prjektu.",
            danger="Může vést k sankcím nebo problémům s právní odpovědností.",
            trigger="Neznalost právních norem.",
            reactions="Prostudovat a definovat právní omezení projektu. A zabezpečit jejich dodržení při implementaci.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.TESTING,
            date_identified=date(2023, 2, 10),
            date_updated=date(2023, 2, 20),
            date_reaction=date(2023, 2, 20)
        )
        risk.save()

    def _create_risk_203(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Definice rozsahu)").first()
        risk = Risk(
            owner=self.user_3_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nerealistické požadavky",
            description="Toto riziko se vyskytuje, když jsou stanoveny požadavky na projekt, které jsou nerealistické nebo příliš ambiciózní. To může vést k přetížení týmu, nedostatku zdrojů a finančních prostředků a snížení kvality projektu.",
            danger="Zpoždění projektu, vysoké náklady",
            trigger="Neznalost trhu nebo technologií. Špatná analýza.",
            reactions="Analýzu by měli provádět zkušení lidé. Dialog se zákazníkem, aby nedošlo ke špatnému pochopení požadavků. Pečlivě kontrolovat průběh projektu, aby se včas minimalizovalo riziko.",
            probability=Probability.TINY,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2023, 2, 20),
            date_updated=date(2023, 2, 28),
            date_reaction=date(2023, 2, 28)
        )
        risk.save()

    def _create_risk_204(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Specifikace požadavků)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_2_id,
            title="Změny požadavků během vývoje",
            description="Nestabilní a měnící se požadavky s průběhem projektu.",
            danger="Změny požadavků mohou způsobit zpoždění v plánování a vývoji produktu, nárůst nákladů, kvalitativní problémy a nespokojenost uživatelů. Může také vést ke snížení efektivity týmu.",
            trigger="Změna potřeb uživatelů nebo klientů, technologické změny, změny v legislativě.",
            reactions="Pružný proces řízení požadavků. Častá komunikace se zákazníkem.",
            probability=Probability.LOW,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 4, 1),
            date_updated=date(2023, 4, 10),
            date_reaction=date(2023, 4, 10)
        )
        risk.save()

    def _create_risk_205(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Specifikace požadavků)").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nedostatečná analýza potřeb uživatelů a trhu",
            description="Špatná analýza cíle projektu, výstupů nebo jednotlivých požadavků. Nedostatečná analýza funkčních požadavků na systém.",
            danger="Nedostatečná analýza může vést k neuspokojení potřeb uživatelů a/nebo nesplnění požadavků daného trhu. Dále může vést k nárůstu nákladů a zpoždění vývoje v důsledku nutnosti opakované analýzy a návrhu.",
            trigger="Nedostatečná komunikace se zákazníkem, malý sběr dat, nevhodné metody analýzy.",
            reactions="Průběžná komunikace s klientem. Pečlivá fáze přípravy. Vhodné metody analýzy.",
            probability=Probability.LOW,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2023, 2, 25),
            date_updated=date(2023, 3, 10),
            date_reaction=date(2023, 3, 10)
        )
        risk.save()

    def _create_risk_206(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Technologie)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nekonzistentní nebo nekompatibilní technické řešení",
            description="Produkt není navržen tak, aby splňoval všechny technické požadavky, nebo jsou jednotlivé části vzájemně nekompatibilní.",
            danger="Nekonzistentní nebo nekompatibilní technické řešení může vést k chybám v funkcionalitě softwarového produktu, což může mít za následek nespolehlivost, špatnou výkonnost nebo dokonce selhání celého produktu.",
            trigger="Tento problém může nastat, pokud vývojáři používají různé technologie, které nejsou kompatibilní nebo neodpovídají požadavkům produktu, nebo pokud tým neplánuje a nekoordinuje své aktivity správně.",
            reactions="Koordinace jednotlivých týmů (frontend, backend, …). Uvážení kompatibility technologií při návrhu.",
            probability=Probability.LOW,
            impact=Impact.EXTREME,
            status=Status.CLOSED,
            phase=Phase.DESIGN,
            date_identified=date(2023, 3, 20),
            date_updated=date(2023, 3, 30),
            date_reaction=date(2023, 3, 30)
        )
        risk.save()

    def _create_risk_207(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_2_id,
            title="Návrhové riziko",
            description="Špatný návrh může vést k vysokým nákladům na úpravy nebo k opravám chyb v produkčním prostředí",
            danger="Špatné rozhodnutí při návrhu řešení",
            trigger="Nesprávné nebo nedostatečné analýzy, nevhodný návrh řešení",
            reactions="Pravidelné kontroly kvality a testování návrhu řešení v raných fázích projektu",
            probability=Probability.HIGH,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.DESIGN,
            date_identified=date(2023, 3, 20),
            date_updated=date(2023, 3, 30),
            date_reaction=date(2023, 3, 30)
        )
        risk.save()

    def _create_risk_208(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (projektové řízení)").first()
        risk = Risk(
            owner=self.user_3_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nedostatok skúseností s plánovaním projektu",
            description="Riziko spojené s tímom, ktorý nemá skúsenosť s plánovaním projektu alebo skúsenosti s vytvorením plánu sú minimálne. Môže to ovplyvniť celkový plán projektu, ktorý bude neefektívny alebo nedostatočne naplánovaný.",
            danger="Nedostatočné plánovanie projektu, plánovanie projektu neskúseným tímom, čo môže viesť až k vytvoreniu nepoužiteľného plánu pre riadenie projektu.",
            trigger="Nedostatočné stanovenie zodpovedností jednotlivých členov tímu, stanovenie nejasných cieľov projektu, nedostatok zdrojov, nevhodne nadväzujúce činnosti na sebe, zlé stanovenie termínov, … ",
            reactions="Dostatočné pripravenie sa na plánovanie projektu, vyhľadanie potrebných užitočných informácií, získanie skúseností a zručností ",
            probability=Probability.LOW,
            impact=Impact.EXTREME,
            status=Status.CLOSED,
            phase=Phase.MANAGEMENT,
            date_identified=date(2023, 2, 20),
            date_updated=date(2023, 2, 20),
            date_reaction=date(2023, 2, 20)
        )
        risk.save()

    def _create_risk_209(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (projektové řízení)").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_2_id,
            title="Chýbajúca činnosť v pláne projektu",
            description="Činnosť, ktorú je z hľadiska vypracovanie kvalitného produktu potrebné vykonať, ale chýba v pláne projektu.  ",
            danger="Opomenutie činnosti v pláne projektu",
            trigger="Nedostatočné plánovanie",
            reactions="Precízne plánovanie projektu, dôkladná kontrola plánu projektu a identifikácia potrebných krokov k úspešnému dokončeniu projektu.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.MANAGEMENT,
            date_identified=date(2023, 2, 22),
            date_updated=date(2023, 2, 28),
            date_reaction=date(2023, 2, 28)
        )
        risk.save()

    def _create_risk_210(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (projektové řízení)").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nedodržanie termínu činnosti",
            description="Niektorý člen/členovia nestihnú ukončiť činnosť pre skončením jej deadlinu.",
            danger="Posunutie termínov nadväzujúcich činností, oneskorenie projektu",
            trigger="Neukončenie činnosti člena/členov tímu pred deadlinom v pláne projektu.",
            reactions="Kontrola plánu projektu a dodržiavanie v ňom určených termínov a komunikácia o postupe na jednotlivých práve prebiehajúcich činnostiach.",
            probability=Probability.MEDIUM,
            impact=Impact.EXTREME,
            status=Status.CLOSED,
            phase=Phase.MANAGEMENT,
            date_identified=date(2023, 3, 26),
            date_updated=date(2023, 3, 28),
            date_reaction=date(2023, 3, 28)
        )
        risk.save()

    def _create_risk_211(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko").first()
        risk = Risk(
            owner=self.user_3_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nedostatečné logování",
            description="Nedostatečné logování, monitorování a upozornění",
            danger="Díky nedostatečnému logování, monitorování a upozorňování může zůstat útočník bez povšimnutí",
            trigger="Logují/monitorují se pouze některé z údajů",
            reactions="Logovat i neúspěšné pokusy, odepřelé přístupy, selhání systému, dostatečně podrobné údaje pro identifikaci útočníků. Formátovat výstup tak, aby jej mohly použít i jiné nástroje.",
            probability=Probability.MEDIUM,
            impact=Impact.EXTREME,
            status=Status.ACTIVE,
            phase=Phase.TESTING,
            date_identified=date(2023, 5, 1),
            date_updated=date(2023, 5, 5),
            date_reaction=date(2023, 5, 5)
        )
        risk.save()

    def _create_risk_212(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Bezpečnost)").first()
        risk = Risk(
            owner=self.manager_id,
            category=cat_id,
            project=self.project_2_id,
            title="API Injection",
            description="Útočník vytváří volání API, která zahrnují SQL, NoSQL, LDAP či jiné příkazy, které rozhraní API nebo backend bez kontroly provádí",
            danger="Útočník může získat citlivé informace uložené v databázi, změnit, smazat nebo vkládat nová data, nebo dokonce ovládnout celou aplikaci",
            trigger="Útočník odesílá škodlivý kód, který je zpracován interním interpretem",
            reactions="Nikdy nedůvěřovat klientům rozhraní API, ani interním. Přísně definovat všechna vstupní data (schémata, typy). Validovat a filtrovat všechna příchozí data",
            probability=Probability.LOW,
            impact=Impact.EXTREME,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 4, 20),
            date_updated=date(2023, 4, 25),
            date_reaction=date(2023, 4, 25)
        )
        risk.save()

    def _create_risk_213(self):
        cat_id = RiskCategory.objects.all().filter(name="Technická rizika (Technická rozhraní)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_2_id,
            title="Nepodporované a neoverené knižnice",
            description="Programátori počas vývoja použijú knižnice, ktoré prestanú byť podporované ",
            danger="Časti aplikácii prestanú fungovať",
            trigger="Neoverená použitá knižnica prestane byť podporovaná a funkčná",
            reactions="Používanie iba dlhodobo overených knižníc",
            probability=Probability.LOW,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 4, 20),
            date_updated=date(2023, 4, 21),
            date_reaction=date(2023, 4, 21)
        )
        risk.save()

    def _create_risk_214(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_2_id,
            title="Výpadok elektrickej energie",
            description="Pri implementácii došlo ku výpadku elektrickej energie, takže programátory nemôžu naďalej pracovať ",
            danger="Predĺženie vývoja aplikácii",
            trigger="Odstávka elektrickej energie",
            reactions="Používanie laptopov alebo náhradného zdroja, možnosť presunu programátorov na iné miesto ",
            probability=Probability.LOW,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 4, 23),
            date_updated=date(2023, 4, 24),
            date_reaction=date(2023, 4, 24)
        )
        risk.save()

    def _create_risk_215(self):
        cat_id = RiskCategory.objects.all().filter(name="Technická rizika (Technická rozhraní)").first()
        risk = Risk(
            owner=self.user_1_id,
            category=cat_id,
            project=self.project_2_id,
            title="Zlé naimplementované rozhranie backendu",
            description="Backend aplikácia má vytvorené iné rozhranie ako očakáva frontend",
            danger="Frontend aplikácia nebude schopná využiť plnej funkčnosti backendu",
            trigger="Programátor backend-u zle pochopil a naprogramoval rozhranie",
            reactions="Vykonávanie kontrol rozhrania",
            probability=Probability.MEDIUM,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 4, 10),
            date_updated=date(2023, 4, 16),
            date_reaction=date(2023, 4, 16)
        )
        risk.save()

    def _create_risk_216(self):
        cat_id = RiskCategory.objects.all().filter(name="Technická rizika (Spolehlivost, udržovatelnost)").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_2_id,
            title="Neprehľadný kód",
            description="Programátori nerefaktorujú kód, ktorý sa stáva nečitateľným a teda nie je možné ho udržiavať ",
            danger="Opravy chýb v aplikácii budú príliš náročné na zdroje",
            trigger="Programátori neberú ohľad na prehľadnosť kódu",
            reactions="Vykonávanie refaktorizácií kódu",
            probability=Probability.MEDIUM,
            impact=Impact.LOW,
            status=Status.ACTIVE,
            phase=Phase.IMPLEMENTATION,
            date_identified=date(2023, 5, 1),
            date_updated=date(2023, 5, 5),
            date_reaction=date(2023, 5, 5)
        )
        risk.save()

    def _create_risk_301(self):
        cat_id = RiskCategory.objects.all().filter(name="Organizační riziko").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_3_id,
            title="Nemoc",
            description="Jedním z nejčastějších rizik v projektovém managementu je nemoc nebo absence členů týmu. Nemoc může ovlivnit schopnost týmu dokončit úkoly včas a v souladu s plánem. Absence jednoho nebo více členů týmu může mít za následek přepracování zbylých členů týmu a zvýšení rizika pro celkovou úspěšnost projektu.",
            danger="Zpoždění projektu, snížení kvality výsledků, zvýšení nákladů na projekt a zvýšení stresu pro zbylé členy týmu.",
            trigger="Neočekávaná a neplánovaná nemoc členů týmu, dovolená, rodinné závazky a další neplánované události, které mohou mít za následek absenci jednoho nebo více členů týmu.",
            reactions="Zahrnutí rizika nemoci nebo absence do plánu projektu, vytvoření plánu náhradního personálu, pravidelná komunikace s členy týmu ohledně jejich zdravotního stavu a plánů na dovolenou, předběžné plánování pro případné zpoždění projektu.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2023, 5, 1),
            date_updated=date(2023, 5, 3),
            date_reaction=date(2023, 5, 3)
        )
        risk.save()

    def _create_risk_302(self):
        cat_id = RiskCategory.objects.all().filter(name="Rizika řízení projektu (komunikace)").first()
        risk = Risk(
            owner=self.user_2_id,
            category=cat_id,
            project=self.project_3_id,
            title="Nedostatečná komunikace",
            description="Není zajištěna dostatečná komunikace mezi členy projektového týmu a zainteresovanými stranami.",
            danger="Může vést k nejasnostem mezi zúčastněnými stranami a následně k problémům v dalším průběhu projektu",
            trigger="Nezabezpečení dobré organizace v úvodu projektu. Málo střetnutí mezi zákazníkem a všemi členy projektového týmu.",
            reactions="Plánování střetnutí v určitých intervalech v úvodu projektu. Dobrá dokumentace cílů projektu.",
            probability=Probability.LOW,
            impact=Impact.MEDIUM,
            status=Status.ACTIVE,
            phase=Phase.MANAGEMENT,
            date_identified=date(2023, 5, 1),
            date_updated=date(2023, 5, 4),
            date_reaction=date(2023, 5, 4)
        )
        risk.save()

    def _create_risk_303(self):
        cat_id = RiskCategory.objects.all().filter(name="Technické riziko (Specifikace požadavků)").first()
        risk = Risk(
            owner=self.user_3_id,
            category=cat_id,
            project=self.project_3_id,
            title="Nedostatečná nebo nejasná specifikace",
            description="Nedostatečně specifikované nebo nejasné požadavky mohou vést k neúspěchu projektu, protože tým nebude mít jasnou představu o tom, co se od nich očekává.",
            danger="Projekt může být dokončen nesprávně nebo pozdě.",
            trigger="Nejasné požadavky, chyba v komunikaci.",
            reactions="Jasně definovat požadavky, stanovit přesné cíle projektu. Ujistit se, že všichni jsou do projektu zapojení a rozumějí požadavkům. Provádět pravidelné kontroly.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.ACTIVE,
            phase=Phase.STUDY,
            date_identified=date(2023, 5, 3),
            date_updated=date(2023, 5, 5),
            date_reaction=date(2023, 5, 5)
        )
        risk.save()

    def _create_risk_304(self):
        cat_id = RiskCategory.objects.all().filter(name="Organizační riziko").first()
        risk = Risk(
            owner=self.user_3_id,
            category=cat_id,
            project=self.project_3_id,
            title="Nedostatečné rozdělení úkolů",
            description=" Nesprávné nebo neúplné rozdělení úkolů mezi členy týmu, nejistota ohledně zodpovědnosti jednotlivých úkolů a chybějící jasné definice rolí a odpovědností v týmu.",
            danger="Neefektivní využívání zdrojů, zpoždění projektu a nedostatečné plnění úkolů",
            trigger="Nesprávné rozdělení úkolů při zadání projektu, nejasné požadavky a cíle projektu, změny v plánech projektu nebo nepředvídatelné okolnosti během projektu",
            reactions="Definice jasných rolí a odpovědností v týmu, pravidelná komunikace a koordinace úkolů a plánů, průběžné kontrolní body projektu, které kontrolují správnost rozdělení úkolů a případně možnost přehodnocení rozdělení úkolů",
            probability=Probability.HIGH,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.STUDY,
            date_identified=date(2023, 5, 1),
            date_updated=date(2023, 5, 2),
            date_reaction=date(2023, 5, 2)
        )
        risk.save()

    def handle(self, *args, **options):
        # Users
        self._create_admin()
        self._create_project_manager()
        self._create_user_1()
        self._create_user_2()
        self._create_user_3()

        # Projects
        self._create_project_1()
        self._relate_user_project(self.manager_id, self.project_1_id, UserProjectRoles.MANAGER)
        self._relate_user_project(self.user_1_id, self.project_1_id, UserProjectRoles.EMPLOYEE)

        self._create_project_2()
        self._relate_user_project(self.manager_id, self.project_2_id, UserProjectRoles.MANAGER)
        self._relate_user_project(self.user_1_id, self.project_2_id, UserProjectRoles.EMPLOYEE)
        self._relate_user_project(self.user_2_id, self.project_2_id, UserProjectRoles.EMPLOYEE)
        self._relate_user_project(self.user_3_id, self.project_2_id, UserProjectRoles.EXTERNAL)

        self._create_project_3()
        self._relate_user_project(self.manager_id, self.project_3_id, UserProjectRoles.MANAGER)
        self._relate_user_project(self.user_2_id, self.project_3_id, UserProjectRoles.EMPLOYEE)
        self._relate_user_project(self.user_3_id, self.project_3_id, UserProjectRoles.EXTERNAL)

        # Risk categories
        self._create_risk_category("Organizační riziko")
        self._create_risk_category("Externí rizika (legislativa)")
        self._create_risk_category("Obchodní rizika (smluvní podmínky)")
        self._create_risk_category("Rizika řízení projektu (zdroje)")
        self._create_risk_category("Rizika řízení projektu (komunikace)")
        self._create_risk_category("Rizika řízení projektu (projektové řízení)")
        self._create_risk_category("Technické riziko (Specifikace požadavků)")
        self._create_risk_category("Technické riziko (Definice rozsahu)")
        self._create_risk_category("Technické riziko (Technologie)")
        self._create_risk_category("Technické riziko")
        self._create_risk_category("Technické riziko (Bezpečnost)")
        self._create_risk_category("Technická rizika (Výkonnost)")
        self._create_risk_category("Technická rizika (Technická rozhraní)")
        self._create_risk_category("Technická rizika (Spolehlivost, udržovatelnost)")

        # Risks
        self._create_risk_1()
        self._create_risk_2()
        self._create_risk_3()
        self._create_risk_4()
        self._create_risk_5()
        self._create_risk_6()
        self._create_risk_7()
        self._create_risk_8()
        self._create_risk_9()

        self._create_risk_201()
        self._create_risk_202()
        self._create_risk_203()
        self._create_risk_204()
        self._create_risk_205()
        self._create_risk_206()
        self._create_risk_207()
        self._create_risk_208()
        self._create_risk_209()
        self._create_risk_210()
        self._create_risk_211()
        self._create_risk_212()
        self._create_risk_213()
        self._create_risk_214()
        self._create_risk_215()
        self._create_risk_216()

        self._create_risk_301()
        self._create_risk_302()
        self._create_risk_303()
        self._create_risk_304()

        self.stdout.write("Data successfully inserted")