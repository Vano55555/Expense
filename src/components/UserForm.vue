<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Se connecter</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            required
            placeholder="Entrez votre email"
          />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            required
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <button type="submit" class="submit-btn">Se connecter</button>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },

  mounted() {
    // Code exécuté après le montage du composant
    console.log("Composant monté !");
  },
  methods: {
    async handleLogin() {
      console.log("ALOOOOOOOOOOOO ===> ", {
      email: this.email,
      password: this.password,}
    )
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password,
    });

    // if () {

    // }

    console.log (response)
    const { token, user } = response.data;

    // Stocker le token dans le stockage local ou Vuex pour utilisation future
    localStorage.setItem('token', token);
    console.log('Utilisateur:', user);

    // Rediriger vers une page protégée ou la page d'accueil
    this.$router.push('/dashboard');
  } catch (error) {
    console.log("Erreur ===>", error)
    if (error.response) {
      this.errorMessage = error.response.data.message || 'Identifiants invalides';
    } else {
      this.errorMessage = 'Erreur de connexion';
    }
  }
}
  }
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
}

.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #3b82f6;
}

.submit-btn {
  width: 100%;
  padding: 0.9rem;
  background-color: #3b82f6;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2563eb;
}

.error-message {
  margin-top: 1rem;
  color: #f44336;
  font-size: 14px;
}
</style>
