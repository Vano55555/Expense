<template>
  <div>
    <!-- Bouton pour ouvrir la modal de catégorie -->
    <button @click="showCategoryModal = true" class="btn btn-primary">Créer Catégorie</button>

    <!-- Modal de catégorie -->
    <div v-if="showCategoryModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Modifier Catégorie' : 'Créer Catégorie' }}</h2>
        <form @submit.prevent="handleCategorySubmit">
          <div class="form-group">
            <label for="name">Nom de la Catégorie</label>
            <input type="text" id="name" v-model="category.name" required placeholder="Entrez le nom de la catégorie" />
          </div>

          <div class="form-group">
            <label for="categoryType">Type de Catégorie</label>
            <select id="categoryType" v-model="category.categoryType" required>
              <option value="">Sélectionner un type de catégorie</option>
              <option v-for="type in categoryTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="libelle">Libellé</label>
            <input type="text" id="libelle" v-model="category.libelle" required placeholder="Entrer le libellé de la catégorie" />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="category.description" placeholder="Entrer la description de la catégorie"></textarea>
          </div>

          <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Modifier' : 'Créer' }}</button>
          <button type="button" @click="showCategoryModal = false" class="btn btn-secondary">Annuler</button>
        </form>
      </div>
    </div>

    <!-- Liste des catégories -->
    <h3>Liste des Catégories</h3>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Type de Catégorie</th>
          <th>Libellé</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <td>{{ cat.name }}</td>
          <td>{{ getCategoryTypeName(cat.categoryType) }}</td>
          <td>{{ cat.libelle }}</td>
          <td>{{ cat.description || 'Aucune' }}</td>
          <td>
            <button @click="editCategory(cat)" class="btn btn-warning">Modifier</button>
            <button @click="deleteCategory(cat.id)" class="btn btn-danger">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../services/api';

export default {
  setup() {
    const showCategoryModal = ref(false);
    const category = reactive({
      id: null as number | null,
      name: '',
      categoryType: null as number | null,
      libelle: '',
      description: '',
    });

    const categoryTypes = ref<Array<{ id: number; name: string }>>([]);
    const categories = ref<Array<{ id: number; name: string; libelle: string; description: string; categoryType: number }>>([]);
    const isEditMode = computed(() => category.id !== null);

    // Récupérer les types de catégories
    const fetchCategoryTypes = async () => {
      try {
        const response = await api.get('/category_types');
        if (response.data && Array.isArray(response.data)) {
          categoryTypes.value = response.data;
        } else {
          throw new Error("Format de données inattendu pour les types de catégories");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des types de catégories", error);
      }
    };

    const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    if (response.data && Array.isArray(response.data)) {
      categories.value = response.data.map((cat) => ({
        id: cat.id || 0,
        name: cat.name || 'Inconnu',
        libelle: cat.libelle || 'Aucun libellé',
        description: cat.description || 'Aucune description',
        categoryType: cat.categoryType?.id || 0, // Accède à l'ID de categoryType
      }));
    } else {
      throw new Error("Format de données inattendu pour les catégories");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error);
    alert("Impossible de charger les catégories. Veuillez réessayer plus tard.");
  }
};

    // Soumettre le formulaire (création ou édition)
    const handleCategorySubmit = async () => {
      try {
        const payload = {
          name: category.name,
          categoryTypeId: category.categoryType,
          libelle: category.libelle,
          description: category.description,
        };

        if (isEditMode.value) {
          await api.put(`/categories/${category.id}`, payload);
        } else {
          await api.post('/categories', payload);
        }

        showCategoryModal.value = false;
        resetCategoryForm();
        fetchCategories();
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la catégorie", error);
        alert("Erreur lors de la sauvegarde de la catégorie. Veuillez réessayer.");
      }
    };

    // Réinitialiser le formulaire
    const resetCategoryForm = () => {
      category.id = null;
      category.name = '';
      category.categoryType = null;
      category.libelle = '';
      category.description = '';
    };

    // Supprimer une catégorie
    const deleteCategory = async (id: number) => {
      try {
        await api.delete(`/categories/${id}`);
        alert("Catégorie supprimée avec succès");
        fetchCategories();
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie", error);
      }
    };

    // Modifier une catégorie
    const editCategory = (cat: any) => {
      category.id = cat.id;
      category.name = cat.name;
      category.categoryType = cat.categoryType; // Utilise l'ID directement
      category.libelle = cat.libelle;
      category.description = cat.description;
      showCategoryModal.value = true;
    };

    // Obtenir le nom du type de catégorie
    const getCategoryTypeName = (categoryTypeId: number) => {
      const type = categoryTypes.value.find((type) => type.id === categoryTypeId);
      return type ? type.name : 'Inconnu';
    };

    // Charger les données au montage du composant
    onMounted(() => {
      fetchCategoryTypes();
      fetchCategories();
    });

    return {
      showCategoryModal,
      category,
      categoryTypes,
      categories,
      isEditMode,
      handleCategorySubmit,
      deleteCategory,
      editCategory,
      getCategoryTypeName,
    };
  },
};
</script>

<style scoped>
/* Styles pour la modal native */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 100px;
  resize: vertical;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  margin-left: 10px;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>