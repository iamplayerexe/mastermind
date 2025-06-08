# <-- comment (.py file)(Mastermind/mastermind.py)
import pyxel
import random

LARGEUR_ECRAN = 280
HAUTEUR_ECRAN = 300
NB_PIONS = 4
COULEURS_DISPONIBLES = [13, 12, 11, 2, 5, 9]
NB_COULEURS = len(COULEURS_DISPONIBLES)

# --- MODIFIED: Slightly larger visual elements for touch ---
TAILLE_PION = 16  # Was 12
ESPACEMENT_PION = 14 # Was 18
TAILLE_PALETTE = 18 # Was 15
ESPACEMENT_PALETTE = 10 # Was 8
HAUTEUR_LIGNE_HISTORIQUE = 20
COULEUR_VIDE = -1

# --- Colors (Unchanged) ---
COULEUR_FOND_MENU = 1
COULEUR_FOND_JEU = 1
COULEUR_FOND_VICTOIRE = 3
COULEUR_FOND_DEFAITE = 8
COULEUR_TEXTE = 7
COULEUR_TEXTE_TITRE = 7
COULEUR_OMBRE_TEXTE = 0
COULEUR_LEGENDE = 6
COULEUR_BOUTON_BASE = 5
COULEUR_BOUTON_BORDURE = 0
COULEUR_BOUTON_TEXTE = 7
COULEUR_BOUTON_DESACTIVE_BASE = 1
COULEUR_BOUTON_DESACTIVE_BORDURE = 0
COULEUR_BOUTON_DESACTIVE_TEXTE = 6
COULEUR_BOUTON_FIN_BASE = 5
COULEUR_BOUTON_FIN_BORDURE = 0
COULEUR_BOUTON_FIN_TEXTE = 7
COULEUR_BOITE_SECRET = 1
COULEUR_BOITE_SECRET_BORDURE = 0
COULEUR_TEXTE_BOITE_SECRET = 7
COULEUR_FOND_PION_SECRET = 5
COULEUR_FOND_PION_PROPOSITION = 0
COULEUR_FOND_HISTORIQUE = 1
COULEUR_BORDURE_HISTORIQUE = 7
COULEUR_FOND_ENTETE_HISTORIQUE = 5
COULEUR_TEXTE_ENTETE_HISTORIQUE = 7
COULEUR_TEXTE_HISTORIQUE = 7
COULEUR_PLACEHOLDER_HISTORIQUE = 5
COULEUR_SEPARATEUR_HISTORIQUE = 5
COULEUR_BORDURE_PION_HISTOIRE = 7
COULEUR_FOND_PALETTE = 5
COULEUR_BORDURE_PALETTE = 0
COULEUR_FOND_ERREUR = 2
COULEUR_TEXTE_ERREUR = 7

etat_jeu = "MENU"
tours_min = 3; tours_limite_max = 10
tours_max_autorises = 5

