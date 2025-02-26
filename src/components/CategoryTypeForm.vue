<template>
    <div class="category-type-form">
      <h2>{{ isEditMode ? 'Edit Category Type' : 'Create Category Type' }}</h2>
  
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Category Type Name</label>
          <input type="text" id="name" v-model="categoryType.name" required placeholder="Enter category type name" />
        </div>
  
        <button type="submit" class="submit-btn">{{ isEditMode ? 'Update Category Type' : 'Create Category Type' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import axios from "axios";
  
  export default {
    props: {
      categoryTypeId: {
        type: Number,
        default: null,
      },
    },
    setup(props) {
      const categoryType = ref({
        id: null,
        name: "",
      });
  
      const isEditMode = computed(() => props.categoryTypeId !== null);
  
      const fetchCategoryType = async () => {
        if (props.categoryTypeId) {
          try {
            const response = await axios.get(`/api/category_types/${props.categoryTypeId}`);
            categoryType.value = response.data;
          } catch (error) {
            console.error("Error fetching category type:", error);
          }
        }
      };
  
      const handleSubmit = async () => {
        try {
          if (isEditMode.value) {
            await axios.put(`/api/category_types/${categoryType.value.id}`, categoryType.value);
          } else {
            await axios.post("/api/category_types", categoryType.value);
          }
          alert("Category Type saved successfully");
        } catch (error) {
          console.error("Error saving category type:", error);
        }
      };
  
      onMounted(() => {
        fetchCategoryType();
      });
  
      return {
        categoryType,
        isEditMode,
        handleSubmit,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles */
  .category-type-form {
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
  
  input {
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
  