
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

type Statut = 'Complet' | 'Presque complet' | 'Ouvert';

const evenements: Evenement[] = [
  {
    id: 'E01',
    titre: 'Atelier React',
    categorie: 'Atelier',
    capacite: 25,
    inscrits: 25,
  },
  {
    id: 'E02',
    titre: 'Conférence IA',
    categorie: 'Conférence',
    capacite: 70,
    inscrits: 52,
  },
  {
    id: 'E03',
    titre: 'Sécurité mobile',
    categorie: 'Atelier',
    capacite: 20,
    inscrits: 17,
  },
  {
    id: 'E04',
    titre: 'Design UI',
    categorie: 'Atelier',
    capacite: 18,
    inscrits: 9,
  },
  {
    id: 'E05',
    titre: 'Forum projets',
    categorie: 'Rencontre',
    capacite: 50,
    inscrits: 49,
  },
  {
    id: 'E06',
    titre: 'Découverte Git',
    categorie: 'Atelier',
    capacite: 24,
    inscrits: 24,
  },
];

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const places = placesRestantes(e);

  if (places === 0) {
    return 'Complet';
  } else if (places <= 3) {
    return 'Presque complet';
  } else {
    return 'Ouvert';
  }
}

const nombreTotalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  (e) => statutEvenement(e) === 'Complet'
).length;

const evenementsAvecPlaces = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const totalPlacesRestantes = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

const mode: 'tous' | 'ateliers' = 'tous';

const evenementsAffiches =
  mode === 'tous'
    ? evenements
    : evenements.filter(
        (e) =>
          e.categorie === 'Atelier' &&
          placesRestantes(e) > 0
      );

function BadgeEtat({ statut }: { statut: Statut }) {
  let couleur = '#E5F5EC';

  if (statut === 'Complet') {
    couleur = '#FCE8E8';
  } else if (statut === 'Presque complet') {
    couleur = '#FFF1DA';
  }

  return (
    <View style={[styles.badge, { backgroundColor: couleur }]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

function CarteEvenement({
  evenement,
}: {
  evenement: Evenement;
}) {
  return (
    <View style={styles.carte}>
      <View style={styles.enteteCarte}>
        <Text style={styles.titreCarte}>
          {evenement.titre}
        </Text>

        <BadgeEtat statut={statutEvenement(evenement)} />
      </View>

      <Text style={styles.categorie}>
        Catégorie : {evenement.categorie}
      </Text>

      <Text style={styles.places}>
        Places restantes : {placesRestantes(evenement)}
      </Text>

      <Text style={styles.inscrits}>
        Inscrits : {evenement.inscrits} / {evenement.capacite}
      </Text>
    </View>
  );
}

function BlocStatistique({
  titre,
  valeur,
}: {
  titre: string;
  valeur: number;
}) {
  return (
    <View style={styles.blocStat}>
      <Text style={styles.valeurStat}>{valeur}</Text>
      <Text style={styles.titreStat}>{titre}</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.titrePrincipal}>
              CampusAgenda
            </Text>

            <Text style={styles.sousTitre}>
              Découvrez les événements de votre campus
            </Text>

            <View style={styles.statistiques}>
              <BlocStatistique
                titre="Total événements"
                valeur={nombreTotalEvenements}
              />

              <BlocStatistique
                titre="Événements complets"
                valeur={evenementsComplets}
              />

              <BlocStatistique
                titre="Événements avec places"
                valeur={evenementsAvecPlaces}
              />

              <BlocStatistique
                titre="Places restantes"
                valeur={totalPlacesRestantes}
              />
            </View>

            <Text style={styles.sectionTitre}>
              {mode === 'tous'
                ? 'Tous les événements'
                : 'Ateliers disponibles'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement disponible pour le moment.
          </Text>
        }
        contentContainerStyle={styles.liste}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  liste: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 30,
    flexGrow: 1,
  },
  titrePrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#173B70',
  },
  sousTitre: {
    fontSize: 14,
    color: '#667085',
    marginTop: 6,
    marginBottom: 22,
  },
  statistiques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  blocStat: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  valeurStat: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#2459A6',
  },
  titreStat: {
    fontSize: 12,
    color: '#667085',
    marginTop: 5,
  },
  sectionTitre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#173B70',
    marginBottom: 15,
  },
  carte: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 13,
  },
  enteteCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  titreCarte: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#173B70',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  texteBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#344054',
  },
  categorie: {
    fontSize: 13,
    color: '#667085',
    marginTop: 12,
  },
  places: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2459A6',
    marginTop: 8,
  },
  inscrits: {
    fontSize: 12,
    color: '#667085',
    marginTop: 5,
  },
  messageVide: {
    textAlign: 'center',
    color: '#667085',
    marginTop: 30,
    fontSize: 14,
  },
});

