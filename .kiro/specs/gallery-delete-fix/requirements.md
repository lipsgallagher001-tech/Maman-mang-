# Requirements Document

## Introduction

Ce document décrit les exigences pour corriger le dysfonctionnement de la suppression de photos dans la section de gestion de la galerie du tableau de bord administrateur. Actuellement, lorsqu'un administrateur tente de supprimer une photo de la galerie, une étiquette d'échec s'affiche, indiquant que l'opération de suppression n'aboutit pas correctement.

## Glossary

- **AdminGallery**: Le composant React responsable de l'affichage et de la gestion des images de la galerie dans le tableau de bord administrateur
- **Supabase**: Le service backend utilisé pour stocker et gérer les données de l'application, incluant les images de la galerie
- **gallery_images**: La table Supabase qui stocke les URLs des images de la galerie avec leur ordre d'affichage
- **deleteGalleryImage**: La fonction de service qui effectue la suppression d'une image dans la base de données Supabase

## Requirements

### Requirement 1

**User Story:** En tant qu'administrateur, je veux supprimer des photos de la galerie, afin de pouvoir gérer le contenu visuel affiché sur le site.

#### Acceptance Criteria

1. WHEN un administrateur clique sur le bouton de suppression d'une image THEN le système SHALL supprimer l'image de la base de données Supabase
2. WHEN une image est supprimée avec succès THEN le système SHALL mettre à jour l'affichage de la galerie pour retirer l'image supprimée
3. WHEN une erreur de suppression se produit THEN le système SHALL afficher un message d'erreur explicite à l'administrateur
4. WHEN une image est supprimée THEN le système SHALL maintenir l'intégrité des données en ne supprimant que l'image ciblée
5. WHEN la fonction deleteGalleryImage est appelée THEN le système SHALL identifier correctement l'image à supprimer en utilisant son URL

### Requirement 2

**User Story:** En tant qu'administrateur, je veux marquer les avis comme lus, afin de pouvoir suivre quels avis j'ai déjà consultés.

#### Acceptance Criteria

1. WHEN un administrateur clique sur "Marquer comme lu" pour un avis THEN le système SHALL mettre à jour le statut de l'avis dans la base de données
2. WHEN un avis est marqué comme lu THEN le système SHALL mettre à jour l'affichage pour refléter le nouveau statut
3. WHEN la fonction onMarkReviewAsRead est appelée THEN le système SHALL invoquer la fonction markReviewAsRead du service Supabase