# --- MODIFIED: Larger menu buttons for easier tapping ---
rect_bouton_demarrer = (LARGEUR_ECRAN // 2 - 50, 130, 100, 35)
y_controles_tours = 190
x_label_tours = LARGEUR_ECRAN // 2 - len("Tours") * pyxel.FONT_WIDTH // 2
rect_tour_moins = (LARGEUR_ECRAN // 2 - 50, y_controles_tours + 20, 35, 35)
rect_tour_plus = (LARGEUR_ECRAN // 2 + 15, y_controles_tours + 20, 35, 35)
x_numero_tours = LARGEUR_ECRAN // 2 - 7 # Centered between buttons

code_secret = []; proposition_actuelle = [COULEUR_VIDE] * NB_PIONS
index_couleur_selectionnee = None; index_pion_actuel = 0
historique = []; tour_actuel = 0; message_feedback_general = ""

rects_pions_proposition = []; rects_palette = []
rect_bouton_valider = (0, 0, 100, 35) # Size updated
rect_bouton_menu = (LARGEUR_ECRAN // 2 - 50, 200, 100, 35) # Size updated

def verifier_collision(x, y, l, h):
    return x <= pyxel.mouse_x < x + l and y <= pyxel.mouse_y < y + h

def demarrer_nouvelle_partie():
    global code_secret, proposition_actuelle, index_couleur_selectionnee, index_pion_actuel, historique, tour_actuel, message_feedback_general, etat_jeu
    code_secret = random.choices(COULEURS_DISPONIBLES, k=NB_PIONS)
    proposition_actuelle = [COULEUR_VIDE] * NB_PIONS; index_couleur_selectionnee = None; index_pion_actuel = 0; historique = []
    tour_actuel = 0; message_feedback_general = ""; etat_jeu = "JEU"

def evaluer_proposition():
    # This function's logic is unchanged
    global historique, tour_actuel, etat_jeu, proposition_actuelle, index_couleur_selectionnee, index_pion_actuel, message_feedback_general

    pions_noirs = 0
    code_secret_copie = list(code_secret)
    proposition_copie = list(proposition_actuelle)

    for i in range(NB_PIONS):
        if proposition_copie[i] == code_secret_copie[i]:
            pions_noirs += 1
            code_secret_copie[i] = COULEUR_VIDE
            proposition_copie[i] = COULEUR_VIDE

    pions_blancs = 0
    for i in range(NB_PIONS):
        if proposition_copie[i] != COULEUR_VIDE:
            for j in range(NB_PIONS):
                if proposition_copie[i] == code_secret_copie[j]:
                    pions_blancs += 1
                    code_secret_copie[j] = COULEUR_VIDE
                    break

    historique.append((list(proposition_actuelle), pions_noirs, pions_blancs))
    message_feedback_general = ""

    if pions_noirs == NB_PIONS: etat_jeu = "VICTOIRE"
    elif tour_actuel + 1 >= tours_max_autorises: etat_jeu = "DEFAITE"
    else:
        tour_actuel += 1
        proposition_actuelle = [COULEUR_VIDE] * NB_PIONS
        index_couleur_selectionnee = None
        index_pion_actuel = 0

def mise_a_jour():
    if etat_jeu == "MENU": mise_a_jour_menu()
    elif etat_jeu == "JEU": mise_a_jour_jeu()
    elif etat_jeu in ["VICTOIRE", "DEFAITE"]: mise_a_jour_ecran_fin()

def mise_a_jour_menu():
    global tours_max_autorises
    if pyxel.btnp(pyxel.MOUSE_BUTTON_LEFT):
        if verifier_collision(*rect_bouton_demarrer): demarrer_nouvelle_partie()
        elif verifier_collision(*rect_tour_moins) and tours_max_autorises > tours_min: tours_max_autorises -= 1
        elif verifier_collision(*rect_tour_plus) and tours_max_autorises < tours_limite_max: tours_max_autorises += 1

def mise_a_jour_jeu():
    global index_couleur_selectionnee, index_pion_actuel, message_feedback_general, proposition_actuelle
    if pyxel.btnp(pyxel.MOUSE_BUTTON_LEFT):
        clic_sur_ui = False
        for i, rect in enumerate(rects_palette):
            if verifier_collision(*rect): index_couleur_selectionnee = i; clic_sur_ui = True; break
        if not clic_sur_ui:
            for i, rect in enumerate(rects_pions_proposition):
                 if verifier_collision(*rect):
                    if index_couleur_selectionnee is not None: proposition_actuelle[i] = COULEURS_DISPONIBLES[index_couleur_selectionnee]
                    else: proposition_actuelle[i] = COULEUR_VIDE
                    index_pion_actuel = i; clic_sur_ui = True; break
        if not clic_sur_ui:
            if verifier_collision(*rect_bouton_valider):
                est_complete = (COULEUR_VIDE not in proposition_actuelle)
                if est_complete: evaluer_proposition()
                else: message_feedback_general = "Completez la proposition !"
                clic_sur_ui = True

def mise_a_jour_ecran_fin():
    global etat_jeu
    if pyxel.btnp(pyxel.MOUSE_BUTTON_LEFT):
        if verifier_collision(*rect_bouton_menu): etat_jeu = "MENU"

def dessiner_bouton_sombre(x, y, l, h, texte, coul_base, coul_texte, coul_bordure, desactive=False, coul_base_desac=1, coul_texte_desac=6, coul_bordure_desac=0):
    base_act = coul_base_desac if desactive else coul_base; texte_act = coul_texte_desac if desactive else coul_texte; bordure_act = coul_bordure_desac if desactive else coul_bordure
    pyxel.rect(x, y, l, h, base_act); pyxel.rectb(x, y, l, h, bordure_act)
    largeur_texte = len(texte) * pyxel.FONT_WIDTH; tx = x + (l - largeur_texte) // 2; ty = y + (h - pyxel.FONT_HEIGHT) // 2 + 1
    coul_ombre = 0 if texte_act != 0 else 7; pyxel.text(tx+1, ty+1, texte, coul_ombre); pyxel.text(tx, ty, texte, texte_act)

def dessiner_texte_avec_ombre(texte, x, y, coul, coul_ombre=COULEUR_OMBRE_TEXTE):
    pyxel.text(x+1, y+1, texte, coul_ombre); pyxel.text(x, y, texte, coul)

def dessiner():
    couleur_fond = COULEUR_FOND_MENU if etat_jeu == "MENU" else COULEUR_FOND_JEU if etat_jeu == "JEU" else COULEUR_FOND_VICTOIRE if etat_jeu == "VICTOIRE" else COULEUR_FOND_DEFAITE
    pyxel.cls(couleur_fond)
    if etat_jeu == "MENU": dessiner_menu()
    elif etat_jeu == "JEU": dessiner_jeu()
    elif etat_jeu in ["VICTOIRE", "DEFAITE"]: dessiner_ecran_fin()
    if index_couleur_selectionnee is not None and etat_jeu == "JEU":
        couleur_curseur = COULEURS_DISPONIBLES[index_couleur_selectionnee]; rayon = 6
        pyxel.circ(pyxel.mouse_x, pyxel.mouse_y, rayon, couleur_curseur); pyxel.circb(pyxel.mouse_x, pyxel.mouse_y, rayon, COULEUR_BORDURE_PION_HISTOIRE); pyxel.circb(pyxel.mouse_x, pyxel.mouse_y, rayon + 1, 0)

def dessiner_menu():
    titre = "Mastermind"; largeur_titre = len(titre) * pyxel.FONT_WIDTH; tx = LARGEUR_ECRAN // 2 - largeur_titre // 2; ty = 45
    dessiner_texte_avec_ombre(titre, tx, ty, COULEUR_TEXTE_TITRE)
    bx, by, bl, bh = rect_bouton_demarrer
    dessiner_bouton_sombre(bx, by, bl, bh, "DEMARRER", COULEUR_BOUTON_BASE, COULEUR_BOUTON_TEXTE, COULEUR_BOUTON_BORDURE)
    pyxel.text(x_label_tours, y_controles_tours, "Tours", COULEUR_TEXTE)
    mx, my, ml, mh = rect_tour_moins; moins_desactive = (tours_max_autorises <= tours_min)
    dessiner_bouton_sombre(mx, my, ml, mh, "-", COULEUR_BOUTON_BASE, COULEUR_BOUTON_TEXTE, COULEUR_BOUTON_BORDURE, desactive=moins_desactive)
    px, py, pl, ph = rect_tour_plus; plus_desactive = (tours_max_autorises >= tours_limite_max)
    dessiner_bouton_sombre(px, py, pl, ph, "+", COULEUR_BOUTON_BASE, COULEUR_BOUTON_TEXTE, COULEUR_BOUTON_BORDURE, desactive=plus_desactive)
    texte_tours = str(tours_max_autorises); pyxel.text(x_numero_tours - len(texte_tours) * pyxel.FONT_WIDTH // 2, my + mh // 2 - pyxel.FONT_HEIGHT // 2 + 1, texte_tours, COULEUR_TEXTE)
    # --- RESTORED: Animated starfield background ---
    for i in range(30): star_x = (i * 47 + pyxel.frame_count // 6) % LARGEUR_ECRAN; star_y = (i * 29 + pyxel.frame_count // 9) % HAUTEUR_ECRAN; pyxel.pset(star_x, star_y, 7 if i % 3 == 0 else 6)

def dessiner_jeu():
    global rects_pions_proposition, rects_palette, rect_bouton_valider

    largeur_historique = 100; x_historique = LARGEUR_ECRAN - largeur_historique - 10; y_historique = 25; h_max_historique = HAUTEUR_ECRAN - y_historique - 20
    largeur_zone_principale = x_historique - 20; largeur_boite = NB_PIONS * (TAILLE_PION + ESPACEMENT_PION) + ESPACEMENT_PION
    x_boite = (largeur_zone_principale - largeur_boite) // 2 + 10; y_boite_secret = 35; h_boite_secret = 45

    y_boite_proposition = y_boite_secret + h_boite_secret + 15; h_boite_proposition = 50
    _vx, _vy, largeur_bouton_val, hauteur_bouton_val = rect_bouton_valider; y_bouton_valider = y_boite_proposition + h_boite_proposition + 15; y_palette = y_bouton_valider + hauteur_bouton_val + 20
    x_depart_pion = x_boite + ESPACEMENT_PION; y_pion_secret = y_boite_secret + (h_boite_secret - TAILLE_PION) // 2; y_pion_proposition = y_boite_proposition + (h_boite_proposition - TAILLE_PION) // 2
    largeur_totale_palette = NB_COULEURS * (TAILLE_PALETTE + ESPACEMENT_PALETTE) - ESPACEMENT_PALETTE; x_depart_palette = (largeur_zone_principale - largeur_totale_palette) // 2 + 10

    pyxel.rect(x_boite, y_boite_secret, largeur_boite, h_boite_secret, COULEUR_BOITE_SECRET); pyxel.rectb(x_boite, y_boite_secret, largeur_boite, h_boite_secret, COULEUR_BOITE_SECRET_BORDURE)
    for i in range(NB_PIONS): px = x_depart_pion + i * (TAILLE_PION + ESPACEMENT_PION); pyxel.rect(px, y_pion_secret, TAILLE_PION, TAILLE_PION, COULEUR_FOND_PION_SECRET); pyxel.rectb(px, y_pion_secret, TAILLE_PION, TAILLE_PION, 7); pyxel.text(px + TAILLE_PION // 2 - pyxel.FONT_WIDTH//2, y_pion_secret + TAILLE_PION // 2 - pyxel.FONT_HEIGHT//2, "?", COULEUR_TEXTE_BOITE_SECRET)

    rects_pions_proposition = []
    pyxel.rect(x_boite, y_boite_proposition, largeur_boite, h_boite_proposition, COULEUR_BOITE_SECRET); pyxel.rectb(x_boite, y_boite_proposition, largeur_boite, h_boite_proposition, COULEUR_BOITE_SECRET_BORDURE)
    for i in range(NB_PIONS):
        px = x_depart_pion + i * (TAILLE_PION + ESPACEMENT_PION); py = y_pion_proposition
        # --- MODIFIED: Increased hitbox size with padding ---
        rects_pions_proposition.append((px - 5, py - 5, TAILLE_PION + 10, TAILLE_PION + 10))
        pyxel.circ(px + TAILLE_PION // 2, py + TAILLE_PION // 2, TAILLE_PION // 2 -1 , COULEUR_FOND_PION_PROPOSITION); pyxel.circb(px + TAILLE_PION // 2, py + TAILLE_PION // 2, TAILLE_PION // 2, 7)
        couleur = proposition_actuelle[i]
        if couleur != COULEUR_VIDE: pyxel.circ(px + TAILLE_PION // 2, py + TAILLE_PION // 2, TAILLE_PION // 2 - 1, couleur)

    x_bouton_valider = x_boite + (largeur_boite - largeur_bouton_val) // 2; rect_bouton_valider = (x_bouton_valider, y_bouton_valider, largeur_bouton_val, hauteur_bouton_val); proposition_incomplete = COULEUR_VIDE in proposition_actuelle
    dessiner_bouton_sombre(x_bouton_valider, y_bouton_valider, largeur_bouton_val, hauteur_bouton_val, "VALIDER", COULEUR_BOUTON_BASE, COULEUR_BOUTON_TEXTE, COULEUR_BOUTON_BORDURE, desactive=proposition_incomplete)

    x_fond_palette = x_depart_palette - 5; y_fond_palette = y_palette - 5; largeur_fond_palette = largeur_totale_palette + 10; hauteur_fond_palette = TAILLE_PALETTE + 10
    pyxel.rect(x_fond_palette, y_fond_palette, largeur_fond_palette, hauteur_fond_palette, COULEUR_FOND_PALETTE); pyxel.rectb(x_fond_palette, y_fond_palette, largeur_fond_palette, hauteur_fond_palette, COULEUR_BORDURE_PALETTE)
    rects_palette = []
    for i, couleur in enumerate(COULEURS_DISPONIBLES):
        px = x_depart_palette + i * (TAILLE_PALETTE + ESPACEMENT_PALETTE); py = y_palette
        # --- MODIFIED: Increased hitbox size with padding ---
        rects_palette.append((px - 4, py - 4, TAILLE_PALETTE + 8, TAILLE_PALETTE + 8))
        pyxel.circ(px + TAILLE_PALETTE // 2, py + TAILLE_PALETTE // 2, TAILLE_PALETTE // 2, couleur)
        pyxel.circb(px + TAILLE_PALETTE // 2, py + TAILLE_PALETTE // 2, TAILLE_PALETTE // 2, COULEUR_BORDURE_PION_HISTOIRE)
        if index_couleur_selectionnee is not None and index_couleur_selectionnee == i: pyxel.circb(px + TAILLE_PALETTE // 2, py + TAILLE_PALETTE // 2, TAILLE_PALETTE // 2 + 2, 0)

    # History Panel Drawing (Layout unchanged)
    x_hist = x_historique; y_hist = y_historique; l_hist = largeur_historique; h_hist = min( (tours_max_autorises * HAUTEUR_LIGNE_HISTORIQUE + 25), h_max_historique )
    pyxel.rect(x_hist, y_hist, l_hist, h_hist, COULEUR_FOND_HISTORIQUE); pyxel.rect(x_hist, y_hist, l_hist, 15, COULEUR_FOND_ENTETE_HISTORIQUE); pyxel.text(x_hist + l_hist // 2 - len("Historique")*pyxel.FONT_WIDTH//2, y_hist + 5, "Historique", COULEUR_TEXTE_ENTETE_HISTORIQUE); pyxel.rectb(x_hist, y_hist, l_hist, h_hist, COULEUR_BORDURE_HISTORIQUE); pyxel.line(x_hist, y_hist + 15, x_hist + l_hist, y_hist + 15, COULEUR_BORDURE_HISTORIQUE)
    taille_pion_hist = 5; espacement_pion_hist = 4; x_proposition_hist = x_hist + 5; y_separateur_offset = HAUTEUR_LIGNE_HISTORIQUE - 2
    x_texte_feedback_hist = x_hist + l_hist - 38

    for i in range(tours_max_autorises):
        y_ligne = y_hist + 20 + i * HAUTEUR_LIGNE_HISTORIQUE
        if y_ligne + HAUTEUR_LIGNE_HISTORIQUE > y_hist + h_hist: break
        if i < len(historique):
            proposition_hist, pions_noirs, pions_blancs = historique[i]
            for j in range(NB_PIONS):
                 px = x_proposition_hist + j * (taille_pion_hist + espacement_pion_hist)
                 couleur_hist = proposition_hist[j]
                 if couleur_hist != COULEUR_VIDE: pyxel.circ(px + taille_pion_hist // 2, y_ligne + taille_pion_hist // 2, taille_pion_hist // 2, couleur_hist); pyxel.circb(px + taille_pion_hist // 2, y_ligne + taille_pion_hist // 2, taille_pion_hist // 2, COULEUR_BORDURE_PION_HISTOIRE)
            feedback_hist_str = f"BP:{pions_noirs} MP:{pions_blancs}";
            y_texte_hist = y_ligne + (HAUTEUR_LIGNE_HISTORIQUE - pyxel.FONT_HEIGHT - y_separateur_offset//2) // 2;
            pyxel.text(x_texte_feedback_hist, y_texte_hist, feedback_hist_str, COULEUR_TEXTE_HISTORIQUE)
        else:
             for j in range(NB_PIONS): px = x_proposition_hist + j * (taille_pion_hist + espacement_pion_hist); pyxel.circb(px + taille_pion_hist // 2, y_ligne + taille_pion_hist // 2, 1, COULEUR_PLACEHOLDER_HISTORIQUE)
             y_texte_hist_place = y_ligne + (HAUTEUR_LIGNE_HISTORIQUE - pyxel.FONT_HEIGHT - y_separateur_offset//2)//2
             pyxel.text(x_texte_feedback_hist, y_texte_hist_place, "BP:- MP:-", COULEUR_PLACEHOLDER_HISTORIQUE)
        if y_ligne + y_separateur_offset < y_hist + h_hist - 5: pyxel.line(x_hist + 1, y_ligne + y_separateur_offset, x_hist + l_hist - 1, y_ligne + y_separateur_offset, COULEUR_SEPARATEUR_HISTORIQUE)

    if message_feedback_general:
         largeur_msg = len(message_feedback_general) * pyxel.FONT_WIDTH; msg_x = largeur_zone_principale // 2 - largeur_msg // 2 + 10; msg_y = y_bouton_valider + hauteur_bouton_val + 5
         pyxel.rect(msg_x - 3, msg_y - 3, largeur_msg + 6, pyxel.FONT_HEIGHT + 5 , COULEUR_FOND_ERREUR)
         dessiner_texte_avec_ombre(message_feedback_general, msg_x, msg_y, COULEUR_TEXTE_ERREUR, 0)

    legende_y_start = HAUTEUR_ECRAN - 2 * (pyxel.FONT_HEIGHT + 3)
    pyxel.text(5, legende_y_start, "BP: Bien Place", COULEUR_LEGENDE)
    pyxel.text(5, legende_y_start + pyxel.FONT_HEIGHT + 3, "MP: Mal Place", COULEUR_LEGENDE)

def dessiner_ecran_fin():
    global rect_bouton_menu
    y_msg = HAUTEUR_ECRAN // 2 - 80
    if etat_jeu == "VICTOIRE": msg = "Vous avez gagne !"; largeur_msg = len(msg) * pyxel.FONT_WIDTH; dessiner_texte_avec_ombre(msg, LARGEUR_ECRAN // 2 - largeur_msg // 2 , y_msg, COULEUR_TEXTE)
    elif etat_jeu == "DEFAITE": msg = "VOUS AVEZ PERDU !"; largeur_msg = len(msg) * pyxel.FONT_WIDTH; dessiner_texte_avec_ombre(msg, LARGEUR_ECRAN // 2 - largeur_msg // 2 , y_msg, COULEUR_TEXTE)
    if etat_jeu == "DEFAITE":
        y_revelation = y_msg + pyxel.FONT_HEIGHT + 40; pyxel.text(LARGEUR_ECRAN // 2 - len("Le code etait:") * pyxel.FONT_WIDTH // 2, y_revelation - 15, "Le code etait:", COULEUR_TEXTE); taille_pion_rev = 16; espacement_rev = 8; x_depart_pion_rev = (LARGEUR_ECRAN - NB_PIONS * (taille_pion_rev + espacement_rev) + espacement_rev) // 2
        for i, couleur in enumerate(code_secret): px = x_depart_pion_rev + i * (taille_pion_rev + espacement_rev); pyxel.circ(px + taille_pion_rev // 2, y_revelation + taille_pion_rev // 2, taille_pion_rev // 2 - 1, couleur); pyxel.circb(px + taille_pion_rev // 2, y_revelation + taille_pion_rev // 2, taille_pion_rev // 2 - 1, 0)
    bx, by, bl, bh = rect_bouton_menu; x_bouton = LARGEUR_ECRAN // 2 - bl // 2; y_bouton = HAUTEUR_ECRAN // 2 + 80; rect_bouton_menu = (x_bouton, y_bouton, bl, bh)
    dessiner_bouton_sombre(x_bouton, y_bouton, bl, bh, "MENU", COULEUR_BOUTON_FIN_BASE, COULEUR_BOUTON_FIN_TEXTE, COULEUR_BOUTON_FIN_BORDURE)

pyxel.init(LARGEUR_ECRAN, HAUTEUR_ECRAN, title="Mastermind", fps=30)
pyxel.mouse(True)
pyxel.run(mise_a_jour, dessiner)
# <-- end comment (.py file)(Mastermind/mastermind.py)