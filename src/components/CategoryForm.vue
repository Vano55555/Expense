<template>
    <div class="category-form">
      <h2>{{ isEditMode ? 'Edit Category' : 'Create Category' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Category Name</label>
          <input type="text" id="name" v-model="category.name" required placeholder="Enter category name" />
        </div>
        
        <div class="form-group">
          <label for="parentCategory">Parent Category</label>
          <select id="parentCategory" v-model="category.parentCategory" :disabled="!parentCategories.length">
            <option value="">No Parent</option>
            <option v-for="parent in parentCategories" :key="parent.id" :value="parent.id">{{ parent.name }}</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="categoryType">Category Type</label>
          <select id="categoryType" v-model="category.categoryType" required>
            <option value="">Select Category Type</option>
            <option v-for="type in categoryTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
          </select>
        </div>
  
        <button type="submit" class="submit-btn">{{ isEditMode ? 'Update Category' : 'Create Category' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import axios from "axios";
  
  export default {
    props: {
      categoryId: {
        type: Number,
        default: null,
      },
    },
    setup(props) {
      const category = ref({
        id: null,
        name: "",
        parentCategory: null,
        categoryType: null,
      });
  
      const categoryTypes = ref([]);
      const parentCategories = ref([]);
      const isEditMode = computed(() => props.categoryId !== null);
  
      const fetchCategoryTypes = async () => {
        try {
          const response = await axios.get("/api/category_types");
          categoryTypes.value = response.data;
        } catch (error) {
          console.error("Error fetching category types:", error);
        }
      };
  
      const fetchParentCategories = async () => {
        try {
          const response = await axios.get("/api/categories");
          parentCategories.value = response.data;
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      const fetchCategory = async () => {
        if (props.categoryId) {
          try {
            const response = await axios.get(`/api/categories/${props.categoryId}`);
            category.value = response.data;
          } catch (error) {
            console.error("Error fetching category:", error);
          }
        }
      };
  
      const handleSubmit = async () => {
        try {
          if (isEditMode.value) {
            await axios.put(`/api/categories/${category.value.id}`, category.value);
          } else {
            await axios.post("/api/categories", category.value);
          }
          alert("Category saved successfully");
        } catch (error) {
          console.error("Error saving category:", error);
        }
      };
  
      onMounted(() => {
        fetchCategoryTypes();
        fetchParentCategories();
        fetchCategory();
      });
  
      return {
        category,
        categoryTypes,
        parentCategories,
        isEditMode,
        handleSubmit,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles */
  .category-form {
    width: 100%;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input,
  select {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button.submit-btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button.submit-btn:hover {
    background-color: #45a049;
  }
  </style>
  