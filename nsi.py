""" Exercice 1 :
1) Nom : A / valeur : 5.2 / type: float
2) Nom : B / valeur : "Bonjour" / type: string
3) Nom : C / valeur : 6 / type: int
4) Nom : D / valeur : "Choisir un nombre entier" / type: string
5) Nom : E / valeur : False / type: int
6) Nom : F / valeur : 11.2 / type: float
7) Nom : G / valeur : -4 / type: int
8) Nom : H / valeur : 2 / type: int
"""

""" Exercice 2 :
1)  Nom : nombre / valeur : "3" / type: string
2)  Nom : autre_nombre / valeur : 5 / type: int
3)  Nom : texte / valeur : True / type: boolean
4)  Nom : autre_texte / valeur : "False" / type: string
5)  Nom : somme / valeur : 33 / type: string
6)  Nom : autre_somme / valeur : 10 / type: int 
"""

""" Exercice 3 :
1) 
prixBaguette => valeur: 0.9 => type: float
nombreBaguette => valeur  3 => type: int
total => valeur: 2.7 => type: float

2)
1 - Il définie la variable "prixBaguette" avec la valeur 0.9
2 - Il définie la variable "nombreBaguette" avec la valeur 3
3 - Il définie la variable "total" avec le produit de "prixBaguette" et "nombreBaguette"
4 - Il envoie dans la console le contenu de la variable "total" avec la méthode print()

3)
prixBaguette < Prix de la baguette
nombreBaguette <Nombre de baguette demandé
total < produit de prixBaguette par nombreBaguette
print total
"""


""" Exercice 4 :"""
print("Exercice 4 >>> "); """ Pour ne pas confondre les données des divers exercices """
cote = 5.0;
perimetre = cote*4;
aire = cote**2;
print("Perimetre : ",perimetre);
print("Aire : ",aire);


""" Exercice 5 : """
print("\nExercice 5 >>> "); """ Pour ne pas confondre les données des divers exercices """

import math;
print(math.pi);

rayon = 5.0;
print("Rayon d'un cercle où R =",rayon," :",2*math.pi*rayon);

""" Exercice 6 : """
print("\nExercice 6 >>> "); """ Pour ne pas confondre les données des divers exercices """
L = float(input("Quel valeur pour L ? "));
l = float(input("Quel valeur pour l ? "));
h = float(input("Quel valeur pour h ? "));
if ((type(L)is int) and (type(L) is float)) or ((type(l) is int) and type(l) is float()) or ((type(h) is int) and (type(h)is float)):
  print("OUPS, des données ne sont pas valides !")
else:
  """ surface latérale  + volume """
  print("Quand :");
  print("L = ",L);
  print("l = ",l);
  print("h = ",h);
  print("Alors :")
  surface = L*l;
  volume = (L*l)*h;
  print("La surface latérale :",surface);
  print("Le volume :",volume);